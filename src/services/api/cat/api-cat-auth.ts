import { fetchCatApi } from '../fetch';

export async function apiCatAuth(userName: string, password: string) {
  try {
    const response = await fetchCatApi<{ token: string }>('/cat-api/v2/auth/openSession', { userName, userPassword: password })

    return response.token;
  }
  catch(e: any) {
    if (e.message.startsWith('API fetch, code: ERR_AUTH')) {
      return;
    }
  }
}
