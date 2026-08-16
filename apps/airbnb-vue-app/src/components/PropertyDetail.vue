<script setup lang="ts">
  import type { PropertyDetail } from "@airbnb-skripsi/api/catalog";
  import { formatPrice, optimizeImage } from "../catalog";

  interface Props {
    property: PropertyDetail;
    wishlisted: boolean;
  }

  interface Emits {
    back: [];
    toggleWishlist: [id: string];
  }

  defineProps<Props>();
  const emit = defineEmits<Emits>();
</script>

<template>
  <article class="detail">
    <button class="back-button" type="button" @click="emit('back')">
      &larr; Kembali ke hasil
    </button>

    <header class="detail__header">
      <div>
        <p class="detail__eyebrow">
          {{ property.propertyType.name }}
          &middot; {{ property.location.displayName }}
        </p>
        <h1>{{ property.title }}</h1>
        <p class="detail__rating">
          &#9733; {{ property.rating.toFixed(1) }} &middot;
          {{ property.reviewCount }}
          ulasan
          <span v-if="property.isGuestFavorite">&middot; Favorit tamu</span>
        </p>
      </div>

      <button
        class="detail-wishlist"
        :class="{ 'detail-wishlist--active': wishlisted }"
        type="button"
        :aria-pressed="wishlisted"
        @click="emit('toggleWishlist', property.id)"
      >
        <span aria-hidden="true">&#9829;</span>
        {{ wishlisted ? "Tersimpan" : "Simpan" }}
      </button>
    </header>

    <div v-if="property.images.length > 0" class="gallery">
      <img
        v-for="(image, index) in property.images"
        :key="image.id"
        :class="{ 'gallery__image--cover': index === 0 }"
        :alt="image.altText"
        height="700"
        :loading="index === 0 ? 'eager' : 'lazy'"
        :fetchpriority="index === 0 ? 'high' : 'auto'"
        :src="optimizeImage(image.imageUrl, index === 0 ? 1400 : 800)"
        width="1200"
      >
    </div>

    <div class="detail__layout">
      <div class="detail__content">
        <section class="fact-strip" aria-label="Ringkasan properti">
          <div>
            <strong>{{ property.maxGuests }}</strong>
            <span>Tamu</span>
          </div>
          <div>
            <strong>{{ property.bedrooms }}</strong>
            <span>Kamar</span>
          </div>
          <div>
            <strong>{{ property.beds }}</strong>
            <span>Tempat tidur</span>
          </div>
          <div>
            <strong>{{ property.bathrooms }}</strong>
            <span>Kamar mandi</span>
          </div>
        </section>

        <section class="detail__section">
          <h2>Tentang tempat ini</h2>
          <p>{{ property.description }}</p>
        </section>

        <section class="detail__section">
          <h2>Yang tersedia</h2>
          <ul class="amenity-list">
            <li v-for="amenity in property.amenities" :key="amenity.id">
              <span aria-hidden="true">&#10003;</span>
              {{ amenity.name }}
            </li>
          </ul>
        </section>

        <section class="host-card">
          <img
            :alt="`Foto profil ${property.host.name}`"
            height="72"
            :src="optimizeImage(property.host.avatarUrl, 144)"
            width="72"
          >
          <div>
            <p class="host-card__label">Tuan rumah</p>
            <h2>{{ property.host.name }}</h2>
            <p>
              Bergabung sejak {{ property.host.joinedYear }}
              <span v-if="property.host.isSuperhost">&middot; Superhost</span>
            </p>
          </div>
        </section>
      </div>

      <aside class="price-card">
        <p>
          <strong>{{ formatPrice(property.pricePerNight) }}</strong>
          <span> / malam</span>
        </p>
        <dl>
          <div>
            <dt>Lokasi</dt>
            <dd>{{ property.location.city }}</dd>
          </div>
          <div>
            <dt>Kapasitas</dt>
            <dd>{{ property.maxGuests }} tamu</dd>
          </div>
          <div>
            <dt>Rating</dt>
            <dd>{{ property.rating.toFixed(1) }} / 5</dd>
          </div>
        </dl>
        <p class="price-card__note">
          Tampilan eksperimen saja. Pemesanan dan pembayaran tidak termasuk
          ruang lingkup penelitian.
        </p>
      </aside>
    </div>
  </article>
</template>
