import { Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/ui/Input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getLocations } from '@/entities/property/api/properties.api';
import type {
  OwnershipType,
  PropertyFilters,
  PropertySource,
  PropertyStatus,
} from '@/entities/property/model/types';
import {
  OWNERSHIP_TYPE,
  ownershipTypeLabels,
  PROPERTY_SOURCE,
  PROPERTY_STATUS,
  statusLabels,
} from '@/entities/property/model/types';
import { cn } from '@/lib/utils';

const optionalNumber = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) return undefined;
    if (typeof value === 'number' && Number.isNaN(value)) return undefined;
    return value;
  },
  z.coerce.number().optional(),
);

const schema = z.object({
  bedroomsTo: optionalNumber,
  bathroomsFrom: optionalNumber,
  bathroomsTo: optionalNumber,
  ownershipType: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  location: z.string().optional(),
});

type MoreFiltersValues = z.infer<typeof schema>;

function normalizeOptionalNumber(value: unknown): number | undefined {
  if (typeof value !== 'number') return undefined;
  return Number.isNaN(value) ? undefined : value;
}

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
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationSearchedEmpty, setLocationSearchedEmpty] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [suppressLocationSuggest, setSuppressLocationSuggest] = useState(false);
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  /** Skip resetting suppress once after programmatic `.focus()` from picking a suggestion. */
  const skipSuppressResetOnFocusRef = useRef(false);
  const fieldClassName =
    'h-11 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_90%,white)] px-3 text-sm shadow-sm transition outline-none placeholder:text-[var(--color-muted-foreground)] focus-visible:border-[color-mix(in_srgb,var(--color-primary)_55%,var(--color-border))] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]';
  const formValuesFromFilters = (filters: PropertyFilters): MoreFiltersValues => ({
    bedroomsTo: filters.bedroomsTo,
    bathroomsFrom: filters.bathroomsFrom,
    bathroomsTo: filters.bathroomsTo,
    ownershipType: filters.ownershipType,
    status: filters.status,
    source: filters.source,
    location: filters.location,
  });
  const form = useForm<MoreFiltersValues>({
    defaultValues: formValuesFromFilters(initialFilters),
  });
  const ownershipType = form.watch('ownershipType') ?? 'all';
  const status = form.watch('status') ?? 'all';
  const source = form.watch('source') ?? 'all';
  const location = form.watch('location') ?? '';

  const {
    ref: locationRegisterRef,
    onBlur: locationOnBlur,
    onChange: locationOnChange,
    ...locationRegisterRest
  } = form.register('location');

  const locationQueryTrimmed = location.trim();
  const showLocationPopover =
    open &&
    locationFocused &&
    !suppressLocationSuggest &&
    locationQueryTrimmed.length >= 2 &&
    (locationLoading || locationOptions.length > 0 || locationSearchedEmpty);

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

  useEffect(() => {
    if (!open) {
      setLocationOptions([]);
      setLocationLoading(false);
      setLocationSearchedEmpty(false);
      setLocationFocused(false);
      setSuppressLocationSuggest(false);
      skipSuppressResetOnFocusRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    form.reset(formValuesFromFilters(initialFilters));
  }, [form, initialFilters]);

  useEffect(() => {
    if (!open) return;

    const q = location.trim();
    if (q.length < 2) {
      setLocationOptions([]);
      setLocationSearchedEmpty(false);
      setLocationLoading(false);
      return;
    }

    const handle = window.setTimeout(() => {
      void (async () => {
        setLocationLoading(true);
        setLocationSearchedEmpty(false);
        try {
          const items = await getLocations(q);
          setLocationOptions(items);
          setLocationSearchedEmpty(items.length === 0);
        } catch {
          setLocationOptions([]);
          setLocationSearchedEmpty(true);
        } finally {
          setLocationLoading(false);
        }
      })();
    }, 300);

    return () => window.clearTimeout(handle);
  }, [location, open]);

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
            const parsed = schema.safeParse(values);
            const normalized = parsed.success
              ? parsed.data
              : {
                  bedroomsTo: normalizeOptionalNumber(values.bedroomsTo),
                  bathroomsFrom: normalizeOptionalNumber(values.bathroomsFrom),
                  bathroomsTo: normalizeOptionalNumber(values.bathroomsTo),
                  ownershipType: values.ownershipType,
                  status: values.status,
                  source: values.source,
                  location: values.location,
                };
            onApply({
              bedroomsTo: normalized.bedroomsTo,
              bathroomsFrom: normalized.bathroomsFrom,
              bathroomsTo: normalized.bathroomsTo,
              ownershipType: normalized.ownershipType as OwnershipType | undefined,
              status: normalized.status as PropertyStatus | undefined,
              source: normalized.source as PropertySource | undefined,
              location: normalized.location,
            });
            onClose();
          })}
        >
          <input
            placeholder="Bedrooms to"
            type="number"
            {...form.register('bedroomsTo', { valueAsNumber: true })}
            className={fieldClassName}
          />

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
              {OWNERSHIP_TYPE.map((ownership) => (
                <SelectItem key={ownership} value={ownership}>
                  {ownershipTypeLabels[ownership]}
                </SelectItem>
              ))}
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
              {PROPERTY_STATUS.map((propertyStatus) => (
                <SelectItem key={propertyStatus} value={propertyStatus}>
                  {statusLabels[propertyStatus]}
                </SelectItem>
              ))}
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
              {PROPERTY_SOURCE.map((propertySource) => (
                <SelectItem key={propertySource} value={propertySource}>
                  {propertySource}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover
            modal={false}
            open={showLocationPopover}
            onOpenChange={(next) => {
              if (!next) setSuppressLocationSuggest(true);
            }}
          >
            <PopoverAnchor asChild>
              <div
                className="relative w-full"
                onPointerDownCapture={() => setSuppressLocationSuggest(false)}
              >
                <Input
                  aria-autocomplete="list"
                  aria-expanded={showLocationPopover}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder="Location"
                  spellCheck={false}
                  {...locationRegisterRest}
                  ref={(el) => {
                    locationRegisterRef(el);
                    locationInputRef.current = el;
                  }}
                  className={cn(
                    fieldClassName,
                    'ring-offset-transparent focus-visible:border-[color-mix(in_srgb,var(--color-primary)_55%,var(--color-border))] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2',
                    'min-h-11 w-full pr-10 shadow-sm',
                  )}
                  onFocus={() => {
                    setLocationFocused(true);
                    if (!skipSuppressResetOnFocusRef.current) {
                      setSuppressLocationSuggest(false);
                    }
                  }}
                  onChange={(event) => {
                    locationOnChange?.(event);
                    setSuppressLocationSuggest(false);
                  }}
                  onBlur={(event) => {
                    locationOnBlur?.(event);
                    window.setTimeout(() => setLocationFocused(false), 200);
                  }}
                />
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)] opacity-60"
                />
              </div>
            </PopoverAnchor>
            <PopoverContent
              align="start"
              className="p-1 text-sm shadow-md"
              side="bottom"
              sideOffset={4}
              onCloseAutoFocus={(event) => {
                event.preventDefault();
              }}
              onInteractOutside={() => setSuppressLocationSuggest(true)}
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              {locationLoading ? (
                <p className="px-2 py-1.5 text-[var(--color-muted-foreground)]">Loading…</p>
              ) : null}
              {!locationLoading && locationOptions.length === 0 && locationSearchedEmpty ? (
                <p className="px-2 py-1.5 text-[var(--color-muted-foreground)]">No matches</p>
              ) : null}
              {locationOptions.map((option) => {
                const selected = option.trim() === location.trim();
                return (
                  <button
                    key={option}
                    type="button"
                    title={option}
                    className={cn(
                      'relative flex w-full cursor-pointer items-center truncate rounded-[var(--radius-sm)] py-1.5 pr-8 pl-2 text-left transition-colors outline-none select-none',
                      'hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]',
                      'focus:bg-[var(--color-muted)] focus:text-[var(--color-foreground)]',
                      selected && 'bg-[var(--color-muted)]',
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      form.setValue('location', option, { shouldDirty: true });
                      setSuppressLocationSuggest(true);
                      skipSuppressResetOnFocusRef.current = true;
                      queueMicrotask(() => {
                        locationInputRef.current?.focus({ preventScroll: true });
                        requestAnimationFrame(() => {
                          skipSuppressResetOnFocusRef.current = false;
                        });
                      });
                    }}
                  >
                    <span className="min-w-0 flex-1 truncate">{option}</span>
                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                      {selected ? <Check className="h-4 w-4" aria-hidden /> : null}
                    </span>
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>

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
