import { useEffect } from 'react';

const suffix = 'Hristian Blog';

export default function usePageTitle(title) {
  useEffect(() => {
    const nextTitle = title ? `${title} | ${suffix}` : suffix;
    document.title = nextTitle;
  }, [title]);
}
