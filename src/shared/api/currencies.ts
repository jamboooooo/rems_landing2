import { getRequest } from '@/shared/api/api';

export type CurrencyCode = 'usd' | 'rub' | 'aed';
export type CurrencyCodeUpper = Uppercase<CurrencyCode>;

export type CurrencyRates = {
  usd: {
    rub: number;
    aed: number;
  };
  rub: {
    usd: number;
    aed: number;
  };
  aed: {
    usd: number;
    rub: number;
  };
};

export async function getCurrencies(): Promise<CurrencyRates> {
  return getRequest<CurrencyRates, Record<string, never>>('/currencies');
}
