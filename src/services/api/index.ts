import { TERMINAL_TYPE_ID } from "../consts";

async function fetchApi<T = any>(url: string, data?: Record<string, any>, mode: 'json' | 'text' = 'json', headers: any = {}): Promise<T> {
  let response;

  try {
    response = await fetch(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'content-type': 'application/json',
        ...headers
      },
      cache: 'no-cache',
      mode: 'cors',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    });
  }
  catch(e) {
    // browser will log error
  }
  if (response) {
    if (response.status !== 200) {
      throw new Error(`API fetch, code: ${response.status}`);
    }

    let result;

    try {
      switch (mode) {
        case 'json':
          result = await response.json();
          break;
        case 'text':
          result = await response.text();
          break;
        default:
          throw new Error(`Unsupported fetch mode: ${mode}`)
      }
    }
    catch(e) {
      console.error('couldnt parse API CAT response', e);
    }
    if (!result || result.error) {
      throw new Error(`API fetch, code: ${result?.error?.code || '???'}, message: ${result?.error?.message || ''}`);
    }

    return result;
  }
  else {
    throw new Error('API fetch');
  }
}

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
    currency_id?: string,
    munit_id?: string,
  },
}

export async function apiAddAnyTerminal(name: string, code: string) {
  const response = await fetchApi<{ data: TerminalParams }>('/api/v2/addAnyTerminal', {
    name,
    code,
    type_id: TERMINAL_TYPE_ID,
  })
  return response.data;
}

// Note: There is also /api/v2/auth/openSession
export async function apiAuth(userName: string, userPassword: string) {
  const response = await fetchApi<{ token: string }>('/auth/login.json', { userName, userPassword })
  return response.token;
}

export async function apiAuthBearer(token: string) {
  const response = await fetchApi<{ token: string }>('/api/v2/auth/bearerLogin', undefined, "json", {
    Authorization: `Bearer ${token}`,
  })
  return response.token;
}

export async function apiGetLocalesList(objectId: string, locationId: string) {
  const response = await fetchApi('/api/v2/kiosk/getLocalesList', {
    objectId,
    locationId,
  });
  return response.data.locales as {id: string, langcode: string}[];
}

export async function apiGetLocale(lang: string) {
  const response = await fetchApi('/api/v2/kiosk/getLocale', {
    lang,
  });
  return response.data.locale[0]?.data;
}


export type User = {
  id: string,
  login: string,
  name: string,
  tokens: string,
  rights: { id: string, name: string }[],
}

export async function apiUsersWhoami() {
  const response = await fetchApi<{ data: User }>('/api/v2/users/whoami')
  return response.data
}

export async function apiReportsGetView(viewId: string, parameters?: Record<string, any>) {
  const response = await fetchApi('/api/v2/reports/getView', { view_id: viewId, parameters },'text')
  return response.data
}

export type ApiGoodCategory = {
  id: string,
  title: string,
  goods: ApiGood[],
}

export type ApiGood = {
  id: string,
  title: string,
  description: string,
  price: number,
  stock: number,
  images_ids: string[],
}

export async function apiGetGoods(location_id: string, locale: string) {
  const response = await fetchApi('/api/v2/kiosk/getGoods', {
    location_id,
    locale,
  });
  return response.data.goodTypes as ApiGoodCategory[];
}

export async function apiGetGoodsImages(imageIds: string[]) {
  const response = await fetchApi('/api/v2/kiosk/getGoodsImages', {
    imageIds,
    type: 'FULLSIZE',
  });
  return response.data.images as {
    id: string,
    image: string,
  }[];
}

export type Document = {
  id: string,
  state: number,
  dts: any
  doc_type: any,
  abbr_text: any,
  abbr_num: any,
  doc_date: any,
  doc_order: number,
  corr_from_ref: any,
  corr_from_name: any,
  corr_to_ref: any,
  corr_to_name: any,
  primary_stock: any,
  respperson_ref: any,
  respperson_name: any,
  currency_ref: any,
  currency_name: any,
  curr_rate: any,
  comment: any,
  details: {
    id: any,
    state: any,
    dts: any,
    move_type: number,
    rec_order: any,
    good_id: any,
    good_name: any,
    stock_id: any,
    stock_name: any,
    munit_id: any,
    munit_name: any,
    quant: any,
    total: any,
    doc_detail_link: any,
    doc_detail_type: any,
    doc_detail_type_name: any,
  }[],
};

export async function apiGetDocuments(types: string[], states: number[]) {
  const response = await fetchApi('/api/v2/kiosk/getDocuments', {
    types,
    states,
  });
  console.log('getDocuments', response)
  return response.data.docs as Document[];
}

export async function apiGetDocument(id: string) {
  const response = await fetchApi('/api/v2/kiosk/getDocument', {
    id
  });
  console.log('getDocument', response)
  return response.data.doc as Document;
}

export type SaveableDocument = {
  id?: any,
  state: number,
  doc_type: string,
  abbr_text?: any,
  abbr_num?: any,
  doc_date: string, // e.g. '2024-01-24'
  doc_order: number,
  corr_from_ref: string,
  corr_to_ref: string,
  respperson_ref: string,
  currency_ref: string,
  curr_rate: number,
  comment?: string,
  details: {
    id?: any,
    state: number,
    rec_order: number,
    good_id: string,
    munit_id: string,
    quant: number,
    total: number,
    doc_detail_link?: string,
    doc_detail_type: string,
  }[],
}

export const enum DocumentState {
  Active = 0,
  Deleted = 1,
  Draft = 2,
}

export async function apiSaveDocument(doc: SaveableDocument) {
  const response = await fetchApi('/api/v2/kiosk/saveDocument', {
    doc,
  });
  console.log('saveDocument', response);
  return response.data.id as string;
}

export async function apiGetStockRemains(id: string) {
  const response = await fetchApi('/api/v2/kiosk/getStockRemains', {
    id
  });
  console.log('apiGetStockRemains', response)
  return response.data.goods as { good_id: string, remain_quant: number }[];
}

// Unused now:
// getDocumentRemains
// saveOperation

