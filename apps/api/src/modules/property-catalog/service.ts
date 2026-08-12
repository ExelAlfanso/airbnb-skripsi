import type {
  Amenity,
  ApiErrorResponse,
  Location,
  PaginatedResponse,
  Property,
  PropertyDetail,
  PropertyImage,
  PropertyListItem,
  PropertyQueryParams,
  PropertyType,
  SortOption,
} from "./model";
import type {
  PropertyCatalogRepository,
  PropertyCatalogSnapshot,
} from "./repository";

type QueryValue = string | string[] | undefined;
type RawPropertyQuery = Record<string, QueryValue>;

interface SuccessResult<T> {
  ok: true;
  value: T;
}

interface BadRequestResult {
  error: ApiErrorResponse;
  ok: false;
  status: 400;
}

interface NotFoundResult {
  error: ApiErrorResponse;
  ok: false;
  status: 404;
}

type ListPropertiesResult =
  | SuccessResult<PaginatedResponse<PropertyListItem>>
  | BadRequestResult;
type PropertyDetailResult = SuccessResult<PropertyDetail> | NotFoundResult;

const sortOptions = [
  "recommended",
  "price_asc",
  "price_desc",
  "rating_desc",
] as const;

export async function listProperties(
  repository: PropertyCatalogRepository,
  rawQuery: RawPropertyQuery
): Promise<ListPropertiesResult> {
  const parsedQuery = parsePropertyQuery(rawQuery);

  if (!parsedQuery.ok) {
    return parsedQuery;
  }

  const snapshot = await repository.getSnapshot();
  const filtered = filterProperties(snapshot, parsedQuery.value);
  const sorted = sortProperties(filtered, parsedQuery.value.sort);
  const { page, limit } = parsedQuery.value;
  const total = sorted.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const pageItems = sorted.slice(start, start + limit);

  return {
    ok: true,
    value: {
      data: pageItems.map((property) => toListItem(snapshot, property)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    },
  };
}

export async function getPropertyDetail(
  repository: PropertyCatalogRepository,
  id: string
): Promise<PropertyDetailResult> {
  const snapshot = await repository.getSnapshot();
  const property = snapshot.properties.find((item) => item.id === id);

  if (!property) {
    return {
      ok: false,
      status: 404,
      error: {
        error: {
          code: "PROPERTY_NOT_FOUND",
          message: "Property not found",
        },
      },
    };
  }

  return {
    ok: true,
    value: toDetail(snapshot, property),
  };
}

export async function listLocations(
  repository: PropertyCatalogRepository
): Promise<Location[]> {
  return (await repository.getSnapshot()).locations;
}

export async function listPropertyTypes(
  repository: PropertyCatalogRepository
): Promise<PropertyType[]> {
  return (await repository.getSnapshot()).propertyTypes;
}

export async function listAmenities(
  repository: PropertyCatalogRepository
): Promise<Amenity[]> {
  return (await repository.getSnapshot()).amenities;
}

function parsePropertyQuery(
  rawQuery: RawPropertyQuery
): SuccessResult<PropertyQueryParams> | BadRequestResult {
  const minPrice = parseOptionalNumber(rawQuery.minPrice, "minPrice", {
    minimum: 0,
  });
  if (!minPrice.ok) {
    return minPrice;
  }

  const maxPrice = parseOptionalNumber(rawQuery.maxPrice, "maxPrice", {
    minimum: 0,
  });
  if (!maxPrice.ok) {
    return maxPrice;
  }

  if (
    minPrice.value !== undefined &&
    maxPrice.value !== undefined &&
    maxPrice.value < minPrice.value
  ) {
    return badRequest(
      "maxPrice",
      "maxPrice must be greater than or equal to minPrice"
    );
  }

  const guests = parseOptionalNumber(rawQuery.guests, "guests", { minimum: 1 });
  if (!guests.ok) {
    return guests;
  }

  const bedrooms = parseOptionalNumber(rawQuery.bedrooms, "bedrooms", {
    minimum: 1,
  });
  if (!bedrooms.ok) {
    return bedrooms;
  }

  const beds = parseOptionalNumber(rawQuery.beds, "beds", { minimum: 1 });
  if (!beds.ok) {
    return beds;
  }

  const bathrooms = parseOptionalNumber(rawQuery.bathrooms, "bathrooms", {
    minimum: 1,
  });
  if (!bathrooms.ok) {
    return bathrooms;
  }

  const page =
    parseOptionalNumber(rawQuery.page, "page", { minimum: 1 }) ?? undefined;
  if (page && !page.ok) {
    return page;
  }

  const limit =
    parseOptionalNumber(rawQuery.limit, "limit", { minimum: 1, maximum: 50 }) ??
    undefined;
  if (limit && !limit.ok) {
    return limit;
  }

  const sort = parseSort(rawQuery.sort);
  if (!sort.ok) {
    return sort;
  }

  return {
    ok: true,
    value: {
      search: parseOptionalString(rawQuery.search),
      location: parseOptionalString(rawQuery.location),
      type: parseOptionalString(rawQuery.type),
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
      guests: guests.value,
      bedrooms: bedrooms.value,
      beds: beds.value,
      bathrooms: bathrooms.value,
      amenities: parseAmenities(rawQuery.amenities),
      sort: sort.value,
      page: page?.value ?? 1,
      limit: limit?.value ?? 12,
    },
  };
}

function parseOptionalNumber(
  value: QueryValue,
  field: string,
  options: { minimum?: number; maximum?: number }
): SuccessResult<number | undefined> | BadRequestResult {
  const rawValue = firstQueryValue(value);

  if (rawValue === undefined || rawValue.trim() === "") {
    return { ok: true, value: undefined };
  }

  const numberValue = Number(rawValue);

  if (!Number.isFinite(numberValue)) {
    return badRequest(field, `${field} must be a number`);
  }

  if (options.minimum !== undefined && numberValue < options.minimum) {
    return badRequest(
      field,
      `${field} must be greater than or equal to ${options.minimum}`
    );
  }

  if (options.maximum !== undefined && numberValue > options.maximum) {
    return badRequest(
      field,
      `${field} must be less than or equal to ${options.maximum}`
    );
  }

  return { ok: true, value: numberValue };
}

function parseSort(
  value: QueryValue
): SuccessResult<SortOption> | BadRequestResult {
  const rawValue = firstQueryValue(value) ?? "recommended";

  if (!sortOptions.includes(rawValue as SortOption)) {
    return badRequest(
      "sort",
      "sort must be one of recommended, price_asc, price_desc, rating_desc"
    );
  }

  return { ok: true, value: rawValue as SortOption };
}

function parseOptionalString(value: QueryValue): string | undefined {
  const rawValue = firstQueryValue(value)?.trim();
  return rawValue ? rawValue : undefined;
}

function parseAmenities(value: QueryValue): string[] | undefined {
  if (value === undefined) {
    return;
  }

  const values = Array.isArray(value) ? value : [value];
  const parsed = values
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : undefined;
}

function firstQueryValue(value: QueryValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function badRequest(field: string, reason: string): BadRequestResult {
  return {
    ok: false,
    status: 400,
    error: {
      error: {
        code: "BAD_REQUEST",
        message: "Invalid query parameter",
        details: { field, reason },
      },
    },
  };
}

function filterProperties(
  snapshot: PropertyCatalogSnapshot,
  query: PropertyQueryParams
): Property[] {
  return snapshot.properties.filter((property) =>
    matchesQuery(snapshot, property, query)
  );
}

function matchesQuery(
  snapshot: PropertyCatalogSnapshot,
  property: Property,
  query: PropertyQueryParams
): boolean {
  const location = findRequired(snapshot.locations, property.locationId);
  const propertyType = findRequired(
    snapshot.propertyTypes,
    property.propertyTypeId
  );

  return (
    matchesSearch(property, location, propertyType, query.search) &&
    matchesLocation(location, query.location) &&
    matchesType(propertyType, query.type) &&
    matchesPrice(property, query) &&
    matchesCapacity(property, query) &&
    matchesAmenities(snapshot, property.id, query.amenities)
  );
}

function matchesSearch(
  property: Property,
  location: Location,
  propertyType: PropertyType,
  search: string | undefined
): boolean {
  if (!search) {
    return true;
  }

  const searchValue = normalize(search);
  const searchableValues = [
    property.title,
    location.city,
    location.province,
    location.country,
    location.displayName,
    propertyType.name,
    propertyType.slug,
  ];

  return searchableValues.some((value) =>
    normalize(value).includes(searchValue)
  );
}

function matchesLocation(
  location: Location,
  locationQuery: string | undefined
): boolean {
  if (!locationQuery) {
    return true;
  }

  const normalizedLocation = normalize(locationQuery);

  return [location.id, location.city, location.displayName].some(
    (value) => normalize(value) === normalizedLocation
  );
}

function matchesType(
  propertyType: PropertyType,
  typeQuery: string | undefined
): boolean {
  if (!typeQuery) {
    return true;
  }

  const normalizedType = normalize(typeQuery);

  return [propertyType.id, propertyType.slug].some(
    (value) => normalize(value) === normalizedType
  );
}

function matchesPrice(property: Property, query: PropertyQueryParams): boolean {
  if (query.minPrice !== undefined && property.pricePerNight < query.minPrice) {
    return false;
  }

  if (query.maxPrice !== undefined && property.pricePerNight > query.maxPrice) {
    return false;
  }

  return true;
}

function matchesCapacity(
  property: Property,
  query: PropertyQueryParams
): boolean {
  return (
    isAtLeast(property.maxGuests, query.guests) &&
    isAtLeast(property.bedrooms, query.bedrooms) &&
    isAtLeast(property.beds, query.beds) &&
    isAtLeast(property.bathrooms, query.bathrooms)
  );
}

function matchesAmenities(
  snapshot: PropertyCatalogSnapshot,
  propertyId: string,
  requestedAmenities: string[] | undefined
): boolean {
  if (!requestedAmenities) {
    return true;
  }

  const amenityTokens = getAmenities(snapshot, propertyId).flatMap(
    (amenity) => [amenity.id, amenity.name, amenity.iconName]
  );

  return requestedAmenities.every((requestedAmenity) =>
    amenityTokens.some(
      (token) => normalize(token) === normalize(requestedAmenity)
    )
  );
}

function isAtLeast(actual: number, minimum: number | undefined): boolean {
  return minimum === undefined || actual >= minimum;
}

function sortProperties(properties: Property[], sort: SortOption): Property[] {
  return [...properties].sort((a, b) => {
    if (sort === "price_asc") {
      return compareNumber(a.pricePerNight, b.pricePerNight) || compareId(a, b);
    }
    if (sort === "price_desc") {
      return compareNumber(b.pricePerNight, a.pricePerNight) || compareId(a, b);
    }
    if (sort === "rating_desc") {
      return compareNumber(b.rating, a.rating) || compareId(a, b);
    }

    return (
      compareNumber(Number(b.isGuestFavorite), Number(a.isGuestFavorite)) ||
      compareNumber(b.rating, a.rating) ||
      compareNumber(b.reviewCount, a.reviewCount) ||
      b.createdAt.localeCompare(a.createdAt) ||
      compareId(a, b)
    );
  });
}

function toListItem(
  snapshot: PropertyCatalogSnapshot,
  property: Property
): PropertyListItem {
  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    location: findRequired(snapshot.locations, property.locationId),
    propertyType: findRequired(snapshot.propertyTypes, property.propertyTypeId),
    pricePerNight: property.pricePerNight,
    rating: property.rating,
    reviewCount: property.reviewCount,
    maxGuests: property.maxGuests,
    bedrooms: property.bedrooms,
    beds: property.beds,
    bathrooms: property.bathrooms,
    coverImage: getCoverImage(snapshot, property.id),
    isGuestFavorite: property.isGuestFavorite,
    isWishlisted: getWishlistState(snapshot, property.id),
  };
}

function toDetail(
  snapshot: PropertyCatalogSnapshot,
  property: Property
): PropertyDetail {
  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description,
    location: findRequired(snapshot.locations, property.locationId),
    propertyType: findRequired(snapshot.propertyTypes, property.propertyTypeId),
    host: findRequired(snapshot.hosts, property.hostId),
    pricePerNight: property.pricePerNight,
    rating: property.rating,
    reviewCount: property.reviewCount,
    maxGuests: property.maxGuests,
    bedrooms: property.bedrooms,
    beds: property.beds,
    bathrooms: property.bathrooms,
    images: getImages(snapshot, property.id),
    amenities: getAmenities(snapshot, property.id),
    isGuestFavorite: property.isGuestFavorite,
    isWishlisted: getWishlistState(snapshot, property.id),
  };
}

function getCoverImage(
  snapshot: PropertyCatalogSnapshot,
  propertyId: string
): PropertyImage | null {
  return getImages(snapshot, propertyId).find((image) => image.isCover) ?? null;
}

function getImages(
  snapshot: PropertyCatalogSnapshot,
  propertyId: string
): PropertyImage[] {
  return snapshot.propertyImages
    .filter((image) => image.propertyId === propertyId)
    .sort((a, b) => compareNumber(a.sortOrder, b.sortOrder));
}

function getAmenities(
  snapshot: PropertyCatalogSnapshot,
  propertyId: string
): Amenity[] {
  const amenityIds = snapshot.propertyAmenities
    .filter((propertyAmenity) => propertyAmenity.propertyId === propertyId)
    .map((propertyAmenity) => propertyAmenity.amenityId);

  return snapshot.amenities.filter((amenity) =>
    amenityIds.includes(amenity.id)
  );
}

function getWishlistState(
  snapshot: PropertyCatalogSnapshot,
  propertyId: string
): boolean {
  return (
    snapshot.wishlistStates.find((state) => state.propertyId === propertyId)
      ?.isWishlisted ?? false
  );
}

function findRequired<T extends { id: string }>(items: T[], id: string): T {
  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    throw new Error(`Missing catalog relation: ${id}`);
  }

  return item;
}

function compareNumber(a: number, b: number): number {
  return a - b;
}

function compareId(a: Property, b: Property): number {
  return a.id.localeCompare(b.id);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
