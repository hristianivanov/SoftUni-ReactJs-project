import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '../auth/AuthContext.jsx';
import GuestOnlyRoute from './GuestOnlyRoute.jsx';
import RequireAuth from './RequireAuth.jsx';

describe('route guards', () => {
  it('redirects guests to login and preserves full location', () => {
    renderWithAuth(
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/articles/create" element={<div>Create article</div>} />
        </Route>
        <Route path="/login" element={<LoginProbe />} />
      </Routes>,
      ['/articles/create?draft=1#top'],
    );

    expect(screen.getByText('/articles/create?draft=1#top')).toBeInTheDocument();
  });

  it('renders protected content for authenticated users', () => {
    setStoredSession();
    renderWithAuth(
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/articles/create" element={<div>Create article</div>} />
        </Route>
      </Routes>,
      ['/articles/create'],
    );

    expect(screen.getByText('Create article')).toBeInTheDocument();
  });

  it('redirects authenticated users away from guest routes', () => {
    setStoredSession();
    renderWithAuth(
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<div>Login page</div>} />
        </Route>
      </Routes>,
      ['/login'],
    );

    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
});

function LoginProbe() {
  const location = useLocation();
  const from = location.state?.from;
  return <div>{`${from.pathname}${from.search}${from.hash}`}</div>;
}

function renderWithAuth(children, initialEntries) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>,
  );
}

function setStoredSession() {
  localStorage.setItem('hristian-blog-session', JSON.stringify({
    _id: 'user-id',
    email: 'user@example.com',
    accessToken: 'token',
  }));
}
