# AGENTS.md

Panduan kerja multi-agent untuk backend `apps/api`.

## Project Context

- Runtime: Bun.
- Framework: ElysiaJS.
- Language: TypeScript ESM.
- App export: `src/app.ts` exports `app` and `type App` for Eden/client type sharing.
- Runtime entrypoint: `src/index.ts` only starts the Bun server.
- Validation command: `bun run check`.

## Required Skill Order

Before planning, reviewing, or changing code under `apps/api`:

1. Read `.agents/skills/elysiajs/SKILL.md` completely.
2. Read the ElysiaJS references routed by that skill for the current task. For Cloudflare work, this includes `integrations/cloudflare-worker.md`; for deployment changes, also read `references/deployment.md` and `references/testing.md`.
3. Use `$ponytail` to keep the implementation minimal, reuse existing code, and avoid speculative infrastructure or dependencies.
4. Use `$caveman` for concise agent updates and handoffs. Keep source code, comments, documentation, commit messages, and pull request text in normal professional prose.

Do not start ElysiaJS implementation work until the required skill and task-specific references have been read. When local guidance and current official documentation differ, verify the latest official ElysiaJS documentation before changing code.

## Shared Rules

- Keep changes scoped to this API package unless the task explicitly says otherwise.
- Do not move server startup logic out of `src/index.ts`.
- Keep `src/app.ts` as the composition root for Elysia plugins/modules.
- Preserve exported `type App = typeof app` whenever touching `src/app.ts`.
- Prefer feature-based modules under `src/modules/<feature>/`.
- Do not add dependencies unless the task clearly requires them.
- Do not edit `.env`, `bun.lock`, or generated files unless required by the task.
- Before finishing, run `bun run check` when TypeScript code changed.

## Architecture Convention

Use this shape for new backend features:

```text
src/modules/<feature>/
  index.ts    # Elysia controller/routes
  service.ts  # business logic, no full Elysia Context
  model.ts    # TypeBox schemas and inferred TypeScript types
```

Controller rules:

- One feature module should export one Elysia instance, for example `<feature>Module`.
- Handlers should destructure only the context fields they use.
- Register request/response schemas with Elysia models where practical.
- Use referenced models for route schemas instead of duplicating inline schemas repeatedly.

Service rules:

- Services should not accept the full Elysia `Context`.
- Keep service methods stateless unless a dependency is explicitly injected.
- Prefer returning typed DTOs from `model.ts`.

Model rules:

- Runtime schema and TypeScript type must come from the same source.
- Export schemas and inferred types together.
- Avoid separate manual interfaces that can drift from validation schemas.

## Suggested Agent Roles

### Planner Agent

Use when the task is broad or touches multiple files.

Responsibilities:

- Read current repo structure and relevant files.
- Identify behavior that must remain compatible.
- Produce a short implementation plan with target files and verification commands.
- Call out assumptions and risky migrations before implementation.

### Backend Agent

Use for Elysia routes, services, validation, and app composition.

Responsibilities:

- Implement feature modules using the architecture convention above.
- Keep route behavior compatible unless the task requests a breaking change.
- Keep HTTP concerns in controllers and business logic in services.
- Update `src/app.ts` only as the app composition root.

### Test Agent

Use whenever behavior changes or a route is added.

Responsibilities:

- Add focused tests with `bun:test` when the repo has or needs tests.
- Test via `app.handle(new Request(...))` for route behavior.
- Cover success paths and relevant error/unknown route behavior.
- Run `bun run check` and `bun test` when tests exist.

### Review Agent

Use before handoff or PR creation.

Responsibilities:

- Review diffs for regressions, broken exports, missing validation, and missing tests.
- Confirm no unrelated files were changed.
- Summarize changed files and verification results.
- Flag unresolved risks instead of hiding them.

## Handoff Format

When one agent hands work to another, include:

```text
Goal:
Current state:
Files changed:
Commands run:
Verification result:
Open questions or risks:
Next recommended step:
```

## Git Safety

- Never run `git reset --hard` or discard user changes unless explicitly requested.
- Check the worktree before committing or publishing.
- If unrelated user changes exist, leave them alone and mention them in handoff.
- Commit only the files relevant to the task.

## Done Criteria

A task is done when:

- The requested behavior or file exists.
- TypeScript compiles for changed code.
- Relevant tests pass or the reason tests were not run is documented.
- The final summary names changed files and commands run.
