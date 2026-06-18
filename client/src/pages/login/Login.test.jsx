import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../auth/AuthContext.jsx';
import useAuth from '../../auth/useAuth';
import Login from './Login.jsx';

describe('Login page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows client validation errors', async () => {
    renderLogin();

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('renders server errors and prevents duplicate successful submissions', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response({ code: 403, message: "Login or password don't match" }, 403))
      .mockResolvedValue(response({ _id: 'id', email: 'user@example.com', accessToken: 'token' }));
    vi.stubGlobal('fetch', fetchMock);

    renderLogin();
    await fillLogin('user@example.com', 'demo123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText("Login or password don't match")).toBeInTheDocument();

    await fillLogin('user@example.com', 'demo123');
    const button = screen.getByRole('button', { name: /sign in/i });
    await Promise.all([userEvent.click(button), userEvent.click(button)]);

    await waitFor(() => expect(screen.getByText('Home')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('shows and clears the expired-session message during a fresh auth flow', async () => {
    render(
      <MemoryRouter initialEntries={['/expire']}>
        <AuthProvider>
          <Routes>
            <Route path="/expire" element={<ExpireSession />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: /expire/i }));

    expect(screen.getByRole('status')).toHaveTextContent('Your session expired. Please sign in again.');

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

async function fillLogin(email, password) {
  await userEvent.clear(screen.getByLabelText(/email/i));
  await userEvent.type(screen.getByLabelText(/email/i), email);
  await userEvent.clear(screen.getByLabelText(/password/i));
  await userEvent.type(screen.getByLabelText(/password/i), password);
}

function response(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function ExpireSession() {
  const { handleInvalidSession } = useAuth();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        handleInvalidSession();
        navigate('/login', { replace: true, state: { from: { pathname: '/articles/create' } } });
      }}
    >
      Expire
    </button>
  );
}
