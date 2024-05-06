import i18next, { t } from 'i18next';
import { defineStore } from 'pinia';
import { updateCatalogLocales } from 'src/services/locales';
import { KioskState } from 'src/types/kiosk-state';
import { computed, reactive, ref, watchEffect } from 'vue';
import { Router, useRouter } from 'vue-router';
import { currentUser, logout, startLoopUpdateCurrentUser } from 'src/services/users';
import { initTerminal, settings, terminalParams } from 'src/services/terminal';
import { kioskCorr, userCorr } from 'src/services/documents/correspondents';
import { closeTerminalShift, locationShift, openTerminalShift, startClosingTerminalShift, terminalShift, terminalShiftOpenedBy, terminalShiftPreviousClosedBy, updateShifts } from 'src/services/shifts';

export const useAppStore = defineStore('app', () => {
  const router = useRouter();
  const drawerCartState = ref(false);
  const orderDialog = ref(false);
  const langDialog = ref(false);
  const tab = ref('');
  const lang_dir = ref('ltr');
  const redirectDialogState = ref(false);
  const colorMode = ref('light');

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
  })

  router.isReady().then(() => {
    kioskState.name = getTerminalName(router);
    kioskState.code = getTerminalCode(router);

    if (!kioskState.code) {
      kioskState.globalError = new Error(t('no_terminal_code_provided_on_startup'))
      kioskState.status = 'UnrecoverableError'
    }

    initTerminal(kioskState.name, kioskState.code);
    router.push('/');
  })

  startLoopUpdateCurrentUser();

  const setLocale = async (lang_code: string) => {
    console.log('setLocale', lang_code)
    i18next.changeLanguage(lang_code, (err, t) => {
      if(err) { console.log('i18next err', err)}
    })
    lang_dir.value = i18next.dir(lang_code);
  }

  const resetLocale = async () => {
    await setLocale(kioskState.settings?.loc ?? 'en' )
  }

  const hasRight = (right?: string) => !!right && !!kioskState.user?.rights.some(r => r.id == right);
  const shiftIsOpen = computed<boolean>(() => kioskState.terminalShift?.state == kioskState.settings?.shifts__state_open);
  const shiftIsClosing = computed<boolean>(() => kioskState.terminalShift?.state == kioskState.settings?.shifts__state_closing);
  const shiftIsUpToDate = computed<boolean>(() => kioskState.terminalShift?.global_shift_id == kioskState.locationShift?.id);
  const shiftIsGood = computed<boolean>(() => shiftIsOpen.value && shiftIsUpToDate.value);

  const lockTerminal = async () => {
    await logout();
  }

  let catalogLocalesInited = false;
  watchEffect(async () => {
    if (currentUser.value && terminalParams.value && !catalogLocalesInited) {
      try {
        catalogLocalesInited = true;
        await updateCatalogLocales(kioskState);
      } catch {
        catalogLocalesInited = false;
      }
    }
  })

  setTimeout(resetLocale, 0);

  watchEffect(async () => {
    if (currentUser.value === null) {
      await router.push('/');
    }
  })


  let inited = false;
  let redirecting = false;
  watchEffect(async () => {
    kioskState.params = terminalParams.value;
    kioskState.settings = settings.value;
    kioskState.user = currentUser.value ?? undefined; // ?? is backward compatibility
    kioskState.userCorr = userCorr.value;
    kioskState.kioskCorr = kioskCorr.value;
    kioskState.locationShift = locationShift.value;
    kioskState.terminalShift = terminalShift.value ?? undefined; // ?? is backward compatibility
    kioskState.terminalShiftOpenedBy = terminalShiftOpenedBy.value ?? undefined; // ?? is backward compatibility
    kioskState.terminalShiftPreviousClosedBy = terminalShiftPreviousClosedBy.value ?? undefined; // ?? is backward compatibility

    const currentUserIsReady = currentUser.value !== undefined;
    const locationShiftIsReady = locationShift.value !== undefined;
    const terminalShiftIsReady = terminalShift.value !== undefined;

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

    if (!inited &&
      (
        currentUserIsReady && !currentUser.value /* not logged in */ ||
        newStatus == 'Ready' && terminalShiftIsReady && locationShiftIsReady
      )
    ) {
      inited = true;
      try { await resetLocale(); } catch(e) { console.error(e); }
      if (currentUser.value && shiftIsGood.value) {
        redirecting = true;
        await router.push('/hello');
        redirecting = false;
      } else {
        kioskState.user = undefined;
        newStatus = deduceStatus(kioskState);
        await logout();
      }
    }
    if (redirecting || !inited && newStatus == 'Ready') {
      // Fix some race conditions
      return;
    }
    kioskState.status = newStatus;
  })

  //===================================

  return {
    drawerCartState,
    tab,
    openDrawerCart,
    orderDialog,
    langDialog,
    openOrderDialog,
    openLangDialog,

    kioskState,
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
    colorMode,
    redirectDialogState,

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
