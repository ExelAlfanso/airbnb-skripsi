# QA Project Context

## Product

- **Name:** StayCompare / airbnb-skripsi.
- **Purpose:** Prototype penelitian skripsi untuk membandingkan implementasi frontend Vue dan Svelte pada pengalaman katalog properti yang identik.
- **Type:** Monorepo aplikasi web eksperimen dengan shared REST API.
- **Critical user journeys:**
  1. Pengguna membuka daftar properti dari dataset migrasi yang sama.
  2. Pengguna mencari properti berdasarkan teks.
  3. Pengguna memfilter lokasi, tipe, harga, kapasitas, dan amenitas.
  4. Pengguna mengurutkan hasil dan memuat halaman berikutnya.
  5. Pengguna membuka detail properti dan kembali ke hasil.
  6. Pengguna menambah atau menghapus wishlist lokal selama sesi.
- **Out of scope:** Autentikasi, booking, pembayaran, chat, dashboard host/admin, kalender realtime, dan peta realtime.

## Tech Stack

- **Monorepo/package manager:** pnpm workspaces 10.33.2.
- **Vue frontend:** Vue 3, TypeScript 5.9, Vite; path `apps/airbnb-vue-app`.
- **Svelte frontend:** Svelte 5 runes, TypeScript 5.9, Vite; path `apps/airbnb-svelte-app`.
- **Backend:** ElysiaJS REST API on Bun locally and Cloudflare Worker when deployed; path `apps/api`.
- **Typed client:** Eden Treaty factory exported by `@airbnb-skripsi/api/client`.
- **Database/ORM:** Cloudflare D1 (SQLite) with Drizzle ORM; schema and deterministic dummy data under `packages/db`.
- **Infrastructure:** Alchemy provisions the Worker, D1 resource, migrations, and `DB` binding. R2 is intentionally absent while images remain external URLs.
- **CDN/edge:** Cloudflare Worker edge runtime. Monitoring is not configured.

## Test Stack

### Vue

- **Unit/integration:** Vitest with jsdom and Vue Test Utils.
- **Config:** `apps/airbnb-vue-app/vitest.config.ts`.
- **Tests:** Co-located `*.test.ts` files under `apps/airbnb-vue-app/src`.

### Svelte

- **Unit/integration:** Vitest with jsdom and Svelte Testing Library.
- **Config:** `apps/airbnb-svelte-app/vitest.config.ts`.
- **Tests:** Co-located `*.test.ts` files under `apps/airbnb-svelte-app/src`.

### API and data

- **API:** Bun test under `apps/api/test`.
- **Data:** Drizzle migration validation against SQLite/D1-compatible SQL.

### Performance

- **Backend/system capacity:** Grafana k6 scripts under `tests/performance/k6`.
- **Frontend lab performance:** Lighthouse CI configs under `tests/performance/lighthouse`.
- **E2E browser suite:** None selected; current integration scope is component-level.

## CI/CD

- No GitHub Actions workflow is currently present.
- Required local gates are type checks, unit/integration tests, production builds, k6 thresholds against an explicitly selected environment, and Lighthouse budgets for both production previews.
- k6 and Lighthouse result artifacts are not yet retained by CI.
- Cloudflare deployment is manual through Alchemy scripts; infrastructure plans are reviewable before deploy.

## Environments

- **Local API:** `http://localhost:3001`.
- **Local Vue:** `http://localhost:3000`.
- **Local Svelte:** `http://localhost:5173`.
- **Staging/load-test:** No URL assigned. Load/stress/soak tests must target a dedicated stage when one exists.
- **Production:** No URL assigned.
- **Data parity:** All environments should apply the same deterministic Drizzle migrations. Frontends use the same API URL through `VITE_API_URL`.

## Quality Goals

- Unit/integration suites for each frontend complete in under 3 minutes.
- Zero accepted test failures and less than 2% flakiness.
- k6 baseline thresholds: failed requests below 1%, p95 below 500 ms, and p99 below 1000 ms.
- Lighthouse lab gates per frontend: LCP at most 2500 ms, CLS at most 0.1, TBT at most 200 ms, and performance score at least 0.90.
- Lighthouse TBT is only a lab responsiveness proxy. Real INP requires CrUX or RUM after public deployment.
- Initial coverage target: at least 60% for framework-independent catalog logic; component tests prioritize critical behavior over snapshots.

## Risk Areas

| Area | Risk level | Business/research impact | Notes |
| --- | --- | --- | --- |
| Framework parity | Critical | Invalidates the Vue versus Svelte comparison | Journeys, dataset, styling, API, and production conditions must remain equivalent. |
| Cloudflare/D1 binding | Critical | Frontends cannot load controlled data | Worker must receive the exact Alchemy-provisioned `DB` binding and migrations. |
| Performance methodology | Critical | Produces misleading thesis conclusions | k6 measures shared backend/system capacity, not frontend framework performance. |
| Async list/detail states | Important | Breaks primary participant journeys | Cover loading, error, empty, pagination, stale response, and retry behavior. |
| External images | Important | Adds network variance to Lighthouse | Use identical URLs and repeated runs; document third-party variance. |
| Local wishlist state | Monitor | Can create cross-view inconsistency | User changes must survive list/detail navigation but need not persist across sessions. |

## Team

- Team headcount and dedicated QA staffing are not documented.
- Current operating model is developer-owned automation with no separate manual regression team.
- Thesis owner approves methodology, environment selection, and any production load-test coordination.

## Conventions

- Branches and PRs use a linear `gh-stack` chain based on `dev`.
- Tests are co-located and named `*.test.ts`.
- Prefer semantic roles, labels, and visible text for component queries; use stable test IDs only when no semantic selector exists.
- Mock the shared catalog boundary in component integration tests; API behavior itself is covered by API tests.
- Dummy catalog data comes only from versioned Drizzle migrations under `packages/db/migrations`.
- Performance scripts take target URLs from environment variables and never silently target production.
- Compare production builds with identical browser, network/CPU profile, API stage, dataset, cache policy, route, and run count.
