import { useEffect } from 'react';

import { syncReferralIdFromSearch } from '@/shared/lib/referral';

export function ReferralSync() {
  useEffect(() => {
    syncReferralIdFromSearch(window.location.search);
  }, []);

  return null;
}
