import { getPropertyPublicMock } from '@/entities/property/api/mock/get-property-public';
import type { PropertyPublic } from '@/entities/property/model/types';
import { getRequest } from '@/shared/api/api';

const USE_MOCK_API = true;

export async function getPropertyPublic(id: string): Promise<PropertyPublic | null> {
  if (USE_MOCK_API) {
    return getPropertyPublicMock(id);
  }

  try {
    return await getRequest<PropertyPublic, Record<string, never>>(`/properties/${id}`, {});
  } catch {
    return null;
  }
}
