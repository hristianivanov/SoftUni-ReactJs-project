const DEFAULT_API_BASE_URL = 'http://localhost:3030';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

export class RequestError extends Error {
  constructor(message, { status, code, responseBody } = {}) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
    this.code = code;
    this.responseBody = sanitizeResponseBody(responseBody);
  }
}

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

  let response;

  try {
    response = await fetch(`${apiBaseUrl}${endpoint}`, options);
  } catch {
    throw new RequestError('Unable to reach the API server.', {
      code: 'NETWORK_ERROR',
    });
  }

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

    throw new RequestError(message, {
      status: response.status,
      code: typeof result === 'object' && result !== null ? result.code : undefined,
      responseBody: result,
    });
  }

  return result;
}

function sanitizeResponseBody(responseBody) {
  if (!responseBody || typeof responseBody !== 'object') {
    return responseBody;
  }

  const forbiddenKeys = new Set(['password', 'accessToken', 'token']);

  return Object.fromEntries(
    Object.entries(responseBody).filter(([key]) => !forbiddenKeys.has(key)),
  );
}
