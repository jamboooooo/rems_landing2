import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [mounted, setMounted] = useState(false);
  const fieldClassName =
    'h-11 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_90%,white)] px-3 text-sm shadow-sm transition outline-none placeholder:text-[var(--color-muted-foreground)] focus-visible:border-[color-mix(in_srgb,var(--color-primary)_55%,var(--color-border))] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]';
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
  const ownershipType = form.watch('ownershipType') ?? 'all';
  const status = form.watch('status') ?? 'all';
  const source = form.watch('source') ?? 'all';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousLeft = document.body.style.left;
    const previousRight = document.body.style.right;
    const previousWidth = document.body.style.width;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.left = previousLeft;
      document.body.style.right = previousRight;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] h-dvh bg-black/40">
      <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden rounded-t-3xl border border-[color-mix(in_srgb,var(--color-primary)_16%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_88%,white)] p-5 shadow-2xl backdrop-blur md:inset-y-0 md:left-auto md:h-[100dvh] md:max-h-none md:w-[440px] md:rounded-none md:rounded-l-3xl md:rounded-tr-none">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(360px 180px at 0% 0%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 72%), radial-gradient(320px 180px at 100% 0%, color-mix(in srgb, var(--color-accent) 45%, transparent), transparent 76%)',
          }}
        />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="relative text-base font-semibold">More filters</h3>
          <button
            type="button"
            onClick={onClose}
            className="relative rounded-md p-2 transition hover:bg-[var(--color-muted)]"
            aria-label="Close filters"
          >
            <X size={16} />
          </button>
        </div>

        <form
          className="relative grid gap-4"
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
              className={fieldClassName}
            />
            <input
              placeholder="Bathrooms to"
              type="number"
              {...form.register('bathroomsTo', { valueAsNumber: true })}
              className={fieldClassName}
            />
          </div>

          <Select
            value={ownershipType}
            onValueChange={(value) =>
              form.setValue('ownershipType', value === 'all' ? undefined : value, {
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger className={fieldClassName}>
              <SelectValue placeholder="Ownership" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Ownership</SelectItem>
              <SelectItem value="FREEHOLD">Freehold</SelectItem>
              <SelectItem value="LEASEHOLD">Leasehold</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(value) =>
              form.setValue('status', value === 'all' ? undefined : value, { shouldDirty: true })
            }
          >
            <SelectTrigger className={fieldClassName}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status</SelectItem>
              <SelectItem value="COMPLETED">Ready</SelectItem>
              <SelectItem value="HANDOVER_IN">Handover Soon</SelectItem>
              <SelectItem value="UNDER_CONSTRUCTION">Under Construction</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={source}
            onValueChange={(value) =>
              form.setValue('source', value === 'all' ? undefined : value, { shouldDirty: true })
            }
          >
            <SelectTrigger className={fieldClassName}>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Source</SelectItem>
              <SelectItem value="stepalliance">stepalliance</SelectItem>
              <SelectItem value="behomes">behomes</SelectItem>
            </SelectContent>
          </Select>
          <input placeholder="Location" {...form.register('location')} className={fieldClassName} />

          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--color-border))] bg-[var(--color-background)] text-sm font-medium transition hover:bg-[var(--color-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-xl bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_88%,black),var(--color-primary))] text-sm font-medium text-[var(--color-primary-foreground)] shadow-sm transition hover:opacity-95"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
