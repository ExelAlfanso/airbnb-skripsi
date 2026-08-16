<script lang="ts">
  import type {
    PaginatedResponse,
    PropertyDetail,
    PropertyListItem,
  } from "@airbnb-skripsi/api/catalog";
  import { onMount } from "svelte";
  import {
    type CatalogFilters,
    type CatalogOptions,
    createCatalogSearchParams,
    createDefaultFilters,
    fetchCatalogOptions,
    fetchPropertyDetail,
    fetchPropertyPage,
    parseCatalogFilters,
  } from "../catalog";
  import PropertyDetailView from "./PropertyDetail.svelte";
  import PropertyGrid from "./PropertyGrid.svelte";
  import SearchFilters from "./SearchFilters.svelte";

  type PaginationMeta = PaginatedResponse<PropertyListItem>["meta"];

  const SKELETON_ITEMS = [0, 1, 2, 3];
  let options: CatalogOptions = $state.raw({
    amenities: [],
    locations: [],
    propertyTypes: [],
  });
  let filters: CatalogFilters = $state.raw(createDefaultFilters());
  let filterFormKey = $state(0);
  let properties: PropertyListItem[] = $state.raw([]);
  let pagination = $state.raw<PaginationMeta | null>(null);
  let detail = $state.raw<PropertyDetail | null>(null);
  let selectedId: string | null = $state(null);
  let wishlistStates: Record<string, boolean> = $state.raw({});
  let loadingOptions = $state(false);
  let loadingList = $state(false);
  let loadingDetail = $state(false);
  let optionsError: string | null = $state(null);
  let listError: string | null = $state(null);
  let detailError: string | null = $state(null);
  let listRequestId = 0;
  let detailRequestId = 0;

  let errorMessage = $derived(listError ?? optionsError);
  let resultLabel = $derived(`${pagination?.total ?? 0} properti ditemukan`);

  onMount(() => {
    restoreFiltersFromUrl();
    window.addEventListener("popstate", handlePopState);
    initialize();

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  });

  async function initialize(): Promise<void> {
    await Promise.all([loadOptions(), loadProperties(true)]);
  }

  async function loadOptions(): Promise<void> {
    loadingOptions = true;
    optionsError = null;

    try {
      options = await fetchCatalogOptions();
    } catch (error) {
      optionsError = messageFrom(error);
    } finally {
      loadingOptions = false;
    }
  }

  async function loadProperties(reset: boolean): Promise<void> {
    const requestId = ++listRequestId;
    const nextPage = reset ? 1 : (pagination?.page ?? 0) + 1;
    loadingList = true;
    listError = null;

    try {
      const response = await fetchPropertyPage(filters, nextPage);

      if (requestId !== listRequestId) {
        return;
      }

      properties = reset ? response.data : [...properties, ...response.data];
      pagination = response.meta;
      mergeWishlist(response.data);
    } catch (error) {
      if (requestId === listRequestId) {
        listError = messageFrom(error);
      }
    } finally {
      if (requestId === listRequestId) {
        loadingList = false;
      }
    }
  }

  function handleSearch(nextFilters: CatalogFilters): void {
    filters = nextFilters;
    updateCatalogUrl(nextFilters);
    selectedId = null;
    detail = null;
    loadProperties(true);
  }

  function handleReset(): void {
    handleSearch(createDefaultFilters());
  }

  function handlePopState(): void {
    restoreFiltersFromUrl();
    detailRequestId += 1;
    selectedId = null;
    detail = null;
    detailError = null;
    loadingDetail = false;
    loadProperties(true);
  }

  function restoreFiltersFromUrl(): void {
    filters = parseCatalogFilters(new URLSearchParams(window.location.search));
    filterFormKey += 1;
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

  async function openProperty(id: string): Promise<void> {
    const requestId = ++detailRequestId;
    selectedId = id;
    detail = null;
    detailError = null;
    loadingDetail = true;
    window.scrollTo({ behavior: "smooth", top: 0 });

    try {
      const response = await fetchPropertyDetail(id);

      if (requestId !== detailRequestId) {
        return;
      }

      detail = response;
      mergeWishlist([response]);
    } catch (error) {
      if (requestId === detailRequestId) {
        detailError = messageFrom(error);
      }
    } finally {
      if (requestId === detailRequestId) {
        loadingDetail = false;
      }
    }
  }

  function closeDetail(): void {
    detailRequestId += 1;
    selectedId = null;
    detail = null;
    detailError = null;
    loadingDetail = false;
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  function toggleWishlist(id: string): void {
    wishlistStates = {
      ...wishlistStates,
      [id]: !(wishlistStates[id] ?? false),
    };
  }

  function mergeWishlist(
    items: Array<PropertyListItem | PropertyDetail>
  ): void {
    const next = { ...wishlistStates };

    for (const item of items) {
      if (!(item.id in next)) {
        next[item.id] = item.isWishlisted;
      }
    }

    wishlistStates = next;
  }

  function messageFrom(error: unknown): string {
    return error instanceof Error
      ? error.message
      : "Terjadi kesalahan. Coba lagi.";
  }
</script>

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
    {#if selectedId}
      {#if loadingDetail}
        <div class="status-panel" aria-live="polite" role="status">
          Memuat detail properti&hellip;
        </div>
      {:else if detailError}
        <div class="status-panel status-panel--error" role="alert">
          <p>{detailError}</p>
          <button type="button" onclick={closeDetail}>Kembali ke hasil</button>
        </div>
      {:else if detail}
        <PropertyDetailView
          back={closeDetail}
          property={detail}
          {toggleWishlist}
          wishlisted={wishlistStates[detail.id] ?? false}
        />
      {/if}
    {:else}
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero__intro">
          <div class="hero__copy-block">
            <p class="hero__eyebrow">Eksperimen frontend skripsi</p>
            <h1 id="hero-title">
              Temukan tempat singgah.
              <span>Bandingkan tanpa bias.</span>
            </h1>
            <p class="hero__copy">
              Jelajahi prototipe listing akomodasi dengan pencarian, filter, dan
              detail yang setara pada implementasi Vue dan Svelte.
            </p>
          </div>

          <aside class="research-rail" aria-label="Konteks penelitian">
            <div><span>Dataset</span><strong>Dummy deterministik</strong></div>
            <div><span>API</span><strong>Respons yang sama</strong></div>
            <div><span>Frontend</span><strong>Vue + Svelte</strong></div>
          </aside>
        </div>

        {#key filterFormKey}
          <SearchFilters
            disabled={loadingList || loadingOptions}
            initialFilters={filters}
            {options}
            reset={handleReset}
            search={handleSearch}
          />
        {/key}
      </section>

      <section class="results" aria-labelledby="results-title">
        <div class="results__heading">
          <div>
            <p class="results__eyebrow">Katalog akomodasi</p>
            <h2 id="results-title" aria-live="polite">{resultLabel}</h2>
          </div>
          {#if pagination}
            <p>
              Halaman {pagination.page} dari
              {Math.max(pagination.totalPages, 1)}
            </p>
          {/if}
        </div>

        {#if errorMessage}
          <div class="status-panel status-panel--error" role="alert">
            <p>{errorMessage}</p>
            <button type="button" onclick={() => loadProperties(true)}>
              Coba lagi
            </button>
          </div>
        {:else if loadingList && properties.length === 0}
          <div class="skeleton-grid" aria-live="polite" role="status">
            <span class="sr-only">Memuat properti&hellip;</span>
            {#each SKELETON_ITEMS as item (item)}
              <div class="skeleton-card"></div>
            {/each}
          </div>
        {:else if properties.length === 0}
          <div class="status-panel" aria-live="polite">
            <p>Tidak ada properti yang cocok dengan filter ini.</p>
            <button type="button" onclick={handleReset}>Reset filter</button>
          </div>
        {:else}
          <PropertyGrid
            {openProperty}
            {properties}
            {toggleWishlist}
            {wishlistStates}
          />

          <div class="load-more">
            {#if pagination?.hasMore}
              <button
                disabled={loadingList}
                type="button"
                onclick={() => loadProperties(false)}
              >
                {loadingList ? "Memuat\u2026" : "Muat lebih banyak"}
              </button>
            {:else}
              <p>Semua properti sudah ditampilkan.</p>
            {/if}
          </div>
        {/if}
      </section>
    {/if}
  </main>

  <footer class="site-footer">
    <p><strong>Prototipe akademik</strong></p>
    <p>
      Data dummy deterministik <span aria-hidden="true">&middot;</span>
      Tanpa pemesanan atau transaksi
    </p>
  </footer>
</div>

<style>
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

  .results {
    padding: 3.5rem 0 5rem;
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
    }
    .site-header > p {
      text-align: left;
    }

    .hero h1 {
      font-size: clamp(2.75rem, 14vw, 4.5rem);
    }
  }
</style>
