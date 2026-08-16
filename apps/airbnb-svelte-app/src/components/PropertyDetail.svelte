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
        &#9733; {property.rating.toFixed(1)} &middot;
        {property.reviewCount}
        ulasan
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
