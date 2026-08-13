<script lang="ts">
  import type { PropertyDetail } from "@airbnb-skripsi/api/catalog";
  import { formatPrice, optimizeImage } from "../catalog";

  interface Props {
    back: () => void;
    property: PropertyDetail;
    toggleWishlist: (id: string) => void;
    wishlisted: boolean;
  }

  let { back, property, toggleWishlist, wishlisted }: Props = $props();
</script>

<article class="detail">
  <button class="back-button" type="button" onclick={back}>
    &larr; Kembali ke hasil
  </button>

  <header class="detail__header">
    <div>
      <p class="detail__eyebrow">
        {property.propertyType.name}
        &middot; {property.location.displayName}
      </p>
      <h1>{property.title}</h1>
      <p class="detail__rating">
        &#9733; {property.rating.toFixed(1)} &middot; {property.reviewCount} ulasan
        {#if property.isGuestFavorite}
          <span>&middot; Favorit tamu</span>
        {/if}
      </p>
    </div>

    <button
      class={["detail-wishlist", wishlisted && "detail-wishlist--active"]}
      type="button"
      aria-pressed={wishlisted}
      onclick={() => toggleWishlist(property.id)}
    >
      <span aria-hidden="true">&#9829;</span>
      {wishlisted ? "Tersimpan" : "Simpan"}
    </button>
  </header>

  {#if property.images.length > 0}
    <div class="gallery">
      {#each property.images as image, index (image.id)}
        <img
          class={index === 0 ? "gallery__image--cover" : undefined}
          alt={image.altText}
          height="700"
          loading={index === 0 ? "eager" : "lazy"}
          fetchpriority={index === 0 ? "high" : "auto"}
          src={optimizeImage(image.imageUrl, index === 0 ? 1400 : 800)}
          width="1200"
        >
      {/each}
    </div>
  {/if}

  <div class="detail__layout">
    <div class="detail__content">
      <section class="fact-strip" aria-label="Ringkasan properti">
        <div>
          <strong>{property.maxGuests}</strong>
          <span>Tamu</span>
        </div>
        <div>
          <strong>{property.bedrooms}</strong>
          <span>Kamar</span>
        </div>
        <div>
          <strong>{property.beds}</strong>
          <span>Tempat tidur</span>
        </div>
        <div>
          <strong>{property.bathrooms}</strong>
          <span>Kamar mandi</span>
        </div>
      </section>

      <section class="detail__section">
        <h2>Tentang tempat ini</h2>
        <p>{property.description}</p>
      </section>

      <section class="detail__section">
        <h2>Yang tersedia</h2>
        <ul class="amenity-list">
          {#each property.amenities as amenity (amenity.id)}
            <li>
              <span aria-hidden="true">&#10003;</span>
              {amenity.name}
            </li>
          {/each}
        </ul>
      </section>

      <section class="host-card">
        <img
          alt={`Foto profil ${property.host.name}`}
          height="72"
          src={optimizeImage(property.host.avatarUrl, 144)}
          width="72"
        >
        <div>
          <p class="host-card__label">Tuan rumah</p>
          <h2>{property.host.name}</h2>
          <p>
            Bergabung sejak {property.host.joinedYear}
            {#if property.host.isSuperhost}
              <span>&middot; Superhost</span>
            {/if}
          </p>
        </div>
      </section>
    </div>

    <aside class="price-card">
      <p>
        <strong>{formatPrice(property.pricePerNight)}</strong>
        <span> / malam</span>
      </p>
      <dl>
        <div>
          <dt>Lokasi</dt>
          <dd>{property.location.city}</dd>
        </div>
        <div>
          <dt>Kapasitas</dt>
          <dd>{property.maxGuests} tamu</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{property.rating.toFixed(1)} / 5</dd>
        </div>
      </dl>
      <p class="price-card__note">
        Tampilan eksperimen saja. Pemesanan dan pembayaran tidak termasuk ruang
        lingkup penelitian.
      </p>
    </aside>
  </div>
</article>

<style>
  .detail {
    padding: 2rem 0 4rem;
  }

  .back-button {
    padding: 0.65rem 0.9rem;
    font-weight: 700;
    color: var(--ink);
    background: var(--surface-soft);
    border-radius: 999px;
  }

  .detail__header {
    display: flex;
    gap: 1.5rem;
    align-items: flex-end;
    justify-content: space-between;
    margin: 1.5rem 0;
  }

  .detail__eyebrow,
  .detail__rating {
    margin: 0;
    color: var(--muted);
  }

  .detail__eyebrow {
    font-size: 0.8rem;
    font-weight: 750;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .detail__header h1 {
    max-width: 50rem;
    margin: 0.45rem 0;
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 1.03;
    letter-spacing: -0.045em;
  }

  .detail-wishlist {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.7rem 1rem;
    font-weight: 750;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 999px;
  }

  .detail-wishlist span {
    color: var(--muted);
  }

  .detail-wishlist--active span {
    color: var(--brand);
  }

  .gallery {
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    grid-auto-rows: minmax(10rem, 16rem);
    gap: 0.65rem;
    overflow: hidden;
    background: var(--surface-soft);
    border-radius: 1.5rem;
  }

  .gallery img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .gallery__image--cover {
    grid-row: span 2;
  }

  .detail__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 21rem);
    gap: 3rem;
    align-items: start;
    margin-top: 2rem;
  }

  .fact-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.15rem;
  }

  .fact-strip div {
    display: grid;
    gap: 0.15rem;
    text-align: center;
  }

  .fact-strip strong {
    font-size: 1.25rem;
  }

  .fact-strip span,
  .detail__section p,
  .host-card p,
  .price-card span {
    color: var(--muted);
  }

  .detail__section {
    padding: 1.8rem 0;
    border-bottom: 1px solid var(--border);
  }

  .detail__section h2,
  .host-card h2 {
    margin: 0 0 0.7rem;
    font-size: 1.3rem;
  }

  .detail__section p {
    max-width: 46rem;
    margin: 0;
    line-height: 1.75;
  }

  .amenity-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .amenity-list li {
    display: flex;
    gap: 0.65rem;
    align-items: center;
  }

  .amenity-list span {
    font-weight: 800;
    color: var(--brand);
  }

  .host-card {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-top: 1.8rem;
  }

  .host-card img {
    width: 4.5rem;
    height: 4.5rem;
    object-fit: cover;
    border-radius: 999px;
  }

  .host-card__label {
    margin: 0 0 0.2rem;
    font-size: 0.75rem;
    font-weight: 750;
    text-transform: uppercase;
  }

  .host-card h2,
  .host-card p {
    margin-top: 0;
    margin-bottom: 0.2rem;
  }

  .price-card {
    position: sticky;
    top: 1rem;
    padding: 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    box-shadow: var(--shadow-md);
  }

  .price-card > p:first-child {
    margin: 0 0 1rem;
  }

  .price-card > p strong {
    font-size: 1.35rem;
  }

  .price-card dl {
    display: grid;
    gap: 0.7rem;
    padding: 1rem 0;
    margin: 0;
    border-block: 1px solid var(--border);
  }

  .price-card dl div {
    display: flex;
    justify-content: space-between;
  }

  .price-card dt {
    color: var(--muted);
  }

  .price-card dd {
    margin: 0;
    font-weight: 700;
  }

  .price-card__note {
    margin: 1rem 0 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--muted);
  }

  @media (max-width: 800px) {
    .detail__layout {
      grid-template-columns: 1fr;
    }

    .price-card {
      position: static;
      grid-row: 1;
    }
  }

  @media (max-width: 580px) {
    .detail__header {
      flex-direction: column;
      align-items: flex-start;
    }

    .gallery {
      grid-template-columns: 1fr;
      grid-auto-rows: 14rem;
    }

    .gallery__image--cover {
      grid-row: auto;
    }

    .fact-strip {
      grid-template-columns: repeat(2, 1fr);
    }

    .amenity-list {
      grid-template-columns: 1fr;
    }
  }
</style>
