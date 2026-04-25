import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  MapPin,
  Maximize2,
  Sparkles,
  Video,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { YandexMap } from '@/components/map/YandexMap';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { formatFullMoney } from '@/entities/property/lib/format';
import type { AttachmentItem, PropertyPublic } from '@/entities/property/model/types';
import {
  currencyLabels,
  ownershipTypeLabels,
  statusLabels,
  typeLabels,
} from '@/entities/property/model/types';

type PropertyDetailPageProps = {
  property: PropertyPublic;
};

function galleryPhotos(property: PropertyPublic): string[] {
  const fromAttachments = property.attachments
    .filter((a: AttachmentItem) => a.type === 'PHOTO')
    .map((a) => a.url);
  const merged = [property.preview, ...fromAttachments].filter(Boolean);
  return [...new Set(merged)];
}

const meshBg = {
  background: `
    radial-gradient(900px 420px at 8% -8%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 58%),
    radial-gradient(700px 360px at 92% 0%, color-mix(in srgb, var(--color-accent) 55%, transparent), transparent 55%),
    radial-gradient(520px 280px at 50% 100%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 65%),
    linear-gradient(180deg, color-mix(in srgb, var(--color-muted) 40%, transparent) 0%, transparent 42%)
  `,
} as const;

function SectionTitle({
  kicker,
  title,
  icon,
}: {
  kicker: string;
  title: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--color-muted-foreground)] uppercase">
          {kicker}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {icon ? <span className="text-[var(--color-primary)]">{icon}</span> : null}
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
        </div>
      </div>
      <div className="hidden h-px flex-1 translate-y-[-6px] bg-gradient-to-r from-[var(--color-border)] via-[color-mix(in_srgb,var(--color-primary)_35%,var(--color-border))] to-transparent sm:ml-8 sm:block" />
    </div>
  );
}

export function PropertyDetailPage({ property }: PropertyDetailPageProps) {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const fallbackPhoto = `${normalizedBase}images/property-placeholder.svg`;
  const photos = useMemo(() => galleryPhotos(property), [property]);
  const initialPhoto = photos[0] || property.preview || fallbackPhoto;
  const [activePhoto, setActivePhoto] = useState(initialPhoto);

  const glassPanel =
    'relative overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_78%,transparent)] shadow-[var(--shadow-md)] backdrop-blur-xl';

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-x-clip pb-24">
      <div className="pointer-events-none fixed inset-0 -z-10" style={meshBg} />

      <Container className="relative pt-6 md:pt-8">
        <a
          href={`${normalizedBase}properties`}
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_85%,white)] px-4 py-2 text-sm font-medium text-[var(--color-muted-foreground)] shadow-sm backdrop-blur transition hover:border-[color-mix(in_srgb,var(--color-primary)_45%,var(--color-border))] hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to catalog
        </a>

        <div className="relative min-w-0 overflow-hidden rounded-[2rem] border border-[color-mix(in_srgb,var(--color-primary)_16%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-card)_92%,transparent)] p-5 shadow-[var(--shadow-lg)] backdrop-blur-md sm:p-6 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                'radial-gradient(520px 200px at 0% 0%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 70%), radial-gradient(480px 200px at 100% 100%, color-mix(in srgb, var(--color-accent) 35%, transparent), transparent 72%)',
            }}
          />
          <div className="relative grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 space-y-6 lg:col-span-7">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_92%,black),var(--color-primary))] px-3.5 py-1 text-xs font-semibold tracking-wide text-[var(--color-primary-foreground)] shadow-sm">
                  {statusLabels[property.status]}
                </span>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--color-primary)_28%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-background))] px-3.5 py-1 text-xs font-semibold text-[var(--color-foreground)]">
                  {typeLabels[property.type]}
                </span>
                {property.ownershipType ? (
                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/80 px-3.5 py-1 text-xs font-medium text-[var(--color-muted-foreground)]">
                    {ownershipTypeLabels[property.ownershipType]}
                  </span>
                ) : null}
              </div>
              <h1 className="max-w-4xl text-[2rem] leading-[1.08] font-semibold tracking-tight text-balance md:text-[2.35rem] lg:text-[2.6rem]">
                <span className="bg-gradient-to-br from-[var(--color-foreground)] via-[var(--color-foreground)] to-[color-mix(in_srgb,var(--color-primary)_55%,var(--color-foreground))] bg-clip-text text-transparent">
                  {property.name}
                </span>
              </h1>
              <div className="flex flex-col gap-3 text-sm text-[var(--color-muted-foreground)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2">
                <span className="inline-flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/70">
                    <MapPin size={16} className="text-[var(--color-primary)]" />
                  </span>
                  {property.location}
                </span>
                <span className="inline-flex h-px w-full bg-[var(--color-border)] sm:hidden" />
                <span className="inline-flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/70">
                    <Building2 size={16} className="text-[var(--color-primary)]" />
                  </span>
                  {property.developer}
                </span>
              </div>
            </div>

            <div className={`${glassPanel} min-w-0 p-5 sm:p-6 lg:col-span-5 lg:p-6`}>
              <div
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl"
                style={{
                  background: 'color-mix(in srgb, var(--color-primary) 35%, transparent)',
                }}
              />
              <p className="text-[11px] font-medium tracking-[0.22em] text-[var(--color-muted-foreground)] uppercase">
                indicative pricing
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                {formatFullMoney(property.price, property.currency)}
              </p>
              <div className="mt-5 grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
                {(
                  [
                    ['USD', property.prices.usd],
                    ['AED', property.prices.aed],
                    ['RUB', property.prices.rub],
                  ] as const
                ).map(([code, amount]) => (
                  <div
                    key={code}
                    className="min-w-0 rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-background)]/60 px-2 py-2 text-center sm:px-3 sm:py-2.5"
                  >
                    <p className="text-[10px] font-medium tracking-wider text-[var(--color-muted-foreground)] uppercase">
                      {code}
                    </p>
                    <p className="mt-1 truncate text-[11px] font-semibold text-[var(--color-foreground)] sm:text-xs">
                      {formatFullMoney(amount, code as 'USD' | 'AED' | 'RUB')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container className="relative mt-10 md:mt-12">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 space-y-10 lg:col-span-8">
            <section className={glassPanel}>
              <div className="relative p-3 md:p-4">
                <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:gap-4">
                  <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)] shadow-inner">
                    <div className="relative aspect-[16/10] w-full max-h-[min(78vh,720px)] overflow-hidden">
                      <img
                        src={activePhoto}
                        alt=""
                        className="absolute inset-0 size-full object-cover transition duration-500"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 md:opacity-100" />
                      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 md:bottom-5 md:left-5 md:right-5">
                        <p className="max-w-[70%] text-xs font-medium tracking-wide text-white/90 drop-shadow md:text-sm">
                          {property.location}
                        </p>
                        <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md md:text-xs">
                          Gallery
                        </span>
                      </div>
                    </div>
                  </div>
                  {photos.length > 1 ? (
                    <div className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 [-webkit-overflow-scrolling:touch] lg:mx-0 lg:w-[5.75rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:px-0 lg:pb-0 lg:pr-1">
                      {photos.map((url) => (
                        <button
                          key={url}
                          type="button"
                          onClick={() => setActivePhoto(url)}
                          className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-[4.5rem] sm:w-28 md:h-20 md:w-32 lg:aspect-square lg:w-full lg:min-h-0 ${
                            url === activePhoto
                              ? 'border-[var(--color-primary)] shadow-md ring-2 ring-[color-mix(in_srgb,var(--color-primary)_35%,transparent)]'
                              : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={url}
                            alt=""
                            className="absolute inset-0 size-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            <section className={glassPanel}>
              <div className="relative p-6 md:p-8">
                <SectionTitle kicker="at a glance" title="Key figures" icon={<Sparkles size={22} />} />
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: 'Total area',
                      value: `${property.area} m²`,
                      icon: <Maximize2 className="size-5" />,
                    },
                    {
                      label: 'Bedrooms',
                      value: String(property.bedrooms),
                      icon: <BedDouble className="size-5" />,
                    },
                    {
                      label: 'Bathrooms',
                      value: String(property.bathrooms),
                      icon: <Bath className="size-5" />,
                    },
                    {
                      label: 'Completion',
                      value: property.completionDate ?? 'TBC',
                      icon: <Building2 className="size-5" />,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="group relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_92%,white)] p-5 transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-primary)_28%,var(--color-border))] hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium tracking-wide text-[var(--color-muted-foreground)] uppercase">
                            {item.label}
                          </p>
                          <p className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</p>
                        </div>
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] text-[var(--color-primary)] transition group-hover:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--color-border))]">
                          {item.icon}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {property.description ? (
              <section className={glassPanel}>
                <div className="relative p-6 md:p-8">
                  <SectionTitle kicker="the residence" title="Description" />
                  <div className="relative border-l-2 border-[color-mix(in_srgb,var(--color-primary)_55%,var(--color-border))] pl-6 md:pl-8">
                    <p className="text-base leading-relaxed text-[var(--color-muted-foreground)] md:text-[1.05rem] md:leading-8">
                      {property.description}
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            {property.features?.length ? (
              <section className={glassPanel}>
                <div className="relative p-6 md:p-8">
                  <SectionTitle kicker="lifestyle" title="Features" />
                  <ul className="flex flex-wrap gap-2.5">
                    {property.features.map((f) => (
                      <li
                        key={f}
                        className="rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--color-border))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_70%,transparent),color-mix(in_srgb,var(--color-background)_90%,white))] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            {property.infrastructure?.length ? (
              <section className={glassPanel}>
                <div className="relative p-6 md:p-8">
                  <SectionTitle kicker="neighbourhood" title="Infrastructure" />
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {property.infrastructure.map((item, i) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-[var(--color-border)]/90 bg-[var(--color-background)]/50 px-4 py-3 text-sm text-[var(--color-muted-foreground)]"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] text-xs font-bold text-[var(--color-primary)]">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            {property.videoLinks.length > 0 ? (
              <section className={glassPanel}>
                <div className="relative p-6 md:p-8">
                  <SectionTitle
                    kicker="experience"
                    title={property.videoLinks.length > 1 ? 'Videos' : 'Video'}
                    icon={<Video size={22} />}
                  />
                  <div className="grid min-w-0 gap-6 md:grid-cols-2">
                    {property.videoLinks.map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 shadow-sm transition hover:border-[color-mix(in_srgb,var(--color-primary)_30%,var(--color-border))] hover:shadow-md"
                      >
                        <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] via-[color-mix(in_srgb,var(--color-primary)_40%,white)] to-[var(--color-primary)]" />
                        <div className="aspect-video">
                          <iframe
                            title={`Property video ${index + 1}`}
                            src={src}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {property.priceList?.length ? (
              <section className={glassPanel}>
                <div className="relative p-6 md:p-8">
                  <SectionTitle kicker="inventory" title="Price list" />
                  <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/40">
                    <div className="border-b border-[var(--color-border)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-primary)_18%,var(--color-muted)),var(--color-muted))] px-5 py-3">
                      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-muted-foreground)] uppercase">
                        selected layouts
                      </p>
                    </div>
                    <div className="max-w-full overflow-x-auto">
                      <table className="w-full min-w-0 text-left text-sm sm:min-w-[520px]">
                        <thead>
                          <tr className="text-[11px] tracking-wide text-[var(--color-muted-foreground)] uppercase">
                            <th className="px-5 py-3 font-medium">Floor</th>
                            <th className="px-5 py-3 font-medium">Layout</th>
                            <th className="px-5 py-3 text-right font-medium">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {property.priceList.map((row, idx) => (
                            <tr
                              key={`${row.floor}-${idx}`}
                              className="border-t border-[var(--color-border)]/80 transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_6%,transparent)]"
                            >
                              <td className="px-5 py-3.5 font-medium">{row.floor ?? '—'}</td>
                              <td className="px-5 py-3.5 text-[var(--color-muted-foreground)]">
                                {row.bedrooms} bd · {row.bathrooms} ba
                              </td>
                              <td className="px-5 py-3.5 text-right text-base font-semibold">
                                {formatFullMoney(row.price, property.currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            <section className={glassPanel}>
              <div className="relative p-6 md:p-8">
                <SectionTitle kicker="where it sits" title="Location" icon={<MapPin size={22} />} />
                <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {property.location}
                </p>
                <div className="max-w-full min-w-0 overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-inner">
                  <YandexMap
                    center={[property.mapCoordinates.lat, property.mapCoordinates.lng]}
                    zoom={13}
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <div className={glassPanel}>
              <div className="relative p-6 md:p-7">
                <div
                  className="pointer-events-none absolute -left-10 top-1/2 size-40 -translate-y-1/2 rounded-full blur-3xl"
                  style={{
                    background: 'color-mix(in srgb, var(--color-primary) 25%, transparent)',
                  }}
                />
                <p className="text-[11px] font-medium tracking-[0.22em] text-[var(--color-muted-foreground)] uppercase">
                  private desk
                </p>
                <p className="mt-2 text-lg font-semibold leading-snug">
                  Tailored follow-up for this residence
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  Share your brief and we will confirm availability, comparable sales, and next
                  steps.
                </p>
                <dl className="mt-6 space-y-4 border-t border-[var(--color-border)]/80 pt-6 text-sm">
                  <div className="flex min-w-0 justify-between gap-3">
                    <dt className="shrink-0 text-[var(--color-muted-foreground)]">Property ID</dt>
                    <dd className="min-w-0 max-w-[58%] truncate text-right font-mono text-xs text-[var(--color-foreground)] sm:max-w-[52%]">
                      {property.id}
                    </dd>
                  </div>
                  <div className="flex min-w-0 justify-between gap-3">
                    <dt className="shrink-0 text-[var(--color-muted-foreground)]">Listed</dt>
                    <dd className="min-w-0 text-right font-medium">
                      {property.created_at
                        ? new Date(property.created_at).toLocaleDateString()
                        : '—'}
                    </dd>
                  </div>
                  <div className="flex min-w-0 justify-between gap-3">
                    <dt className="shrink-0 text-[var(--color-muted-foreground)]">Currency</dt>
                    <dd className="font-medium">{currencyLabels[property.currency]}</dd>
                  </div>
                </dl>
                <Button type="button" className="mt-7 w-full shadow-sm" variant="default" size="lg">
                  Request details
                </Button>
                <Button type="button" className="mt-3 w-full" variant="secondary" size="lg">
                  Schedule viewing
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
