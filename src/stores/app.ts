import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { useCartStore } from './cart';
import { TerminalParams, apiAddAnyTerminal, apiAuth, apiAuthBearer, apiGetLocale, apiGetLocalesList, apiUsersWhoami } from 'src/services/api';
import { Router, useRouter } from 'vue-router';
import { TERMINAL_REGISTRATION_ATTEMPT_INTERVAL, TERMINAL_STATUS_UPDATE_INTERVAL, USER_INFO_UPDATE_INTERVAL } from 'src/services/consts';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { delay } from 'src/services/utils';
import { eventEmitter } from 'src/services';

/*
 This is 'app' or 'main' store.
 Предназнечение - хранить глобальные данные для приложения:
 - визуальные состояния при необходимости (например, cartDrawerState)
 - локализации интерфейса
 - может быть, в будущем сессии пользователей (если будут вложенные сессии авторизации)

 Здесь же подключается локализация по умолчанию.

 На этапе разработки вместо fetch использовать Promise.resolve(SOME_CONSTANT)
 с комментарием "//TODO fetch"
 */
export const useAppStore = defineStore('app', () => {
  const { t } = useI18n();
  const i18n = useI18n();
  const { locale } = useI18n();
  const cartStore = useCartStore();
  const router = useRouter();
  const drawerCartState = ref(false);
  const orderDialog = ref(false);
  const tab = ref('food');
  const tabCharacteristics = ref('description');

  const openDrawerCart = (state: boolean) => {
    drawerCartState.value = state;
  }

  const openOrderDialog = (state: boolean) => {
    orderDialog.value = state;
    cartStore.clearCart();
  }

  //===================================
  // TERMINAL INIT

  const kioskState = reactive<KioskState>({
    status: KioskStatus.UNKNOWN,
    name: getTerminalName(router),
    code: getTerminalCode(router),
  })
  if (!kioskState.code) {
    kioskState.globalError = new Error(t('NO_TERMINAL_CODE_PROVIDED_ON_STARTUP'))
    kioskState.status = KioskStatus.UNRECOVERABLE_ERROR
  }

  setTimeout(loopUpdateTerminalParams, 0, kioskState);
  setTimeout(loopUpdateCurrentUser, 0, kioskState)

  let inited = false;
  eventEmitter.on('kioskState.status', async ({ newStatus }) => {
    if (newStatus != KioskStatus.READY) {
      return
    }
    // Update locales
    while (true) {
      try {
        const lang_codes = await apiGetLocalesList(kioskState.params!.object_id!, kioskState.params!.location_id!)
          .then(r => r?.map(l => l?.langcode))
        console.log('lang_codes', lang_codes);
        lang_codes.forEach(async(lc) => {
          // Update i18n here
          i18n.setLocaleMessage(lc, await apiGetLocale(lc))
        })
        break
      } catch {
      }
      await delay(1000)
    }

    if (!inited) {
      inited = true
      router.push('/employee-actions')
    }
  })

  const setLocale = async (langcode: string) => {
    locale.value = langcode
  }

  const resetLocale = async () => {
    await setLocale(kioskState.params?.terminal_settings?.loc ?? 'en' )
  }

  const login = async (userName: string, userPassword: string) => {
    await apiAuth(userName, userPassword)
    await updateCurrentUser(kioskState)
  }

  const loginByToken = async (token: string) => {
    await apiAuthBearer(token)
    await updateCurrentUser(kioskState)
  }


  eventEmitter.on('local-ws', async evt => {
    if (evt.cmd == 'barcode' && evt.data.startsWith("220") && evt.data.length == 13) {
      // Используем коды EAN13: EAN-13 (полный) — кодируется 13 цифр (12 значащих + 1 контрольная сумма).
      // Структура кода:
      // 3 знака - префикс
      // 9 знаков - код сущности
      // 1 знак - контрольная сумма
      // Префиксы 200-299 - зарезервированны в стандарте для внутренних целей. Используем их таким образом:
      // 200: внутрениие товары
      // 210: товары для продажи
      // 220: сотрудники
      await loginByToken(evt.data.slice(3, 12))
      router.push('/employee-actions')
    }
  })

  //===================================


  return {
    drawerCartState,
    tab,
    tabCharacteristics,
    openDrawerCart,
    orderDialog,
    openOrderDialog,

    kioskState,
    login,
    setLocale,
    resetLocale,
  }
});

export const enum KioskStatus {
  UNKNOWN = 'UNKNOWN',
  UNBOUND_TERMINAL = 'UNBOUND_TERMINAL',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  READY = 'READY',
  UNRECOVERABLE_ERROR = 'UNRECOVERABLE_ERROR',
}

export type KioskState = {
  status: KioskStatus, //'UNKNOWN' | 'UNBOUND_TERMINAL',// KioskStatus,
  name: string,
  code: string,
  params?: TerminalParams,
  globalError?: Error,
  user?: any,
  locales?: { [langcode: string]: any }
}

async function loopUpdateTerminalParams(kioskState: KioskState) {
  while(true) {
    if (kioskState.status == KioskStatus.UNRECOVERABLE_ERROR) {
      return
    }
    let terminalParams = await tryFetchTerminalParams(kioskState.name, kioskState.code);
    if (terminalParams) {
      kioskState.params = terminalParams
      console.log('terminalParams', terminalParams)
      updateKioskStatus(kioskState)
    }
    await delay(
      kioskState.params ?
      TERMINAL_STATUS_UPDATE_INTERVAL :
      TERMINAL_REGISTRATION_ATTEMPT_INTERVAL
    )
  }
}

function getTerminalCode(router: Router) {
  const queryParams = router.currentRoute.value.query
  const terminalCode = queryParams?.terminalCode?.toString()
  if (!terminalCode && process.env.DEV) {
    return 'kiosk-test';
  }
  return terminalCode ?? '';
}

function getTerminalName(router: Router) {
  const queryParams = router.currentRoute.value.query
  return queryParams?.terminalName?.toString() ?? 'Unnamed kiosk'
}

async function tryFetchTerminalParams(terminalName: string, terminalCode: string) {
  try {
    console.log(`Update terminal params. Name: ${terminalName}, code: ${terminalCode}`);
    return await apiAddAnyTerminal(terminalName, terminalCode);
  }
  catch {
    const { t } = useI18n();
    Notify.create({
      color: 'warning',
      position: 'center',
      message: t('ERROR_FETCH_TERMINAL_PARAMS'),
    });
  }
  return undefined;
}

async function loopUpdateCurrentUser(kioskState: KioskState) {
  while(true) {
    await updateCurrentUser(kioskState)
    await delay(USER_INFO_UPDATE_INTERVAL)
  }
}

async function updateCurrentUser(kioskState: KioskState) {
  try {
    const result = await apiUsersWhoami()
    kioskState.user = result
    console.log('whoami', result)
    updateKioskStatus(kioskState)
  } catch (e: any) {
    if (e?.message?.includes("ERR_AUTH")) {
      kioskState.user = undefined
      console.log('whoami', undefined)
    } else {
      const { t } = useI18n();
      Notify.create({
        color: 'warning',
        position: 'center',
        message: t('ERROR_FETCH_USER_INFO'),
      });
    }
  }
}

function updateKioskStatus(kioskState: KioskState) {
  const oldStatus = kioskState.status
  let newStatus = deduceStatus(kioskState)

  // Erroneous transitions
  if (oldStatus == KioskStatus.READY &&
      [
        KioskStatus.UNKNOWN,
        KioskStatus.UNBOUND_TERMINAL,
      ].findIndex(s => s == newStatus) >= 0
    ) {
      const { t } = useI18n()
      kioskState.globalError = new Error(t('TERMINAL_WAS_UNREGISTERED'))
      newStatus = KioskStatus.UNRECOVERABLE_ERROR
  }

  if (oldStatus != newStatus) {
    kioskState.status = newStatus
    eventEmitter.emit('kioskState.status', { oldStatus, newStatus })
  }
}

function deduceStatus(kioskState: KioskState) {
  if (kioskState.globalError || kioskState.status == KioskStatus.UNRECOVERABLE_ERROR) {
    return KioskStatus.UNRECOVERABLE_ERROR
  }
  if (!kioskState.params?.terminal_id) {
    return KioskStatus.UNKNOWN
  }
  if (!kioskState.params?.location_id || !kioskState.params?.object_id) {
    return KioskStatus.UNBOUND_TERMINAL
  }
  if (!kioskState.user) {
    return KioskStatus.UNAUTHENTICATED
  }
  return KioskStatus.READY
}






  //=======================================
  // Printer example (temp)

  // const sessionToken = localStorage.getItem('sessionToken');

  // async function doAuth() {
  //   $q.loading.show();
  //   try {
  //     const authToken = await apiAuth('v.kakotkin@fait.gl', '1c8b6f9f-a29a');

  //     if (!authToken) {
  //       $q.notify({
  //         message: 'Auth error...',
  //         icon: 'warning',
  //         color: 'negative',
  //       });
  //     }
  //     else {
  //       localStorage.setItem('sessionToken', authToken);
  //     }
  //   }
  //   catch(e) {
  //     console.log(e);
  //     $q.notify({
  //       message: 'Error occured',
  //       icon: 'warning',
  //       color: 'warning',
  //     });
  //   }
  //   finally {
  //     $q.loading.hide();
  //   }
  // }

  // const printText = ref('<print align="center" bold>text</print><printqr>hello world</printqr>');

  // function sendWsCommand() {
  //   wsSendMessage('check-print', printText.value);
  // }

  // const check1ViewId = ref('c2db028c-bee9-4504-9302-379a888a1676');

  // async function sendCatPrintCommand() {
  //   $q.loading.show();
  //   try {
  //     const viewData = await apiReportsGetView(check1ViewId.value);
  //     console.log(viewData);
  //     wsSendMessage('check-print', viewData);
  //   }
  //   catch(e) {
  //     console.log(e);
  //     $q.notify({
  //       message: 'Error occured',
  //       icon: 'warning',
  //       color: 'warning',
  //     });
  //   }
  //   finally {
  //     $q.loading.hide();
  //   }
  // }

  //=======================================
