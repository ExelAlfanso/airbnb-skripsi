# Performance test guide

These tests preserve the experiment boundary:

- k6 HTTP measures the shared Cloudflare Worker, D1, edge, WAF, and network path.
- k6 browser runs the same scripted journey against Vue or Svelte.
- Lighthouse CI is the controlled lab gate for each production frontend build.
- Standard Lighthouse does not measure field INP. TBT is the lab proxy; real INP requires CrUX or RUM after a public deployment.

## 1. Run functional gates first

```sh
pnpm test:frontends
pnpm --filter @airbnb-skripsi/api test
```

Both frontend suites cover the same journey: initial list, search, local wishlist, and detail.

## 2. Choose an API environment

Local smoke test:

```sh
pnpm dev:api
pnpm perf:k6:api
```

Cloudflare capacity test:

1. Deploy a dedicated Alchemy stage, not production.
2. Confirm the plan contains the Worker, D1 database, migrations, and `DB` binding.
3. Pass the deployed Worker URL explicitly.

```sh
pnpm --filter @airbnb-skripsi/api infra:plan --stage load-test
pnpm --filter @airbnb-skripsi/api infra:deploy --stage load-test
k6 run -e API_BASE_URL=https://api-load-test.example.workers.dev tests/performance/k6/api-baseline.js
```

A Cloudflare result is valid for the deployed system, not isolated Elysia code. It includes edge routing, WAF/rate limits, Worker CPU limits, D1 latency, and the selected Cloudflare plan. Record the Alchemy stage, region, dataset size, warm-up policy, and test time with every result.

Never load-test production without operations coordination. R2 is not part of this system while catalog images use external URLs.

## 3. Run API profiles

```sh
# Normal expected traffic
k6 run -e API_BASE_URL=http://localhost:3001 tests/performance/k6/api-baseline.js

# Find degradation under increasing traffic
k6 run -e API_BASE_URL=https://dedicated-stage.example tests/performance/k6/api-stress.js

# Detect sustained-resource degradation; defaults to 30 minutes and 20 VUs
k6 run -e API_BASE_URL=https://dedicated-stage.example \
  -e SOAK_DURATION=2h -e SOAK_VUS=20 tests/performance/k6/api-soak.js

# Assert recovery after a spike
k6 run -e API_BASE_URL=https://dedicated-stage.example tests/performance/k6/api-spike.js
```

Baseline budgets are p95 below 500 ms, p99 below 1000 ms, and failed requests below 1%. Recalibrate load levels after a measured baseline; do not invent thesis traffic claims from the default VU counts.

## 4. Run the same k6 browser journey per frontend

Build the target frontend, then start the API and its production preview:

```sh
pnpm --filter @airbnb-skripsi/vue-app build
pnpm --parallel --filter @airbnb-skripsi/api --filter @airbnb-skripsi/vue-app start
```

In another terminal:

```sh
pnpm perf:k6:vue
```

Repeat with Svelte:

```sh
pnpm --filter @airbnb-skripsi/svelte-app build
pnpm --parallel --filter @airbnb-skripsi/api --filter @airbnb-skripsi/svelte-app start
pnpm perf:k6:svelte
```

The browser script searches, toggles wishlist, opens detail, and collects k6 browser LCP, CLS, and scripted INP. Scripted INP is a repeatable lab proxy, not field INP.

## 5. Run Lighthouse CI

Each command builds the target app, starts the local API plus production preview, performs three desktop runs, enforces the same budgets against the median, and writes ignored artifacts under `artifacts/lighthouse`.

```sh
pnpm perf:lighthouse:vue
pnpm perf:lighthouse:svelte
```

Budgets:

| Metric | Gate |
| --- | ---: |
| Performance score | at least 0.90 |
| LCP | at most 2500 ms |
| CLS | at most 0.10 |
| TBT | at most 200 ms |
| Time to Interactive | at most 5000 ms |
| JavaScript transfer size | warning above 150 KB |

## 6. Keep the comparison controlled

For Vue and Svelte, keep the following identical:

- commit and migration dataset;
- API stage and D1 binding;
- browser/Chrome version;
- machine, CPU/network throttle, viewport, and cache policy;
- route and scripted journey;
- run count and run order;
- external image URLs.

Alternate framework run order and report median plus variability across repeated runs. External Unsplash delivery can add variance, so record it as a limitation rather than attributing every difference to a framework.
