import { createApp } from "./create-app";
import { createLocalPropertyCatalogRepository } from "./local-repository";

export const app = createApp(await createLocalPropertyCatalogRepository());

export type App = typeof app;
