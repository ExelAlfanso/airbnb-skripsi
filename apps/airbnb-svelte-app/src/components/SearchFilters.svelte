<script lang="ts">
  import {
    type CatalogFilters,
    type CatalogOptions,
    createDefaultFilters,
    SORT_OPTIONS,
  } from "../catalog";

  interface Props {
    disabled: boolean;
    options: CatalogOptions;
    reset: () => void;
    search: (filters: CatalogFilters) => void;
  }

  let { disabled, options, reset, search }: Props = $props();
  let draft: CatalogFilters = $state(createDefaultFilters());

  function copyDraft(): CatalogFilters {
    return {
      ...draft,
      amenities: [...draft.amenities],
    };
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

<style>
  .search-panel {
    padding: 1.1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    box-shadow: var(--shadow-lg);
  }

  .search-panel__primary {
    display: grid;
    grid-template-columns: minmax(14rem, 1.7fr) repeat(2, minmax(10rem, 1fr)) auto;
    gap: 0.75rem;
    align-items: end;
  }

  .search-panel__secondary {
    display: grid;
    grid-template-columns: minmax(11rem, 14rem) 1fr auto;
    gap: 0.9rem 1rem;
    align-items: end;
    padding-top: 0.9rem;
    margin-top: 0.9rem;
    border-top: 1px solid var(--border);
  }

  .field {
    display: grid;
    gap: 0.35rem;
    min-width: 0;
  }

  .field__label,
  .amenities legend {
    font-size: 0.72rem;
    font-weight: 750;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .field input,
  .field select {
    width: 100%;
    min-height: 3rem;
    padding: 0.7rem 0.85rem;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 0.85rem;
  }

  .field input:focus-visible,
  .field select:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--focus) 22%, transparent);
    border-color: var(--brand);
  }

  .search-button,
  .reset-button {
    min-height: 3rem;
    padding: 0.7rem 1rem;
    font-weight: 750;
    border-radius: 0.85rem;
  }

  .search-button {
    color: white;
    background: var(--brand);
  }

  .search-button:hover:not(:disabled) {
    background: var(--brand-dark);
  }

  .reset-button {
    grid-column: -2 / -1;
    color: var(--ink);
    background: var(--surface-soft);
  }

  .advanced-filters {
    grid-row: 2;
    grid-column: 1 / -1;
    overflow: hidden;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1rem;
  }

  .advanced-filters summary {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    min-height: 3.75rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    list-style: none;
  }

  .advanced-filters summary::-webkit-details-marker {
    display: none;
  }

  .advanced-filters summary:hover {
    background: var(--surface-soft);
  }

  .advanced-filters__summary-copy {
    display: grid;
    gap: 0.15rem;
    min-width: 0;
  }

  .advanced-filters__summary-copy strong {
    font-size: 0.95rem;
  }

  .advanced-filters__summary-copy span {
    font-size: 0.8rem;
    color: var(--muted);
  }

  .advanced-filters__indicator {
    display: grid;
    flex: 0 0 2rem;
    place-items: center;
    width: 2rem;
    height: 2rem;
    font-size: 1.25rem;
    line-height: 1;
    color: var(--brand-dark);
    background: var(--brand-soft);
    border-radius: 999px;
    transform-origin: center;
  }

  .advanced-filters[open] .advanced-filters__indicator {
    transform: rotate(45deg);
  }

  .advanced-filters__body {
    padding: 1rem;
    background: var(--surface-soft);
    border-top: 1px solid var(--border);
  }

  .advanced-filters__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(8rem, 1fr));
    gap: 0.75rem;
  }

  .amenities {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0;
    margin: 0.9rem 0 0;
    border: 0;
  }

  .amenities legend {
    width: 100%;
    margin-bottom: 0.25rem;
  }

  .amenity-option {
    display: inline-flex;
    gap: 0.45rem;
    align-items: center;
    padding: 0.45rem 0.65rem;
    font-size: 0.85rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
  }

  @media (max-width: 900px) {
    .search-panel__primary {
      grid-template-columns: 1fr 1fr;
    }

    .field--search {
      grid-column: 1 / -1;
    }

    .search-panel__secondary {
      grid-template-columns: 1fr auto;
    }

    .advanced-filters {
      grid-row: 2;
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 580px) {
    .search-panel__primary,
    .search-panel__secondary,
    .advanced-filters__grid {
      grid-template-columns: 1fr;
    }

    .field--search,
    .advanced-filters {
      grid-row: auto;
      grid-column: auto;
    }
  }
</style>
