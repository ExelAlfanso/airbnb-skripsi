import {
  amenities,
  hosts,
  locations,
  properties,
  propertyAmenities,
  propertyImages,
  propertyTypes,
  wishlistStates,
} from "./data";
import type {
  Amenity,
  Host,
  Location,
  Property,
  PropertyAmenity,
  PropertyImage,
  PropertyType,
  WishlistState,
} from "./model";

export interface PropertyCatalogSnapshot {
  amenities: Amenity[];
  hosts: Host[];
  locations: Location[];
  properties: Property[];
  propertyAmenities: PropertyAmenity[];
  propertyImages: PropertyImage[];
  propertyTypes: PropertyType[];
  wishlistStates: WishlistState[];
}

export function getPropertyCatalogSnapshot(): PropertyCatalogSnapshot {
  return {
    properties,
    locations,
    propertyTypes,
    hosts,
    amenities,
    propertyAmenities,
    propertyImages,
    wishlistStates,
  };
}

export function listLocations(): Location[] {
  return [...locations];
}

export function listPropertyTypes(): PropertyType[] {
  return [...propertyTypes];
}

export function listAmenities(): Amenity[] {
  return [...amenities];
}

export function findPropertyById(id: string): Property | undefined {
  return properties.find((property) => property.id === id);
}
