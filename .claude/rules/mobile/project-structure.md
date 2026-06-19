# Architecture Rule — File Layering Inside `apps/mobile/`

> Read on demand for any work under `apps/mobile/`. This rule **overrides**
> `.claude/rules/architecture.md` for the mobile app and adapts it to Expo: there is
> **no `src/`** (the `@/*` alias maps to `./*`), routing is **expo-router** file-based
> under `app/`, the UI kit is **gluestack-ui** (not shadcn), text comes from
> **react-i18next** (not next-intl), token persistence is **expo-secure-store** (not
> `localStorage`), and the oRPC client calls the **DAX API URL directly** (there is no
> Next.js proxy rewrite). The layering discipline, dependency direction, per-slug
> rule, and `@/` alias requirement carry over unchanged.

The `apps/mobile` codebase enforces the same strict layered structure as
`apps/admin`. Each kind of code lives in exactly one place. The rule below is
non-negotiable for new code.

---

## 1. The `@/` alias — `apps/admin/src/X` maps to `apps/mobile/X`

`apps/mobile/tsconfig.json` maps `@/*` → `./*` (no `src/`):

```jsonc
// apps/mobile/tsconfig.json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] },
  },
}
```

So every web layer drops the `src/` segment but keeps the same name. The admin
layering rule still applies — read it for the full rationale.

| Web (`apps/admin/`)          | Mobile (`apps/mobile/`)  |
| ---------------------------- | ------------------------ |
| `src/components/`            | `components/`            |
| `src/hooks/`                 | `hooks/`                 |
| `src/lib/`                   | `lib/`                   |
| `src/stores/`                | `stores/`               |
| `src/types/`                 | `types/`                 |
| `src/data/`                  | `data/`                  |
| `src/providers/` (if any)    | `providers/`             |
| `src/constants/` (`lib/...`) | `constants/`             |
| _(N/A — Next.js `app/`)_     | `app/` (expo-router)     |

The web `app/` (Next.js route tree) and the mobile `app/` (expo-router route tree)
are **both** route-only orchestration layers — see §3.

---

## 2. Top-level layout (single source of truth)

```
apps/mobile/
├── app/                     ← expo-router ROUTE FILES ONLY (thin orchestrators)
│   ├── _layout.tsx          ← root providers + AuthGuard + Stack
│   ├── (auth)/              ← auth route group (signin, reset-password)
│   └── (tabs)/              ← tab route group (index, profile, design)
├── components/              ← React components ONLY (.tsx files)
│   ├── pages/<slug>/        ← screen-scoped components (e.g. profile/, design/)
│   ├── ui/                  ← gluestack-ui primitives
│   ├── layout/              ← app shell (app-header, language-switcher, …)
│   └── auth/                ← shared auth widgets (GoogleButton, LockOverlay, …)
├── providers/              ← React context providers (query, i18n, …)
├── hooks/
│   ├── use-*.ts             ← shared, generic hooks
│   └── <slug>/use-*.ts      ← screen-specific hooks (planned)
├── lib/
│   ├── api/                 ← oRPC client + TanStack Query utils
│   ├── auth/                ← auth glue (secure-store, biometric, oauth, fetch)
│   ├── schemas/<slug>/      ← Zod schemas (validation, not UI types) (planned)
│   ├── utils.ts             ← shared utilities (cn, …)
│   └── theme.ts             ← shared non-component config
├── stores/                  ← Zustand stores
│   └── middleware/          ← shared store middleware (planned)
├── types/
│   ├── <shared>.ts          ← cross-cutting domain types
│   └── <slug>/              ← screen-specific types (e.g. design/)
├── data/
│   └── mock-data/<slug>/    ← all mock/placeholder/static datasets
├── constants/               ← NON-COLOR static values only (theme.ts, …)
└── i18n/                    ← react-i18next setup + locale resources
```

---

## 3. `app/` route files are THIN orchestrators

Every file under `app/` is an expo-router route (or `_layout.tsx`). A route file's
**only** job is to compose the screen shell — typically a `SafeScreen` wrapping a
single `components/pages/<slug>` component. Screen logic does not live here.

```tsx
// ✅ Correct — app/(tabs)/profile.tsx is a thin orchestrator
import React from "react";

import { ProfilePage } from "@/components/pages/profile/ProfilePage";
import { SafeScreen } from "@/components/ui/safe-screen";

export default function ProfileScreen() {
  return (
    <SafeScreen scroll edges={[]} contentClassName="px-4 pt-6">
      <ProfilePage />
    </SafeScreen>
  );
}
```

A route file MUST be limited to:

- the screen shell (`SafeScreen` / `KeyboardAvoidingView` / `ScrollView`),
- one (or a few small) `components/pages/<slug>` components,
- expo-router glue (`<Stack.Screen>`, `router.replace`, navigation params),
- the default-export screen function and `_layout.tsx` provider/stack wiring.

The following are **forbidden** inside `app/**`:

- Inline `z.object({ … })` Zod schemas (→ `lib/schemas/<slug>/`).
- Multi-`useState` form/controller logic and `useForm` wiring beyond trivial glue
  (→ a `components/pages/<slug>` component).
- Standalone helper functions with real logic (→ `lib/utils.ts`, `lib/<area>.ts`,
  or `hooks/<slug>/`).
- `const MOCK_*` / large static datasets (→ `data/mock-data/<slug>/`).
- Type/interface declarations beyond a route's local prop shape (→ `types/<slug>/`).

### Anti-example: `app/(auth)/signin.tsx`

`app/(auth)/signin.tsx` currently violates §3 in three ways and is the canonical
"do not do this" reference:

```tsx
// ❌ Wrong — schema declared inline in a route file
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

// ❌ Wrong — multi-line helper with real logic in a route file
async function offerEnableBiometric(t: Translate): Promise<void> {
  const cap = await getBiometricCapability();
  // …Alert.alert + biometric persistence…
}

// ❌ Wrong — five useState + full useForm/Controller form UI in a route file
export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // …onSubmit, onGooglePress, full Controller-driven JSX…
}
```

Target split (do this for new screens; `signin.tsx` is tracked for migration):

| Current (in the route file)         | Where it belongs                                  |
| ----------------------------------- | ------------------------------------------------- |
| `loginSchema` + `LoginFormValues`   | `lib/schemas/auth/index.ts` (planned)             |
| `offerEnableBiometric` helper       | `lib/auth/biometric.ts` (alongside the capability helpers) |
| form `useState`/`useForm` + form JSX | `components/pages/auth/SignInForm.tsx` (planned)  |
| `app/(auth)/signin.tsx`             | thin shell rendering `<SignInForm />` (like `profile.tsx`) |

Do not add new violations on the grounds that "signin.tsx does it".

---

## 4. `components/` is `.tsx`-only

`apps/mobile/components/**` accepts **only** React component files (`.tsx`) and
subdirectories of more `.tsx` files. The sanctioned sub-layers are:

| Folder                  | Holds                                                    | Real examples                                                      |
| ----------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| `components/pages/<slug>/` | screen-scoped components (one screen = one slug)       | `pages/profile/ProfilePage.tsx`, `pages/design/PrimitivesShowcase.tsx` |
| `components/ui/`        | gluestack-ui primitives (the registry kit)               | `ui/button.tsx`, `ui/input.tsx`, `ui/safe-screen.tsx`             |
| `components/layout/`    | app shell pieces                                         | `layout/app-header.tsx`, `layout/language-switcher.tsx`          |
| `components/auth/`      | shared auth widgets                                      | `auth/GoogleButton.tsx`, `auth/LockOverlay.tsx`                  |

Forbidden under `components/**` (extract to the dedicated layer):

- `*.ts` non-component files — types, utils, schemas, mock data, hooks, constants.
- Inline `const MOCK_*` / large static datasets → `data/mock-data/<slug>/`.
- Inline `function use<Hook>` with real logic → `hooks/` or `hooks/<slug>/`.
- Barrel files that mix layers. (`components/ui/index.ts` re-exporting only `ui`
  primitives is allowed — it does not cross layers.)

Default UI state (e.g. a `const DEFAULT_FILTERS = { … }` seed for `useState`) is
**allowed** in a component — it is a UI seed, not data.

---

## 5. `hooks/`, `lib/`, `stores/`, `providers/`

### `hooks/`

Shared, generic hooks live at `hooks/use-*.ts` (e.g. `hooks/use-format-date.ts`
bound to the i18next locale, `hooks/use-color-scheme.ts`, `hooks/use-theme-color.ts`).
Screen-specific hooks go under `hooks/<slug>/use-*.ts` (planned — no slug folders
exist yet). Platform variants use the Expo `*.web.ts` suffix
(`hooks/use-color-scheme.web.ts`) — that suffix is the **only** sanctioned reason to
duplicate a filename.

### `lib/`

| Subfolder            | Holds                                                       | Real examples                                                     |
| -------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `lib/api/`           | oRPC client + `apiContracts` (TanStack Query utils)        | `lib/api/client.ts`                                              |
| `lib/auth/`          | auth glue — token store, biometric, OAuth, authed fetch    | `lib/auth/secure-store.ts`, `lib/auth/biometric.ts`, `lib/auth/google-oauth.ts`, `lib/auth/fetch-with-auth.ts` |
| `lib/schemas/<slug>/` | Zod schemas (validation / payload shape) — NOT UI types   | `lib/schemas/auth/index.ts` (planned)                            |
| `lib/utils.ts`       | shared pure utilities                                       | `lib/utils.ts` (`cn`)                                            |
| `lib/<area>.ts`      | shared non-component config                                 | `lib/theme.ts` (`NAV_THEME`)                                     |

- The oRPC client resolves the API URL **directly** — `EXPO_PUBLIC_DAX_API_URL`
  with a `https://dev-api.daxsystem.md` fallback in `lib/api/client.ts`. There is
  **no** Next.js `/api/dax` proxy on mobile; do not hardcode the URL in components.
- Token persistence goes through `tokenStore` in `lib/auth/secure-store.ts`, which
  wraps `expo-secure-store` (and falls back to `localStorage` only on
  `Platform.OS === "web"`). NEVER call `SecureStore`/`localStorage` directly from a
  component — go through `tokenStore`.

### `stores/`

Zustand stores live at `stores/<name>.ts` (`stores/auth.ts`). Shared store
middleware belongs in `stores/middleware/` (planned — the folder does not exist yet).

> Divergence from `state/zustand.md`: the mobile `useAuthStore` is a plain
> `create<AuthState>()` with **no** `devtools(persist(logger(...)))` stack. Session
> state is persisted out-of-band through `tokenStore` (SecureStore), not through the
> `persist` middleware, because secrets must not land in `localStorage`-style
> storage. Match the existing store; do not bolt the web middleware stack onto it.

### `providers/`

React context providers are a **sanctioned top-level layer** on mobile:
`providers/query-provider.tsx`, `providers/i18n-provider.tsx`. They wrap `children`
and wire one external system each (TanStack Query client, `I18nextProvider`). They
are imported by `app/_layout.tsx`, never the reverse.

---

## 6. `types/`, `data/`, `constants/`

- **`types/`** — cross-cutting domain types at `types/<area>.ts`; screen-specific
  types under `types/<slug>/` (e.g. `types/design/index.ts`). `types/` imports from
  nothing in `components/`, `hooks/`, `data/`, `stores/`.
- **`data/mock-data/<slug>/`** — all mock / placeholder / curated static datasets
  (e.g. `data/mock-data/design/showcase-tokens.ts`). Imports **types only**.
- **`constants/`** — NON-color static values only (e.g. `constants/theme.ts`'s
  `Fonts`/`Colors` Expo-template config). Semantic color tokens come from the
  `tailwind.config.js` `semantic` object (injected at runtime by `ThemeRoot` from
  `lib/theme.ts`), never from raw hex in components — see
  `.claude/rules/mobile/theming.md`.

---

## 7. Decision tree — "Where does this file belong?"

Answer **one** question before creating a file. If two locations seem plausible,
prefer the layer **closest to data** (types over utils, utils over hooks, hooks over
components). When in doubt, stop and ask.

| What is the file?                                        | Where it goes                                   |
| -------------------------------------------------------- | ----------------------------------------------- |
| expo-router screen / `_layout` (thin orchestrator)       | `app/<route>.tsx` (`SafeScreen` + one page comp) |
| React component (returns JSX)                            | `components/pages/<slug>/` (or `ui/`/`layout/`/`auth/`) |
| Context provider wrapping `children`                     | `providers/<name>.tsx`                          |
| Custom hook (`use*`) used by one screen                  | `hooks/<slug>/use-<name>.ts` (planned)          |
| Custom hook used by many screens                         | `hooks/use-<name>.ts`                           |
| Zod schema (form validation, payload shape)              | `lib/schemas/<slug>/index.ts` (planned)         |
| oRPC client / query glue                                 | `lib/api/`                                       |
| Auth glue (token store, biometric, OAuth, authed fetch)  | `lib/auth/`                                      |
| Pure utility (shared, no JSX)                            | `lib/utils.ts` or `lib/<area>.ts`               |
| Zustand store                                            | `stores/<name>.ts`                              |
| Shared store middleware                                  | `stores/middleware/<name>.ts` (planned)         |
| Types/interfaces for one screen                          | `types/<slug>/`                                 |
| Cross-cutting domain types                               | `types/<area>.ts`                               |
| Mock / placeholder / static data                         | `data/mock-data/<slug>/`                        |
| Non-color static constants                               | `constants/<name>.ts`                           |

---

## 8. Per-slug discipline

If a screen has a folder under `components/pages/<slug>/`, the **same slug** is
reused everywhere it appears:

- `components/pages/profile/` ↔ `hooks/profile/` ↔ `types/profile/` ↔ `data/mock-data/profile/` ↔ `lib/schemas/profile/`
- `components/pages/design/` ↔ `types/design/` ↔ `data/mock-data/design/`

Never split one screen across multiple slugs (no `profile/` and `profiles/` and
`user-profile/` at once). Pick one slug when the screen is created and keep it.

---

## 9. Import paths — ALWAYS the `@/` alias

Always use absolute aliased imports across layers; deep relative paths that cross
layer boundaries are forbidden.

```tsx
// ✅ Correct — aliased, crosses layers explicitly
import { ProfilePage } from "@/components/pages/profile/ProfilePage";
import { SafeScreen } from "@/components/ui/safe-screen";
import { authClient, apiContracts } from "@/lib/api/client";
import { tokenStore } from "@/lib/auth/secure-store";
import { useAuthStore } from "@/stores/auth";
import type { ColorTokenGroup } from "@/types/design";

// ❌ Wrong — deep relative path crossing layer boundaries
import { ProfilePage } from "../../../components/pages/profile/ProfilePage";

// ❌ Wrong — a screen reaching into a sibling screen by relative path
import { ShowcaseSection } from "../design/ShowcaseSection";
```

Relative imports (`./Foo`) are allowed **only** inside the same folder (e.g.
`pages/design/sections/` siblings). Platform variants (`*.web.tsx`) are resolved by
Metro from the same import specifier — never import the `.web` file explicitly.

---

## 10. Dependency direction

Layers import downward only — never the reverse:

```
types → (imported by all)
↓
data/mock-data, lib/schemas → types
↓
lib/utils, lib/api, lib/auth → types (+ @repo/api contract)
↓
hooks → types, lib
↓
stores → types, lib
↓
providers → lib, stores, components/ui
↓
components → everything above
↓
app/ (routes) → components, providers, stores, lib   ← the top
```

Concrete rules:

- `types/` never imports from `components/`, `hooks/`, `data/`, `stores/`, `app/`.
- `data/mock-data/` and `lib/schemas/` import types (+ `zod` for schemas) only.
- `lib/` imports types + the `@repo/api` contract; never imports `components/`.
- `app/` route files sit at the top — they import everything below and nothing
  imports them.

---

## 11. Pre-file-creation checklist

Before creating any new file under `apps/mobile/`, confirm in order:

1. **Remember this rule** (and the admin `architecture.md` it overrides).
2. **Identify the file kind** from §7.
3. **Pick the location** strictly from §2 — and never put non-`.tsx` under
   `components/` or real logic under `app/`.
4. **Check the slug** in §8 — reuse the existing screen slug if one exists.
5. **Verify dependency direction** in §10.
6. **Use `@/` aliases** for all cross-layer imports (§9).

## 12. Exceptions

There are **no** exceptions for new code. Existing legacy violations (notably
`app/(auth)/signin.tsx`, §3) are migrated incrementally — do not add new violations
because old code does it. The only permitted variation is a genuinely cross-cutting,
non-screen-specific file living at the top of its layer (e.g. `lib/theme.ts`,
`lib/utils.ts`, `constants/theme.ts`) rather than under a `<slug>/` subfolder.
