# Lighthouse frontend performance guide

Lighthouse CI is the controlled lab gate for each production frontend build. It does not measure field INP; TBT is the lab responsiveness proxy, while real INP requires CrUX or RUM after public deployment.

## 1. Run functional gates first

```sh
pnpm test:frontends
pnpm --filter @airbnb-skripsi/api test
```

Both frontend suites cover the same journey: initial list, search, local wishlist, and detail.

## 2. Run Lighthouse CI

Each command builds the target app, starts the local API plus production preview, performs three desktop runs, enforces the same budgets against the median, and writes ignored artifacts under `artifacts/lighthouse`.

```sh
pnpm perf:lighthouse:vue
pnpm perf:lighthouse:svelte
pnpm perf:lighthouse:react
```

Budgets:

| Metric                   |                 Gate |
| ------------------------ | -------------------: |
| Performance score        |        at least 0.90 |
| LCP                      |      at most 2500 ms |
| CLS                      |         at most 0.10 |
| TBT                      |       at most 200 ms |
| Time to Interactive      |      at most 5000 ms |
| JavaScript transfer size | warning above 150 KB |

## 3. Run scripted INP scenarios

The Playwright harness builds and starts the Vue and Svelte production apps with the same API, then measures search submission, advanced-filter amenity selection, and wishlist toggling. Each scenario runs three times per framework on a fresh 390x844 browser context with 4x CPU throttling. Framework order alternates and scenario order rotates between runs.

```sh
pnpm perf:inp
```

Raw Event Timing entries and median/IQR summaries are written to `artifacts/inp/results.json`. Values marked `belowReportingThreshold` were below the Event Timing API's 16 ms reporting threshold and are conservatively recorded as 16 ms.

This is scripted session INP under controlled laboratory conditions, not population field INP. Use CrUX or RUM after a public deployment for field INP.

## 4. Keep the comparison controlled

For Vue and Svelte, keep the following identical:

- commit and migration dataset;
- local API and its D1-compatible dataset;
- browser/Chrome version;
- machine, CPU/network throttle, viewport, and cache policy;
- route;
- run count and run order;
- external image URLs.

Alternate framework run order and report median plus variability across repeated runs. External Unsplash delivery can add variance, so record it as a limitation rather than attributing every difference to a framework.
