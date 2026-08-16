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
