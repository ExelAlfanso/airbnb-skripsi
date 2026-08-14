<script lang="ts">
  import type { PropertyListItem } from "@airbnb-skripsi/api/catalog";
  import { formatPrice, optimizeImage } from "../catalog";

  interface Props {
    openProperty: (id: string) => void;
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
    onclick={() => openProperty(property.id)}
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
      onclick={() => openProperty(property.id)}
    >
      {property.title}
    </button>

    <p class="property-card__location">{property.location.displayName}</p>
    <p class="property-card__facts">
      {property.maxGuests} tamu &middot;
      {property.bedrooms} kamar &middot; {property.beds}
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

<style>
  .property-card {
    position: relative;
    min-width: 0;
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    transition:
      translate 180ms ease,
      box-shadow 180ms ease;
  }

  .property-card:hover {
    box-shadow: none;
    translate: 0;
  }

  .property-card__image-button {
    display: block;
    width: 100%;
    padding: 0;
    overflow: hidden;
    background: var(--surface-soft);
    border-radius: 1rem;
  }

  .property-card__image,
  .property-card__placeholder {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
  }

  .property-card__image {
    object-fit: cover;
    transition: scale 300ms ease;
  }

  .property-card:is(:hover, :focus-within) .property-card__image {
    scale: 1.025;
  }

  .property-card__placeholder {
    display: grid;
    place-items: center;
    color: var(--muted);
  }

  .wishlist-button {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    display: grid;
    place-items: center;
    width: 2.55rem;
    height: 2.55rem;
    font-size: 1.2rem;
    color: white;
    text-shadow: 0 1px 5px rgb(0 0 0 / 45%);
    background: rgb(24 28 33 / 38%);
    border: 1px solid color-mix(in srgb, white 72%, transparent);
    border-radius: 999px;
    backdrop-filter: blur(8px);
  }

  .wishlist-button--active {
    color: var(--brand);
    text-shadow: none;
    background: white;
  }

  .property-card__body {
    padding: 0.8rem 0.125rem 0;
  }

  .property-card__eyebrow,
  .property-card__footer {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
  }

  .property-card__eyebrow {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
  }

  .property-card__title {
    width: 100%;
    padding: 0;
    margin-top: 0.55rem;
    font-size: 1.08rem;
    font-weight: 780;
    line-height: 1.3;
    overflow-wrap: anywhere;
    color: var(--ink);
    text-align: left;
    background: transparent;
  }

  .property-card__title:hover {
    color: var(--brand-dark);
  }

  .property-card__location,
  .property-card__facts {
    margin: 0.35rem 0 0;
    font-size: 0.9rem;
    color: var(--muted);
  }

  .property-card__footer {
    margin-top: 0.9rem;
  }

  .property-card__footer p {
    margin: 0;
  }

  .property-card__footer span {
    font-size: 0.85rem;
    color: var(--muted);
  }

  .favorite-badge {
    padding: 0.35rem 0.55rem;
    font-size: 0.72rem;
    font-weight: 750;
    color: var(--brand-dark);
    background: var(--brand-soft);
    border-radius: 999px;
  }
</style>
