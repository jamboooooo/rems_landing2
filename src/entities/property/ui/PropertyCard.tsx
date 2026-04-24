type PropertyCardProps = {
  title?: string;
  location?: string;
  price?: string;
};

export function PropertyCard({
  title = 'Property title placeholder',
  location = 'Location placeholder',
  price = 'Price placeholder',
}: PropertyCardProps) {
  return (
    <article className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-4 shadow-[var(--shadow-sm)]">
      <div className="mb-4 aspect-[4/3] rounded-[var(--radius-md)] bg-[var(--color-muted)]" />
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm text-[var(--color-muted-foreground)]">{location}</p>
      <p className="mt-3 text-sm font-medium">{price}</p>
    </article>
  );
}
