import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { PropertyFilters } from '@/entities/property/model/types';
import { MoreFiltersSheet } from '@/features/properties-filter/MoreFiltersSheet';
import { SearchInput } from '@/features/properties-search/SearchInput';

type PropertiesFiltersProps = {
  filters: PropertyFilters;
  onChange: (next: Partial<PropertyFilters>) => void;
};

export function PropertiesFilters({ filters, onChange }: PropertiesFiltersProps) {
  const [isMoreOpen, setMoreOpen] = useState(false);

  const minPriceValue = useMemo(
    () => (filters.priceFrom ? String(filters.priceFrom) : ''),
    [filters],
  );
  const maxPriceValue = useMemo(() => (filters.priceTo ? String(filters.priceTo) : ''), [filters]);

  return (
    <>
      <div className="rounded-2xl border bg-white p-4 md:p-5">
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
          <SearchInput value={filters.q ?? ''} onChange={(q) => onChange({ q, page: 1 })} />

          <select
            value={filters.type ?? ''}
            onChange={(e) =>
              onChange({ type: (e.target.value || undefined) as PropertyFilters['type'], page: 1 })
            }
            className="h-11 rounded-xl border px-3 text-sm"
            aria-label="Filter by property type"
          >
            <option value="">Property Type</option>
            <option value="VILLA">Villa</option>
            <option value="HOUSE">House</option>
            <option value="TOWNHOUSE">Townhouse</option>
            <option value="APARTMENT">Apartment</option>
            <option value="PENTHOUSE">Penthouse</option>
            <option value="LOFT">Loft</option>
            <option value="STUDIO">Studio</option>
            <option value="DUPLEX">Duplex</option>
            <option value="BUNGALOW">Bungalow</option>
            <option value="SERVICED_APARTMENT">Serviced Apartment</option>
          </select>

          <input
            type="number"
            inputMode="numeric"
            placeholder="Price from"
            value={minPriceValue}
            onChange={(e) => onChange({ priceFrom: Number(e.target.value) || undefined, page: 1 })}
            className="h-11 rounded-xl border px-3 text-sm"
            aria-label="Minimum price"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Price to"
            value={maxPriceValue}
            onChange={(e) => onChange({ priceTo: Number(e.target.value) || undefined, page: 1 })}
            className="h-11 rounded-xl border px-3 text-sm"
            aria-label="Maximum price"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Bedrooms"
            value={filters.bedroomsFrom ?? ''}
            onChange={(e) =>
              onChange({ bedroomsFrom: Number(e.target.value) || undefined, page: 1 })
            }
            className="h-11 rounded-xl border px-3 text-sm"
            aria-label="Minimum bedrooms"
          />

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="hidden h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm md:inline-flex"
          >
            <SlidersHorizontal size={16} />
            More Filters
          </button>
        </div>

        <div className="mt-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMoreOpen(true)}
        className="fixed right-4 bottom-6 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-foreground)] px-5 text-sm text-[var(--color-background)] shadow-lg md:hidden"
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>

      <MoreFiltersSheet
        open={isMoreOpen}
        onClose={() => setMoreOpen(false)}
        initialFilters={filters}
        onApply={(next) => onChange({ ...next, page: 1 })}
      />
    </>
  );
}
