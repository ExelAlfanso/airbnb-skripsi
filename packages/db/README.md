# Database

This package is the single source of truth for the shared property catalog.
It targets SQLite-compatible Cloudflare D1 through Drizzle ORM.

## Layout

- `schemas/index.ts` contains the Drizzle schema.
- `migrations/` contains ordered SQL migrations.
- The initial migration includes the deterministic dummy dataset used by both
  frontends.

The migration provides identical initial wishlist values to both frontends.
Wishlist toggles remain local browser state and are never written back to D1.

## Change the schema

1. Edit `schemas/index.ts`.
2. Run `pnpm --filter @airbnb-skripsi/db generate` from the repository root.
3. Review the generated SQL.
4. Do not add catalog records to application source files; add deterministic
   data through a migration.
