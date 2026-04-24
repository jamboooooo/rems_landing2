import type { PropertyListItem } from '@/entities/property/model/types';
import { PropertyCardPremium } from '@/entities/property/ui/PropertyCardPremium';

type PropertiesGridProps = {
  properties: PropertyListItem[];
};

export function PropertiesGrid({ properties }: PropertiesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCardPremium key={property.id} property={property} />
      ))}
    </div>
  );
}
