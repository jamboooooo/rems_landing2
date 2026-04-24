import { getPropertiesMock } from '@/entities/property/api/mock/get-properties';
import type { PropertyFilters, PropertyResponse } from '@/entities/property/model/types';
import { getRequest } from '@/shared/api/api';

const USE_MOCK_API = true;

export async function getProperties(filters: PropertyFilters): Promise<PropertyResponse> {
  if (USE_MOCK_API) {
    return getPropertiesMock(filters);
  }

  return getRequest<PropertyResponse, PropertyFilters>('/properties', filters);
}
