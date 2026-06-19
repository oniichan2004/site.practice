# API & Data Layer Rules (oRPC + TanStack Query)

> Loaded every session via the `@.claude/rules/api.md` import in `CLAUDE.md`.
> Claude Code has **no** native rule auto-loader (no `trigger:` / `globs:` like
> Cursor/Windsurf) — this file is active only because it is imported. All project
> rules live in `.claude/rules/` (the source of truth) and are imported the same way.

This repo talks to the DAX admin backend through an **oRPC** contract, surfaced as
typed TanStack Query utilities. Follow these patterns — do not invent new clients.

## 1. The contract is the source of truth

- All API types and the router contract come from `@repo/api` (which re-exports
  `@daxsystem/admin-api-contract` plus the oRPC runtime).
- **Never hand-write request/response types.** Import them from `@/lib/api/types`
  (which re-exports from `@repo/api`), or derive with
  `Awaited<ReturnType<typeof client.x>>`. This is `core/typescript-strict.md` §3.
- If a type is missing, add it to the contract package — never redeclare it locally.

## 2. Client-side data — use `apiContracts`

`apiContracts` (from `@/lib/api/client`) is the single TanStack Query entry point,
built with `createTanstackQueryUtils(adminClient)`.

```tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { apiContracts } from "@/lib/api/client";

const { data, isLoading, isError } = useQuery({
  ...apiContracts.trips.list.queryOptions({ input: { orgId } }),
});
```

- Query options: `apiContracts.<resource>.<procedure>.queryOptions({ input })`
- Query key (for invalidation): `apiContracts.<resource>.<procedure>.key() as QueryKey`
- Follow `nextjs/data-fetching.md`: always handle loading / error / empty, and
  prefer `skipToken` over `enabled: false` for conditional queries.

## 3. Mutations — named clients + invalidate by key

Call the named client inside `mutationFn`; invalidate affected lists via `.key()`.

```tsx
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (data: InviteDriverValues) =>
    invitationClient.inviteDriver({ ...data, orgId }),
  onSuccess: () => {
    void queryClient.invalidateQueries({
      queryKey: apiContracts.drivers.list.key() as QueryKey,
    });
  },
  onError: () => toast.error("..."),
});
```

Named clients (`tripsClient`, `usersClient`, `organizationsClient`,
`invitationClient`, `vehiclesClient`, …) are exported from `@/lib/api/client`. Use
them for direct, non-cached calls (typically inside `mutationFn`).

## 4. Server components — use `server-client.ts`

Server-side code (`page.tsx`, server actions, route handlers) imports the
`server*Client` exports from `@/lib/api/server-client` and passes the access token
through the oRPC **context**, never through a module global:

```tsx
const me = await serverAuthClient.me(input, { context: { accessToken } });
```

## 5. API URL resolution — never hardcode

`@/lib/api/client` resolves the base URL itself:

- **Server**: `DAX_API_URL` (must be declared in the env schema — see `core/env.md`).
- **Client**: proxied through the Next.js rewrite at `/api/dax`.

Do not hardcode `https://…daxsystem.md` in components, and do not read `DAX_API_URL`
directly in client code.

## 6. Errors

oRPC failures throw `ORPCError`. Map them to user-facing messages with the helpers in
`@/lib/api/errors.ts` (and `route-errors.ts` / `knowledge-base-errors.ts`). Never
swallow errors silently — see `core/coding-style.md` §4.
