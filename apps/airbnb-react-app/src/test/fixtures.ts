import type {
  PaginatedResponse,
  PropertyDetail,
  PropertyListItem,
} from "@airbnb-skripsi/api/catalog";
import type { CatalogOptions } from "../catalog";

export const catalogOptions: CatalogOptions = {
  amenities: [{ iconName: "wifi", id: "amenity_wifi", name: "Wi-Fi" }],
  locations: [
    {
      city: "Bandung",
      country: "Indonesia",
      displayName: "Bandung, Jawa Barat",
      id: "loc_bandung",
      province: "Jawa Barat",
    },
  ],
  propertyTypes: [{ id: "type_villa", name: "Villa", slug: "villa" }],
};

export const property: PropertyListItem = {
  bathrooms: 2,
  bedrooms: 2,
  beds: 3,
  coverImage: {
    altText: "Villa di perbukitan Bandung",
    id: "image_1",
    imageUrl: "https://images.unsplash.com/photo-test",
    isCover: true,
    propertyId: "prop_001",
    sortOrder: 1,
  },
  id: "prop_001",
  isGuestFavorite: true,
  isWishlisted: false,
  location: catalogOptions.locations[0],
  maxGuests: 4,
  pricePerNight: 1_250_000,
  propertyType: catalogOptions.propertyTypes[0],
  rating: 4.9,
  reviewCount: 125,
  slug: "villa-bandung",
  title: "Villa Tenang di Bandung",
};

export const propertyPage: PaginatedResponse<PropertyListItem> = {
  data: [property],
  meta: { hasMore: false, limit: 4, page: 1, total: 1, totalPages: 1 },
};

export const propertyDetail: PropertyDetail = {
  amenities: catalogOptions.amenities,
  bathrooms: property.bathrooms,
  bedrooms: property.bedrooms,
  beds: property.beds,
  description: "Tempat tenang dengan pemandangan perbukitan.",
  host: {
    avatarUrl: "https://images.unsplash.com/avatar-test",
    id: "host_1",
    isSuperhost: true,
    joinedYear: 2020,
    name: "Ayu",
  },
  id: property.id,
  images: property.coverImage ? [property.coverImage] : [],
  isGuestFavorite: property.isGuestFavorite,
  isWishlisted: property.isWishlisted,
  location: property.location,
  maxGuests: property.maxGuests,
  pricePerNight: property.pricePerNight,
  propertyType: property.propertyType,
  rating: property.rating,
  reviewCount: property.reviewCount,
  slug: property.slug,
  title: property.title,
};
