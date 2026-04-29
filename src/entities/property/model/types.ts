export const PROPERTY_STATUS = ['HANDOVER_IN', 'UNDER_CONSTRUCTION', 'COMPLETED'] as const;
export const PROPERTY_TYPE = [
  'VILLA',
  'HOUSE',
  'TOWNHOUSE',
  'APARTMENT',
  'PENTHOUSE',
  'LOFT',
  'STUDIO',
  'DUPLEX',
  'BUNGALOW',
  'MANSION',
  'SERVICED_APARTMENT',
] as const;
export const OWNERSHIP_TYPE = ['LEASEHOLD', 'FREEHOLD'] as const;
export const PROPERTY_SOURCE = ['stepalliance', 'behomes'] as const;
export const CURRENCY = ['USD', 'AED', 'RUB'] as const;

export type PropertyStatus = (typeof PROPERTY_STATUS)[number];
export type PropertyType = (typeof PROPERTY_TYPE)[number];
export type OwnershipType = (typeof OWNERSHIP_TYPE)[number];
export type PropertySource = (typeof PROPERTY_SOURCE)[number];
export type Currency = (typeof CURRENCY)[number];

export type PropertyListItem = {
  priceFrom: number;
  priceTo: number;
  bathroomsFrom: number;
  bathroomsTo: number;
  bedroomsFrom: number;
  bedroomsTo: number;
  id: string;
  name: string;
  developer: string;
  location: string;
  status: PropertyStatus;
  type: PropertyType;
  ownershipType: OwnershipType | null;
  currency: Currency;
  createdAt: string;
  authorId: number;
  source: PropertySource;
  preview: string | null;
};

export type PropertyMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
};

export type PropertyResponse = {
  data: PropertyListItem[];
  meta: PropertyMeta;
};

export type PropertyFilters = {
  q?: string;
  location?: string;
  status?: PropertyStatus;
  type?: PropertyType;
  ownershipType?: OwnershipType;
  source?: PropertySource;
  priceFrom?: number;
  priceTo?: number;
  bedroomsFrom?: number;
  bedroomsTo?: number;
  bathroomsFrom?: number;
  bathroomsTo?: number;
  page?: number;
  limit?: number;
};

export const statusLabels: Record<PropertyStatus, string> = {
  HANDOVER_IN: 'Handover Soon',
  UNDER_CONSTRUCTION: 'Under Construction',
  COMPLETED: 'Ready',
};

export const typeLabels: Record<PropertyType, string> = {
  VILLA: 'Villa',
  HOUSE: 'House',
  TOWNHOUSE: 'Townhouse',
  APARTMENT: 'Apartment',
  PENTHOUSE: 'Penthouse',
  LOFT: 'Loft',
  STUDIO: 'Studio',
  DUPLEX: 'Duplex',
  BUNGALOW: 'Bungalow',
  MANSION: 'Mansion',
  SERVICED_APARTMENT: 'Serviced Apartment',
};

export type AttachmentType = 'PHOTO' | 'VIDEO' | 'FLOOR_PLAN' | 'DOCUMENT' | 'PROMO_MATERIAL';

export type AttachmentItem = {
  id: string;
  url: string;
  type: AttachmentType;
  title?: string;
};

/** Public payload for property detail (API-aligned). */
export type PropertyPublic = {
  id: string;
  authorId: string;
  area: number;
  name: string;
  developer: string;
  price: number;
  currency: Currency;
  location: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  status: PropertyStatus;
  ownershipType?: OwnershipType;
  completionDate?: string;
  description?: string;
  features?: string[];
  mapCoordinates: { lat: number; lng: number };
  infrastructure?: string[];
  created_at?: string;
  attachments: AttachmentItem[];
  preview: string;
  videoLinks: string[];
  priceList?: {
    floor?: number;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area?: number;
  }[];
  prices: { usd: number; rub: number; aed: number };
};

export const ownershipTypeLabels: Record<OwnershipType, string> = {
  LEASEHOLD: 'Leasehold',
  FREEHOLD: 'Freehold',
};

export const currencyLabels: Record<Currency, string> = {
  USD: 'USD',
  AED: 'AED',
  RUB: 'RUB',
};
