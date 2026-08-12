<script setup lang="ts">
  import type { PropertyListItem } from "@airbnb-skripsi/api/catalog";
  import PropertyCard from "./PropertyCard.vue";

  interface Props {
    properties: PropertyListItem[];
    wishlistStates: ReadonlyMap<string, boolean>;
  }

  interface Emits {
    open: [id: string];
    toggleWishlist: [id: string];
  }

  defineProps<Props>();
  const emit = defineEmits<Emits>();
</script>

<template>
  <div class="property-grid">
    <PropertyCard
      v-for="(property, index) in properties"
      :key="property.id"
      :priority="index === 0"
      :property="property"
      :wishlisted="wishlistStates.get(property.id) ?? false"
      @open="emit('open', $event)"
      @toggle-wishlist="emit('toggleWishlist', $event)"
    />
  </div>
</template>

<style scoped>
  .property-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: 700px) {
    .property-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
