import { mockProperties } from '@/entities/property/api/mock/properties';
import type {
  AttachmentItem,
  Currency,
  PropertyListItem,
  PropertyPublic,
  PropertyStatus,
} from '@/entities/property/model/types';

const AED_PER_USD = 3.67;
const RUB_PER_USD = 92;

function midpoint(a: number, b: number) {
  return Math.round((a + b) / 2);
}

function pricesFromAmount(amount: number, currency: Currency): PropertyPublic['prices'] {
  let usd: number;
  if (currency === 'USD') usd = amount;
  else if (currency === 'AED') usd = amount / AED_PER_USD;
  else usd = amount / RUB_PER_USD;

  return {
    usd: Math.round(usd),
    aed: Math.round(usd * AED_PER_USD),
    rub: Math.round(usd * RUB_PER_USD),
  };
}

function hashToUnitInterval(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 10_000) / 10_000;
}

function coordinatesFor(id: string): { lat: number; lng: number } {
  const t = hashToUnitInterval(id);
  const lat = 24.8 + t * 0.55;
  const lng = 54.8 + (1 - t) * 0.45;
  return { lat, lng };
}

function completionFor(status: PropertyStatus): string | undefined {
  if (status === 'COMPLETED') return undefined;
  if (status === 'HANDOVER_IN') return '2026-09-30';
  return '2027-12-31';
}

function buildAttachments(item: PropertyListItem, extraPhotos: string[]): AttachmentItem[] {
  const photos: AttachmentItem[] = [item.preview, ...extraPhotos]
    .filter(Boolean)
    .map((url, i) => ({
      id: `${item.id}-ph-${i}`,
      url: url as string,
      type: 'PHOTO' as const,
      title: i === 0 ? 'Main view' : `Gallery ${i + 1}`,
    }));

  return [
    ...photos,
    {
      id: `${item.id}-fp`,
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      type: 'FLOOR_PLAN',
      title: 'Floor plan',
    },
  ];
}

function buildPriceList(item: PropertyListItem, midPrice: number): NonNullable<PropertyPublic['priceList']> {
  const rows: NonNullable<PropertyPublic['priceList']> = [];
  const floors = item.status === 'COMPLETED' ? [3, 7, 12] : [5, 10];
  for (let i = 0; i < floors.length; i += 1) {
    const delta = 1 - i * 0.04;
    rows.push({
      floor: floors[i],
      price: Math.round(midPrice * delta),
      bedrooms: midpoint(item.bedroomsFrom, item.bedroomsTo),
      bathrooms: midpoint(item.bathroomsFrom, item.bathroomsTo),
    });
  }
  return rows;
}

function descriptionFor(item: PropertyListItem) {
  return `${item.name} by ${item.developer} in ${item.location}. A curated residence with refined finishes, generous layouts, and strong long-term appeal. Contact our team for availability, payment plans, and private viewings.`;
}

function featuresFor(type: PropertyListItem['type']): string[] {
  const base = ['Premium finishes', 'Smart home ready', 'Parking', 'Concierge'];
  if (type === 'VILLA' || type === 'HOUSE' || type === 'MANSION') {
    return [...base, 'Private pool', 'Landscaped garden', "Maid's room"];
  }
  if (type === 'PENTHOUSE' || type === 'APARTMENT' || type === 'DUPLEX') {
    return [...base, 'Panoramic glazing', 'Built-in wardrobes', 'High ceilings'];
  }
  return [...base, 'Resort amenities', 'Beach access'];
}

function infrastructureNear(location: string): string[] {
  if (location.toLowerCase().includes('moscow')) {
    return ['Metro within 10 min', 'Business district', 'Airport 35 min'];
  }
  return ['Retail & dining', 'Schools nearby', 'Parks & waterfront'];
}

export function listItemToPropertyPublic(item: PropertyListItem): PropertyPublic {
  const midPrice = midpoint(item.priceFrom, item.priceTo);
  const beds = midpoint(item.bedroomsFrom, item.bedroomsTo);
  const baths = midpoint(item.bathroomsFrom, item.bathroomsTo);
  const area = Math.round(90 + hashToUnitInterval(item.id) * 420);

  const extraPhotos = [
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
  ];

  const videoLinks =
    item.id.charCodeAt(0) % 2 === 0 ? ['https://www.youtube.com/embed/dQw4w9WgXcQ'] : [];

  return {
    id: item.id,
    authorId: String(item.authorId),
    area,
    name: item.name,
    developer: item.developer,
    price: midPrice,
    currency: item.currency,
    location: item.location,
    type: item.type,
    bedrooms: beds,
    bathrooms: baths,
    status: item.status,
    ownershipType: item.ownershipType ?? undefined,
    completionDate: completionFor(item.status),
    description: descriptionFor(item),
    features: featuresFor(item.type),
    mapCoordinates: coordinatesFor(item.id),
    infrastructure: infrastructureNear(item.location),
    created_at: item.createdAt,
    attachments: buildAttachments(item, extraPhotos),
    preview: item.preview ?? '',
    videoLinks,
    priceList: buildPriceList(item, midPrice),
    prices: pricesFromAmount(midPrice, item.currency),
  };
}

export function getPropertyPublicMock(id: string): PropertyPublic | null {
  const item = mockProperties.find((p) => p.id === id);
  if (!item) return null;
  return listItemToPropertyPublic(item);
}
