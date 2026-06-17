export const fallbackImage = '/img/book.png';
export const fallbackAvatar = '/img/author.jpg';

export function normalizeArticleId(article) {
  return article?._id || article?.id;
}

export function formatArticleDate(value) {
  if (!value) {
    return 'Draft date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Draft date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function toDateTime(value) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function safeText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function getParagraphs(value) {
  const content = safeText(value, 'This article does not have readable content yet.');

  return content
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function isSafeHttpUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return value.startsWith('/');
  }
}

export function resolveImageUrl(value, fallback = fallbackImage) {
  return isSafeHttpUrl(value) ? value : fallback;
}

export function handleImageFallback(event, fallback) {
  if (event.currentTarget.src.endsWith(fallback)) {
    return;
  }

  event.currentTarget.src = fallback;
}

export function getCategoryCounts(articles) {
  return articles.reduce((counts, article) => {
    const category = article.category || 'General';
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
}

export function sortNewestFirst(articles) {
  return [...articles].sort((a, b) => (b?._createdOn || 0) - (a?._createdOn || 0));
}

export function sortArticles(articles, sort = 'newest') {
  const sorted = [...articles];

  if (sort === 'oldest') {
    return sorted.sort((a, b) => (a?._createdOn || 0) - (b?._createdOn || 0));
  }

  if (sort === 'title') {
    return sorted.sort((a, b) => safeText(a?.title).localeCompare(safeText(b?.title)));
  }

  return sortNewestFirst(sorted);
}

export function paginateArticles(articles, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(articles.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    currentPage,
    totalPages,
    visibleArticles: articles.slice(start, start + pageSize),
  };
}

export function filterArticles(articles, { searchTerm, category }) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return articles.filter((article) => {
    const matchesCategory = !category || article.category === category;
    const searchable = [
      article.title,
      article.summary,
      article.authorName,
      article.category,
    ].join(' ').toLowerCase();

    return matchesCategory && (!normalizedSearch || searchable.includes(normalizedSearch));
  });
}
