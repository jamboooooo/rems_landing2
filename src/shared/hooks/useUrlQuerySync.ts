import { useEffect } from 'react';

import type { PropertyFilters } from '@/entities/property/model/types';
import { toSearchParams } from '@/shared/lib/query';

export function useUrlQuerySync(filters: PropertyFilters) {
  useEffect(() => {
    const search = toSearchParams(filters).toString();
    const nextUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.replaceState(null, '', nextUrl);
  }, [filters]);
}
