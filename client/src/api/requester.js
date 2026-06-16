const DEFAULT_API_BASE_URL = 'http://localhost:3030';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

export function getApiBaseUrl() {
  return apiBaseUrl;
}

export default async function requester(method, endpoint, data, token) {
  const options = {
    method,
    headers: {},
  };

  if (data !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  if (token) {
    options.headers['X-Authorization'] = token;
  }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, options);

  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof result === 'object' && result !== null
      ? result.message || 'Request failed'
      : result || 'Request failed';

    throw new Error(message);
  }

  return result;
}
