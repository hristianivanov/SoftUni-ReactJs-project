import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as articleService from './articleService';

describe('articleService.getByOwner', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('queries by owner and sorts newest first', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response([
      { _id: 'old', _ownerId: 'owner id', _createdOn: 1 },
      { _id: 'new', _ownerId: 'owner id', _createdOn: 3 },
    ]));
    vi.stubGlobal('fetch', fetchMock);

    const result = await articleService.getByOwner('owner id');

    expect(fetchMock.mock.calls[0][0]).toContain('/data/articles?where=_ownerId%3D%22owner+id%22');
    expect(result.map((article) => article._id)).toEqual(['new', 'old']);
  });

  it('returns an empty array for a missing collection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response('Collection does not exist: articles', 404, 'text/plain')));

    await expect(articleService.getByOwner('owner')).resolves.toEqual([]);
  });
});

function response(body, status = 200, contentType = 'application/json') {
  return new Response(
    contentType.includes('json') ? JSON.stringify(body) : body,
    {
      status,
      headers: { 'Content-Type': contentType },
    },
  );
}
