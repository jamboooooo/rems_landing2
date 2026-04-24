export function buildCleanQuery<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== null && value !== undefined && value !== '',
    ),
  ) as Partial<T>;
}

export function toSearchParams(params: Record<string, unknown>) {
  const clean = buildCleanQuery(params);
  const search = new URLSearchParams();

  Object.entries(clean).forEach(([key, value]) => {
    search.set(key, String(value));
  });

  return search;
}
