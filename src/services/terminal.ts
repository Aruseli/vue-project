import { t } from "i18next";
import { Notify } from "quasar";
import { ref } from "vue";

import { Settings, TerminalParams } from "src/types";
import { apiAddAnyTerminal } from "./api";
import config from "./config";
import { delay } from "./utils";

export const terminalName = ref<string>('');
export const terminalCode = ref<string>('');
export const terminalParams = ref<TerminalParams | undefined>(undefined);
/**
 * This is the `{ .."config.js"."settings", ..backend_terminal_settings }`.
 * Settings from server have higher priority than local settings.
 */
export const settings = ref<Settings | undefined>(undefined);

let _inited = false;
export async function initTerminal() {
  if (_inited) {
    throw new Error("Terminal service already inited");
  }
  const params = new URLSearchParams(document.location.href.split('?')[1]);
  terminalName.value = params.get('terminalName') ?? 'Unnamed kiosk';
  terminalCode.value = params.get('terminalCode') ?? (process.env.DEV ? 'kiosk-test' : '');
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
    terminalParams.value = await apiAddAnyTerminal(terminalName.value, terminalCode.value, config.terminal_type_id);
    settings.value = {
      ...config.settings,
      ...terminalParams.value.terminal_props,
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
