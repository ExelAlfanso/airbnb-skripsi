import type { PropertyListItem } from "@airbnb-skripsi/api/catalog";
import PropertyCard from "./property-card";

interface PropertyGridProps {
  onOpen: (slug: string) => void;
  onToggleWishlist: (id: string) => void;
  properties: PropertyListItem[];
  wishlistStates: ReadonlyMap<string, boolean>;
}

export default function PropertyGrid({
  onOpen,
  onToggleWishlist,
  properties,
  wishlistStates,
}: PropertyGridProps) {
  return (
    <div className="property-grid">
      {properties.map((property, index) => (
        <PropertyCard
          key={property.id}
          onOpen={onOpen}
          onToggleWishlist={onToggleWishlist}
          priority={index === 0}
          property={property}
          wishlisted={wishlistStates.get(property.id) ?? false}
        />
      ))}
    </div>
  );
}
