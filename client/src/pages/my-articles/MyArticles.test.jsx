import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../auth/AuthContext.jsx';
import MyArticles from './MyArticles.jsx';

vi.mock('../../api/articleService', () => ({
  getByOwner: vi.fn(),
  remove: vi.fn(),
}));

describe('MyArticles page', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    setStoredSession('owner-id');
    const articleService = await import('../../api/articleService');
    articleService.getByOwner.mockResolvedValue([ownerArticle]);
    articleService.remove.mockResolvedValue(undefined);
  });

  it('loads only articles returned for the authenticated owner', async () => {
    renderMyArticles();

    expect(await screen.findByRole('heading', { name: /my articles/i })).toBeInTheDocument();
    expect(screen.getByText('Owner Article')).toBeInTheDocument();
    expect(screen.queryByText('Other Article')).not.toBeInTheDocument();
  });

  it('shows an empty state with a create link', async () => {
    const articleService = await import('../../api/articleService');
    articleService.getByOwner.mockResolvedValue([]);

    renderMyArticles();

    expect(await screen.findByText(/no articles yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /write article/i })).toHaveAttribute('href', '/articles/create');
  });

  it('removes a deleted owner article after confirmation', async () => {
    const articleService = await import('../../api/articleService');
    renderMyArticles();

    await screen.findByText('Owner Article');
    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    await userEvent.click(screen.getByRole('button', { name: /delete article/i }));

    await waitFor(() => expect(screen.queryByText('Owner Article')).not.toBeInTheDocument());
    expect(articleService.remove).toHaveBeenCalledWith('owner-article', 'token');
  });
});

function renderMyArticles() {
  return render(
    <MemoryRouter initialEntries={['/my-articles']}>
      <AuthProvider>
        <Routes>
          <Route path="/my-articles" element={<MyArticles />} />
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

const ownerArticle = {
  _id: 'owner-article',
  _ownerId: 'owner-id',
  title: 'Owner Article',
  summary: 'Owner summary',
  content: 'Owner content',
  category: 'React',
  readingTime: 5,
  imageUrl: '/img/book.png',
  _createdOn: 2,
};
