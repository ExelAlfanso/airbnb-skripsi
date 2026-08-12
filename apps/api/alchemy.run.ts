import { Stack } from "alchemy";
import { providers, state, Worker } from "alchemy/Cloudflare";
import { gen } from "effect/Effect";

export default Stack(
  "airbnb-skripsi-api",
  {
    providers: providers(),
    state: state(),
  },
  gen(function* () {
    const api = yield* Worker("Api", {
      main: "./src/worker.ts",
      compatibility: {
        date: "2026-08-12",
      },
    });

    return {
      apiUrl: api.url,
    };
  })
);
