import requester from './requester';
import { createQuery } from './query';

const endpoint = '/data/comments';

export function getByArticleId(articleId) {
  return requester('GET', `${endpoint}${createQuery({
    where: `articleId="${articleId}"`,
    sortBy: '_createdOn asc',
  })}`)
    .then((comments) => comments || [])
    .catch(returnEmptyCollection);
}

export function create(comment, token) {
  return requester('POST', endpoint, comment, token);
}

export function remove(commentId, token) {
  return requester('DELETE', `${endpoint}/${encodeURIComponent(commentId)}`, undefined, token);
}

function returnEmptyCollection(error) {
  if (/not found|404|resource/i.test(error.message)) {
    return [];
  }

  throw error;
}
