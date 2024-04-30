import { t } from "i18next";
import { Notify } from "quasar";
import { ref } from "vue";

import { Settings, TerminalParams } from "src/types";
import { apiAddAnyTerminal } from "./api";
import config from "./config";
import { delay } from "./utils";

export const terminalParams = ref<TerminalParams | undefined>(undefined);
export const settings = ref<Settings | undefined>(undefined);
let _inited = false;
let _name = '';
let _code = '';

export async function initTerminal(name: string, code: string) {
  if (_inited) {
    throw new Error("Terminal service already inited");
  }
  _name = name;
  _code = code;
  _inited = true;
  setTimeout(loopUpdateTerminalParams, 0);
}

async function loopUpdateTerminalParams() {
  while(true) {
    try {
      await updateTerminalParams();
      await delay(
        terminalParams.value ?
        config.terminal_status_update_interval :
        config.terminal_registration_attempt_interval
      )
    } catch { /* empty */ }
  }
}

export async function updateTerminalParams() {
  if (!_inited) {
    console.error('Trying to update not inited terminal');
    return false;
  }
  let success = true;
  try {
    terminalParams.value = await apiAddAnyTerminal(_name, _code, config.terminal_type_id);
    settings.value = {
      ...config.settings,
      ...terminalParams.value.terminal_settings,
    }
  } catch {
    success = false;
    Notify.create({
      color: 'warning',
      position: 'center',
      message: t('ERROR_FETCH_TERMINAL_PARAMS'),
    });
  }
  if (success) {
    console.log("terminalParams", terminalParams.value);
    console.log("settings", settings.value);
  }
  return success;
}
