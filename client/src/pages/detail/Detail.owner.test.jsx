import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../auth/AuthContext.jsx';
import Detail from './Detail.jsx';

vi.mock('../../api/articleService', () => ({
  getById: vi.fn(),
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
