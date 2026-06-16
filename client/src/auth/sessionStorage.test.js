import { describe, expect, it } from 'vitest';
import { clearSession, getSession, setSession } from './sessionStorage';

describe('sessionStorage utility', () => {
  it('stores and reads a valid sanitized session', () => {
    setSession({
      _id: 'user-id',
      email: 'user@example.com',
      accessToken: 'token',
      password: 'secret',
    });

    expect(getSession()).toEqual({
      _id: 'user-id',
      email: 'user@example.com',
      accessToken: 'token',
    });
  });

  it('returns null and clears corrupted JSON', () => {
    localStorage.setItem('hristian-blog-session', '{bad json');

    expect(getSession()).toBeNull();
    expect(localStorage.getItem('hristian-blog-session')).toBeNull();
  });

  it('returns null and clears sessions missing required fields', () => {
    localStorage.setItem('hristian-blog-session', JSON.stringify({ email: 'user@example.com' }));

    expect(getSession()).toBeNull();
    expect(localStorage.getItem('hristian-blog-session')).toBeNull();
  });

  it('clears the session', () => {
    setSession({ _id: 'id', email: 'user@example.com', accessToken: 'token' });
    clearSession();

    expect(getSession()).toBeNull();
  });
});
