import type { PropertyFilters, PropertyResponse } from '@/entities/property/model/types';
import { getRequest } from '@/shared/api/api';

export async function getProperties(filters: PropertyFilters): Promise<PropertyResponse> {
  return getRequest<PropertyResponse, PropertyFilters>('/properties', filters);
}

type LocationsResponse = {
  data: Array<{
    location: string;
  }>;
};

export async function getLocations(q: string): Promise<string[]> {
  if (!q.trim()) return [];

  const response = await getRequest<LocationsResponse, { q: string }>('/addresses', { q });
  return Array.from(
    new Set(
      (response.data ?? [])
        .map((item) => item.location)
        .filter((location): location is string => Boolean(location && location.trim())),
    ),
  );
}
