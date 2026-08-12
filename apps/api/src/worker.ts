import { drizzle } from "drizzle-orm/d1";
import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { createApp } from "./create-app";
import {
  catalogSchema,
  createPropertyCatalogRepository,
  type PropertyCatalogRepository,
} from "./modules/property-catalog/repository";

export interface CloudflareEnv {
  DB: D1Database;
}

type RepositoryFactory = (database: D1Database) => PropertyCatalogRepository;

export function createCloudflareWorker(
  createRepository: RepositoryFactory = (database) =>
    createPropertyCatalogRepository(
      drizzle(database, { schema: catalogSchema })
    )
) {
  const apps = new WeakMap<D1Database, ReturnType<typeof createWorkerApp>>();

  return {
    fetch(request: Request, env: CloudflareEnv) {
      let app = apps.get(env.DB);

      if (!app) {
        app = createWorkerApp(createRepository(env.DB));
        apps.set(env.DB, app);
      }

      return app.fetch(request);
    },
  };
}

function createWorkerApp(repository: PropertyCatalogRepository) {
  return new Elysia({ adapter: CloudflareAdapter })
    .use(createApp(repository))
    .compile();
}

export default createCloudflareWorker();
