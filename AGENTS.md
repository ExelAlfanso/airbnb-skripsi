# AGENTS.md

Repository-wide instructions for agents working in `behance-skripsi`.

## Required context before work

Before planning, reviewing, or changing anything in this repository:

1. Inventory and read every file under `docs/skripsi-docs/` completely. These thesis documents define the research question, scope, variables, and experimental method.
2. Read every other documentation artifact under `docs/` except the entire `docs/frontend-reference/` subtree. Also read `DESIGN.md` and `.agents/qa-project-context.md`.
3. Never open, inspect, list individually, process, or use files under `docs/frontend-reference/` unless the user explicitly asks for those references in the current task.
4. Read the task-relevant source, tests, configuration, package README, and nearest nested `AGENTS.md`. More-specific `AGENTS.md` files override this file within their directories.

Do not replace full document reading with summaries from another agent. Repeat this context pass when documentation changes during the task.

## Research purpose and invariants

This is a 2026 undergraduate thesis prototype comparing Vue 3 and Svelte 5 implementations of the same responsive, Airbnb-like property-listing experience. The comparison covers computational performance, resource efficiency, implementation complexity, user experience, and usability.

The Vue and Svelte applications are experimental treatments. The shared API, database, dataset, assets, information architecture, feature behavior, browser/device/network settings, viewport, cache policy, and test journeys are control variables.

Preserve these invariants:

- Keep the two frontends functionally and visually equivalent. A study-facing change to one frontend normally requires the equivalent change to the other in the same task.
- Use identical API contracts, dataset, image URLs, defaults, labels, workflows, loading/error/empty states, and accessibility outcomes unless the research design explicitly requires a difference.
- Keep framework-native implementations; do not force identical internal code when equivalent observable behavior is sufficient.
- Do not introduce an optimization to only one frontend and then present the result as a framework comparison. Record intentional asymmetry and its research consequence.
- The supported prototype journeys are catalog listing, property detail, search, filters, sorting, page-based load more, and session-local wishlist toggling.
- Authentication, payment, real booking, chat, dashboards, review submission, real-time calendars/maps, and persistent account wishlist are out of scope unless the user changes the thesis scope.
- Evaluate production builds under controlled, repeated conditions. Alternate framework run order and report a central value plus variability; do not infer conclusions from one run.
- Lighthouse TBT is a laboratory responsiveness proxy, not field INP. Scripted/session INP is not population field data. External image delivery is a shared source of variance.

## Current repository map

| Path                                  | Purpose                                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `apps/airbnb-vue-app`                 | Vue 3 + TypeScript + Vite frontend, served locally on port 3000.                                                |
| `apps/airbnb-svelte-app`              | Svelte 5 + TypeScript + Vite frontend, served locally on port 5173.                                             |
| `apps/api`                            | ElysiaJS API; Bun locally on port 3001 and Cloudflare Worker when deployed.                                     |
| `packages/db`                         | Drizzle schema, migrations, and deterministic catalog seed for SQLite-compatible Cloudflare D1.                 |
| `packages/r2`                         | R2/S3-compatible client utilities; not currently part of the deployed catalog because images use external URLs. |
| `tests/performance/k6`                | Shared API capacity profiles and equivalent frontend browser journey.                                           |
| `tests/performance/lighthouse`        | Lighthouse CI configuration and common performance budgets.                                                     |
| `docs/skripsi-docs`                   | Thesis proposal and research methodology; mandatory reading.                                                    |
| `docs/00-*.md` through `docs/06-*.md` | Early backend domain, contract, and architecture blueprint.                                                     |
| `DESIGN.md`                           | Allowed text design-system artifact and visual implementation source.                                           |

This is a pnpm 10 workspace. Root scripts orchestrate workspace packages; the API itself uses Bun. Formatting and static rules come from Ultracite/Biome, with Lefthook applying fixes to staged supported files.

## Source-of-truth rules

- The thesis proposal and accepted research constraints govern experiment design and parity.
- Executable source, tests, package manifests, current READMEs, migrations, and seed files govern the implemented system.
- The documents in `docs/00-*.md` through `docs/06-*.md` are an early blueprint. They still define the intended domain and API behavior, but their PostgreSQL statements are stale: the current implementation targets Cloudflare D1/SQLite through Drizzle, with an in-memory SQLite database for local API development.
- When documentation and implementation disagree, do not silently choose one. Preserve current behavior unless the task asks for a migration, and update or flag stale documentation as appropriate.
- `packages/db/schemas/index.ts` is the schema source; `packages/db/migrations/` is generated migration history; `packages/db/seeds/catalog.sql` is the deterministic shared dataset. Do not put catalog records in frontend or API source files.
- `apps/api` is the API-contract source. Frontends consume public types and the Eden client from `@airbnb-skripsi/api`; do not duplicate contract types locally.
- Use `DESIGN.md` for design decisions. The excluded `docs/frontend-reference/` files are not an agent input unless explicitly requested.

## Shared behavior contract

The API exposes `GET /health`, `/properties`, `/properties/:id`, `/locations`, `/property-types`, and `/amenities`.

For property queries, preserve:

- defaults: `page=1`, `limit=12`, `sort=recommended`;
- sort values: `recommended`, `price_asc`, `price_desc`, and `rating_desc`;
- case-insensitive search across property and location/type text;
- minimum-capacity filters and inclusive price bounds;
- AND semantics when multiple amenities are requested;
- deterministic sorting and pagination, with `limit <= 50`;
- consistent `{ error: { code, message, details? } }` errors;
- load more as the next API page appended with the same active query, reset to page 1 after query changes, and stopped by `meta.hasMore`;
- wishlist as shared list/detail state within one frontend session only, with no mutation endpoint or persistence requirement.

## Implementation rules

- Make the smallest scoped change that satisfies the task. Reuse existing patterns and dependencies; do not add speculative abstractions or packages.
- Preserve unrelated user changes and generated files. Never discard worktree changes or run destructive Git commands without explicit permission.
- For Vue work, use the repository `vue-best-practices` skill and Composition API with `<script setup lang="ts">`. Use the Vue testing skill when tests change.
- For Svelte work, follow `apps/airbnb-svelte-app/AGENTS.md` and the required Svelte skills/tools.
- For API work, follow `apps/api/AGENTS.md`, keep `src/app.ts` exporting `app` and `App`, keep runtime startup in `src/index.ts`, and keep Worker composition compatible with `src/worker.ts`.
- Keep HTTP concerns in Elysia modules, domain behavior in services, and persistence behind the repository contract.
- Schema changes require a reviewed migration and deterministic seed compatibility. Do not hand-edit Drizzle metadata or generated snapshots unless the migration workflow requires it.
- Do not provision, deploy, destroy, or load-test Cloudflare resources without explicit user authorization. Never target production implicitly; performance scripts must receive an explicit environment URL.
- Maintain semantic HTML, keyboard access, visible focus, useful accessible names, reduced-motion support, stable image dimensions, and mobile behavior.

## Commands and verification

Run the smallest relevant checks from the repository root. Do not claim a command passed unless it was run successfully.

After implementing any feature or fix:

1. Run `pnpm check`.
2. Run `pnpm fix`.
3. Run `pnpm check` again.
4. Resolve every reported error and repeat the sequence until the final `pnpm check` passes. Do not ignore or hand off unresolved errors; if an error is demonstrably pre-existing and outside the requested scope, document it explicitly.

```text
pnpm check
pnpm build
pnpm test:frontends
pnpm --filter @airbnb-skripsi/vue-app check
pnpm --filter @airbnb-skripsi/vue-app test
pnpm --filter @airbnb-skripsi/svelte-app check
pnpm --filter @airbnb-skripsi/svelte-app test
pnpm --filter @airbnb-skripsi/api check
pnpm --filter @airbnb-skripsi/api test
pnpm --filter @airbnb-skripsi/db check
pnpm --filter @airbnb-skripsi/r2 check
```

Use the performance commands documented in `tests/performance/README.md` only when performance measurement is in scope. Run both frontend configurations under identical conditions for comparative results.

Minimum handoff:

- summarize the behavior changed and files touched;
- list checks run and their results;
- identify any check not run and why;
- call out parity, methodology, documentation drift, or deployment risks that remain.
