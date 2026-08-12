<script setup lang="ts">
  import type {
    PaginatedResponse,
    PropertyDetail as PropertyDetailType,
    PropertyListItem,
  } from "@airbnb-skripsi/api/catalog";
  import { computed, onMounted, shallowRef } from "vue";
  import {
    type CatalogFilters,
    type CatalogOptions,
    createDefaultFilters,
    fetchCatalogOptions,
    fetchPropertyDetail,
    fetchPropertyPage,
  } from "../catalog";
  import PropertyDetail from "./PropertyDetail.vue";
  import PropertyGrid from "./PropertyGrid.vue";
  import SearchFilters from "./SearchFilters.vue";

  type PaginationMeta = PaginatedResponse<PropertyListItem>["meta"];

  const options = shallowRef<CatalogOptions>({
    amenities: [],
    locations: [],
    propertyTypes: [],
  });
  const filters = shallowRef<CatalogFilters>(createDefaultFilters());
  const properties = shallowRef<PropertyListItem[]>([]);
  const pagination = shallowRef<PaginationMeta | null>(null);
  const detail = shallowRef<PropertyDetailType | null>(null);
  const selectedId = shallowRef<string | null>(null);
  const wishlistStates = shallowRef<Map<string, boolean>>(new Map());
  const loadingOptions = shallowRef(false);
  const loadingList = shallowRef(false);
  const loadingDetail = shallowRef(false);
  const optionsError = shallowRef<string | null>(null);
  const listError = shallowRef<string | null>(null);
  const detailError = shallowRef<string | null>(null);
  let listRequestId = 0;
  let detailRequestId = 0;

  const errorMessage = computed(() => listError.value ?? optionsError.value);
  const resultLabel = computed(() => {
    const total = pagination.value?.total ?? 0;
    return `${total} properti ditemukan`;
  });

  onMounted(() => {
    void initialize();
  });

  async function initialize(): Promise<void> {
    await Promise.all([loadOptions(), loadProperties(true)]);
  }

  async function loadOptions(): Promise<void> {
    loadingOptions.value = true;
    optionsError.value = null;

    try {
      options.value = await fetchCatalogOptions();
    } catch (error) {
      optionsError.value = messageFrom(error);
    } finally {
      loadingOptions.value = false;
    }
  }

  async function loadProperties(reset: boolean): Promise<void> {
    const requestId = ++listRequestId;
    const nextPage = reset ? 1 : (pagination.value?.page ?? 0) + 1;
    loadingList.value = true;
    listError.value = null;

    try {
      const response = await fetchPropertyPage(filters.value, nextPage);

      if (requestId !== listRequestId) {
        return;
      }

      properties.value = reset
        ? response.data
        : [...properties.value, ...response.data];
      pagination.value = response.meta;
      mergeWishlist(response.data);
    } catch (error) {
      if (requestId === listRequestId) {
        listError.value = messageFrom(error);
      }
    } finally {
      if (requestId === listRequestId) {
        loadingList.value = false;
      }
    }
  }

  function handleSearch(nextFilters: CatalogFilters): void {
    filters.value = nextFilters;
    selectedId.value = null;
    detail.value = null;
    void loadProperties(true);
  }

  function handleReset(): void {
    handleSearch(createDefaultFilters());
  }

  async function openProperty(id: string): Promise<void> {
    const requestId = ++detailRequestId;
    selectedId.value = id;
    detail.value = null;
    detailError.value = null;
    loadingDetail.value = true;
    window.scrollTo({ behavior: "smooth", top: 0 });

    try {
      const response = await fetchPropertyDetail(id);

      if (requestId !== detailRequestId) {
        return;
      }

      detail.value = response;
      mergeWishlist([response]);
    } catch (error) {
      if (requestId === detailRequestId) {
        detailError.value = messageFrom(error);
      }
    } finally {
      if (requestId === detailRequestId) {
        loadingDetail.value = false;
      }
    }
  }

  function closeDetail(): void {
    detailRequestId += 1;
    selectedId.value = null;
    detail.value = null;
    detailError.value = null;
    loadingDetail.value = false;
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  function toggleWishlist(id: string): void {
    const next = new Map(wishlistStates.value);
    next.set(id, !(next.get(id) ?? false));
    wishlistStates.value = next;
  }

  function mergeWishlist(
    items: Array<PropertyListItem | PropertyDetailType>
  ): void {
    const next = new Map(wishlistStates.value);

    for (const item of items) {
      if (!next.has(item.id)) {
        next.set(item.id, item.isWishlisted);
      }
    }

    wishlistStates.value = next;
  }

  function messageFrom(error: unknown): string {
    return error instanceof Error
      ? error.message
      : "Terjadi kesalahan. Coba lagi.";
  }
</script>

<template>
  <div class="app">
    <header class="site-header">
      <a class="brand" href="/" aria-label="StayCompare beranda">
        <span class="brand__mark" aria-hidden="true">?</span>
        <span>StayCompare</span>
      </a>
      <p>Satu dataset ? Satu API ? Dua framework</p>
    </header>

    <main class="container">
      <template v-if="selectedId">
        <div
          v-if="loadingDetail"
          class="status-panel"
          aria-live="polite"
          role="status"
        >
          Memuat detail properti...
        </div>
        <div v-else-if="detailError" class="status-panel status-panel--error">
          <p>{{ detailError }}</p>
          <button type="button" @click="closeDetail">Kembali ke hasil</button>
        </div>
        <PropertyDetail
          v-else-if="detail"
          :property="detail"
          :wishlisted="wishlistStates.get(detail.id) ?? false"
          @back="closeDetail"
          @toggle-wishlist="toggleWishlist"
        />
      </template>

      <template v-else>
        <section class="hero">
          <p class="hero__eyebrow">Eksperimen frontend skripsi</p>
          <h1>Temukan tempat singgah yang terasa tepat.</h1>
          <p class="hero__copy">
            Jelajahi dataset properti yang sama pada implementasi Vue dan
            Svelte, lengkap dengan pencarian, filter, dan detail.
          </p>

          <SearchFilters
            :disabled="loadingList || loadingOptions"
            :options="options"
            @reset="handleReset"
            @search="handleSearch"
          />
        </section>

        <section class="results" aria-labelledby="results-title">
          <div class="results__heading">
            <div>
              <p class="results__eyebrow">Pilihan untuk Anda</p>
              <h2 id="results-title">{{ resultLabel }}</h2>
            </div>
            <p v-if="pagination">
              Halaman {{ pagination.page }} dari
              {{ Math.max(pagination.totalPages, 1) }}
            </p>
          </div>

          <div v-if="errorMessage" class="status-panel status-panel--error">
            <p>{{ errorMessage }}</p>
            <button type="button" @click="loadProperties(true)">
              Coba lagi
            </button>
          </div>

          <div
            v-else-if="loadingList && properties.length === 0"
            class="skeleton-grid"
            aria-live="polite"
            role="status"
          >
            <span class="sr-only">Memuat properti...</span>
            <div v-for="item in 4" :key="item" class="skeleton-card" />
          </div>

          <div
            v-else-if="properties.length === 0"
            class="status-panel"
            aria-live="polite"
          >
            <p>Tidak ada properti yang cocok dengan filter ini.</p>
            <button type="button" @click="handleReset">Reset filter</button>
          </div>

          <template v-else>
            <PropertyGrid
              :properties="properties"
              :wishlist-states="wishlistStates"
              @open="openProperty"
              @toggle-wishlist="toggleWishlist"
            />

            <div class="load-more">
              <button
                v-if="pagination?.hasMore"
                :disabled="loadingList"
                type="button"
                @click="loadProperties(false)"
              >
                {{ loadingList ? "Memuat..." : "Muat lebih banyak" }}
              </button>
              <p v-else>Semua properti sudah ditampilkan.</p>
            </div>
          </template>
        </section>
      </template>
    </main>

    <footer class="site-footer">
      <p>Prototype penelitian ? Data dummy deterministik ? Tanpa transaksi</p>
    </footer>
  </div>
</template>

<style scoped>
  .app {
    min-height: 100vh;
  }

  .container,
  .site-header,
  .site-footer {
    width: min(100% - 2rem, 76rem);
    margin-inline: auto;
  }

  .site-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    min-height: 4.75rem;
    border-bottom: 1px solid var(--border);
  }

  .site-header p {
    margin: 0;
    font-size: 0.82rem;
    color: var(--muted);
  }

  .brand {
    display: inline-flex;
    gap: 0.6rem;
    align-items: center;
    font-weight: 820;
    color: var(--ink);
    letter-spacing: -0.02em;
    text-decoration: none;
  }

  .brand__mark {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    color: white;
    background: var(--brand);
    border-radius: 0.65rem;
  }

  .hero {
    padding: clamp(3.5rem, 8vw, 7rem) 0 2.5rem;
  }

  .hero__eyebrow,
  .results__eyebrow {
    margin: 0 0 0.65rem;
    font-size: 0.76rem;
    font-weight: 800;
    color: var(--brand-dark);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .hero h1 {
    max-width: 55rem;
    margin: 0;
    font-size: clamp(2.8rem, 8vw, 6.6rem);
    line-height: 0.94;
    letter-spacing: -0.065em;
  }

  .hero__copy {
    max-width: 42rem;
    margin: 1.25rem 0 2rem;
    font-size: clamp(1rem, 2vw, 1.18rem);
    line-height: 1.65;
    color: var(--muted);
  }

  .results {
    padding: 2.5rem 0 4rem;
  }

  .results__heading {
    display: flex;
    gap: 1rem;
    align-items: end;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .results__heading h2,
  .results__heading p {
    margin: 0;
  }

  .results__heading h2 {
    font-size: clamp(1.65rem, 4vw, 2.5rem);
    letter-spacing: -0.035em;
  }

  .results__heading > p {
    font-size: 0.88rem;
    color: var(--muted);
  }

  .status-panel {
    display: grid;
    place-items: center;
    min-height: 13rem;
    padding: 2rem;
    text-align: center;
    background: var(--surface);
    border: 1px dashed var(--border-strong);
    border-radius: 1.25rem;
  }

  .status-panel p {
    margin: 0;
  }

  .status-panel button,
  .load-more button {
    padding: 0.7rem 1rem;
    font-weight: 750;
    color: white;
    background: var(--ink);
    border-radius: 999px;
  }

  .status-panel--error {
    color: #8b1e2d;
    background: #fff7f8;
  }

  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }

  .skeleton-card {
    min-height: 24rem;
    background:
      linear-gradient(
        100deg,
        transparent 20%,
        rgb(255 255 255 / 55%) 45%,
        transparent 70%
      ),
      var(--surface-soft);
    background-size: 200% 100%;
    border-radius: 1.35rem;
    animation: shimmer 1.3s infinite linear;
  }

  .load-more {
    display: grid;
    place-items: center;
    min-height: 7rem;
  }

  .load-more p {
    font-size: 0.9rem;
    color: var(--muted);
  }

  .site-footer {
    padding: 1.5rem 0 2.5rem;
    font-size: 0.82rem;
    color: var(--muted);
    text-align: center;
    border-top: 1px solid var(--border);
  }

  @keyframes shimmer {
    to {
      background-position-x: -200%;
    }
  }

  @media (max-width: 700px) {
    .site-header {
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding-block: 1rem;
    }

    .skeleton-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton-card {
      animation: none;
    }
  }
</style>
