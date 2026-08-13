import { Database } from "bun:sqlite";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/bun-sqlite";
import {
  catalogSchema,
  createPropertyCatalogRepository,
} from "./modules/property-catalog/repository";

export async function createLocalPropertyCatalogRepository() {
  const sqlite = new Database(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON;");

  const migrationsDirectory = fileURLToPath(
    new URL("../../../packages/db/migrations/", import.meta.url)
  );
  const migrationFiles = (await readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const migrationFile of migrationFiles) {
    sqlite.exec(
      await readFile(join(migrationsDirectory, migrationFile), "utf8")
    );
  }
  sqlite.exec(
    await readFile(
      fileURLToPath(
        new URL("../../../packages/db/seeds/catalog.sql", import.meta.url)
      ),
      "utf8"
    )
  );

  return createPropertyCatalogRepository(
    drizzle(sqlite, { schema: catalogSchema })
  );
}
