import { afterEach, describe, expect, it, vi } from 'vitest';
import requester, { RequestError } from './requester';

describe('requester', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns successful JSON responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ ok: true })));

    await expect(requester('GET', '/data/articles')).resolves.toEqual({ ok: true });
  });

  it('returns undefined for 204 responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    await expect(requester('DELETE', '/data/articles/1')).resolves.toBeUndefined();
  });

  it('throws structured HTTP errors without sensitive fields', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      code: 403,
      message: 'Forbidden',
      accessToken: 'secret',
      password: 'secret',
    }, { status: 403 })));

    await expect(requester('POST', '/users/login')).rejects.toMatchObject({
      name: 'RequestError',
      message: 'Forbidden',
      status: 403,
      code: 403,
      responseBody: { code: 403, message: 'Forbidden' },
    });
  });

  it('throws text errors and structured network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Missing', { status: 404 })));

    await expect(requester('GET', '/missing')).rejects.toBeInstanceOf(RequestError);

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network failed')));
    await expect(requester('GET', '/offline')).rejects.toMatchObject({
      name: 'RequestError',
      message: 'Unable to reach the API server.',
      code: 'NETWORK_ERROR',
    });
  });

  it('sends authorization headers when token is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    await requester('POST', '/data/articles', { title: 'Test' }, 'token-value');

    expect(fetchMock.mock.calls[0][1].headers['X-Authorization']).toBe('token-value');
  });
});

function response(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status || 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
