import { t } from "i18next";
import { ref, watchSyncEffect } from "vue";
import { Notify } from "quasar";

import { TerminalShift } from "src/types";
import { apiAddShift, apiCloseShift, apiGetCurrentShift, apiGetShift } from "./api";
import { settings, terminalParams } from "./terminal";
import { currentUser } from "./users";
import { delay, throwErr } from "./utils";


export const locationShift = ref<{ id: string } | undefined>(undefined);
export const terminalShift = ref<TerminalShift | null | undefined>(undefined);
export const terminalShiftOpenedBy = ref<string | null | undefined>(undefined);
export const terminalShiftPreviousClosedBy = ref<string | null | undefined>(undefined);
let lastLocationShiftLocationId = undefined as string | undefined;
let lastTerminalShiftTerminalId = undefined as string | undefined;

watchSyncEffect(async () => {
  await with_retries(updateLocationShift);
})

watchSyncEffect(async () => {
  await with_retries(updateTerminalShift);
})

async function with_retries(fn: () => Promise<boolean>) {
  let attempts = 100;
  while (attempts > 0) {
    attempts -= 1;
    try {
      if (await fn()) {
        return;
      }
      await delay(250);
    } catch { /* empty */ }
  }
}


export async function closeTerminalShift() {
  await updateShifts();
  try {
    if (terminalShift.value?.state == settings.value?.shifts__state_closed) {
      return;
    }
    if (terminalShift.value?.state != settings.value?.shifts__state_closing) {
      throwErr('wrong terminalShift state');
    }
    const result = await apiCloseShift(
      terminalShift.value?.id ?? throwErr('terminalShift.id is missing'),
      settings.value?.shifts__state_closed ?? throwErr('settings are missing'),
      currentUser.value?.id ?? throwErr('user.id is missing'),
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
  }
  await updateShifts();
};

export async function openTerminalShift() {
  await updateShifts();
  try {
    if (terminalShift.value) {
      throwErr('terminalShift exists');
    }
    await apiAddShift(
      terminalParams.value?.terminal_id ?? throwErr('terminal_id is missing'),
      locationShift.value?.id ?? throwErr('locationShift.id is missing'),
      currentUser.value?.id ?? throwErr('user.id is missing'),
    );
  } catch (error) {
    console.log("openTerminalShift error:", error);
    Notify.create({
      color: 'warning',
      position: 'center',
      message: t('error_during_shift_open'),
    });
  }
  await updateShifts();
}


export async function startClosingTerminalShift() {
  await updateShifts();
  try {
    if (terminalShift.value?.state == settings.value?.shifts__state_closing) {
      return;
    }
    if (terminalShift.value?.state != settings.value?.shifts__state_open) {
      throwErr('wrong terminalShift state');
    }
    await apiCloseShift(
      terminalShift.value?.id ?? throwErr('terminalShift.id is missing'),
      settings.value?.shifts__state_closing ?? throwErr('settings are missing'),
      currentUser.value?.id ?? throwErr('user.id is missing'),
    );
  } catch (error) {
    console.log("startClosingTerminalShift error:", error);
    Notify.create({
      color: 'warning',
      position: 'center',
      message: t('error_during_shift_closing'),
    });
  }
  await updateShifts();
}

export async function updateShifts() {
  const result = await Promise.all([
    updateLocationShift(),
    updateTerminalShift(),
  ]);
  return result.reduce((prev, curr) => prev && curr);
}

// CAUTION: Access all ref dependencies before first await to make watchEffect/watchSyncEffect work properly
export async function updateLocationShift(force = false) {
  const location_id = terminalParams.value?.location_id;
  if (!force &&
    (currentUser.value && location_id == lastLocationShiftLocationId ||
    !currentUser.value && lastLocationShiftLocationId === undefined)
  ) {
    return false;
  }
  const canFetch = !!(location_id && currentUser.value /* authenticated */);
  locationShift.value = canFetch
    ? {
      id: await apiGetCurrentShift(location_id),
    }
    : undefined;
  console.log("Location shift", locationShift.value);
  lastLocationShiftLocationId = canFetch ? location_id : undefined;
  return canFetch;
}

// CAUTION: Access all ref dependencies before first await to make watchEffect/watchSyncEffect work properly
export async function updateTerminalShift(force = false) {
  const terminal_id = terminalParams.value?.terminal_id;
  if (!force &&
    (currentUser.value && terminal_id == lastTerminalShiftTerminalId ||
    !currentUser.value && lastTerminalShiftTerminalId === undefined)
  ) {
    return false;
  }
  const canFetch = !!(terminal_id && currentUser.value /* authenticated */);
  if (canFetch) {
    const {
      shift,
      last_close_operation: lastClose,
      last_open_operation: lastOpen,
    } = await apiGetShift(terminal_id);

    terminalShift.value = shift ?? null;
    terminalShiftOpenedBy.value = lastOpen?.details.terminal_shift_id == shift?.id ? lastOpen?.staff1 : null;
    terminalShiftPreviousClosedBy.value = lastClose?.staff1 ?? null;
  } else {
    terminalShift.value = undefined;
    terminalShiftOpenedBy.value = undefined;
    terminalShiftPreviousClosedBy.value = undefined;
  }
  console.log("Terminal shift", terminalShift.value);
  console.log("Terminal shift opened by", terminalShiftOpenedBy.value);
  console.log("Terminal shift previous closed by", terminalShiftPreviousClosedBy.value);
  lastTerminalShiftTerminalId = canFetch ? terminal_id : undefined;
  return canFetch;
}
