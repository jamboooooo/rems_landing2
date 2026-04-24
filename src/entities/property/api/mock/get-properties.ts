import { mockProperties } from '@/entities/property/api/mock/properties';
import type {
  PropertyFilters,
  PropertyListItem,
  PropertyResponse,
} from '@/entities/property/model/types';
import { buildCleanQuery } from '@/shared/lib/query';

function inRange(value: number, from?: number, to?: number) {
  const matchFrom = from === undefined || value >= from;
  const matchTo = to === undefined || value <= to;
  return matchFrom && matchTo;
}

function applyFilters(list: PropertyListItem[], filters: PropertyFilters) {
  return list.filter((item) => {
    const q = filters.q?.trim().toLowerCase();
    const matchQ =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.developer.toLowerCase().includes(q);

    const matchLocation =
      !filters.location || item.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchStatus = !filters.status || item.status === filters.status;
    const matchType = !filters.type || item.type === filters.type;
    const matchOwnership = !filters.ownershipType || item.ownershipType === filters.ownershipType;
    const matchSource = !filters.source || item.source === filters.source;

    const matchPrice = inRange(item.priceFrom, filters.priceFrom, filters.priceTo);
    const matchBedrooms = inRange(item.bedroomsFrom, filters.bedroomsFrom, filters.bedroomsTo);
    const matchBathrooms = inRange(item.bathroomsFrom, filters.bathroomsFrom, filters.bathroomsTo);

    return (
      matchQ &&
      matchLocation &&
      matchStatus &&
      matchType &&
      matchOwnership &&
      matchSource &&
      matchPrice &&
      matchBedrooms &&
      matchBathrooms
    );
  });
}

export async function getPropertiesMock(rawFilters: PropertyFilters): Promise<PropertyResponse> {
  const filters = buildCleanQuery(rawFilters);
  const filtered = applyFilters(mockProperties, filters);

  const page = Number(filters.page ?? 1);
  const limit = Number(filters.limit ?? 9);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const end = start + limit;
  const pagedData = filtered.slice(start, end);

  await new Promise((resolve) => setTimeout(resolve, 420));

  return {
    data: pagedData,
    meta: {
      page: safePage,
      limit,
      total,
      totalPages,
      hasNext: safePage < totalPages,
    },
  };
}
