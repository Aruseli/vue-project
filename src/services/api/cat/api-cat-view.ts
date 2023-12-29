export async function apiFetchCatView(viewId: string, parameters?: Record<string, any>) {
  const response = await fetch('/cat-api/v2/reports/getView', {
    method: 'POST',
    body: JSON.stringify({
      view_id: viewId,
      parameters,
    }),
    headers: {
      'content-type': 'application/json',
    },
  })

  if (response.ok) {
    const result = await response.text();

    return result;
  }
  else {
    throw new Error('CAT view fetch')
  }
}
