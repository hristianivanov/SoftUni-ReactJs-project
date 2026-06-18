import { describe, expect, it } from 'vitest';
import { isInvalidSessionError } from './authErrors';

describe('isInvalidSessionError', () => {
  it('detects SoftUni invalid access token responses', () => {
    expect(isInvalidSessionError({
      status: 403,
      message: 'Invalid access token',
      responseBody: { code: 403, message: 'Invalid access token' },
    })).toBe(true);
  });

  it('detects missing token responses', () => {
    expect(isInvalidSessionError({
      status: 401,
      responseBody: { message: 'Missing access token' },
    })).toBe(true);
  });

  it('does not treat non-owner 403 errors as expired sessions', () => {
    expect(isInvalidSessionError({
      status: 403,
      message: 'Only the owner can modify this record.',
    })).toBe(false);
  });

  it('does not treat generic 403 errors as expired sessions', () => {
    expect(isInvalidSessionError({
      status: 403,
      message: 'Forbidden',
    })).toBe(false);
  });

  it('does not treat network errors as expired sessions', () => {
    expect(isInvalidSessionError({
      code: 'NETWORK_ERROR',
      message: 'Unable to reach the API server.',
    })).toBe(false);
  });
});
