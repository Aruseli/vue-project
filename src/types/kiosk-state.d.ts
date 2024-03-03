// See also config.json
export type Settings = {
  loc: string,
  tdp: string,

  view_check: string,
  view_doc_input: string,
  view_doc_invent: string,
  view_ord: string,

  client_corr_id: string,
  user_corr_type: string,
  kiosk_corr_type: string,
  currency_id: string,
  munit_id: string,

  invoice_doc_type_id: string,
  invoice_docdetail_type_id: string,
  goods_arrival_doc_type_id: string,
  goods_arrival_docdetail_type_id: string,
  inventory_doc_type_id: string,
  inventory_docdetail_type_id: string,

  kiosk_open_shift_right_id: string,
  kiosk_close_own_shift_right_id: string,
  kiosk_close_shift_right_id: string,
  kiosk_issue_order_right_id: string,
  kiosk_selective_inventory_right_id: string,
  kiosk_selective_inventory_extended_right_id: string,
  kiosk_full_inventory_right_id: string,
  kiosk_arrival_of_goods_right_id: string,
  kiosk_list_orders_right_id: string,
  kiosk_print_stock_right_id: string,

  images_cache_cleanup_interval: number,
  orders_cache_ttl: number,
  arrivals_cache_ttl: number,
  inventories_cache_ttl: number,
  user_info_update_interval: number,

  //TODO: This five lines are not stabilized and not used yet
  customer_inactive_after_ms: number,
  employee_inactive_after_ms: number,
  customer_inactive_notify_duration_ms: number,
  employee_inactive_notify_duration_ms: number,
  customer_successful_order_notify_duration_ms: number,
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
  id?: string,
  name?: string,
  entityType?: string,
  entityId?: string,
  corrType?: string,
}

export type KioskState = {
  status: 'Unknown' | 'UnboundTerminal' | 'Unauthenticated' | 'Ready' | 'UnrecoverableError',
  name: string,
  code: string,
  params?: TerminalParams,
  /**
   * This is the `{ .."config.js"."settings", ..backend_terminal_settings }`.
   * Settings from server have higher priority than local settings.
   */
  settings?: Settings,
  globalError?: Error,
  user?: User,
  userCorr?: Correspondent,
  kioskCorr?: Correspondent,
  catalogLocales?: LocaleInfo[],
}
