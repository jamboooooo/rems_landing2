import type { Currency } from '@/entities/property/model/types';

const currencyMap: Record<Currency, string> = {
  USD: '$',
  AED: 'AED',
  RUB: 'RUB',
};

export function compactMoney(value: number, currency: Currency) {
  const abs = Math.abs(value);
  const symbol = currencyMap[currency];

  if (abs >= 1_000_000) {
    const formatted = `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    return symbol === '$' ? `${symbol}${formatted}` : `${symbol} ${formatted}`;
  }

  if (abs >= 1_000) {
    const formatted = `${(value / 1_000).toFixed(0)}K`;
    return symbol === '$' ? `${symbol}${formatted}` : `${symbol} ${formatted}`;
  }

  return symbol === '$' ? `${symbol}${value}` : `${symbol} ${value}`;
}

export function formatPriceRange(from: number, to: number, currency: Currency) {
  if (from === to) {
    return compactMoney(from, currency);
  }
  return `${compactMoney(from, currency)} - ${compactMoney(to, currency)}`;
}

export function formatFullMoney(value: number, currency: Currency) {
  return compactMoney(value, currency);
}

export function formatRange(from: number, to: number, label: string) {
  if (from === to) {
    return `${from} ${label}${from > 1 ? 's' : ''}`;
  }
  return `${from}-${to} ${label}${to > 1 ? 's' : ''}`;
}
