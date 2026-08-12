<script setup lang="ts">
  import { reactive } from "vue";
  import {
    type CatalogFilters,
    type CatalogOptions,
    createDefaultFilters,
    SORT_OPTIONS,
  } from "../catalog";

  interface Props {
    disabled: boolean;
    options: CatalogOptions;
  }

  interface Emits {
    reset: [];
    search: [filters: CatalogFilters];
  }

  defineProps<Props>();
  const emit = defineEmits<Emits>();
  const draft = reactive<CatalogFilters>(createDefaultFilters());

  function copyDraft(): CatalogFilters {
    return {
      ...draft,
      amenities: [...draft.amenities],
    };
  }

  function submit(): void {
    emit("search", copyDraft());
  }

  function reset(): void {
    Object.assign(draft, createDefaultFilters());
    emit("reset");
  }
</script>

<template>
  <form class="search-panel" :aria-busy="disabled" @submit.prevent="submit">
    <div class="search-panel__primary">
      <label class="field field--search">
        <span class="field__label">Cari</span>
        <input
          v-model="draft.search"
          :disabled="disabled"
          name="search"
          placeholder="Villa, kota, atau tipe properti"
          type="search"
        >
      </label>

      <label class="field">
        <span class="field__label">Lokasi</span>
        <select v-model="draft.location" :disabled="disabled" name="location">
          <option value="">Semua lokasi</option>
          <option
            v-for="location in options.locations"
            :key="location.id"
            :value="location.id"
          >
            {{ location.displayName }}
          </option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">Tipe</span>
        <select v-model="draft.type" :disabled="disabled" name="type">
          <option value="">Semua tipe</option>
          <option
            v-for="propertyType in options.propertyTypes"
            :key="propertyType.id"
            :value="propertyType.slug"
          >
            {{ propertyType.name }}
          </option>
        </select>
      </label>

      <button class="search-button" :disabled="disabled" type="submit">
        {{ disabled ? "Mencari..." : "Cari properti" }}
      </button>
    </div>

    <div class="search-panel__secondary">
      <label class="field">
        <span class="field__label">Urutkan</span>
        <select v-model="draft.sort" :disabled="disabled" name="sort">
          <option
            v-for="option in SORT_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <details class="advanced-filters">
        <summary>Filter lanjutan</summary>
        <div class="advanced-filters__body">
          <div class="advanced-filters__grid">
            <label class="field">
              <span class="field__label">Harga minimum</span>
              <input
                v-model="draft.minPrice"
                :disabled="disabled"
                min="0"
                name="minPrice"
                placeholder="Rp0"
                type="number"
              >
            </label>
            <label class="field">
              <span class="field__label">Harga maksimum</span>
              <input
                v-model="draft.maxPrice"
                :disabled="disabled"
                min="0"
                name="maxPrice"
                placeholder="Tanpa batas"
                type="number"
              >
            </label>
            <label class="field">
              <span class="field__label">Tamu minimum</span>
              <input
                v-model="draft.guests"
                :disabled="disabled"
                min="1"
                name="guests"
                placeholder="Bebas"
                type="number"
              >
            </label>
            <label class="field">
              <span class="field__label">Kamar tidur</span>
              <input
                v-model="draft.bedrooms"
                :disabled="disabled"
                min="1"
                name="bedrooms"
                placeholder="Bebas"
                type="number"
              >
            </label>
            <label class="field">
              <span class="field__label">Tempat tidur</span>
              <input
                v-model="draft.beds"
                :disabled="disabled"
                min="1"
                name="beds"
                placeholder="Bebas"
                type="number"
              >
            </label>
            <label class="field">
              <span class="field__label">Kamar mandi</span>
              <input
                v-model="draft.bathrooms"
                :disabled="disabled"
                min="1"
                name="bathrooms"
                placeholder="Bebas"
                type="number"
              >
            </label>
          </div>

          <fieldset class="amenities">
            <legend>Amenitas wajib</legend>
            <label
              v-for="amenity in options.amenities"
              :key="amenity.id"
              class="amenity-option"
            >
              <input
                v-model="draft.amenities"
                :disabled="disabled"
                name="amenities"
                type="checkbox"
                :value="amenity.id"
              >
              <span>{{ amenity.name }}</span>
            </label>
          </fieldset>
        </div>
      </details>

      <button
        class="reset-button"
        :disabled="disabled"
        type="button"
        @click="reset"
      >
        Reset filter
      </button>
    </div>
  </form>
</template>

<style scoped>
  .search-panel {
    padding: 1rem;
    background: color-mix(in srgb, var(--surface) 94%, transparent);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(16px);
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
    gap: 1rem;
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
    min-height: 2.8rem;
    padding: 0.7rem 0.85rem;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 0.85rem;
  }

  .field input:focus,
  .field select:focus {
    outline: 3px solid color-mix(in srgb, var(--brand) 18%, transparent);
    border-color: var(--brand);
  }

  .search-button,
  .reset-button {
    min-height: 2.8rem;
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
    color: var(--ink);
    background: var(--surface-soft);
  }

  .advanced-filters {
    align-self: stretch;
    background: var(--surface-soft);
    border-radius: 0.85rem;
  }

  .advanced-filters summary {
    display: flex;
    align-items: center;
    min-height: 2.8rem;
    padding: 0.7rem 0.9rem;
    font-weight: 700;
    cursor: pointer;
  }

  .advanced-filters__body {
    padding: 0.25rem 0.9rem 0.9rem;
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
