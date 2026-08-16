<script setup lang="ts">
  import type {
    PaginatedResponse,
    PropertyDetail as PropertyDetailType,
    PropertyListItem,
  } from "@airbnb-skripsi/api/catalog";
  import { computed, onMounted, onUnmounted, shallowRef } from "vue";
  import {
    type CatalogFilters,
    type CatalogOptions,
    createCatalogSearchParams,
    createDefaultFilters,
    createPropertyPath,
    fetchCatalogOptions,
    fetchPropertyDetail,
    fetchPropertyPage,
    parseCatalogFilters,
    parsePropertySlug,
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
  const filterFormKey = shallowRef(0);
  const properties = shallowRef<PropertyListItem[]>([]);
  const pagination = shallowRef<PaginationMeta | null>(null);
  const detail = shallowRef<PropertyDetailType | null>(null);
  const selectedSlug = shallowRef<string | null>(null);
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
    window.addEventListener("popstate", handlePopState);
    const slug = parsePropertySlug(window.location.pathname);

    if (slug) {
      openProperty(slug, false);
    } else {
      restoreFiltersFromUrl();
      initialize();
    }
  });

  onUnmounted(() => {
    window.removeEventListener("popstate", handlePopState);
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
    updateCatalogUrl(nextFilters);
    clearDetail();
    loadProperties(true);
  }

  function handleReset(): void {
    handleSearch(createDefaultFilters());
  }

  function handlePopState(): void {
    const slug = parsePropertySlug(window.location.pathname);

    if (slug) {
      openProperty(slug, false);
      return;
    }

    restoreFiltersFromUrl();
    clearDetail();
    loadProperties(true);
  }

  function restoreFiltersFromUrl(): void {
    filters.value = parseCatalogFilters(
      new URLSearchParams(window.location.search)
    );
    filterFormKey.value += 1;
  }

  function updateCatalogUrl(nextFilters: CatalogFilters): void {
    const url = new URL(window.location.href);
    url.search = createCatalogSearchParams(
      nextFilters,
      url.searchParams
    ).toString();
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextUrl !== currentUrl) {
      window.history.pushState(null, "", nextUrl);
    }
  }

  async function openProperty(slug: string, updateUrl = true): Promise<void> {
    const requestId = ++detailRequestId;
    selectedSlug.value = slug;
    detail.value = null;
    detailError.value = null;
    loadingDetail.value = true;

    if (updateUrl) {
      const catalogUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.history.pushState({ catalogUrl }, "", createPropertyPath(slug));
    }

    window.scrollTo({ behavior: "smooth", top: 0 });

    try {
      const response = await fetchPropertyDetail(slug);

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
    if (typeof window.history.state?.catalogUrl === "string") {
      window.history.back();
      return;
    }

    window.history.pushState(null, "", "/");
    restoreFiltersFromUrl();
    clearDetail();
    initialize();
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  function clearDetail(): void {
    detailRequestId += 1;
    selectedSlug.value = null;
    detail.value = null;
    detailError.value = null;
    loadingDetail.value = false;
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
    <a class="skip-link" href="#main-content">Langsung ke konten utama</a>
    <header class="site-header">
      <a class="brand" href="/" aria-label="Airbnb beranda">
        <span class="brand__mark" aria-hidden="true">A</span>
        <span translate="no">Airbnb</span>
      </a>
      <p>
        Prototipe listing
        <span class="site-header__separator" aria-hidden="true">/</span>
        Studi kasus Airbnb
      </p>
    </header>

    <main id="main-content" class="container">
      <template v-if="selectedSlug">
        <div
          v-if="loadingDetail"
          class="status-panel"
          aria-live="polite"
          role="status"
        >
          Memuat detail properti&hellip;
        </div>
        <div
          v-else-if="detailError"
          class="status-panel status-panel--error"
          role="alert"
        >
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
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero__intro">
            <div class="hero__copy-block">
              <p class="hero__eyebrow">Eksperimen frontend skripsi</p>
              <h1 id="hero-title">
                Temukan tempat singgah.
                <span>Bandingkan tanpa bias.</span>
              </h1>
              <p class="hero__copy">
                Jelajahi prototipe listing akomodasi dengan pencarian, filter,
                dan detail yang setara pada implementasi Vue dan Svelte.
              </p>
            </div>

            <aside class="research-rail" aria-label="Konteks penelitian">
              <div>
                <span>Dataset</span><strong>Dummy deterministik</strong>
              </div>
              <div><span>API</span><strong>Respons yang sama</strong></div>
              <div><span>Frontend</span><strong>Vue + Svelte</strong></div>
            </aside>
          </div>

          <SearchFilters
            :key="filterFormKey"
            :disabled="loadingList || loadingOptions"
            :initial-filters="filters"
            :options="options"
            @reset="handleReset"
            @search="handleSearch"
          />
        </section>

        <section class="results" aria-labelledby="results-title">
          <div class="results__heading">
            <div>
              <p class="results__eyebrow">Katalog akomodasi</p>
              <h2 id="results-title" aria-live="polite">{{ resultLabel }}</h2>
            </div>
            <p v-if="pagination">
              Halaman {{ pagination.page }} dari
              {{ Math.max(pagination.totalPages, 1) }}
            </p>
          </div>

          <div
            v-if="errorMessage"
            class="status-panel status-panel--error"
            role="alert"
          >
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
            <span class="sr-only">Memuat properti&hellip;</span>
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
                {{ loadingList ? "Memuat\u2026" : "Muat lebih banyak" }}
              </button>
              <p v-else>Semua properti sudah ditampilkan.</p>
            </div>
          </template>
        </section>
      </template>
    </main>

    <footer class="site-footer">
      <p><strong>Prototipe akademik</strong></p>
      <p>
        Data dummy deterministik <span aria-hidden="true">&middot;</span>
        Tanpa pemesanan atau transaksi
      </p>
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
    width: min(100% - 2rem, 80rem);
    margin-inline: auto;
  }
  .skip-link {
    position: fixed;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 10;
    padding: 0.7rem 1rem;
    font-weight: 750;
    color: white;
    text-decoration: none;
    background: var(--ink);
    border-radius: 0.75rem;
    translate: 0 -200%;
  }

  .skip-link:focus-visible {
    translate: 0;
  }

  .site-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    min-height: 5.25rem;
    border-bottom: 1px solid var(--border);
  }

  .site-header > p {
    margin: 0;
    font-family: ui-monospace, "Cascadia Code", "SFMono-Regular", monospace;
    font-size: 0.82rem;
    color: var(--muted);
    text-align: right;
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

  .site-header__separator {
    margin-inline: 0.35rem;
  }

  .brand__mark {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    color: white;
    background: var(--brand);
    border-radius: 50% 50% 50% 0.7rem;
  }

  .hero {
    padding: clamp(3rem, 7vw, 6.5rem) 0 2.5rem;
  }

  .hero__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(16rem, 0.65fr);
    gap: clamp(2rem, 6vw, 6rem);
    align-items: end;
    margin-bottom: 2.25rem;
  }

  .hero__copy-block {
    min-width: 0;
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
    max-width: 58rem;
    margin: 0;
    font-family: ui-rounded, "Arial Rounded MT Bold", ui-sans-serif, sans-serif;
    font-size: clamp(3rem, 7.5vw, 6.75rem);
    line-height: 0.92;
    letter-spacing: -0.07em;
    text-wrap: balance;
  }

  .hero h1 span {
    display: block;
    color: var(--brand);
  }

  .hero__copy {
    max-width: 42rem;
    margin: 1.5rem 0 0;
    font-size: clamp(1rem, 2vw, 1.18rem);
    line-height: 1.65;
    color: var(--muted);
  }

  .research-rail > div > span {
    font-family: ui-monospace, "Cascadia Code", "SFMono-Regular", monospace;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }

  .research-rail {
    border-block: 1px solid var(--ink);
  }

  .research-rail div {
    display: grid;
    gap: 0.2rem;
    padding: 0.85rem 0;
  }

  .research-rail div + div {
    border-top: 1px solid var(--border);
  }

  .research-rail strong {
    font-size: 0.95rem;
  }

  .results {
    padding: 3.5rem 0 5rem;
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
  .status-panel button:hover:not(:disabled),
  .load-more button:hover:not(:disabled) {
    background: var(--brand-dark);
  }

  .status-panel button:active:not(:disabled),
  .load-more button:active:not(:disabled) {
    scale: 0.98;
  }

  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
    border-top: 1px solid var(--border);
  }

  .site-footer p {
    margin: 0.2rem 0;
    text-align: center;
  }

  @keyframes shimmer {
    to {
      background-position-x: -200%;
    }
  }

  @media (max-width: 900px) {
    .hero__intro {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .skeleton-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
      .site-header > p {
        text-align: left;
      }

      .hero h1 {
        font-size: clamp(2.75rem, 14vw, 4.5rem);
      }
    }
  }
</style>
