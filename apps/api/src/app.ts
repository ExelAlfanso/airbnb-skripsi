import { Elysia } from "elysia";
import { propertyCatalogModule } from "./modules/property-catalog";
import { systemModule } from "./modules/system";

export const app = new Elysia({ name: "App" })
  .use(systemModule)
  .use(propertyCatalogModule);

export type App = typeof app;
