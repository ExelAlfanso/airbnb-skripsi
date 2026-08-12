import { Stack } from "alchemy";
import { D1, providers, state, Worker } from "alchemy/Cloudflare";
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
      primaryLocationHint: "apac",
    });

    const api = yield* Worker("Api", {
      main: "./src/worker.ts",
      compatibility: {
        date: "2026-08-12",
      },
      env: {
        DB: database,
      },
    });

    return {
      apiUrl: api.url,
      databaseId: database.databaseId,
      databaseName: database.databaseName,
    };
  })
);
