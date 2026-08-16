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
    initialFilters: CatalogFilters;
    options: CatalogOptions;
  }

  interface Emits {
    reset: [];
    search: [filters: CatalogFilters];
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();
  const draft = reactive<CatalogFilters>(copyFilters(props.initialFilters));

  function copyFilters(filters: CatalogFilters): CatalogFilters {
    return {
      ...filters,
      amenities: [...filters.amenities],
    };
  }

  function copyDraft(): CatalogFilters {
    return copyFilters(draft);
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
          autocomplete="off"
          :disabled="disabled"
          name="search"
          placeholder="Contoh: vila di Bali&#8230;"
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
        {{ disabled ? "Mencari\u2026" : "Cari properti" }}
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
                v-model="draft.minPrice"
                autocomplete="off"
                :disabled="disabled"
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
                v-model="draft.maxPrice"
                autocomplete="off"
                :disabled="disabled"
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
                v-model="draft.guests"
                autocomplete="off"
                :disabled="disabled"
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
                v-model="draft.bedrooms"
                autocomplete="off"
                :disabled="disabled"
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
                v-model="draft.beds"
                autocomplete="off"
                :disabled="disabled"
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
                v-model="draft.bathrooms"
                autocomplete="off"
                :disabled="disabled"
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
