import { PropertyCard } from '@/entities/property/ui/PropertyCard';

type PropertyGridProps = {
  items?: number;
};

export function PropertyGrid({ items = 6 }: PropertyGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }, (_, idx) => (
        <PropertyCard key={idx} />
      ))}
    </div>
  );
}
