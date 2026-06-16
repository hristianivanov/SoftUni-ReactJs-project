const SESSION_KEY = 'hristian-blog-session';

export function getSession() {
  try {
    const rawSession = localStorage.getItem(SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    const session = JSON.parse(rawSession);

    if (!isValidSession(session)) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function setSession(session) {
  if (!isValidSession(session)) {
    throw new Error('Cannot store an invalid authentication session.');
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({
    _id: session._id,
    email: session.email,
    accessToken: session.accessToken,
  }));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function isValidSession(session) {
  return Boolean(
    session
    && typeof session._id === 'string'
    && typeof session.email === 'string'
    && typeof session.accessToken === 'string',
  );
}
