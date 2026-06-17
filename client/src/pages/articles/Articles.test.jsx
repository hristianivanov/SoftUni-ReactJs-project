import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Articles from './Articles.jsx';

vi.mock('../../api/articleService', () => ({
  getAll: vi.fn(),
}));

describe('Articles catalog', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    const articleService = await import('../../api/articleService');
    articleService.getAll.mockResolvedValue(articles);
  });

  it('initializes from URL search params and sorts results', async () => {
    renderArticles('/articles?search=react&sort=title&page=1');

    expect(await screen.findByDisplayValue('react')).toBeInTheDocument();
    expect(screen.getByLabelText(/sort/i)).toHaveValue('title');
    const headings = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(headings[0]).toBe('A React Start');
  });

  it('updates search query and resets page while typing', async () => {
    renderArticles('/articles?page=2&sort=oldest&keep=1');

    await userEvent.type(await screen.findByRole('searchbox', { name: /search articles/i }), 'api');

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('search=api'));
    expect(screen.getByTestId('location')).not.toHaveTextContent('page=2');
    expect(screen.getByTestId('location')).toHaveTextContent('sort=oldest');
    expect(screen.getByTestId('location')).toHaveTextContent('keep=1');
  });

  it('paginates and resets page after filters change', async () => {
    renderArticles('/articles?page=2');

    expect(await screen.findByText(/Page 2 of/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '1' }));
    expect(screen.getByTestId('location')).toHaveTextContent('page=1');

    await userEvent.selectOptions(screen.getByLabelText(/sort/i), 'title');
    expect(screen.getByTestId('location')).not.toHaveTextContent('page=');
  });
});

function renderArticles(initialEntry) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/articles" element={<Articles />} />
      </Routes>
      <LocationProbe />
    </MemoryRouter>,
  );
}

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.search}</output>;
}

const articles = Array.from({ length: 8 }, (_, index) => ({
  _id: `article-${index}`,
  title: index === 0 ? 'A React Start' : `Article ${index}`,
  summary: index === 1 ? 'API summary' : 'React summary',
  authorName: 'Author',
  category: index % 2 === 0 ? 'React' : 'API',
  imageUrl: '/img/book.png',
  readingTime: 4,
  _createdOn: index + 1,
}));
