import { t } from "i18next";
import { Cookies, Notify } from "quasar";
import { ref } from "vue"

import { User } from "src/types";
import { apiAuth, apiAuthBearer, apiUsersWhoami } from "./api";
import config from "./config";
import { settings } from "./terminal";
import { delay } from "./utils";


export const currentUser = ref<User | null | undefined>(undefined);

export async function login(userName: string, userPassword: string) {
  await apiAuth(userName, userPassword)
  await updateCurrentUser()
}

export async function loginByToken(token: string) {
  const sessionToken = await apiAuthBearer(token);
  await updateCurrentUser()
  return !!sessionToken
}

export async function hasRight(right: string) {
  return !!right && currentUser.value?.rights.some(r => r.id == right);
}

export async function updateCurrentUser() {
  let success = true;
  try {
    currentUser.value = await apiUsersWhoami();
  } catch (e: any) {
    if (e?.message?.includes("ERR_AUTH")) {
      currentUser.value = null;
    } else {
      success = false;
      Notify.create({
        color: "warning",
        position: "center",
        message: t("ERROR_FETCH_USER_INFO"),
      });
    }
  }
  if (success) {
    console.log("currentUser", currentUser.value);
  }
  return { user: currentUser.value, success };
}

async function loopUpdateCurrentUser() {
  while(true) {
    try {
      await updateCurrentUser()
      await delay(settings.value?.user_info_update_interval ?? config.settings.user_info_update_interval)
    } catch { /* empty */}
  }
}

let loopStarted = false;
export function startLoopUpdateCurrentUser() {
  if (loopStarted) {
    return;
  }
  loopStarted = true;
  setTimeout(loopUpdateCurrentUser, 0);
}

export async function logout() {
  console.log("User logout");
  Cookies.remove('session');
  currentUser.value = null;
  await updateCurrentUser();
}
