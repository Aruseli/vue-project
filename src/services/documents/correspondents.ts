import { ref, watchSyncEffect } from "vue"

import { Correspondent } from "src/types";
import { apiGetCorrespondentByEntity } from "../api";
import { currentUser } from "../users";
import { settings, terminalParams } from '../terminal';
import { delay } from "../utils";


export const kioskCorr = ref<Correspondent | undefined>(undefined);
export const userCorr = ref<Correspondent | undefined>(undefined);
let lastKioskCorrType = undefined as string | undefined;
let lastKioskCorrTerminalId = undefined as string | undefined;
let lastUserCorrType = undefined as string | undefined;
let lastUserCorrUserId = undefined as string | undefined;

watchSyncEffect(async () => {
  await with_retries(updateUserCorr);
})

watchSyncEffect(async () => {
  await with_retries(updateKioskCorr);
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

// CAUTION: Access all ref dependencies before first await to make watchEffect/watchSyncEffect work properly
export async function updateUserCorr(force = false) {
  const user_id = currentUser.value?.id;
  const user_corr_type = settings?.value?.user_corr_type;
  if (!force && user_id == lastUserCorrUserId && user_corr_type == lastUserCorrType) {
    return false;
  }
  userCorr.value = (user_id && user_corr_type)
    ? await apiGetCorrespondentByEntity(user_id, user_corr_type)
    : undefined;
  console.log("userCorr", userCorr.value);
  lastUserCorrType = user_corr_type;
  lastUserCorrUserId = user_id;
  return true;
}

// CAUTION: Access all ref dependencies before first await to make watchEffect/watchSyncEffect work properly
export async function updateKioskCorr(force = false) {
  const terminal_id = terminalParams.value?.terminal_id;
  const kiosk_corr_type = settings?.value?.kiosk_corr_type;
  if (!force &&
    (currentUser.value && terminal_id == lastKioskCorrTerminalId && kiosk_corr_type == lastKioskCorrType ||
    !currentUser.value && lastKioskCorrTerminalId == undefined && lastKioskCorrType == undefined)
  ) {
    return false;
  }
  const canFetch = !!(terminal_id && kiosk_corr_type && currentUser.value /* authenticated */)
  kioskCorr.value = canFetch
    ? await apiGetCorrespondentByEntity(terminal_id, kiosk_corr_type)
    : undefined;
  console.log("kioskCorr", kioskCorr.value);
  lastKioskCorrType = canFetch ? kiosk_corr_type : undefined;
  lastKioskCorrTerminalId = canFetch ? terminal_id : undefined;
  return canFetch;
}
