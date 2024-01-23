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
  terminal_settings?: {
    loc?: string,
    tdp?: string,
    view_check?: string,
    view_doc_input?: string,
    view_doc_invent?: string,
    view_ord?: string,
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
