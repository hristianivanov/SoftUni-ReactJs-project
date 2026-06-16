import { fallbackAvatar } from './articles';

export function createAuthorFromUser(user) {
  const emailName = user?.email?.split('@')[0] || 'Author';

  return {
    authorName: emailName,
    authorAvatar: fallbackAvatar,
  };
}
