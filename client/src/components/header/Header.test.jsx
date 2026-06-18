import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider } from '../../auth/AuthContext.jsx';
import Header from './Header.jsx';

describe('Header mobile navigation', () => {
  beforeEach(() => {
    window.innerWidth = 390;
  });

  it('opens and closes with Escape and backdrop', async () => {
    renderHeader();

    await userEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
    await userEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    await waitFor(() => expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument());
  });

  it('closes after route navigation', async () => {
    renderHeader();

    await userEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
    await userEvent.click(within(screen.getByRole('navigation', { name: /mobile navigation/i })).getByRole('link', { name: /articles/i }));

    await waitFor(() => expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument());
  });

  it('shows authenticated mobile links and hides them for guests', async () => {
    setStoredSession();
    renderHeader();

    await userEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
    const authNav = screen.getByRole('navigation', { name: /mobile navigation/i });
    expect(authNav).toHaveTextContent('My Articles');
    expect(authNav).toHaveTextContent('Write Article');

    localStorage.clear();
    renderHeader();
    await userEvent.click(screen.getAllByRole('button', { name: /toggle navigation menu/i }).at(-1));
    const guestNav = screen.getAllByRole('navigation', { name: /mobile navigation/i }).at(-1);
    expect(guestNav).not.toHaveTextContent('My Articles');
  });

  it('shows display names instead of full emails in desktop and mobile auth UI', async () => {
    setStoredSession('jane.writer@example.com');
    renderHeader();

    expect(screen.getAllByTitle('jane.writer@example.com')[0]).toHaveTextContent('Jane Writer');
    expect(screen.queryByText('jane.writer@example.com')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
    const drawer = screen.getByRole('navigation', { name: /mobile navigation/i });
    expect(within(drawer).getByTitle('jane.writer@example.com')).toHaveTextContent('Jane Writer');
    expect(drawer).not.toHaveTextContent('jane.writer@example.com');
  });
});

function renderHeader() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<main>Home page</main>} />
          <Route path="/articles" element={<main>Articles page</main>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function setStoredSession(email = 'demo@local.test') {
  localStorage.setItem('hristian-blog-session', JSON.stringify({
    _id: 'user-id',
    email,
    accessToken: 'token',
  }));
}
