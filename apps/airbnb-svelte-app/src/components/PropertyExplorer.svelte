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
    createPropertyPath,
    fetchCatalogOptions,
    fetchPropertyDetail,
    fetchPropertyPage,
    parseCatalogFilters,
    parsePropertySlug,
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
  let selectedSlug: string | null = $state(null);
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
    const slug = parsePropertySlug(window.location.pathname);

    if (slug) {
      openProperty(slug, false);
    } else {
      restoreFiltersFromUrl();
      initialize();
    }
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

  async function openProperty(slug: string, updateUrl = true): Promise<void> {
    const requestId = ++detailRequestId;
    selectedSlug = slug;
    detail = null;
    detailError = null;
    loadingDetail = true;

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
    selectedSlug = null;
    detail = null;
    detailError = null;
    loadingDetail = false;
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

<svelte:window onpopstate={handlePopState} />

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
    {#if selectedSlug}
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
