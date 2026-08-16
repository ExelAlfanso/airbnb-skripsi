<script lang="ts">
  import type { PropertyListItem } from "@airbnb-skripsi/api/catalog";
  import { formatPrice, optimizeImage } from "../catalog";

  interface Props {
    openProperty: (slug: string) => void;
    priority: boolean;
    property: PropertyListItem;
    toggleWishlist: (id: string) => void;
    wishlisted: boolean;
  }

  let { openProperty, priority, property, toggleWishlist, wishlisted }: Props =
    $props();
</script>

<article class="property-card">
  <button
    class="property-card__image-button"
    type="button"
    onclick={() => openProperty(property.slug)}
  >
    {#if property.coverImage}
      <img
        class="property-card__image"
        alt={property.coverImage.altText}
        fetchpriority={priority ? "high" : "auto"}
        height="600"
        loading={priority ? "eager" : "lazy"}
        src={optimizeImage(property.coverImage.imageUrl)}
        width="900"
      >
    {:else}
      <span class="property-card__placeholder">Foto belum tersedia</span>
    {/if}
  </button>

  <button
    class={["wishlist-button", wishlisted && "wishlist-button--active"]}
    type="button"
    aria-label={wishlisted
      ? `Hapus ${property.title} dari wishlist`
      : `Simpan ${property.title} ke wishlist`}
    aria-pressed={wishlisted}
    onclick={() => toggleWishlist(property.id)}
  >
    <span aria-hidden="true">&#9829;</span>
  </button>

  <div class="property-card__body">
    <div class="property-card__eyebrow">
      <span>{property.propertyType.name}</span>
      <span>
        <span aria-hidden="true">&#9733;</span>
        <span class="sr-only">Rating </span>{property.rating.toFixed(1)}
      </span>
    </div>

    <button
      class="property-card__title"
      type="button"
      onclick={() => openProperty(property.slug)}
    >
      {property.title}
    </button>

    <p class="property-card__location">{property.location.displayName}</p>
    <p class="property-card__facts">
      {property.maxGuests}
      tamu &middot;
      {property.bedrooms}
      kamar &middot; {property.beds}
      tempat tidur
    </p>

    <div class="property-card__footer">
      <p>
        <strong>{formatPrice(property.pricePerNight)}</strong>
        <span> / malam</span>
      </p>
      {#if property.isGuestFavorite}
        <span class="favorite-badge">Favorit tamu</span>
      {/if}
    </div>
  </div>
</article>
