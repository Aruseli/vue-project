import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18_n';
import { t } from 'i18next';
import i18next from 'i18next';
import { eventEmitter, initLocalDeviceWsService } from 'src/services';
import { apiAddAnyTerminal, apiAuth, apiAuthBearer, apiUsersWhoami } from 'src/services/api';
import { TERMINAL_REGISTRATION_ATTEMPT_INTERVAL, TERMINAL_STATUS_UPDATE_INTERVAL, USER_INFO_UPDATE_INTERVAL } from 'src/services/consts';
import { updateCatalogLocales } from 'src/services/locales';
import { delay } from 'src/services/utils';
import { KioskState } from 'src/types/kiosk-state';
import { reactive, ref } from 'vue';
import { Router, useRouter } from 'vue-router';
import router from '../router/routes'

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
  let locale = i18next.language;
  const router = useRouter();
  const drawerCartState = ref(false);
  const orderDialog = ref(false);
  const tab = ref('');
  const tabCharacteristics = ref('description');

  const openDrawerCart = (state: boolean) => {
    drawerCartState.value = state;
  }

  const openOrderDialog = (state: boolean) => {
    orderDialog.value = state;
  }

  //===================================
  // TERMINAL INIT

  const kioskState = reactive<KioskState>({
    status: 'Unknown',
    name: getTerminalName(router),
    code: getTerminalCode(router),
  })
  if (!kioskState.code) {
    kioskState.globalError = new Error(t('no_terminal_code_provided_on_startup'))
    kioskState.status = 'UnrecoverableError'
  }

  setTimeout(loopUpdateTerminalParams, 0, kioskState);
  setTimeout(loopUpdateCurrentUser, 0, kioskState)

  const setLocale = async (lang_code: string) => {
    console.log('setLocale', lang_code)
    locale = lang_code
    console.log('locale', locale)
  }

  const resetLocale = async () => {
    await setLocale(kioskState.params?.terminal_settings?.loc ?? 'en' )
  }

  const login = async (userName: string, userPassword: string) => {
    await apiAuth(userName, userPassword)
    await updateCurrentUser(kioskState)
  }

  const loginByToken = async (token: string) => {
    const sessionToken = await apiAuthBearer(token)
    await updateCurrentUser(kioskState)
    return !!sessionToken
  }

  let inited = false;
  eventEmitter.on('kioskState.status', async ({ newStatus }) => {
    if (newStatus != 'Ready') {
      return
    }
    if (!inited) {
      inited = true
      await resetLocale()
      router.push('/employee-actions') // Redirect to employee-actions on startup
    }

    // Init locales
    await updateCatalogLocales(kioskState, locale)
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
    loginByToken,
    setLocale,
    resetLocale,
  }
});

async function loopUpdateTerminalParams(kioskState: KioskState) {
  while(true) {
    if (kioskState.status == 'UnrecoverableError') {
      return
    }
    let terminalParams = await tryFetchTerminalParams(kioskState.name, kioskState.code);
    if (terminalParams) {
      kioskState.params = terminalParams
      console.log('terminalParams', terminalParams)
      initLocalDeviceWsService(terminalParams.terminal_settings?.tdp ?? "localhost:3010")
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
    // const { t } = i18n.global;
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
    const result = await apiUsersWhoami();
    kioskState.user = result;
    console.log("whoami", result);
    updateKioskStatus(kioskState);
  } catch (e: any) {
    if (e?.message?.includes("ERR_AUTH")) {
      kioskState.user = undefined;
      router.push({
        path: "",
        component: () => import("pages/terminal.vue"),
        redirect: undefined,
      });
      console.log("whoami", undefined);
    } else {
      // const { t } = i18n.global;
      Notify.create({
        color: "warning",
        position: "center",
        message: t("ERROR_FETCH_USER_INFO"),
      });
      // router.push("/");
    }
  }
}

function updateKioskStatus(kioskState: KioskState) {
  const oldStatus = kioskState.status
  let newStatus: KioskState['status'] = deduceStatus(kioskState)

  // Erroneous transitions
  if (oldStatus == 'Ready' &&
      [
        'Unknown',
        'UnboundTerminal',
      ].findIndex(s => s == newStatus) >= 0
    ) {
      // const { t } = i18n.global
      kioskState.globalError = new Error(t('TERMINAL_WAS_UNREGISTERED'))
      newStatus = 'UnrecoverableError'
  }

  if (oldStatus != newStatus) {
    kioskState.status = newStatus
    eventEmitter.emit('kioskState.status', { oldStatus, newStatus })
  }
}

function deduceStatus(kioskState: KioskState) {
  if (kioskState.globalError || kioskState.status == 'UnrecoverableError') {
    return 'UnrecoverableError'
  }
  if (!kioskState.params?.terminal_id) {
    return 'Unknown'
  }
  if (!kioskState.params?.location_id || !kioskState.params?.object_id) {
    return 'UnboundTerminal'
  }
  if (!kioskState.user) {
    return 'Unauthenticated'
  }
  return 'Ready'
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
