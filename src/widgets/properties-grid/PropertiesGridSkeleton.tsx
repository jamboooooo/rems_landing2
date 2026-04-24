export function PropertiesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, idx) => (
        <div key={idx} className="overflow-hidden rounded-2xl border bg-[var(--color-card)]">
          <div className="aspect-[4/3] animate-pulse bg-[var(--color-muted)]" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-[var(--color-muted)]" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-muted)]" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-[var(--color-muted)]" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-[var(--color-muted)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
