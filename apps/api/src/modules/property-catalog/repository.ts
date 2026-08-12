import {
  amenities,
  hosts,
  locations,
  properties,
  propertyAmenities,
  propertyImages,
  propertyTypes,
  wishlistStates,
} from "@airbnb-skripsi/db";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type { DrizzleD1Database } from "drizzle-orm/d1";
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

export interface PropertyCatalogRepository {
  getSnapshot(): Promise<PropertyCatalogSnapshot>;
}

export const catalogSchema = {
  amenities,
  hosts,
  locations,
  properties,
  propertyAmenities,
  propertyImages,
  propertyTypes,
  wishlistStates,
};

type CatalogDatabase =
  | BunSQLiteDatabase<typeof catalogSchema>
  | DrizzleD1Database<typeof catalogSchema>;

export function createPropertyCatalogRepository(
  database: CatalogDatabase
): PropertyCatalogRepository {
  return {
    async getSnapshot() {
      const [
        amenityRows,
        hostRows,
        locationRows,
        propertyRows,
        propertyAmenityRows,
        propertyImageRows,
        propertyTypeRows,
        wishlistStateRows,
      ] = await Promise.all([
        database.select().from(amenities),
        database.select().from(hosts),
        database.select().from(locations),
        database.select().from(properties),
        database.select().from(propertyAmenities),
        database.select().from(propertyImages),
        database.select().from(propertyTypes),
        database.select().from(wishlistStates),
      ]);

      return {
        amenities: amenityRows,
        hosts: hostRows,
        locations: locationRows,
        properties: propertyRows,
        propertyAmenities: propertyAmenityRows,
        propertyImages: propertyImageRows,
        propertyTypes: propertyTypeRows,
        wishlistStates: wishlistStateRows,
      };
    },
  };
}
