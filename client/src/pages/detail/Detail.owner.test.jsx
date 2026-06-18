import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../auth/AuthContext.jsx';
import Detail from './Detail.jsx';

vi.mock('../../api/articleService', () => ({
  getById: vi.fn(),
  getByCategory: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('../../api/commentService', () => ({
  getByArticleId: vi.fn(),
  create: vi.fn(),
  remove: vi.fn(),
}));

describe('article and comment owner visibility', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    const articleService = await import('../../api/articleService');
    const commentService = await import('../../api/commentService');
    articleService.getById.mockResolvedValue(article);
    articleService.getByCategory.mockResolvedValue([article, relatedArticle]);
    commentService.getByArticleId.mockResolvedValue([ownerComment, otherComment]);
  });

  it('shows article and comment delete controls for owners', async () => {
    setStoredSession('owner-id');
    renderDetail();

    expect(await screen.findByRole('link', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2);
  });

  it('hides owner controls from guests and non-owners', async () => {
    renderDetail();

    await waitFor(() => expect(screen.queryByRole('link', { name: /edit/i })).not.toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();

    cleanup();
    localStorage.clear();
    setStoredSession('other-id');
    renderDetail();

    await waitFor(() => expect(screen.queryByRole('link', { name: /edit/i })).not.toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('shows related articles without repeating the current article', async () => {
    renderDetail();

    expect(await screen.findByRole('heading', { name: /related articles/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Related Article' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Owner Article' })).toHaveLength(1);
  });

  it('renders old plain text content as readable paragraphs', async () => {
    renderDetail();

    expect(await screen.findByText(/Readable article content/)).toBeInTheDocument();
  });

  it('renders Markdown content safely', async () => {
    const articleService = await import('../../api/articleService');
    articleService.getById.mockResolvedValue({
      ...article,
      content: '## Markdown Heading\n\n- First item\n\n> Safe quote\n\n[Safe](https://example.com) [Bad](javascript:alert(1))',
    });

    renderDetail();

    expect(await screen.findByRole('heading', { name: 'Markdown Heading' })).toBeInTheDocument();
    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Safe quote')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Safe' })).toHaveAttribute('href', 'https://example.com');
    expect(screen.queryByRole('link', { name: 'Bad' })).not.toBeInTheDocument();
  });
});

const article = {
  _id: 'article-id',
  _ownerId: 'owner-id',
  title: 'Owner Article',
  summary: 'Readable summary for owner article.',
  content: 'Readable article content that is long enough for rendering in tests.',
  imageUrl: 'https://example.com/image.jpg',
  authorName: 'Owner',
  category: 'React',
  readingTime: 5,
};

const ownerComment = {
  _id: 'comment-owner',
  _ownerId: 'owner-id',
  text: 'Owner comment',
  authorName: 'Owner',
};

const otherComment = {
  _id: 'comment-other',
  _ownerId: 'someone-else',
  text: 'Other comment',
  authorName: 'Other',
};

const relatedArticle = {
  _id: 'related-id',
  _ownerId: 'other-id',
  title: 'Related Article',
  summary: 'Related summary',
  content: 'Related content',
  imageUrl: 'https://example.com/related.jpg',
  authorName: 'Other',
  category: 'React',
  readingTime: 4,
  _createdOn: 2,
};

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/articles/article-id']}>
      <AuthProvider>
        <Routes>
          <Route path="/articles/:articleId" element={<Detail />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function setStoredSession(id) {
  localStorage.setItem('hristian-blog-session', JSON.stringify({
    _id: id,
    email: `${id}@example.com`,
    accessToken: 'token',
  }));
}
