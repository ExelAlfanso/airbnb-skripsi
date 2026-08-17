import { resolve } from "node:path";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: false,
  outputDir: resolve("artifacts/inp/playwright"),
  reporter: "list",
  testDir: ".",
  testMatch: "inp.spec.ts",
  timeout: 180_000,
  workers: 1,
  use: {
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "node run-inp.cjs serve-api",
      reuseExistingServer: false,
      timeout: 60_000,
      url: "http://127.0.0.1:3101/health",
    },
    {
      command:
        "pnpm --filter @airbnb-skripsi/vue-app exec vite preview --host 127.0.0.1 --port 3100",
      reuseExistingServer: false,
      timeout: 60_000,
      url: "http://127.0.0.1:3100/",
    },
    {
      command:
        "pnpm --filter @airbnb-skripsi/svelte-app exec vite preview --host 127.0.0.1 --port 5174",
      reuseExistingServer: false,
      timeout: 60_000,
      url: "http://127.0.0.1:5174/",
    },
  ],
});
