# API deployment with Alchemy and Cloudflare

`apps/api` runs locally on Bun through `src/index.ts` and deploys to Cloudflare Workers through `src/worker.ts`. Both entrypoints reuse the same exported Elysia application.

## 1. Install dependencies

From the repository root:

```bash
pnpm install
```

## 2. Verify the API locally

```bash
cd apps/api
bun run check
bun test
```

## 3. Sign in to Cloudflare

Alchemy stores credentials in its profile directory. Do not add Cloudflare credentials to project environment files.

```bash
bun alchemy login --configure
```

## 4. Review the infrastructure plan

Use a separate stage for each developer or environment:

```bash
bun run infra:plan --stage dev_yourname
```

The first Alchemy command for a Cloudflare account can request permission to bootstrap its shared remote state store. That bootstrap creates Cloudflare resources, so review and approve the prompt deliberately.

## 5. Deploy the Worker

After reviewing the plan:

```bash
bun run infra:deploy --stage dev_yourname
```

Alchemy prints `apiUrl` after deployment. Verify it with:

```bash
curl https://your-worker-url/health
```

## 6. Run cloud-backed development

```bash
bun run infra:dev --stage dev_yourname
```

## 7. Remove a stage

This deletes resources managed by that stack stage:

```bash
bun run infra:destroy --stage dev_yourname
```

No custom domain, database binding, or R2 bucket is provisioned yet. Add each only when the API consumes it.
