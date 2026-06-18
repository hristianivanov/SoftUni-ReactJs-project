import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider } from '../auth/AuthContext.jsx';
import GuestOnlyRoute from './GuestOnlyRoute.jsx';
import RequireAuth from './RequireAuth.jsx';

describe('route guards', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it.each([
    ['/my-articles', '/my-articles'],
    ['/articles/create?draft=1#top', '/articles/create?draft=1#top'],
    ['/articles/article-123/edit', '/articles/article-123/edit'],
  ])('redirects guest visitors from %s to login and preserves the requested location', (entry, expectedFrom) => {
    renderWithAuth(
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/my-articles" element={<div>My articles</div>} />
          <Route path="/articles/create" element={<div>Create article</div>} />
          <Route path="/articles/:articleId/edit" element={<div>Edit article</div>} />
        </Route>
        <Route path="/login" element={<LoginProbe />} />
      </Routes>,
      [entry],
    );

    expect(screen.getByText(expectedFrom)).toBeInTheDocument();
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

  it.each([
    ['/login', 'Login page'],
    ['/register', 'Register page'],
  ])('redirects authenticated users away from %s', (entry, guestPageText) => {
    setStoredSession();
    renderWithAuth(
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<div>Login page</div>} />
          <Route path="/register" element={<div>Register page</div>} />
        </Route>
      </Routes>,
      [entry],
    );

    expect(screen.getByText('Home page')).toBeInTheDocument();
    expect(screen.queryByText(guestPageText)).not.toBeInTheDocument();
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
