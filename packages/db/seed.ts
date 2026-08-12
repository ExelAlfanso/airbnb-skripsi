import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  amenities,
  hosts,
  locations,
  properties,
  propertyAmenities,
  propertyImages,
  propertyTypes,
  wishlistStates,
} from "../../apps/api/src/modules/property-catalog/data";
import {
  amenities as amenitiesTable,
  hosts as hostsTable,
  locations as locationsTable,
  properties as propertiesTable,
  propertyAmenities as propertyAmenitiesTable,
  propertyImages as propertyImagesTable,
  propertyTypes as propertyTypesTable,
  wishlistStates as wishlistStatesTable,
} from "./schemas";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);

  try {
    await db.insert(locationsTable).values(locations).onConflictDoNothing();
    await db
      .insert(propertyTypesTable)
      .values(propertyTypes)
      .onConflictDoNothing();
    await db.insert(hostsTable).values(hosts).onConflictDoNothing();
    await db.insert(amenitiesTable).values(amenities).onConflictDoNothing();
    await db
      .insert(propertiesTable)
      .values(
        properties.map(({ createdAt, rating, updatedAt, ...property }) => ({
          ...property,
          createdAt: new Date(createdAt),
          rating: rating.toFixed(2),
          updatedAt: new Date(updatedAt),
        }))
      )
      .onConflictDoNothing();
    await db
      .insert(propertyImagesTable)
      .values(propertyImages)
      .onConflictDoNothing();
    await db
      .insert(propertyAmenitiesTable)
      .values(propertyAmenities)
      .onConflictDoNothing();
    await db
      .insert(wishlistStatesTable)
      .values(wishlistStates)
      .onConflictDoNothing();
  } finally {
    await pool.end();
  }
}

main();
