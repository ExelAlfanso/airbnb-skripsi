# Database

This package is the single source of truth for the shared property catalog.
It targets SQLite-compatible Cloudflare D1 through Drizzle ORM.

## Layout

- `schemas/index.ts` contains the Drizzle schema.
- `migrations/` contains ordered SQL migrations.
- The initial migration includes the deterministic dummy dataset used by both
  frontends.

Wishlist state is intentionally absent from D1. It is local browser state and
is reset independently for each frontend experiment.

## Change the schema

1. Edit `schemas/index.ts`.
2. Run `pnpm --filter @airbnb-skripsi/db generate` from the repository root.
3. Review the generated SQL.
4. Do not add catalog records to application source files; add deterministic
   data through a migration.
