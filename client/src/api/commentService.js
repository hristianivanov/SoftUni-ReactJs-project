import requester from './requester';
import { createQuery } from './query';

const endpoint = '/data/comments';

export function getByArticleId(articleId) {
  return requester('GET', `${endpoint}${createQuery({
    where: `articleId="${articleId}"`,
  })}`)
    .then((comments) => comments || [])
    .then(sortOldestFirst)
    .catch(returnEmptyCollection);
}

export function create(comment, token) {
  return requester('POST', endpoint, comment, token);
}

export function remove(commentId, token) {
  return requester('DELETE', `${endpoint}/${encodeURIComponent(commentId)}`, undefined, token);
}

function returnEmptyCollection(error) {
  if (error.status === 404) {
    return [];
  }

  throw error;
}

function sortOldestFirst(comments) {
  return [...comments].sort((a, b) => (a?._createdOn || 0) - (b?._createdOn || 0));
}
