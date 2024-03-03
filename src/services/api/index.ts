import { Correspondent, TerminalParams, User } from "src/types/kiosk-state";
import config from 'src/services/config';

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

export async function apiAddAnyTerminal(name: string, code: string) {
  const response = await fetchApi<{ data: TerminalParams }>('/api/v2/addAnyTerminal', {
    name,
    code,
    type_id: config.terminal_type_id,
  })
  return response.data;
}

// Note: There is also /api/v2/auth/openSession
export async function apiAuth(userName: string, userPassword: string) {
  const response = await fetchApi<{ token: string }>('/auth/login.json', { userName, userPassword })
  return response.token;
}

export async function apiAuthBearer(token: string) {
  const response = await fetchApi<{ data: { token: string }}>('/api/v2/auth/bearerLogin', undefined, "json", {
    Authorization: `Bearer ${token}`,
  })
  return response.data.token;
}

export async function apiGetLocalesList(objectId: string, locationId: string) {
  const response = await fetchApi('/api/v2/kiosk/getLocalesList', {
    objectId,
    locationId,
  });
  console.log('apiGetLocalesList', response)
  return response.data.locales as {id: string, lang_code: string, name: string}[];
}

export async function apiGetLocale(lang: string) {
  const response = await fetchApi('/api/v2/kiosk/getLocale', {
    lang,
  });
  console.log('apiGetLocale', response);
  return response.data.locale[0]?.data;
}

export async function apiUsersWhoami() {
  const response = await fetchApi<{ data: User }>('/api/v2/users/whoami')
  return response.data
}

export async function apiGetCorrespondentByEntity(entityId: string, corrType: string) {
  const response = await fetchApi<{ data: Correspondent }>('/api/v2/correspondents/getCorrespondentByEntity', {
    entityId,
    corrType,
  });
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
  code: string,
}

export async function apiGetGoods(location_id: string, locale: string) {
  const response = await fetchApi('/api/v2/kiosk/getGoods', {
    location_id,
    locale,
  });
  removeNullGoods(response)
  fixGoodsTitles(response)
  return response.data.goodTypes as ApiGoodCategory[];

  // Bug: empty list should be [] instead of [null]
  function removeNullGoods(response: any) {
    response.data.goodTypes.forEach((gt: any) => {
      gt.goods = gt.goods.filter((g: any) => !!g)
    })
  }

  // Bug: good.name should be named good.title
  function fixGoodsTitles(response: any) {
    response.data.goodTypes.forEach((gt: any) => {
      gt.goods.forEach((g: any) => {
        g.title = g.title ?? g.name
      })
    })
  }
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

export type KioskDocument = {
  id: string,
  state: number,
  dts: any
  doc_type: any,
  abbr_text: any,
  abbr_num?: number,
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
  return response.data.docs as KioskDocument[];
}

export async function apiGetDocument(id: string) {
  const response = await fetchApi('/api/v2/kiosk/getDocument', {
    id
  });
  return response.data.doc as KioskDocument;
}

export type SaveableDocument = {
  id?: any,
  state: number,
  doc_type: string,
  abbr_text?: any,
  abbr_num?: number,
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
  const response = await fetchApi('/api/v2/kiosk/getStockRemains', { id });
  return response.data.goods as { good_id: string, remain_quant: number }[];
}

// Unused now:
// getDocumentRemains
// saveOperation

