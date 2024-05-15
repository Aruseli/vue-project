import { Correspondent, TerminalParams, TerminalShift, User } from "src/types/kiosk-state";


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

export async function apiAddAnyTerminal(name: string, code: string, type_id: string) {
  const response = await fetchApi<{ data: TerminalParams }>('/api/v2/addAnyTerminal', {
    name,
    code,
    type_id,
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

export async function apiLogout() {
  const response = await fetchApi('/api/v2/auth/closeSession');
  return response;
}

export async function apiGetLocalesList(objectId: string, locationId: string) {
  const response = await fetchApi('/api/v2/kiosk/getLocalesList', {
    objectId,
    locationId,
  });
  return response.data.locales as {id: string, lang_code: string, name: string, flag_code: string}[];
}

export async function apiGetLocale(lang: string) {
  const response = await fetchApi('/api/v2/kiosk/getLocale', {
    lang,
  });
  return response.data.locale;
}
export async function apiGetCurrentShift(locationId: string) {
  const response = await fetchApi('/api/v2/sales/currentShift', {
    id: locationId,
  });
  return response.data.id as string
}
export async function apiGetShift(terminalId: string) {
  const response = await fetchApi('/api/v2/sales/getShift', {
    id: terminalId,
  });
  return response.data as {
    shift?: TerminalShift,
    last_open_operation?: { staff1: string, details: { terminal_shift_id: string } },
    last_close_operation?: { staff1: string, details: { terminal_shift_id: string } },
  };
}
export async function apiAddShift(terminalId: string, locationShiftId: string, user_id: string) {
  const response = await fetchApi('/api/v2/sales/addShift', {
    terminal_id: terminalId,
    global_shift_id: locationShiftId,
    user_id: user_id,
  });
  return response.data as { id: string }
}
export async function apiCloseShift(terminalShiftId: string, state: number, user_id: string) {
  const response = await fetchApi('/api/v2/sales/closeShift', {
    id: terminalShiftId,
    state: state,
    user_id: user_id,
  });
  return response.data as { success: number }
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

export async function apiReportsGetView(viewId: string, parameters?: Record<string, any> | Array<Record<string,any>>) {
  const response = await fetchApi('/api/v2/reports/getView', { view_id: viewId, parameters },'text')
  return response
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
  images_ids: string[],
  code: string,
  props: {
    prop_id: number;
    prop_value: number;
    prop_name: string;
  }
}

export async function apiGetGoods(location_id: string, locale: string) {
  const response = await fetchApi('/api/v2/kiosk/getGoods', {
    location_id,
    locale,
  });
  removeNullGoods(response)
  fixGoodsTitles(response)
  addPropNames(response)
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

  function addPropNames(response: any) {
    console.log(`response.data.goodTypes`, response.data.goodTypes)
    response.data.goodTypes.forEach((goodType: any) => {
        goodType.goods.forEach((good: any) => {
          good.props.forEach((prop: any) => {
            prop.prop_name = response.data.propsNames.find((propName: any) => propName.prop_id === prop.prop_id).prop_name
          })
        })
      }
    )
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
  barcode: string,
  // fields: { payment_type: string },
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

export async function apiGetDocuments(types: string[], states: number[], corr_ids: string[]) {
  const response = await fetchApi('/api/v2/kiosk/getDocuments', {
    types,
    states,
    corr_ids,
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
  doc_date: string, // e.g. '2024-01-24'
  doc_order: number,
  corr_from_ref: string,
  corr_to_ref: string,
  respperson_ref: string,
  currency_ref: string,
  curr_rate: number,
  comment?: string,
  // fields: { payment_type: string },
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

export async function apiSaveDocument(doc: SaveableDocument, terminal_shift_id?: string) {
  const response = await fetchApi('/api/v2/kiosk/saveDocument', {
    doc, terminal_shift_id,
  });
  return response.data.id as string;
}

export async function apiSaveOperation(
  operation_type_id: string,
  doc_id: string,
  respperson_ref: string,
  terminal_shift_id: string,
  data?: object,
) {
  const response = await fetchApi('/api/v2/kiosk/saveOperation', {
    type: operation_type_id,
    doc_id,
    respperson_ref,
    terminal_shift_id,
    data,
  });
  return response.data.success as boolean;
}

export interface CheckContent {
  id: string;
  type: string;
  good_id: string;
  parent_id?: string;
  amount: number;
  base_price: number;
  final_price: number;
  total: number;
  munit: string;
  staff_id: string;
  currency_id: string;
  state: number;
}

export interface CheckPayment {
  id?: string;
  ext_source?: string;
  ext_id?: string;
  payment_type_id: string;
  amount: number;
  payment_date: string;
  staff_id: string;
  state: number;
  currency_id: string;
}

export interface Check {
  id?: string;
  ext_source: string;
  ext_id: string;
  opened: string;
  closed?: string;
  terminal_shift_id: string;
  check_type: 'sale' | 'return';
  total: number;
  state: 0 | 1 | 2;
  returned?: boolean;
  content: CheckContent[];
  payments: CheckPayment[];
}

export async function apiUpsertCheck(check: Check) {
  const axiosResponse = await fetchApi('/api/v2/sales/upsertCheck', {
    check
  });

  return axiosResponse.data;
}

export async function apiGetStockRemains(id: string) {
  const response = await fetchApi('/api/v2/kiosk/getStockRemains', { id });
  return response.data.goods as {
    good_id: string,
    items: { mark: string, code: string}[],
    reserved?: number,
  }[];
}

// Unused now:
// getDocumentRemains
// saveOperation

