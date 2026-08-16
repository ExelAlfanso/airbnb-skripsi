<script lang="ts">
  import type { PropertyListItem } from "@airbnb-skripsi/api/catalog";
  import PropertyCard from "./PropertyCard.svelte";

  interface Props {
    openProperty: (slug: string) => void;
    properties: PropertyListItem[];
    toggleWishlist: (id: string) => void;
    wishlistStates: Readonly<Record<string, boolean>>;
  }

  let { openProperty, properties, toggleWishlist, wishlistStates }: Props =
    $props();
</script>

<div class="property-grid">
  {#each properties as property, index (property.id)}
    <PropertyCard
      {openProperty}
      priority={index === 0}
      {property}
      {toggleWishlist}
      wishlisted={wishlistStates[property.id] ?? false}
    />
  {/each}
</div>

<style>
  .property-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: 900px) {
    .property-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .property-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
