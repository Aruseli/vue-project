import i18next, { t } from 'i18next';
import { defineStore } from 'pinia';
import { Cookies, Notify } from 'quasar';
import { eventEmitter, initLocalDeviceWsService } from 'src/services';
import { apiAddAnyTerminal, apiAuth, apiAuthBearer, apiGetCurrentShift, apiGetShift, apiUsersWhoami, apiAddShift, apiCloseShift, apiGetCorrespondentByEntity } from 'src/services/api';
import { updateCatalogLocales } from 'src/services/locales';
import { delay, throwErr } from 'src/services/utils';
import { KioskState } from 'src/types/kiosk-state';
import { computed, reactive, ref } from 'vue';
import { Router, useRouter } from 'vue-router';
import config from 'src/services/config';

export const useAppStore = defineStore('app', () => {
  const router = useRouter();
  const drawerCartState = ref(false);
  const orderDialog = ref(false);
  const langDialog = ref(false);
  const tab = ref('');
  const tabCharacteristics = ref('description');
  const shiftLoading = ref(true);
  const lang_dir = ref('ltr');


  // start code for redirect windows
  const redirectDialogState = ref(false);
  const redirectAt = ref(0);
  const countdown = ref(0);

  // end code for redirect windows

  const openDrawerCart = (state: boolean) => {
    drawerCartState.value = state;
  }

  const openOrderDialog = (state: boolean) => {
    orderDialog.value = state;
  }
  const openLangDialog = (state: boolean) => {
    langDialog.value = state;
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

  // start code for redirect windows
  const redirect = () => {
    redirectDialogState.value = false;
    router.push('hello');
    redirectAt.value = 0;
  }

  function closeRedirectDialog() {
    redirectAt.value =
      Date.now() +
      (kioskState.settings?.employee_inactivity_before_redirect ?? 150000);
  }
  function resetRedirectTimer() {
    if (redirectDialogState.value) {
      return;
    }
    redirectAt.value =
      Date.now() +
      (kioskState.settings?.employee_inactivity_before_redirect ?? 150000);
  }
  const redirectTimer = ref(null);
  const boundResetTimer = resetRedirectTimer.bind(this);

  const tick = () => {
    if (Date.now() - redirectAt.value > 60*1000) {
      redirectAt.value = Date.now() + (kioskState.settings?.employee_inactivity_before_redirect ?? 150000);
    }

    const timeBeforeRedirect = redirectAt.value - Date.now();
    if (timeBeforeRedirect < 0) {
      // redirect phase
      redirect();
      return;
    }

    if (timeBeforeRedirect < (kioskState.settings?.employee_inactive_notify_duration_ms ?? 30000)) {
      // countdown phase
      countdown.value = Math.floor(timeBeforeRedirect / 1000);
      redirectDialogState.value = true;
      return;
    }
    redirectDialogState.value = false;
    return;
  }

  // end code for redirect windows

  const updateShifts = async () => {
    shiftLoading.value = true;
    try {
      const locationId = kioskState.params?.location_id ?? throwErr("location_id is missing");
      const terminalId = kioskState.params?.terminal_id ?? throwErr("terminal_id is missing");

      const locationShift = {
        id: await apiGetCurrentShift(locationId),
      };
      const {
        shift: terminalShift,
        last_open_operation: lastOpen,
        last_close_operation: lastClose,
      } = await apiGetShift(terminalId);

      kioskState.locationShift = locationShift;
      kioskState.terminalShift = terminalShift;
      kioskState.terminalShiftOpenedBy = lastOpen?.details?.terminal_shift_id == terminalShift?.id ? lastOpen?.staff1 : undefined;
      kioskState.terminalShiftPreviousClosedBy = lastClose?.staff1;
      console.log("Location shift", kioskState.locationShift);
      console.log("Terminal shift", kioskState.terminalShift);
      console.log("Terminal shift opened by", kioskState.terminalShiftOpenedBy);
      console.log("Terminal shift previous closed by", kioskState.terminalShiftPreviousClosedBy);
    } catch (error) {
      console.log('updateShifts error:', error)
    } finally {
      shiftLoading.value = false;
    }
  }

  const openTerminalShift = async () => {
    await updateShifts();
    shiftLoading.value = true;
    try {
      if (kioskState.terminalShift) {
        throwErr('terminalShift exists');
      }
      await apiAddShift(
        kioskState.params?.terminal_id ?? throwErr('terminal_id is missing'),
        kioskState.locationShift?.id ?? throwErr('locationShift.id is missing'),
        kioskState.user?.id ?? throwErr('user.id is missing'),
      );
    } catch (error) {
      console.log("openTerminalShift error:", error);
      Notify.create({
        color: 'warning',
        position: 'center',
        message: t('error_during_shift_open'),
      });
    } finally {
      shiftLoading.value = false;
    }
    await updateShifts();
  };

  const closeTerminalShift = async () => {
    await updateShifts();
    shiftLoading.value = true;
    try {
      if (kioskState.terminalShift?.state == kioskState.settings?.shifts__state_closed) {
        return;
      }
      if (kioskState.terminalShift?.state != kioskState.settings?.shifts__state_closing) {
        throwErr('wrong terminalShift state');
      }
      const result = await apiCloseShift(
        kioskState.terminalShift?.id ?? throwErr('terminalShift.id is missing'),
        kioskState.settings?.shifts__state_closed ?? throwErr('settings are missing'),
        kioskState.user?.id ?? throwErr('user.id is missing'),
      );
      if (!result.success) {
        throwErr("Close shift wasn't successful")
      }
    } catch (error) {
      console.log("closeTerminalShift error:", error);
      Notify.create({
        color: 'warning',
        position: 'center',
        message: t('error_during_shift_close'),
      });
    } finally {
      shiftLoading.value = false;
    }
    await updateShifts();
  };

  const startClosingTerminalShift = async() => {
    await updateShifts();
    shiftLoading.value = true;
    try {
      if (kioskState.terminalShift?.state == kioskState.settings?.shifts__state_closing) {
        return;
      }
      if (kioskState.terminalShift?.state != kioskState.settings?.shifts__state_open) {
        throwErr('wrong terminalShift state');
      }
      await apiCloseShift(
        kioskState.terminalShift?.id ?? throwErr('terminalShift.id is missing'),
        kioskState.settings?.shifts__state_closing ?? throwErr('settings are missing'),
        kioskState.user?.id ?? throwErr('user.id is missing'),
      );
    } catch (error) {
      console.log("startClosingTerminalShift error:", error);
      Notify.create({
        color: 'warning',
        position: 'center',
        message: t('error_during_shift_closing'),
      });
    } finally {
      shiftLoading.value = false;
    }
    await updateShifts();
  }

  setTimeout(loopUpdateTerminalParams, 0, kioskState);
  setTimeout(loopUpdateCurrentUser, 0, kioskState)

  const setLocale = async (lang_code: string) => {
    console.log('setLocale', lang_code)
    i18next.changeLanguage(lang_code, (err, t) => {
      if(err) { console.log('i18next err', err)}
    })
    lang_dir.value = i18next.dir(lang_code);
    console.log('LANG', lang_dir.value)
  }

  const resetLocale = async () => {
    await setLocale(kioskState.settings?.loc ?? 'en' )
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
      router.push('/');
      return
    }
    if (!inited) {
      inited = true
      await resetLocale()
      router.push('/employee-actions') // Redirect to employee-actions on startup
    }

    // Init locales
    await updateCatalogLocales(kioskState);
    await updateShifts();
  })

  //===================================

  const hasRight = (right?: string) => !!right && !!kioskState.user?.rights.some(r => r.id == right);
  const shiftIsOpen = computed<boolean>(() => kioskState.terminalShift?.state == kioskState.settings?.shifts__state_open);
  const shiftIsClosing = computed<boolean>(() => kioskState.terminalShift?.state == kioskState.settings?.shifts__state_closing);
  const shiftIsUpToDate = computed<boolean>(() => kioskState.terminalShift?.global_shift_id == kioskState.locationShift?.id);
  const shiftIsGood = computed<boolean>(() => shiftIsOpen.value && shiftIsUpToDate.value);

  const lockTerminal = async () => {
    Cookies.remove('session');
    await updateCurrentUser(kioskState);
  }

  return {
    drawerCartState,
    tab,
    tabCharacteristics,
    openDrawerCart,
    orderDialog,
    langDialog,
    openOrderDialog,
    openLangDialog,

    kioskState,
    login,
    loginByToken,
    setLocale,
    resetLocale,
    lang_dir,

    updateShifts,
    openTerminalShift,
    closeTerminalShift,
    startClosingTerminalShift,

    hasRight,
    shiftIsOpen,
    shiftIsUpToDate,
    shiftIsGood,
    lockTerminal,

    //redirect start
    redirectDialogState,
    redirectAt,
    countdown,
    redirectTimer,
    boundResetTimer,
    tick,
    redirect,
    closeRedirectDialog,
    resetRedirectTimer,
    //redirect end

    customerModeIsAllowed: computed<boolean>(() => {
      return hasRight(kioskState.settings?.rights__kiosk_open_shift)
        && shiftIsGood.value;
    }),
    shiftOpenIsAllowed: computed<boolean>(() => {
      return hasRight(kioskState.settings?.rights__kiosk_open_shift)
        && !shiftIsOpen.value
        && !shiftIsClosing.value;
    }),
    shiftCloseIsAllowed: computed<boolean>(() => {
      const hasRightToCloseShift =
        hasRight(kioskState.settings?.rights__kiosk_close_any_shift) ||
        ((kioskState.terminalShiftOpenedBy == kioskState.user?.id) ? hasRight(kioskState.settings?.rights__kiosk_close_own_shift) : false);

      return hasRightToCloseShift && (shiftIsOpen.value || shiftIsClosing.value);
    }),
    orderIssueIsAllowed: computed<boolean>(() => {
      return hasRight(kioskState.settings?.rights__kiosk_issue_order)
        && shiftIsOpen.value
        && (shiftIsUpToDate.value || (kioskState.settings?.allow_order_issue_in_outdated_shift || false));
    }),
    arrivalsAreAllowed: computed<boolean>(() => {
      return hasRight(kioskState.settings?.rights__kiosk_arrival_of_goods)
        && shiftIsGood.value;
    }),
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
      kioskState.settings = {
        ...config.settings,
        ...terminalParams.terminal_settings,
      };
      console.log('terminalParams', terminalParams)
      console.log('settings', kioskState.settings)
      initLocalDeviceWsService(kioskState.settings?.tdp ?? "localhost:3010")
      updateKioskStatus(kioskState)
    }
    await delay(
      kioskState.params ?
      config.terminal_status_update_interval :
      config.terminal_registration_attempt_interval
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
    await delay(kioskState.settings?.user_info_update_interval ?? config.settings.user_info_update_interval)
  }
}

async function updateCurrentUser(kioskState: KioskState) {

  try {
    kioskState.user = await apiUsersWhoami();
    console.log("user", kioskState.user);
    kioskState.userCorr = await apiGetCorrespondentByEntity(kioskState.user?.id, kioskState.settings!.user_corr_type!);
    console.log("userCorr", kioskState.userCorr);
    kioskState.kioskCorr = await apiGetCorrespondentByEntity(kioskState.params!.terminal_id!, kioskState.settings!.kiosk_corr_type!);
    console.log("kioskCorr", kioskState.kioskCorr);
    updateKioskStatus(kioskState);
  } catch (e: any) {
    if (e?.message?.includes("ERR_AUTH")) {
      kioskState.user = undefined;
      console.log("whoami", undefined);
      console.log("kioskState", kioskState);
      updateKioskStatus(kioskState);

    } else {
      Notify.create({
        color: "warning",
        position: "center",
        message: t("ERROR_FETCH_USER_INFO"),
      });
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
  if (!kioskState.user || !kioskState.userCorr || !kioskState.kioskCorr) {
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
