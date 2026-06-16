import requester from './requester';
import { createQuery } from './query';

const endpoint = '/data/articles';

export function getAll() {
  return requester('GET', `${endpoint}${createQuery({ sortBy: '_createdOn desc' })}`)
    .then((articles) => articles || [])
    .catch(returnEmptyCollection);
}

export function getLatest(limit = 4) {
  return requester('GET', `${endpoint}${createQuery({ sortBy: '_createdOn desc', pageSize: limit })}`)
    .then((articles) => articles || [])
    .catch(returnEmptyCollection);
}

export function getById(articleId) {
  return requester('GET', `${endpoint}/${encodeURIComponent(articleId)}`);
}

export function getByCategory(category) {
  return requester('GET', `${endpoint}${createQuery({
    where: `category="${category}"`,
    sortBy: '_createdOn desc',
  })}`)
    .then((articles) => articles || [])
    .catch(returnEmptyCollection);
}

export function search(searchTerm) {
  const term = searchTerm.trim().toLowerCase();

  if (!term) {
    return getAll();
  }

  return getAll().then((articles) => articles.filter((article) => {
    const searchable = [
      article.title,
      article.summary,
      article.authorName,
      article.category,
    ].join(' ').toLowerCase();

    return searchable.includes(term);
  }));
}

export function create(article, token) {
  return requester('POST', endpoint, article, token);
}

export function update(articleId, article, token) {
  return requester('PUT', `${endpoint}/${encodeURIComponent(articleId)}`, article, token);
}

export function remove(articleId, token) {
  return requester('DELETE', `${endpoint}/${encodeURIComponent(articleId)}`, undefined, token);
}

function returnEmptyCollection(error) {
  if (/not found|404|resource/i.test(error.message)) {
    return [];
  }

  throw error;
}
