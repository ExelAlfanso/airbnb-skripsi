import { drizzle } from "drizzle-orm/d1";
import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { createApp } from "./create-app";
import {
  catalogSchema,
  createPropertyCatalogRepository,
  type PropertyCatalogRepository,
} from "./modules/property-catalog/repository";

type RepositoryFactory = (database: D1Database) => PropertyCatalogRepository;

export function createCloudflareApp(
  database: D1Database,
  createRepository: RepositoryFactory = (binding) =>
    createPropertyCatalogRepository(drizzle(binding, { schema: catalogSchema }))
) {
  return new Elysia({ adapter: CloudflareAdapter })
    .use(createApp(createRepository(database)))
    .compile();
}
