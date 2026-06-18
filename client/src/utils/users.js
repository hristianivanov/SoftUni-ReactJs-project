export function getUserDisplayName(user) {
  if (!user || typeof user !== 'object') {
    return 'Reader';
  }

  if (user.email === 'demo@local.test') {
    return 'Demo Author';
  }

  const explicitName = [user.name, user.displayName, user.username, user.fullName]
    .find((value) => typeof value === 'string' && value.trim());

  if (explicitName) {
    return formatName(explicitName);
  }

  if (typeof user.email === 'string' && user.email.includes('@')) {
    return formatName(user.email.split('@')[0]);
  }

  return 'Reader';
}

function formatName(value) {
  const trimmed = value.trim();
  const cleaned = trimmed.replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();

  if (!cleaned) {
    return 'Reader';
  }

  if (!/[._-\s]/.test(trimmed) && cleaned === cleaned.toLowerCase()) {
    return cleaned;
  }

  return cleaned
    .split(' ')
    .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : word)
    .join(' ');
}
