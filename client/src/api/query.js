export function createQuery(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .forEach(([key, value]) => searchParams.set(key, value));

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}
