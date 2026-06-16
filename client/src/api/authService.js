import requester from './requester';

export function register(email, password) {
  return requester('POST', '/users/register', { email, password }).then(normalizeUser);
}

export function login(email, password) {
  return requester('POST', '/users/login', { email, password }).then(normalizeUser);
}

export function logout(accessToken) {
  return requester('GET', '/users/logout', undefined, accessToken);
}

function normalizeUser(user) {
  if (!user?._id || !user?.email || !user?.accessToken) {
    throw new Error('The authentication server returned an invalid session.');
  }

  return {
    _id: user._id,
    email: user.email,
    accessToken: user.accessToken,
  };
}
