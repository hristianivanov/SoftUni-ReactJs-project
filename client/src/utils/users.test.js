import { describe, expect, it } from 'vitest';
import { getUserDisplayName } from './users';

describe('getUserDisplayName', () => {
  it('uses a friendly name for the demo account', () => {
    expect(getUserDisplayName({ email: 'demo@local.test', accessToken: 'secret' })).toBe('Demo Author');
  });

  it('prefers explicit user names', () => {
    expect(getUserDisplayName({ displayName: 'jane_writer' })).toBe('Jane Writer');
    expect(getUserDisplayName({ fullName: 'Ada Lovelace' })).toBe('Ada Lovelace');
  });

  it('uses readable email names without exposing tokens', () => {
    expect(getUserDisplayName({ email: 'hristianfancha@gmail.com', accessToken: 'secret' })).toBe('hristianfancha');
    expect(getUserDisplayName({ email: 'jane.writer@example.com' })).toBe('Jane Writer');
  });

  it('falls back safely', () => {
    expect(getUserDisplayName(null)).toBe('Reader');
    expect(getUserDisplayName({ accessToken: 'secret' })).toBe('Reader');
  });
});
