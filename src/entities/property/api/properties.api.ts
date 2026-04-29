import type { PropertyFilters, PropertyResponse } from '@/entities/property/model/types';
import { getRequest } from '@/shared/api/api';

export async function getProperties(filters: PropertyFilters): Promise<PropertyResponse> {
  return getRequest<PropertyResponse, PropertyFilters>('/properties', filters);
}
