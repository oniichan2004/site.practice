# Environment Variable Rules

## 1. Single Source of Truth

EVERY environment variable used in `apps/*` or `packages/*` MUST be declared and validated in `packages/env/src/web.ts` and consumed through the `@travel/env/web` export. No exceptions for application code.

```typescript
// ✅ Correct — typed, validated, throws early if missing
import { env } from "@travel/env/web";

const url = env.NEXT_PUBLIC_WEBSITE_URL;

// ❌ Wrong — bypasses validation, untyped, silently `undefined`
const url = process.env.NEXT_PUBLIC_WEBSITE_URL;

// ❌ Wrong — non-null assertion hiding an undefined
const url = process.env.NEXT_PUBLIC_WEBSITE_URL!;
```

## 2. Allowed Direct `process.env` Reads

`process.env` may ONLY be read directly in these narrow cases:

- `process.env.NODE_ENV` inside dev-only guards — Zustand `logger` / `devtools`, conditional dev tooling. Next.js inlines it at build time and the env package is not always importable in those files.
- `process.env.SKIP_ENV_VALIDATION` inside `packages/env/src/*.ts` only.
- Inside `packages/env/src/*.ts` where the schema maps values into `runtimeEnv`.

Any other `process.env.X` read in `apps/*` or `packages/*` is a bug — add the variable to the schema and import from `@travel/env/web`.

## 3. Adding a New Environment Variable

Three steps, all required, in this exact order:

1. **Declare in the schema** — add the key to either `server` or `client` in `packages/env/src/web.ts` with a Zod validator and a meaningful error message.
2. **Map in `runtimeEnv`** — mirror the key in the `runtimeEnv` object (`KEY: process.env.KEY`). Missing this step causes Next.js to strip the value from the edge/client bundle.
3. **Set the value** — add the real value to `.env.local` (dev), CI secrets, and the deployment target (prod). Never commit `.env.local`.

Skipping any of these steps — even temporarily — is an error.

## 4. Server vs Client Split

- **`server` block** — secrets, private keys, DB URLs. MUST NOT carry the `NEXT_PUBLIC_` prefix. Reading them from a client component throws via `onInvalidAccess`.
- **`client` block** — values safe to ship to the browser (public URLs, public keys, feature flags). MUST be prefixed with `NEXT_PUBLIC_` — `@t3-oss/env-nextjs` enforces this at the type level.
- NEVER move a secret into the `client` block to "make it accessible". If the browser needs it, it isn't a secret — expose it via a server action or route handler instead.

```typescript
// ✅ Correct
server: {
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  API_SECRET: z.string().min(32, "API_SECRET must be at least 32 chars"),
},
client: {
  NEXT_PUBLIC_WEBSITE_URL: z.string().url("NEXT_PUBLIC_WEBSITE_URL must be a valid URL"),
  NEXT_PUBLIC_MAPS_KEY: z.string().min(1, "NEXT_PUBLIC_MAPS_KEY is required"),
},

// ❌ Wrong — secret in the client block, exposed to the browser
client: {
  NEXT_PUBLIC_DATABASE_PASSWORD: z.string(),
},

// ❌ Wrong — missing NEXT_PUBLIC_ prefix in client block (type error)
client: {
  WEBSITE_URL: z.string().url(),
},
```

## 5. Zod Schema Conventions

- ALWAYS include a meaningful error message: `.url("X must be a valid URL")`, `.min(1, "X is required")`
- Prefer `.default(...)` over `.optional()` when a sensible default exists
- Use `z.coerce.number()` for numeric vars (env values are always strings)
- Use `z.enum([...])` for constrained choices (modes, regions, log levels)
- Keep `emptyStringAsUndefined: true` so `KEY=` is treated as missing, not as `""`

```typescript
// ✅ Correct
server: {
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
},
```

## 6. No Unused Variables

- Every key in the schema MUST be read somewhere in `apps/*` or `packages/*` — verify with a workspace-wide grep before adding it.
- Remove keys that were added speculatively and are not referenced — they create noise and cause build failures when the value is missing in CI.
- If a variable is only needed by one app, still declare it in the shared schema — but confirm it is actually imported there.

## 7. Importing `env` in the Right Place

- **Server code** (server components, route handlers, server actions, middleware) — may import `env` freely; all keys are accessible.
- **Client components** (`"use client"`) — may import `env` but may ONLY read `NEXT_PUBLIC_*` keys; any `server` key throws at runtime.
- Import `env` at the **module top level**, never inside render functions or callbacks — env reads must not live in reactive scopes.
- Import only from the public entry `@travel/env/web` — NEVER reach into `@travel/env/src/...` or re-export `env` from app-level barrels.

```typescript
// ✅ Correct — module-level import, public entry
import { env } from "@travel/env/web";

export default function Layout() {
  return <meta property="og:url" content={env.NEXT_PUBLIC_WEBSITE_URL} />;
}

// ❌ Wrong — deep import bypassing the package boundary
import { env } from "@travel/env/src/web";

// ❌ Wrong — env read inside render / effect
function Component() {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  // ...
}
```

## 8. Adding a New Env Entry Point

Today the only entry is `@travel/env/web` for the Next.js app. When a new runtime appears (e.g. a Node worker, a CLI):

- Add a sibling file in `packages/env/src/` (e.g. `node.ts`) with its own `createEnv` call and its own schema — do NOT reuse `web.ts`.
- Export it in `packages/env/package.json` under a new subpath (e.g. `./node`).
- Consumers import from the subpath that matches their runtime; never mix runtimes in a single schema.
