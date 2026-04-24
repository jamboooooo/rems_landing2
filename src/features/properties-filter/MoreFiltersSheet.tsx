import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type {
  OwnershipType,
  PropertyFilters,
  PropertySource,
  PropertyStatus,
} from '@/entities/property/model/types';

const schema = z.object({
  bathroomsFrom: z.coerce.number().optional(),
  bathroomsTo: z.coerce.number().optional(),
  ownershipType: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  location: z.string().optional(),
});

type MoreFiltersValues = z.infer<typeof schema>;

type MoreFiltersSheetProps = {
  open: boolean;
  onClose: () => void;
  initialFilters: PropertyFilters;
  onApply: (filters: Partial<PropertyFilters>) => void;
};

export function MoreFiltersSheet({
  open,
  onClose,
  initialFilters,
  onApply,
}: MoreFiltersSheetProps) {
  const form = useForm<MoreFiltersValues>({
    defaultValues: {
      bathroomsFrom: initialFilters.bathroomsFrom,
      bathroomsTo: initialFilters.bathroomsTo,
      ownershipType: initialFilters.ownershipType,
      status: initialFilters.status,
      source: initialFilters.source,
      location: initialFilters.location,
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/35">
      <div className="absolute inset-x-0 bottom-0 max-h-[82vh] rounded-t-3xl bg-white p-5 shadow-2xl md:inset-y-0 md:left-auto md:w-[440px] md:rounded-l-3xl md:rounded-tr-none">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">More filters</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-[var(--color-muted)]"
            aria-label="Close filters"
          >
            <X size={16} />
          </button>
        </div>

        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => {
            const parsed = schema.parse(values);
            onApply({
              bathroomsFrom: parsed.bathroomsFrom,
              bathroomsTo: parsed.bathroomsTo,
              ownershipType: parsed.ownershipType as OwnershipType | undefined,
              status: parsed.status as PropertyStatus | undefined,
              source: parsed.source as PropertySource | undefined,
              location: parsed.location,
            });
            onClose();
          })}
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Bathrooms from"
              type="number"
              {...form.register('bathroomsFrom', { valueAsNumber: true })}
              className="h-11 rounded-xl border px-3 text-sm"
            />
            <input
              placeholder="Bathrooms to"
              type="number"
              {...form.register('bathroomsTo', { valueAsNumber: true })}
              className="h-11 rounded-xl border px-3 text-sm"
            />
          </div>

          <select
            {...form.register('ownershipType')}
            className="h-11 rounded-xl border px-3 text-sm"
          >
            <option value="">Ownership</option>
            <option value="FREEHOLD">Freehold</option>
            <option value="LEASEHOLD">Leasehold</option>
          </select>
          <select {...form.register('status')} className="h-11 rounded-xl border px-3 text-sm">
            <option value="">Status</option>
            <option value="COMPLETED">Ready</option>
            <option value="HANDOVER_IN">Handover Soon</option>
            <option value="UNDER_CONSTRUCTION">Under Construction</option>
          </select>
          <select {...form.register('source')} className="h-11 rounded-xl border px-3 text-sm">
            <option value="">Source</option>
            <option value="stepalliance">stepalliance</option>
            <option value="behomes">behomes</option>
          </select>
          <input
            placeholder="Location"
            {...form.register('location')}
            className="h-11 rounded-xl border px-3 text-sm"
          />

          <div className="mt-2 grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className="h-11 rounded-xl border text-sm">
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-xl bg-[var(--color-foreground)] text-sm text-[var(--color-background)]"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
