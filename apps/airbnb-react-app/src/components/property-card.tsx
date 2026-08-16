import type { PropertyListItem } from "@airbnb-skripsi/api/catalog";
import { formatPrice, optimizeImage } from "../catalog";

interface PropertyCardProps {
  onOpen: (slug: string) => void;
  onToggleWishlist: (id: string) => void;
  priority: boolean;
  property: PropertyListItem;
  wishlisted: boolean;
}

export default function PropertyCard({
  onOpen,
  onToggleWishlist,
  priority,
  property,
  wishlisted,
}: PropertyCardProps) {
  return (
    <article className="property-card">
      <button
        className="property-card__image-button"
        onClick={() => onOpen(property.slug)}
        type="button"
      >
        {property.coverImage ? (
          <img
            alt={property.coverImage.altText}
            className="property-card__image"
            fetchPriority={priority ? "high" : "auto"}
            height="600"
            loading={priority ? "eager" : "lazy"}
            src={optimizeImage(property.coverImage.imageUrl)}
            width="900"
          />
        ) : (
          <span className="property-card__placeholder">
            Foto belum tersedia
          </span>
        )}
      </button>

      <button
        aria-label={
          wishlisted
            ? `Hapus ${property.title} dari wishlist`
            : `Simpan ${property.title} ke wishlist`
        }
        aria-pressed={wishlisted}
        className={
          wishlisted
            ? "wishlist-button wishlist-button--active"
            : "wishlist-button"
        }
        onClick={() => onToggleWishlist(property.id)}
        type="button"
      >
        <span aria-hidden="true">&hearts;</span>
      </button>

      <div className="property-card__body">
        <div className="property-card__eyebrow">
          <span>{property.propertyType.name}</span>
          <span>
            <span aria-hidden="true">&#9733;</span>
            <span className="sr-only">Rating </span>
            {property.rating.toFixed(1)}
          </span>
        </div>

        <button
          className="property-card__title"
          onClick={() => onOpen(property.slug)}
          type="button"
        >
          {property.title}
        </button>

        <p className="property-card__location">
          {property.location.displayName}
        </p>
        <p className="property-card__facts">
          {property.maxGuests} tamu {"\u00b7"} {property.bedrooms} kamar{" "}
          {"\u00b7"} {property.beds} tempat tidur
        </p>

        <div className="property-card__footer">
          <p>
            <strong>{formatPrice(property.pricePerNight)}</strong>
            <span> / malam</span>
          </p>
          {property.isGuestFavorite ? (
            <span className="favorite-badge">Favorit tamu</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
