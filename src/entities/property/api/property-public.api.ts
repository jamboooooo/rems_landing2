import type { AttachmentItem, PropertyPublic } from '@/entities/property/model/types';
import { getRequest } from '@/shared/api/api';

type BackendPropertyPublic = Omit<PropertyPublic, 'attachments' | 'created_at'> & {
  price?: number;
  priceFrom?: number;
  priceTo?: number;
  attachments: Array<
    Omit<AttachmentItem, 'url'> & {
      link: string;
      name?: string;
    }
  >;
  created_at?: string;
  createdAt?: string;
};

const AED_PER_USD = 3.67;
const RUB_PER_USD = 92;

function normalizePrices(price: number, currency: PropertyPublic['currency']) {
  if (currency === 'USD') {
    return {
      usd: Math.round(price),
      aed: Math.round(price * AED_PER_USD),
      rub: Math.round(price * RUB_PER_USD),
    };
  }

  if (currency === 'AED') {
    const usd = price / AED_PER_USD;
    return {
      usd: Math.round(usd),
      aed: Math.round(price),
      rub: Math.round(usd * RUB_PER_USD),
    };
  }

  const usd = price / RUB_PER_USD;
  return {
    usd: Math.round(usd),
    aed: Math.round(usd * AED_PER_USD),
    rub: Math.round(price),
  };
}

function resolveBasePrice(payload: BackendPropertyPublic) {
  if (typeof payload.price === 'number' && payload.price > 0) {
    return payload.price;
  }

  const from = typeof payload.priceFrom === 'number' ? payload.priceFrom : undefined;
  const to = typeof payload.priceTo === 'number' ? payload.priceTo : undefined;

  if (from !== undefined && to !== undefined) {
    return Math.round((from + to) / 2);
  }

  if (from !== undefined) return from;
  if (to !== undefined) return to;
  return 0;
}

export async function getPropertyPublic(id: string): Promise<PropertyPublic | null> {
  try {
    const response = await getRequest<BackendPropertyPublic, Record<string, never>>(
      `/properties/${id}`,
    );

    const normalizedAttachments = (response.attachments ?? []).map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title ?? item.name,
      url: item.link,
    }));

    const normalizedPrice = resolveBasePrice(response);
    const normalizedCurrency = response.currency ?? 'USD';

    return {
      ...response,
      created_at: response.created_at ?? response.createdAt,
      attachments: normalizedAttachments,
      preview: response.preview ?? normalizedAttachments[0]?.url ?? '',
      mapCoordinates: response.mapCoordinates ?? { lat: 25.2048, lng: 55.2708 },
      features: response.features ?? [],
      infrastructure: response.infrastructure ?? [],
      videoLinks: response.videoLinks ?? [],
      priceList: response.priceList ?? [],
      price: normalizedPrice,
      currency: normalizedCurrency,
      prices: response.prices ?? normalizePrices(normalizedPrice, normalizedCurrency),
    };
  } catch {
    return null;
  }
}
