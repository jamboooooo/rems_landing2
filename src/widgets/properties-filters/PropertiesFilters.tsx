import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PropertyFilters } from '@/entities/property/model/types';
import { MoreFiltersSheet } from '@/features/properties-filter/MoreFiltersSheet';
import { SearchInput } from '@/features/properties-search/SearchInput';

type PropertiesFiltersProps = {
  filters: PropertyFilters;
  onChange: (next: Partial<PropertyFilters>) => void;
};

export function PropertiesFilters({ filters, onChange }: PropertiesFiltersProps) {
  const [isMoreOpen, setMoreOpen] = useState(false);
  const fieldClassName =
    'h-11 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_90%,white)] px-3 text-sm shadow-sm transition outline-none placeholder:text-[var(--color-muted-foreground)] focus-visible:border-[color-mix(in_srgb,var(--color-primary)_55%,var(--color-border))] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]';

  const minPriceValue = useMemo(
    () => (filters.priceFrom ? String(filters.priceFrom) : ''),
    [filters],
  );
  const maxPriceValue = useMemo(() => (filters.priceTo ? String(filters.priceTo) : ''), [filters]);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_16%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_82%,transparent)] p-4 shadow-sm backdrop-blur md:p-5">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(420px 160px at 0% 0%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 70%), radial-gradient(400px 160px at 100% 0%, color-mix(in srgb, var(--color-accent) 42%, transparent), transparent 74%)',
          }}
        />
        <div className="relative mb-3 flex items-center justify-between">
          <p className="text-[11px] tracking-[0.18em] text-[var(--color-muted-foreground)] uppercase">
            refine collection
          </p>
        </div>
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
          <SearchInput value={filters.q ?? ''} onChange={(q) => onChange({ q, page: 1 })} />

          <Select
            value={filters.type ?? 'all'}
            onValueChange={(value) =>
              onChange({ type: (value === 'all' ? undefined : value) as PropertyFilters['type'], page: 1 })
            }
          >
            <SelectTrigger aria-label="Filter by property type" className={fieldClassName}>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Property Type</SelectItem>
              <SelectItem value="VILLA">Villa</SelectItem>
              <SelectItem value="HOUSE">House</SelectItem>
              <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
              <SelectItem value="APARTMENT">Apartment</SelectItem>
              <SelectItem value="PENTHOUSE">Penthouse</SelectItem>
              <SelectItem value="LOFT">Loft</SelectItem>
              <SelectItem value="STUDIO">Studio</SelectItem>
              <SelectItem value="DUPLEX">Duplex</SelectItem>
              <SelectItem value="BUNGALOW">Bungalow</SelectItem>
              <SelectItem value="MANSION">Mansion</SelectItem>
              <SelectItem value="SERVICED_APARTMENT">Serviced Apartment</SelectItem>
            </SelectContent>
          </Select>

          <input
            type="number"
            inputMode="numeric"
            placeholder="Price from"
            value={minPriceValue}
            onChange={(e) => onChange({ priceFrom: Number(e.target.value) || undefined, page: 1 })}
            className={fieldClassName}
            aria-label="Minimum price"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Price to"
            value={maxPriceValue}
            onChange={(e) => onChange({ priceTo: Number(e.target.value) || undefined, page: 1 })}
            className={fieldClassName}
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
            className={fieldClassName}
            aria-label="Minimum bedrooms"
          />

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="hidden h-11 items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_28%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-accent)_55%,var(--color-background))] px-4 text-sm font-medium text-[var(--color-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-background))] md:inline-flex"
          >
            <SlidersHorizontal size={16} />
            More Filters
          </button>
        </div>

        <div className="mt-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_28%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-accent)_55%,var(--color-background))] px-4 text-sm font-medium shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMoreOpen(true)}
        className="fixed right-4 bottom-6 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_88%,black),var(--color-primary))] px-5 text-sm font-medium text-[var(--color-primary-foreground)] shadow-lg md:hidden"
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
