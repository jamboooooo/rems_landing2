export const REFERRAL_STORAGE_KEY = 'rems_partner_id';
const REFERRAL_QUERY_KEYS = ['partnerId', 'partner_id', 'ref', 'pid'] as const;

function normalizeReferralId(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^[a-zA-Z0-9_-]{1,64}$/.test(trimmed) ? trimmed : null;
}

export function syncReferralIdFromSearch(search: string) {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(search);

  let incoming: string | null = null;
  for (const key of REFERRAL_QUERY_KEYS) {
    const candidate = normalizeReferralId(params.get(key));
    if (candidate) {
      incoming = candidate;
      break;
    }
  }

  if (!incoming) return localStorage.getItem(REFERRAL_STORAGE_KEY);
  const current = localStorage.getItem(REFERRAL_STORAGE_KEY);
  if (current !== incoming) {
    localStorage.setItem(REFERRAL_STORAGE_KEY, incoming);
  }
  return incoming;
}

export function getStoredReferralId() {
  if (typeof window === 'undefined') return null;
  return normalizeReferralId(localStorage.getItem(REFERRAL_STORAGE_KEY));
}

export function referralIdToAuthorId(referralId: string | null | undefined) {
  if (!referralId) return undefined;
  const num = Number(referralId);
  if (!Number.isInteger(num) || num <= 0) return undefined;
  return num;
}
