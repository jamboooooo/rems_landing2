import { ArrowUpRight } from 'lucide-react';

import { formatPriceRange, formatRange } from '@/entities/property/lib/format';
import type { PropertyListItem } from '@/entities/property/model/types';
import { statusLabels, typeLabels } from '@/entities/property/model/types';

type PropertyCardPremiumProps = {
  property: PropertyListItem;
};

export function PropertyCardPremium({ property }: PropertyCardPremiumProps) {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const href = `${normalizedBase}properties/${property.id}`;
  const fallbackPreview = `${normalizedBase}images/property-placeholder.svg`;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <a
        href={href}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:outline-none"
        aria-label={`Open ${property.name}`}
      />
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-muted)]">
        <img
          src={property.preview ?? fallbackPreview}
          alt={property.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute top-3 left-3 z-20 flex gap-2">
          <span className="rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {statusLabels[property.status]}
          </span>
          <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-900 backdrop-blur">
            {typeLabels[property.type]}
          </span>
        </div>
      </div>

      <div className="relative z-20 space-y-3 p-5">
        <div className="space-y-1">
          <h3 className="text-lg leading-tight font-semibold">{property.name}</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">{property.location}</p>
          <p className="text-sm text-[var(--color-muted-foreground)]">{property.developer}</p>
        </div>

        <p className="text-base font-medium">
          {formatPriceRange(property.priceFrom, property.priceTo, property.currency)}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-muted-foreground)]">
          <span className="rounded-full bg-[var(--color-muted)] px-2.5 py-1">
            {formatRange(property.bedroomsFrom, property.bedroomsTo, 'Bedroom')}
          </span>
          <span className="rounded-full bg-[var(--color-muted)] px-2.5 py-1">
            {formatRange(property.bathroomsFrom, property.bathroomsTo, 'Bathroom')}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-foreground)]">
          View Details
          <ArrowUpRight size={16} />
        </span>
      </div>
    </article>
  );
}
