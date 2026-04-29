import type { CurrencyCode, CurrencyCodeUpper, CurrencyRates } from '@/shared/api/currencies';

function toCurrencyCode(currency: CurrencyCodeUpper): CurrencyCode {
  return currency.toLowerCase() as CurrencyCode;
}

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCodeUpper,
  toCurrency: CurrencyCodeUpper,
  rates?: CurrencyRates | null,
) {
  if (!rates || !Number.isFinite(amount)) return amount;
  if (fromCurrency === toCurrency) return amount;

  const from = toCurrencyCode(fromCurrency);
  const to = toCurrencyCode(toCurrency);

  const ratesMatrix: Record<CurrencyCode, Partial<Record<CurrencyCode, number>>> = {
    usd: rates.usd,
    rub: rates.rub,
    aed: rates.aed,
  };

  const rate = ratesMatrix[from][to];
  if (typeof rate !== 'number' || !Number.isFinite(rate)) return amount;

  return amount * rate;
}
