export const apiConfig = {
  baseUrl: import.meta.env.PUBLIC_API_BASE_URL ?? 'http://192.168.0.163:3000/',
  timeoutMs: 8000,
} as const;
