const httpUrlPattern = /^https?:\/\/.+/i;

export function validateArticle(values) {
  const errors = {};
  const title = values.title.trim();
  const summary = values.summary.trim();
  const content = values.content.trim();
  const imageUrl = values.imageUrl.trim();
  const category = values.category.trim();
  const readingTime = Number(values.readingTime);

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  }

  if (!summary) {
    errors.summary = 'Summary is required.';
  } else if (summary.length < 20) {
    errors.summary = 'Summary must be at least 20 characters.';
  }

  if (!content) {
    errors.content = 'Content is required.';
  } else if (content.length < 50) {
    errors.content = 'Content must be at least 50 characters.';
  }

  if (!imageUrl) {
    errors.imageUrl = 'Image URL is required.';
  } else if (!httpUrlPattern.test(imageUrl)) {
    errors.imageUrl = 'Image URL must start with http:// or https://.';
  }

  if (!category) {
    errors.category = 'Category is required.';
  }

  if (values.readingTime === '') {
    errors.readingTime = 'Reading time is required.';
  } else if (!Number.isInteger(readingTime) || readingTime < 1 || readingTime > 120) {
    errors.readingTime = 'Reading time must be an integer between 1 and 120.';
  }

  return errors;
}

export function createArticlePayload(values, author) {
  const payload = {
    title: values.title.trim(),
    summary: values.summary.trim(),
    content: values.content.trim(),
    imageUrl: values.imageUrl.trim(),
    category: values.category.trim(),
    readingTime: Number(values.readingTime),
    featured: Boolean(values.featured),
  };

  if (author) {
    payload.authorName = author.authorName;
    payload.authorAvatar = author.authorAvatar;
  } else {
    const authorName = values.authorName?.trim();
    const authorAvatar = values.authorAvatar?.trim();

    if (authorName) {
      payload.authorName = authorName;
    }

    if (authorAvatar) {
      payload.authorAvatar = authorAvatar;
    }
  }

  return payload;
}
