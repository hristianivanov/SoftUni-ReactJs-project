import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider, SESSION_EXPIRED_MESSAGE } from './AuthContext.jsx';
import useAuth from './useAuth';
import RequireAuth from '../routes/RequireAuth.jsx';

describe('AuthProvider session handling', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('clears a stale stored session and exposes an expired-session message', async () => {
    setStoredSession();
    render(
      <MemoryRouter>
        <AuthProvider>
          <SessionProbe />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('authenticated')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /expire session/i }));

    expect(localStorage.getItem('hristian-blog-session')).toBeNull();
    expect(screen.getByText('guest')).toBeInTheDocument();
    expect(screen.getByText(SESSION_EXPIRED_MESSAGE)).toBeInTheDocument();
  });

  it('redirects protected routes after a session is cleared', async () => {
    setStoredSession();
    render(
      <MemoryRouter initialEntries={['/articles/create']}>
        <AuthProvider>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/articles/create" element={<SessionProbe />} />
            </Route>
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: /expire session/i }));

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});

function SessionProbe() {
  const { handleInvalidSession, isAuthenticated, sessionMessage } = useAuth();

  return (
    <div>
      <span>{isAuthenticated ? 'authenticated' : 'guest'}</span>
      {sessionMessage && <p>{sessionMessage}</p>}
      <button type="button" onClick={() => handleInvalidSession()}>Expire session</button>
    </div>
  );
}

function setStoredSession() {
  localStorage.setItem('hristian-blog-session', JSON.stringify({
    _id: 'user-id',
    email: 'user@example.com',
    accessToken: 'token',
  }));
}
