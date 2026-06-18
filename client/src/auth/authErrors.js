const invalidSessionMessages = [
  'invalid access token',
  'missing access token',
  'invalid token',
  'missing token',
  'expired session',
  'session expired',
  'invalid session',
];

const invalidSessionCodes = new Set([
  'INVALID_ACCESS_TOKEN',
  'MISSING_ACCESS_TOKEN',
  'INVALID_TOKEN',
  'TOKEN_EXPIRED',
  'SESSION_EXPIRED',
  'INVALID_SESSION',
]);

export function isInvalidSessionError(error) {
  if (!error || ![401, 403].includes(Number(error.status))) {
    return false;
  }

  const code = getString(error.code) || getString(error.responseBody?.code);
  if (code && invalidSessionCodes.has(code.toUpperCase())) {
    return true;
  }

  const message = [
    error.message,
    error.responseBody?.message,
    error.responseBody?.error,
  ].map(getString).filter(Boolean).join(' ').toLowerCase();

  return invalidSessionMessages.some((invalidMessage) => message.includes(invalidMessage));
}

function getString(value) {
  return typeof value === 'string' ? value.trim() : '';
}
