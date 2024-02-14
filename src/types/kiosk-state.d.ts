export type TerminalParams = {
  terminal_id?: string,
  location_id?: string,
  object_id?: string,
  // Stage values for reference:
  // {
  //   "loc": "en",
  //   "tdp": "ws://127.0.0.1:3010",
  //   "view_ord": "f9fdf826-384d-40ac-a1f3-6551cee8ef98",
  //   "view_check": "1d7f3262-a073-4ea4-9f2c-7da03aa752a2",
  //   "view_doc_input": "4d027811-d085-43c2-844f-8c2199d133d8",
  //   "view_doc_invent": "df812dd8-4f36-412a-ac1e-7c8411d53ee1",
  //   "kiosk_corr_id": "1362c8b4-3642-408b-9fd0-057acf547c60",
  //   "client_corr_id": "4b4d99df-3e1a-4e49-853b-2ae324a954ae",
  //   "invoice_doc_type_id": "3631602d-ef2e-41fe-8aaf-0c063eacb5e1",
  //   "invoice_docdetail_type_id": "f15e302a-b60e-4a7d-bbba-64d29548355c",
  //   "goods_arrival_doc_type_id": "c50c9265-6874-4ecc-950f-588145ff3b65",
  //   "goods_arrival_docdetail_type_id": "bd91b47e-e905-46c5-bbe8-736757f03b87",
  //   "currency_id": "54a23c08-4fb8-4952-bf17-7ee9528cdfca",
  //   "munit_id": "f749a8e4-aa0e-42ad-9768-888c8ef5629b"
  // }
  terminal_settings?: {
    loc?: string,
    tdp?: string,
    view_check?: string,
    view_doc_input?: string,
    view_doc_invent?: string,
    view_ord?: string,
    kiosk_corr_id?: string,
    client_corr_id?: string,
    invoice_doc_type_id?: string,
    invoice_docdetail_type_id?: string,
    goods_arrival_doc_type_id?: string,
    goods_arrival_docdetail_type_id?: string,
    inventory_doc_type_id?: string;
    inventory_docdetail_type_id?: string;

    currency_id?: string,
    munit_id?: string,
  },
}

export type LocaleInfo = {
  lang_code: string,
  flag_src?: string;
  name: string, // title??
}

export type KioskState = {
  status: 'Unknown' | 'UnboundTerminal' | 'Unauthenticated' | 'Ready' | 'UnrecoverableError',
  name: string,
  code: string,
  params?: TerminalParams,
  globalError?: Error,
  user?: any,
  catalogLocales?: LocaleInfo[],
}
