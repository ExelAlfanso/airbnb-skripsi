import { t } from "elysia";

const locationSchema = t.Object({
  id: t.String(),
  city: t.String(),
  province: t.String(),
  country: t.String(),
  displayName: t.String(),
});

const propertyTypeSchema = t.Object({
  id: t.String(),
  name: t.String(),
  slug: t.String(),
});

const hostSchema = t.Object({
  id: t.String(),
  name: t.String(),
  avatarUrl: t.String(),
  joinedYear: t.Number(),
  isSuperhost: t.Boolean(),
});

const amenitySchema = t.Object({
  id: t.String(),
  name: t.String(),
  iconName: t.String(),
});

const propertyImageSchema = t.Object({
  id: t.String(),
  propertyId: t.String(),
  imageUrl: t.String(),
  altText: t.String(),
  sortOrder: t.Number(),
  isCover: t.Boolean(),
});

const propertyAmenitySchema = t.Object({
  propertyId: t.String(),
  amenityId: t.String(),
});

const wishlistStateSchema = t.Object({
  propertyId: t.String(),
  isWishlisted: t.Boolean(),
});

const propertySchema = t.Object({
  id: t.String(),
  title: t.String(),
  slug: t.String(),
  description: t.String(),
  locationId: t.String(),
  propertyTypeId: t.String(),
  hostId: t.String(),
  pricePerNight: t.Number(),
  rating: t.Number(),
  reviewCount: t.Number(),
  maxGuests: t.Number(),
  bedrooms: t.Number(),
  beds: t.Number(),
  bathrooms: t.Number(),
  isGuestFavorite: t.Boolean(),
  createdAt: t.String(),
  updatedAt: t.String(),
});

const propertyListItemSchema = t.Object({
  id: t.String(),
  title: t.String(),
  slug: t.String(),
  location: locationSchema,
  propertyType: propertyTypeSchema,
  pricePerNight: t.Number(),
  rating: t.Number(),
  reviewCount: t.Number(),
  maxGuests: t.Number(),
  bedrooms: t.Number(),
  beds: t.Number(),
  bathrooms: t.Number(),
  coverImage: t.Nullable(propertyImageSchema),
  isGuestFavorite: t.Boolean(),
  isWishlisted: t.Boolean(),
});

const propertyDetailSchema = t.Object({
  id: t.String(),
  title: t.String(),
  slug: t.String(),
  description: t.String(),
  location: locationSchema,
  propertyType: propertyTypeSchema,
  host: hostSchema,
  pricePerNight: t.Number(),
  rating: t.Number(),
  reviewCount: t.Number(),
  maxGuests: t.Number(),
  bedrooms: t.Number(),
  beds: t.Number(),
  bathrooms: t.Number(),
  images: t.Array(propertyImageSchema),
  amenities: t.Array(amenitySchema),
  isGuestFavorite: t.Boolean(),
  isWishlisted: t.Boolean(),
});

const paginationMetaSchema = t.Object({
  page: t.Number(),
  limit: t.Number(),
  total: t.Number(),
  totalPages: t.Number(),
  hasMore: t.Boolean(),
});

const apiErrorResponseSchema = t.Object({
  error: t.Object({
    code: t.String(),
    message: t.String(),
    details: t.Optional(t.Unknown()),
  }),
});

export const propertyCatalogModels = {
  catalogProperty: propertySchema,
  catalogLocation: locationSchema,
  catalogPropertyType: propertyTypeSchema,
  catalogHost: hostSchema,
  catalogAmenity: amenitySchema,
  catalogPropertyAmenity: propertyAmenitySchema,
  catalogPropertyImage: propertyImageSchema,
  catalogWishlistState: wishlistStateSchema,
  catalogPropertyListItem: propertyListItemSchema,
  catalogPropertyDetail: propertyDetailSchema,
  catalogPropertyListResponse: t.Object({
    data: t.Array(propertyListItemSchema),
    meta: paginationMetaSchema,
  }),
  catalogLocationsResponse: t.Array(locationSchema),
  catalogPropertyTypesResponse: t.Array(propertyTypeSchema),
  catalogAmenitiesResponse: t.Array(amenitySchema),
  catalogApiErrorResponse: apiErrorResponseSchema,
  catalogPropertyIdParams: t.Object({
    id: t.String(),
  }),
};

export type Property = typeof propertySchema.static;
export type Location = typeof locationSchema.static;
export type PropertyType = typeof propertyTypeSchema.static;
export type Host = typeof hostSchema.static;
export type Amenity = typeof amenitySchema.static;
export type PropertyImage = typeof propertyImageSchema.static;
export type PropertyAmenity = typeof propertyAmenitySchema.static;
export type WishlistState = typeof wishlistStateSchema.static;
export type PropertyListItem = typeof propertyListItemSchema.static;
export type PropertyDetail = typeof propertyDetailSchema.static;
export type ApiErrorResponse = typeof apiErrorResponseSchema.static;

export type SortOption =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "rating_desc";

export interface PropertyQueryParams {
  amenities?: string[];
  bathrooms?: number;
  bedrooms?: number;
  beds?: number;
  guests?: number;
  limit: number;
  location?: string;
  maxPrice?: number;
  minPrice?: number;
  page: number;
  search?: string;
  sort: SortOption;
  type?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
