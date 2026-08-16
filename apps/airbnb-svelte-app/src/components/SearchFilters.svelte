<script lang="ts">
  import { untrack } from "svelte";
  import {
    type CatalogFilters,
    type CatalogOptions,
    createDefaultFilters,
    SORT_OPTIONS,
  } from "../catalog";

  interface Props {
    disabled: boolean;
    initialFilters: CatalogFilters;
    options: CatalogOptions;
    reset: () => void;
    search: (filters: CatalogFilters) => void;
  }

  let { disabled, initialFilters, options, reset, search }: Props = $props();
  let draft: CatalogFilters = $state(
    untrack(() => copyFilters(initialFilters))
  );

  function copyFilters(filters: CatalogFilters): CatalogFilters {
    return {
      ...filters,
      amenities: [...filters.amenities],
    };
  }

  function copyDraft(): CatalogFilters {
    return copyFilters(draft);
  }

  function submit(event: SubmitEvent): void {
    event.preventDefault();
    search(copyDraft());
  }

  function resetFilters(): void {
    draft = createDefaultFilters();
    reset();
  }
</script>

<form class="search-panel" aria-busy={disabled} onsubmit={submit}>
  <div class="search-panel__primary">
    <label class="field field--search">
      <span class="field__label">Cari</span>
      <input
        bind:value={draft.search}
        autocomplete="off"
        {disabled}
        name="search"
        placeholder="Contoh: vila di Bali&#8230;"
        type="search"
      >
    </label>

    <label class="field">
      <span class="field__label">Lokasi</span>
      <select bind:value={draft.location} {disabled} name="location">
        <option value="">Semua lokasi</option>
        {#each options.locations as location (location.id)}
          <option value={location.id}>{location.displayName}</option>
        {/each}
      </select>
    </label>

    <label class="field">
      <span class="field__label">Tipe</span>
      <select bind:value={draft.type} {disabled} name="type">
        <option value="">Semua tipe</option>
        {#each options.propertyTypes as propertyType (propertyType.id)}
          <option value={propertyType.slug}>{propertyType.name}</option>
        {/each}
      </select>
    </label>

    <button class="search-button" {disabled} type="submit">
      {disabled ? "Mencari\u2026" : "Cari properti"}
    </button>
  </div>

  <div class="search-panel__secondary">
    <label class="field">
      <span class="field__label">Urutkan</span>
      <select bind:value={draft.sort} {disabled} name="sort">
        {#each SORT_OPTIONS as option (option.value)}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </label>

    <details class="advanced-filters">
      <summary>
        <span class="advanced-filters__summary-copy">
          <strong>Filter lanjutan</strong>
          <span>Harga, kapasitas, dan amenitas</span>
        </span>
        <span class="advanced-filters__indicator" aria-hidden="true">+</span>
      </summary>
      <div class="advanced-filters__body">
        <div class="advanced-filters__grid">
          <label class="field">
            <span class="field__label">Harga minimum</span>
            <input
              bind:value={draft.minPrice}
              autocomplete="off"
              {disabled}
              inputmode="numeric"
              min="0"
              name="minPrice"
              placeholder="Mulai dari&#8230;"
              type="number"
            >
          </label>
          <label class="field">
            <span class="field__label">Harga maksimum</span>
            <input
              bind:value={draft.maxPrice}
              autocomplete="off"
              {disabled}
              inputmode="numeric"
              min="0"
              name="maxPrice"
              placeholder="Hingga&#8230;"
              type="number"
            >
          </label>
          <label class="field">
            <span class="field__label">Tamu minimum</span>
            <input
              bind:value={draft.guests}
              autocomplete="off"
              {disabled}
              inputmode="numeric"
              min="1"
              name="guests"
              placeholder="Jumlah tamu&#8230;"
              type="number"
            >
          </label>
          <label class="field">
            <span class="field__label">Kamar tidur</span>
            <input
              bind:value={draft.bedrooms}
              autocomplete="off"
              {disabled}
              inputmode="numeric"
              min="1"
              name="bedrooms"
              placeholder="Jumlah kamar&#8230;"
              type="number"
            >
          </label>
          <label class="field">
            <span class="field__label">Tempat tidur</span>
            <input
              bind:value={draft.beds}
              autocomplete="off"
              {disabled}
              inputmode="numeric"
              min="1"
              name="beds"
              placeholder="Jumlah tempat tidur&#8230;"
              type="number"
            >
          </label>
          <label class="field">
            <span class="field__label">Kamar mandi</span>
            <input
              bind:value={draft.bathrooms}
              autocomplete="off"
              {disabled}
              inputmode="numeric"
              min="1"
              name="bathrooms"
              placeholder="Jumlah kamar mandi&#8230;"
              type="number"
            >
          </label>
        </div>

        <fieldset class="amenities">
          <legend>Amenitas wajib</legend>
          {#each options.amenities as amenity (amenity.id)}
            <label class="amenity-option">
              <input
                bind:group={draft.amenities}
                {disabled}
                name="amenities"
                type="checkbox"
                value={amenity.id}
              >
              <span>{amenity.name}</span>
            </label>
          {/each}
        </fieldset>
      </div>
    </details>

    <button
      class="reset-button"
      {disabled}
      type="button"
      onclick={resetFilters}
    >
      Reset filter
    </button>
  </div>
</form>
