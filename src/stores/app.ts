import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { useCartStore } from './cart';
import { TerminalParams, apiAddAnyTerminal, apiAuth, apiUsersWhoami } from 'src/services/api';
import { useRouter } from 'vue-router';
import { TERMINAL_REGISTRATION_ATTEMPT_INTERVAL, USER_INFO_UPDATE_INTERVAL } from 'src/services/consts';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { Deferred, delay } from 'src/services/utils';

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

export const enum KioskState {
  UNKNOWN = 'UNKNOWN',
  UNBOUND_TERMINAL = 'UNBOUND_TERMINAL',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  READY = 'READY',
  UNRECOVERABLE_ERROR = 'UNRECOVERABLE_ERROR',
}

// type GlobalState = {
//   KioskState,
//   TerminalInfo,
//   UserInfo,
//   Mode, //??? User, Admin
//   Catalog,
//   Cart,
// }

export const useAppStore = defineStore('app', () => {
  const cartStore = useCartStore();
  const router = useRouter();
  const { t } = useI18n();

  const drawerCartState = ref(false);
  const orderDialog = ref(false);
  const tab = ref('food');
  const tabCharacteristics = ref('description');
  const globalError = ref<Error | null>(null);

  const openDrawerCart = (state: boolean) => {
    drawerCartState.value = state;
  }

  const openOrderDialog = (state: boolean) => {
    orderDialog.value = state;
    cartStore.clearCart();
  }

  //===================================
  // TERMINAL INIT

  const kioskState = ref(KioskState.UNKNOWN)
  const queryParams = router.currentRoute.value.query
  const terminalCode = queryParams?.terminalCode?.toString()
  if (!terminalCode && !process.env.DEV) {
    globalError.value = new Error(t('NO_TERMINAL_CODE_PROVIDED_ON_STARTUP'))
    kioskState.value = KioskState.UNRECOVERABLE_ERROR
  }
  const terminal = reactive({
    name: queryParams?.terminalName?.toString() ?? 'Unnamed kiosk',
    code: terminalCode ?? 'kiosk-test',
    params: <TerminalParams | undefined> undefined,
  })
  const user = reactive({
    info: <any> undefined,
  })


  let loginDeferred = new Deferred()
  // Run terminal init outside of storeInit
  setTimeout(async () => {
    // Terminal registration loop
    while(true) {
      if (kioskState.value == KioskState.UNRECOVERABLE_ERROR) {
        return
      }
      let terminalParams: TerminalParams | undefined
      try {
        console.log(`Terminal registration attempt. Name: ${terminal.name}, code: ${terminal.code}`)
        terminalParams = await apiAddAnyTerminal(terminal.name, terminal.code)
      }
      catch {
        Notify.create({
          color: 'warning',
          position: 'center',
          message: t('UNSUCCESSFUL_TERMINAL_REGISTRATION_ATTEMPT'),
        })
      }
      terminal.params = terminalParams
      console.log('terminalParams', terminalParams)
      if (terminalParams?.terminal_id) {
        kioskState.value = KioskState.UNBOUND_TERMINAL
      }
      if (terminalParams?.object_id && terminalParams?.location_id) {
        kioskState.value = KioskState.UNAUTHENTICATED
        break
      }
      await delay(TERMINAL_REGISTRATION_ATTEMPT_INTERVAL)
    }

    // User verification loop
    while(true) {
      try {
        const result = await apiUsersWhoami()
        user.info = result
        console.log('whoami', result)
        kioskState.value = KioskState.READY
        break // TODO: consider running this loop forever to detect unlogin
      } catch {
        kioskState.value = KioskState.UNAUTHENTICATED
        loginDeferred = new Deferred()
      }
      await Promise.any([
        loginDeferred.promise,
        delay(USER_INFO_UPDATE_INTERVAL)
      ])
    }
  })

  const login = async (userName: string, password: string) => {
    await apiAuth(userName, password)
    loginDeferred.resolve(null)
  }

  //===================================


  return {
    drawerCartState,
    tab,
    tabCharacteristics,
    openDrawerCart,
    orderDialog,
    openOrderDialog,

    globalError,
    kioskState,
    terminal,
    user,
    login,
  }
});
