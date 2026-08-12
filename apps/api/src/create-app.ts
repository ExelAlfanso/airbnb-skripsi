import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { createPropertyCatalogModule } from "./modules/property-catalog";
import type { PropertyCatalogRepository } from "./modules/property-catalog/repository";
import { systemModule } from "./modules/system";

export function createApp(repository: PropertyCatalogRepository) {
  return new Elysia({ name: "App" })
    .use(
      cors({
        credentials: false,
        methods: ["GET", "OPTIONS"],
        origin: true,
      })
    )
    .use(systemModule)
    .use(createPropertyCatalogModule(repository));
}
