import { describe, expect, it } from 'vitest';
import { createArticlePayload, validateArticle } from './articleFormValidation';

const validValues = {
  title: 'Useful React Patterns',
  summary: 'A practical summary with enough detail.',
  content: 'This content has enough length to satisfy validation and explain the article idea clearly.',
  imageUrl: 'https://example.com/image.jpg',
  category: 'React',
  readingTime: '8',
  featured: true,
  authorName: 'existing-author',
  authorAvatar: '/img/author.jpg',
};

describe('article form validation', () => {
  it('accepts valid values and trims payload text', () => {
    const values = { ...validValues, title: '  Useful React Patterns  ' };

    expect(validateArticle(values)).toEqual({});
    expect(createArticlePayload(values)).toMatchObject({
      title: 'Useful React Patterns',
      readingTime: 8,
      featured: true,
    });
  });

  it('rejects invalid URLs, short text, and out-of-range reading time', () => {
    const errors = validateArticle({
      title: 'Bad',
      summary: 'Too short',
      content: 'Also short',
      imageUrl: '/local-image.jpg',
      category: '',
      readingTime: '121',
      featured: false,
    });

    expect(errors.title).toBeTruthy();
    expect(errors.summary).toBeTruthy();
    expect(errors.content).toBeTruthy();
    expect(errors.imageUrl).toBeTruthy();
    expect(errors.category).toBeTruthy();
    expect(errors.readingTime).toBeTruthy();
  });

  it('preserves existing author metadata during editing', () => {
    expect(createArticlePayload(validValues)).toMatchObject({
      authorName: 'existing-author',
      authorAvatar: '/img/author.jpg',
    });
  });

  it('uses provided author metadata for new articles', () => {
    const payload = createArticlePayload(validValues, {
      authorName: 'new-author',
      authorAvatar: '/img/new.jpg',
    });

    expect(payload.authorName).toBe('new-author');
    expect(payload.authorAvatar).toBe('/img/new.jpg');
  });
});
