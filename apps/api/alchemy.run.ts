import { Stack } from "alchemy";
import { D1, providers, state, Website, Worker } from "alchemy/Cloudflare";
import { gen } from "effect/Effect";

export default Stack(
  "airbnb-skripsi-api",
  {
    providers: providers(),
    state: state(),
  },
  gen(function* () {
    const database = yield* D1.Database("CatalogDatabase", {
      migrationsDir: "../../packages/db/migrations",
      importFiles: ["../../packages/db/seeds/catalog.sql"],
      primaryLocationHint: "apac",
    });

    const api = yield* Worker("Api", {
      main: "./src/worker.ts",
      domain: "airbnb-skripsi-api.alfanso.xyz",
      workersDev: false,
      compatibility: {
        date: "2026-08-12",
      },
      env: {
        DB: database,
      },
    });
    const prototypeA = yield* Website.Vite("PrototypeA", {
      rootDir: "../airbnb-vue-app",
      domain: "airbnb-skripsi-a.alfanso.xyz",
      workersDev: false,
      env: {
        VITE_API_URL: api.url.as<string>(),
      },
      assets: {
        htmlHandling: "auto-trailing-slash",
        notFoundHandling: "single-page-application",
      },
    });

    const prototypeB = yield* Website.Vite("PrototypeB", {
      rootDir: "../airbnb-svelte-app",
      domain: "airbnb-skripsi-b.alfanso.xyz",
      workersDev: false,
      env: {
        VITE_API_URL: api.url.as<string>(),
      },
      assets: {
        htmlHandling: "auto-trailing-slash",
        notFoundHandling: "single-page-application",
      },
    });
    const prototypeC = yield* Website.Vite("PrototypeC", {
      rootDir: "../airbnb-react-app",
      domain: "airbnb-skripsi-c.alfanso.xyz",
      workersDev: false,
      env: {
        VITE_API_URL: api.url.as<string>(),
      },
      assets: {
        htmlHandling: "auto-trailing-slash",
        notFoundHandling: "single-page-application",
      },
    });

    return {
      apiUrl: api.url,
      databaseId: database.databaseId,
      prototypeA: prototypeA.url,
      prototypeB: prototypeB.url,
      prototypeC: prototypeC.url,
      databaseName: database.databaseName,
    };
  })
);
