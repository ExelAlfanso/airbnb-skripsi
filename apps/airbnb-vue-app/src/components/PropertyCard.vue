<script setup lang="ts">
  import type { PropertyListItem } from "@airbnb-skripsi/api/catalog";
  import { formatPrice, optimizeImage } from "../catalog";

  interface Props {
    priority: boolean;
    property: PropertyListItem;
    wishlisted: boolean;
  }

  interface Emits {
    open: [slug: string];
    toggleWishlist: [id: string];
  }

  defineProps<Props>();
  const emit = defineEmits<Emits>();
</script>

<template>
  <article class="property-card">
    <button
      class="property-card__image-button"
      type="button"
      @click="emit('open', property.slug)"
    >
      <img
        v-if="property.coverImage"
        class="property-card__image"
        :alt="property.coverImage.altText"
        :fetchpriority="priority ? 'high' : 'auto'"
        height="600"
        :loading="priority ? 'eager' : 'lazy'"
        :src="optimizeImage(property.coverImage.imageUrl)"
        width="900"
      >
      <span v-else class="property-card__placeholder">Foto belum tersedia</span>
    </button>

    <button
      class="wishlist-button"
      :class="{ 'wishlist-button--active': wishlisted }"
      type="button"
      :aria-label="
        wishlisted
          ? `Hapus ${property.title} dari wishlist`
          : `Simpan ${property.title} ke wishlist`
      "
      :aria-pressed="wishlisted"
      @click="emit('toggleWishlist', property.id)"
    >
      <span aria-hidden="true">&#9829;</span>
    </button>

    <div class="property-card__body">
      <div class="property-card__eyebrow">
        <span>{{ property.propertyType.name }}</span>
        <span>
          <span aria-hidden="true">&#9733;</span>
          <span class="sr-only">Rating </span>{{ property.rating.toFixed(1) }}
        </span>
      </div>

      <button
        class="property-card__title"
        type="button"
        @click="emit('open', property.slug)"
      >
        {{ property.title }}
      </button>

      <p class="property-card__location">{{ property.location.displayName }}</p>
      <p class="property-card__facts">
        {{ property.maxGuests }}
        tamu &middot;
        {{ property.bedrooms }}
        kamar &middot;
        {{ property.beds }}
        tempat tidur
      </p>

      <div class="property-card__footer">
        <p>
          <strong>{{ formatPrice(property.pricePerNight) }}</strong>
          <span> / malam</span>
        </p>
        <span v-if="property.isGuestFavorite" class="favorite-badge">
          Favorit tamu
        </span>
      </div>
    </div>
  </article>
</template>
