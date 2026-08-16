import type {
  PaginatedResponse,
  PropertyDetail as PropertyDetailType,
  PropertyListItem,
} from "@airbnb-skripsi/api/catalog";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import PropertyDetail from "./property-detail";
import PropertyGrid from "./property-grid";
import SearchFilters from "./search-filters";

type PaginationMeta = PaginatedResponse<PropertyListItem>["meta"];
const EMPTY_OPTIONS: CatalogOptions = {
  amenities: [],
  locations: [],
  propertyTypes: [],
};
const SKELETON_ITEMS = [0, 1, 2, 3];

function messageFrom(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Terjadi kesalahan. Coba lagi.";
}

export default function PropertyExplorer() {
  const [options, setOptions] = useState<CatalogOptions>(EMPTY_OPTIONS);
  const [filters, setFilters] = useState<CatalogFilters>(createDefaultFilters);
  const [filterFormKey, setFilterFormKey] = useState(0);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [detail, setDetail] = useState<PropertyDetailType | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [wishlistStates, setWishlistStates] = useState<Map<string, boolean>>(
    () => new Map()
  );
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const listRequestId = useRef(0);
  const detailRequestId = useRef(0);
  const optionsLoaded = useRef(false);

  const mergeWishlist = useCallback(
    (items: Array<PropertyListItem | PropertyDetailType>) => {
      setWishlistStates((current) => {
        const next = new Map(current);
        for (const item of items) {
          if (!next.has(item.id)) {
            next.set(item.id, item.isWishlisted);
          }
        }
        return next;
      });
    },
    []
  );

  const loadOptions = useCallback(async () => {
    if (optionsLoaded.current) {
      return;
    }
    optionsLoaded.current = true;
    setLoadingOptions(true);
    setOptionsError(null);
    try {
      setOptions(await fetchCatalogOptions());
    } catch (error) {
      optionsLoaded.current = false;
      setOptionsError(messageFrom(error));
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  const loadPropertyList = useCallback(
    async (activeFilters: CatalogFilters, page: number, append: boolean) => {
      const requestId = ++listRequestId.current;
      setLoadingList(true);
      setListError(null);
      try {
        const response = await fetchPropertyPage(activeFilters, page);
        if (requestId !== listRequestId.current) {
          return;
        }
        setProperties((current) =>
          append ? [...current, ...response.data] : response.data
        );
        setPagination(response.meta);
        mergeWishlist(response.data);
      } catch (error) {
        if (requestId === listRequestId.current) {
          setListError(messageFrom(error));
        }
      } finally {
        if (requestId === listRequestId.current) {
          setLoadingList(false);
        }
      }
    },
    [mergeWishlist]
  );

  const openProperty = useCallback(
    async (slug: string, updateUrl = true) => {
      const requestId = ++detailRequestId.current;
      setSelectedSlug(slug);
      setDetail(null);
      setDetailError(null);
      setLoadingDetail(true);

      if (updateUrl) {
        const catalogUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.history.pushState({ catalogUrl }, "", createPropertyPath(slug));
      }
      window.scrollTo({ behavior: "smooth", top: 0 });

      try {
        const response = await fetchPropertyDetail(slug);
        if (requestId !== detailRequestId.current) {
          return;
        }
        setDetail(response);
        mergeWishlist([response]);
      } catch (error) {
        if (requestId === detailRequestId.current) {
          setDetailError(messageFrom(error));
        }
      } finally {
        if (requestId === detailRequestId.current) {
          setLoadingDetail(false);
        }
      }
    },
    [mergeWishlist]
  );

  const clearDetail = useCallback(() => {
    detailRequestId.current += 1;
    setSelectedSlug(null);
    setDetail(null);
    setDetailError(null);
    setLoadingDetail(false);
  }, []);

  const loadCatalog = useCallback(() => {
    const nextFilters = parseCatalogFilters(
      new URLSearchParams(window.location.search)
    );
    setFilters(nextFilters);
    setFilterFormKey((key) => key + 1);
    clearDetail();
    Promise.all([loadOptions(), loadPropertyList(nextFilters, 1, false)]).catch(
      () => undefined
    );
  }, [clearDetail, loadOptions, loadPropertyList]);

  const syncRoute = useCallback(() => {
    const slug = parsePropertySlug(window.location.pathname);
    if (slug) {
      openProperty(slug, false).catch(() => undefined);
    } else {
      loadCatalog();
    }
  }, [loadCatalog, openProperty]);

  useEffect(() => {
    syncRoute();
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, [syncRoute]);

  function updateCatalogUrl(nextFilters: CatalogFilters) {
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

  function handleSearch(nextFilters: CatalogFilters) {
    setFilters(nextFilters);
    updateCatalogUrl(nextFilters);
    clearDetail();
    loadPropertyList(nextFilters, 1, false).catch(() => undefined);
  }

  function closeDetail() {
    if (typeof window.history.state?.catalogUrl === "string") {
      window.history.back();
      return;
    }
    window.history.pushState(null, "", "/");
    loadCatalog();
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  function toggleWishlist(id: string) {
    setWishlistStates((current) => {
      const next = new Map(current);
      next.set(id, !(next.get(id) ?? false));
      return next;
    });
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Langsung ke konten utama
      </a>
      <header className="site-header">
        <a aria-label="Airbnb beranda" className="brand" href="/">
          <span aria-hidden="true" className="brand__mark">
            A
          </span>
          <span translate="no">Airbnb</span>
        </a>
        <p>
          Prototipe listing
          <span aria-hidden="true" className="site-header__separator">
            /
          </span>
          Studi kasus Airbnb
        </p>
      </header>

      <main className="container" id="main-content">
        {selectedSlug ? (
          <DetailState
            detail={detail}
            error={detailError}
            loading={loadingDetail}
            onBack={closeDetail}
            onToggleWishlist={toggleWishlist}
            wishlisted={
              detail ? (wishlistStates.get(detail.id) ?? false) : false
            }
          />
        ) : (
          <>
            <section aria-labelledby="hero-title" className="hero">
              <div className="hero__intro">
                <div className="hero__copy-block">
                  <p className="hero__eyebrow">Eksperimen frontend skripsi</p>
                  <h1 id="hero-title">
                    Temukan tempat singgah.
                    <span className="hero__accent">Bandingkan tanpa bias.</span>
                  </h1>
                  <p className="hero__copy">
                    Jelajahi prototipe listing akomodasi dengan pencarian,
                    filter, dan detail yang setara pada implementasi Vue dan
                    Svelte.
                  </p>
                </div>

                <aside
                  aria-label="Konteks penelitian"
                  className="research-rail"
                >
                  <div>
                    <span>Dataset</span>
                    <strong>Dummy deterministik</strong>
                  </div>
                  <div>
                    <span>API</span>
                    <strong>Respons yang sama</strong>
                  </div>
                  <div>
                    <span>Frontend</span>
                    <strong>Vue + Svelte</strong>
                  </div>
                </aside>
              </div>

              <SearchFilters
                disabled={loadingList || loadingOptions}
                initialFilters={filters}
                key={filterFormKey}
                onReset={() => handleSearch(createDefaultFilters())}
                onSearch={handleSearch}
                options={options}
              />
            </section>

            <ResultsState
              error={listError ?? optionsError}
              filters={filters}
              loading={loadingList}
              loadPropertyList={loadPropertyList}
              onOpen={openProperty}
              onReset={() => handleSearch(createDefaultFilters())}
              onToggleWishlist={toggleWishlist}
              pagination={pagination}
              properties={properties}
              wishlistStates={wishlistStates}
            />
          </>
        )}
      </main>

      <footer className="site-footer">
        <p>
          <strong>Prototipe akademik</strong>
        </p>
        <p>
          Data dummy deterministik <span aria-hidden="true">{"\u00b7"}</span>{" "}
          Tanpa pemesanan atau transaksi
        </p>
      </footer>
    </div>
  );
}

interface DetailStateProps {
  detail: PropertyDetailType | null;
  error: string | null;
  loading: boolean;
  onBack: () => void;
  onToggleWishlist: (id: string) => void;
  wishlisted: boolean;
}

interface ResultsStateProps {
  error: string | null;
  filters: CatalogFilters;
  loading: boolean;
  loadPropertyList: (
    filters: CatalogFilters,
    page: number,
    append: boolean
  ) => Promise<void>;
  onOpen: (slug: string) => Promise<void>;
  onReset: () => void;
  onToggleWishlist: (id: string) => void;
  pagination: PaginationMeta | null;
  properties: PropertyListItem[];
  wishlistStates: ReadonlyMap<string, boolean>;
}

function ResultsState({
  error,
  filters,
  loading,
  loadPropertyList,
  onOpen,
  onReset,
  onToggleWishlist,
  pagination,
  properties,
  wishlistStates,
}: ResultsStateProps) {
  let content: ReactNode;

  if (error) {
    content = (
      <div className="status-panel status-panel--error" role="alert">
        <p>{error}</p>
        <button
          onClick={() => {
            loadPropertyList(filters, 1, false).catch(() => undefined);
          }}
          type="button"
        >
          Coba lagi
        </button>
      </div>
    );
  } else if (loading && properties.length === 0) {
    content = (
      <div aria-live="polite" className="skeleton-grid" role="status">
        <span className="sr-only">Memuat properti...</span>
        {SKELETON_ITEMS.map((item) => (
          <div className="skeleton-card" key={item} />
        ))}
      </div>
    );
  } else if (properties.length === 0) {
    content = (
      <div aria-live="polite" className="status-panel">
        <p>Tidak ada properti yang cocok dengan filter ini.</p>
        <button onClick={onReset} type="button">
          Reset filter
        </button>
      </div>
    );
  } else {
    content = (
      <>
        <PropertyGrid
          onOpen={(slug) => {
            onOpen(slug).catch(() => undefined);
          }}
          onToggleWishlist={onToggleWishlist}
          properties={properties}
          wishlistStates={wishlistStates}
        />
        <div className="load-more">
          {pagination?.hasMore ? (
            <button
              disabled={loading}
              onClick={() => {
                loadPropertyList(filters, pagination.page + 1, true).catch(
                  () => undefined
                );
              }}
              type="button"
            >
              {loading ? "Memuat..." : "Muat lebih banyak"}
            </button>
          ) : (
            <p>Semua properti sudah ditampilkan.</p>
          )}
        </div>
      </>
    );
  }

  return (
    <section aria-labelledby="results-title" className="results">
      <div className="results__heading">
        <div>
          <p className="results__eyebrow">Katalog akomodasi</p>
          <h2 aria-live="polite" id="results-title">
            {pagination?.total ?? 0} properti ditemukan
          </h2>
        </div>
        {pagination ? (
          <p>
            Halaman {pagination.page} dari {Math.max(pagination.totalPages, 1)}
          </p>
        ) : null}
      </div>
      {content}
    </section>
  );
}

function DetailState({
  detail,
  error,
  loading,
  onBack,
  onToggleWishlist,
  wishlisted,
}: DetailStateProps) {
  if (loading) {
    return (
      <div aria-live="polite" className="status-panel" role="status">
        Memuat detail properti...
      </div>
    );
  }
  if (error) {
    return (
      <div className="status-panel status-panel--error" role="alert">
        <p>{error}</p>
        <button onClick={onBack} type="button">
          Kembali ke hasil
        </button>
      </div>
    );
  }
  return detail ? (
    <PropertyDetail
      onBack={onBack}
      onToggleWishlist={onToggleWishlist}
      property={detail}
      wishlisted={wishlisted}
    />
  ) : null;
}
