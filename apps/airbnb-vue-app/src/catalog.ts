import type {
  Amenity,
  Location,
  PaginatedResponse,
  PropertyDetail,
  PropertyListItem,
  PropertyType,
  SortOption,
} from "@airbnb-skripsi/api/catalog";
import { createApiClient } from "@airbnb-skripsi/api/client";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const api = createApiClient(API_URL);

export interface CatalogFilters {
  amenities: string[];
  bathrooms: string;
  bedrooms: string;
  beds: string;
  guests: string;
  location: string;
  maxPrice: string;
  minPrice: string;
  search: string;
  sort: SortOption;
  type: string;
}

export interface CatalogOptions {
  amenities: Amenity[];
  locations: Location[];
  propertyTypes: PropertyType[];
}

export const SORT_OPTIONS: ReadonlyArray<{
  label: string;
  value: SortOption;
}> = [
  { label: "Rekomendasi", value: "recommended" },
  { label: "Harga terendah", value: "price_asc" },
  { label: "Harga tertinggi", value: "price_desc" },
  { label: "Rating tertinggi", value: "rating_desc" },
];

const FILTER_QUERY_KEYS = [
  "search",
  "location",
  "type",
  "minPrice",
  "maxPrice",
  "guests",
  "bedrooms",
  "beds",
  "bathrooms",
  "amenities",
  "sort",
] as const;

const rupiah = new Intl.NumberFormat("id-ID", {
  currency: "IDR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function createDefaultFilters(): CatalogFilters {
  return {
    amenities: [],
    bathrooms: "",
    bedrooms: "",
    beds: "",
    guests: "",
    location: "",
    maxPrice: "",
    minPrice: "",
    search: "",
    sort: "recommended",
    type: "",
  };
}

export function parseCatalogFilters(
  searchParams: URLSearchParams
): CatalogFilters {
  const filters = createDefaultFilters();

  filters.search = readParameter(searchParams, "search");
  filters.location = readParameter(searchParams, "location");
  filters.type = readParameter(searchParams, "type");
  filters.minPrice = readParameter(searchParams, "minPrice");
  filters.maxPrice = readParameter(searchParams, "maxPrice");
  filters.guests = readParameter(searchParams, "guests");
  filters.bedrooms = readParameter(searchParams, "bedrooms");
  filters.beds = readParameter(searchParams, "beds");
  filters.bathrooms = readParameter(searchParams, "bathrooms");
  filters.amenities = [
    ...new Set(
      readParameter(searchParams, "amenities")
        .split(",")
        .map((amenity) => amenity.trim())
        .filter(Boolean)
    ),
  ];

  const sort = readParameter(searchParams, "sort");
  if (SORT_OPTIONS.some((option) => option.value === sort)) {
    filters.sort = sort as SortOption;
  }

  return filters;
}

export function createCatalogSearchParams(
  filters: CatalogFilters,
  current = new URLSearchParams()
): URLSearchParams {
  const searchParams = new URLSearchParams(current);

  for (const key of FILTER_QUERY_KEYS) {
    searchParams.delete(key);
  }

  addParameter(searchParams, "search", filters.search);
  addParameter(searchParams, "location", filters.location);
  addParameter(searchParams, "type", filters.type);
  addParameter(searchParams, "minPrice", filters.minPrice);
  addParameter(searchParams, "maxPrice", filters.maxPrice);
  addParameter(searchParams, "guests", filters.guests);
  addParameter(searchParams, "bedrooms", filters.bedrooms);
  addParameter(searchParams, "beds", filters.beds);
  addParameter(searchParams, "bathrooms", filters.bathrooms);

  if (filters.amenities.length > 0) {
    searchParams.set("amenities", filters.amenities.join(","));
  }

  if (filters.sort !== "recommended") {
    searchParams.set("sort", filters.sort);
  }

  return searchParams;
}

export function formatPrice(value: number): string {
  return rupiah.format(value);
}

export function optimizeImage(url: string, width = 900): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&fit=crop&w=${width}&q=78`;
}

export async function fetchCatalogOptions(): Promise<CatalogOptions> {
  const [locations, propertyTypes, amenities] = await Promise.all([
    api.locations.get(),
    api["property-types"].get(),
    api.amenities.get(),
  ]);

  return {
    amenities: unwrap(amenities, "amenitas"),
    locations: unwrap(locations, "lokasi"),
    propertyTypes: unwrap(propertyTypes, "tipe properti"),
  };
}

export async function fetchPropertyPage(
  filters: CatalogFilters,
  page: number,
  limit = 4
): Promise<PaginatedResponse<PropertyListItem>> {
  const response = await api.properties.get({
    $query: buildQuery(filters, page, limit),
  });

  return unwrap(response, "daftar properti");
}

export async function fetchPropertyDetail(id: string): Promise<PropertyDetail> {
  const response = await api.properties[id].get();
  return unwrap(response, "detail properti");
}

function buildQuery(
  filters: CatalogFilters,
  page: number,
  limit: number
): Record<string, string> {
  const query: Record<string, string> = {
    limit: String(limit),
    page: String(page),
    sort: filters.sort,
  };

  addIfPresent(query, "search", filters.search);
  addIfPresent(query, "location", filters.location);
  addIfPresent(query, "type", filters.type);
  addIfPresent(query, "minPrice", filters.minPrice);
  addIfPresent(query, "maxPrice", filters.maxPrice);
  addIfPresent(query, "guests", filters.guests);
  addIfPresent(query, "bedrooms", filters.bedrooms);
  addIfPresent(query, "beds", filters.beds);
  addIfPresent(query, "bathrooms", filters.bathrooms);

  if (filters.amenities.length > 0) {
    query.amenities = filters.amenities.join(",");
  }

  return query;
}

function addIfPresent(
  target: Record<string, string>,
  key: string,
  value: string
): void {
  const normalized = value.trim();
  if (normalized) {
    target[key] = normalized;
  }
}

function addParameter(
  searchParams: URLSearchParams,
  key: string,
  value: string
): void {
  const normalized = value.trim();
  if (normalized) {
    searchParams.set(key, normalized);
  }
}

function readParameter(searchParams: URLSearchParams, key: string): string {
  return searchParams.get(key)?.trim() ?? "";
}

function unwrap<T>(
  result: { data: T | null; error: unknown },
  resource: string
): T {
  if (result.error || result.data === null) {
    throw new Error(`Gagal memuat ${resource}. Coba lagi.`);
  }

  return result.data;
}
