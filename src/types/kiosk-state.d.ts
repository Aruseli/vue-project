import { PrinterType } from "src/services";

// See also config.json
export type Settings = {
  loc: string,
  tdp: string,

  view_check: string,
  view_doc_input: string,
  view_doc_invent: string,
  view_doc_leftover: string,
  view_ord: string,

  client_corr_id: string,
  user_corr_type: string,
  kiosk_corr_type: string,
  currency_id: string,
  munit_id: string,

  doc_type__invoice: string,
  docdetail_type__invoice: string,
  doc_type__goods_arrival: string,
  docdetail_type__goods_arrival_incoming: string,
  doc_type__inventory: string,
  docdetail_type__inventory: string,
  doc_type__inventory_request: string,
  docdetail_type__inventory_request: string,
  docoperation_type__erroneous_action: string,
  docoperation_type__deletion_reason: string,
  inventory_request_state_requested: number,
  inventory_request_state_fulfilled: number,

  rights__kiosk_open_shift: string,
  rights__kiosk_close_own_shift: string,
  rights__kiosk_close_any_shift: string,
  rights__kiosk_issue_order: string,
  rights__kiosk_selective_inventory: string,
  rights__kiosk_selective_inventory_extended: string,
  rights__kiosk_full_inventory: string,
  rights__kiosk_arrival_of_goods: string,
  rights__kiosk_list_orders: string,
  rights__kiosk_print_stock: string,

  cache__images_cleanup_interval_ms: number,
  cache__orders_ttl_ms: number,
  cache__arrivals_ttl_ms: number,
  cache__inventories_ttl_ms: number,
  user_info_update_interval: number,

  customer_inactivity_before_redirect: number,
  customer_inactivity_countdown_duration: number,
  customer_inactivity_animation_start_before_redirect: number,
  customer_successful_order_notify_duration_ms: number,

  employee_menu_inactivity_before_action: number,
  employee_menu_inactivity_countdown_duration: number,
  employee_menu_inactivity_action: 'customer' | 'lock' | string,
  employee_docs_inactivity_before_action: number,
  employee_docs_inactivity_countdown_duration: number,
  employee_docs_inactivity_action: 'customer' | 'lock' | string,
  employee_doclists_inactivity_before_action: number,
  employee_doclists_inactivity_countdown_duration: number,
  employee_doclists_inactivity_action: 'customer' | 'lock' | string,

  allow_order_issue_in_outdated_shift: boolean,
  shifts__poll_interval_average_ms: number,
  shifts__poll_interval_variance_ms: number,
  shifts__inventory_on_open: boolean,
  shifts__inventory_on_close: boolean,
  shifts__skip_inventory_on_open_if_same_user: boolean,
  shifts__state_open: number,
  shifts__state_closing: number,
  shifts__state_closed: number,

  alt_ui: 'design_v1' | 'design_v2' | 'design_v3' | string,

  keyboard_login_enabled: boolean,

  payment_type_id_cash: string,
  payment_type_id_card: string,

  // Чтобы добавить подключение к объету нужно в админке зайти в
  // Objects -> выбрать Объект -> Внешние подключение -> "Добавить" -> Выбрать тип "Internal API", дать имя и сохранить.
  // После этого в списке подключений этого объекта появиться запись, идентификатор которой и есть искомый ID.
  check_ext_source: string,
  check_content_type: string,

  printer_type: PrinterType,
  networkHost?: string,
  networkPort?: number,
}

export type TerminalParams = {
  terminal_id?: string,
  location_id?: string,
  object_id?: string,
  terminal_settings?: Partial<Settings>,
}

export type LocaleInfo = {
  lang_code: string,
  flag_src?: string;
  name: string, // title??
}

export type User = {
  id: string,
  login: string,
  name: string,
  tokens: string,
  rights: { id: string, name: string }[],
}

export type Correspondent = {
  id: string,
  name: string,
  entityType: string,
  entityId: string,
  corrType: string,
}

export type TerminalShift = {
  id: string,
  datetime_open: any,
  datetime_close: any,
  shiftdate: any,
  /** see config `shifts__state_*` */
  state: number,
  object_id: string,
  /** Location shift id */
  global_shift_id: string, // location shift id
  terminal_id: string,
}

export type KioskState = {
  status: 'Unknown' | 'UnboundTerminal' | 'Unauthenticated' | 'Ready' | 'GlobalError',
  /**
   * @deprecated in favor of `import { terminalParams } from 'src/services/terminal';`
   */
  params?: TerminalParams,
  /**
   * @deprecated in favor of `import { settings } from 'src/services/terminal';`
   */
  settings?: Settings,
  globalError?: Error,
  /**
   * @deprecated in favor of `import { currentUser } from 'src/services/users';`
   */
  user?: User,
  /**
   * @deprecated in favor of `import { userCorr } from 'src/services/documents/correspondents';`
   */
  userCorr?: Correspondent,
  /**
   * @deprecated in favor of `import { kioskCorr } from 'src/services/documents/correspondents';`
   */
  kioskCorr?: Correspondent,
  catalogLocales?: LocaleInfo[],
  /**
   * @deprecated in favor of `import { locationShift } from 'src/services/shifts';`
   */
  locationShift?: { id: string },
  /**
   * @deprecated in favor of `import { terminalShift } from 'src/services/shifts';`
   */
  terminalShift?: TerminalShift,
  /**
   * @deprecated in favor of `import { terminalShiftOpenedBy } from 'src/services/shifts';`
   */
  terminalShiftOpenedBy?: string,
  /**
   * @deprecated in favor of `import { terminalShiftPreviousClosedBy } from 'src/services/shifts';`
   */
  terminalShiftPreviousClosedBy?: string,
}
