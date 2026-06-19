# Zustand Rules (mobile)

> Read on demand for `apps/mobile`. Overrides `state/zustand.md` for this app. The
> divergences that matter: there is no `src/` (`@/*` maps to `./*`), so import the
> shared logger from `@/stores/middleware/logger`, not `@/...src/...`; the
> **`persist(localStorage)` step from the web rule is dropped** — credentials live
> in `expo-secure-store` (see `lib/auth/secure-store.ts`) and the only thing that
> may be persisted is UI prefs, via AsyncStorage. Everything else (named setters,
> individual selectors / `useShallow`, store-vs-TanStack-Query boundaries) carries
> over from the web rule unchanged.

---

## 1. Middleware Stack — `devtools(logger(...))`, no `persist`

EVERY mobile store MUST wrap its creator with `devtools(logger(...))` — in that
exact order. The web rule's mandatory `persist(localStorage)` middle layer is
**removed** here: React Native has no `localStorage`, credentials must never be
persisted (§3), and most mobile stores hold transient session state only. Add
`persist` back **only** for a UI-prefs store (§4), and only with AsyncStorage.

- **`devtools`** (outer) — Redux DevTools / Flipper inspection, gated by
  `enabled: process.env.NODE_ENV === "development"`.
- **`logger`** (inner) — grouped console log of every mutation in development;
  imported from `@/stores/middleware/logger` **(planned — port the admin logger
  at `apps/admin/src/stores/middleware/logger.ts` verbatim)**. NEVER inline the
  logger per store.

The current store, `stores/auth.ts`, is a bare `create<AuthState>(...)` with no
middleware. Wrapping it with the stack below is the first migration step.

```typescript
// ✅ Correct — mobile mandatory stack (no persist)
"use client"; // not required by RN, but harmless and matches the web template
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { logger } from "@/stores/middleware/logger"; // planned

export const useAuthStore = create<AuthState>()(
  devtools(
    logger(
      (set, get) => ({
        // state and named setters
      }),
      { name: "Auth" },
    ),
    { name: "Auth", enabled: process.env.NODE_ENV === "development" },
  ),`
);

// ❌ Wrong — bare create with no middleware (current stores/auth.ts state)
export const useAuthStore = create<AuthState>((set, get) => ({ /* ... */ }));

// ❌ Wrong — persisting the whole store to localStorage (web pattern, invalid here)
devtools(persist(logger(creator, { name }), { name, storage: localStorage }));
```

### Logger behavior

- Active ONLY when `process.env.NODE_ENV === "development"` — zero runtime cost in
  production. Logs `[StoreName] changedKeys` grouped with a `from`/`to` diff plus
  the full next state.
- Pick a unique `name` per store and reuse it for the `devtools` `name`.
- The shared file at `apps/admin/src/stores/middleware/logger.ts` already has the
  correct `Logger` / `LoggerImpl` typing — copy it to
  `apps/mobile/stores/middleware/logger.ts` unchanged; do NOT re-derive it.

---

## 2. Store vs TanStack Query — never fetch server state into a store

The boundary is identical to web: **Zustand = client UI / session state**,
**TanStack Query = server / async data**. The mobile app already exposes
`apiContracts` (`createTanstackQueryUtils`) from `@/lib/api/client`, so there is no
excuse to cache server responses in a store.

`stores/auth.ts` currently violates this: `loadProfile()` calls
`authClient.me()` and writes `user` / `memberships` into the store via
`setSession`. That is server state living in Zustand.

```tsx
// ❌ Wrong — current loadProfile: fetches the profile into the store
loadProfile: async () => {
  const { user, memberships } = await authClient.me();
  get().setSession({ user, memberships }); // server data cached in Zustand
},

// ✅ Correct (target) — read the profile through TanStack Query
const { data } = useQuery(
  apiContracts.auth.me.queryOptions({
    input: isAuthenticated ? {} : skipToken,
  }),
);
```

MUST migrate `loadProfile` / `me` to an `apiContracts.auth.me` query. What stays
in the store is the **session flag and UI-derived bits** (`isAuthenticated`,
`activeOrg`, `activeRole`, `isLocked`, `biometricEnabled`), not the fetched
`UserOutput`. NEVER add a setter whose only job is to mirror an API response into
the store.

---

## 3. Credentials — SecureStore only, NEVER persisted

This is the documented mobile exception to the web `persist(localStorage)` rule.
Access and refresh tokens are owned exclusively by `lib/auth/secure-store.ts`,
which writes to `expo-secure-store` on native (and falls back to `localStorage`
only on `Platform.OS === "web"`):

| Token / secret          | Owner                                      | Storage             |
| ----------------------- | ------------------------------------------ | ------------------- |
| `dax-access-token`      | `tokenStore.setTokens` / `getAccessToken`  | `expo-secure-store` |
| `dax-refresh-token`     | `tokenStore.setTokens` / `getRefreshToken` | `expo-secure-store` |
| `dax-biometric-enabled` | `tokenStore.setBiometricEnabled`           | `expo-secure-store` |

Rules:

- NEVER put a token, refresh token, or any credential in Zustand state, and NEVER
  add it to a `partialize` allowlist. Tokens never enter the React tree.
- The store holds only **booleans derived from** SecureStore — `isAuthenticated`,
  `biometricEnabled`, `isLocked` — read via `tokenStore.hasSession()` /
  `tokenStore.isBiometricEnabled()` in `checkSession`. It does not hold the
  secrets themselves.
- Reads/writes go through `tokenStore`. NEVER call `SecureStore` directly from a
  store or component.

```typescript
// ✅ Correct — store mirrors a SecureStore boolean, not the token
const [has, biometricEnabled] = await Promise.all([
  tokenStore.hasSession(),
  tokenStore.isBiometricEnabled(),
]);
set({
  isAuthenticated: has,
  biometricEnabled,
  isLocked: has && biometricEnabled,
});

// ❌ Wrong — token in Zustand state
set({ accessToken: await tokenStore.getAccessToken() });
```

---

## 4. Persistence — UI prefs only, AsyncStorage + `partialize` + `_hasHydrated`

The web `persist` step is permitted again **only** for a non-sensitive UI-prefs
store. Today theme is driven by NativeWind (`useColorScheme`, see
`app/_layout.tsx` and `components/layout/theme-toggle.tsx`) and locale by
`react-i18next` (`providers/i18n-provider.tsx`); neither is a Zustand store. When
a `usePreferencesStore` is introduced **(planned)** it persists those prefs:

- Storage MUST be `createJSONStorage(() => AsyncStorage)` from
  `@react-native-async-storage/async-storage` **(planned dependency)** — NEVER
  `localStorage`, NEVER SecureStore (prefs aren't secrets).
- `partialize` MUST allow ONLY data fields (`theme`, `locale`). NEVER persist
  transient UI flags or `_hasHydrated`.
- Expose `_hasHydrated` and flip it in `onRehydrateStorage`; guard consumers so
  the UI does not flash the default theme/locale before AsyncStorage resolves.

```typescript
// ✅ Correct — planned prefs store, AsyncStorage, partialize, hydration flag
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { logger } from "@/stores/middleware/logger"; // planned

export const usePreferencesStore = create<PreferencesStore>()(
  devtools(
    persist(
      logger((set) => ({ /* theme, locale, setters, _hasHydrated */ }),
        { name: "Preferences" }),
      {
        name: "preferences",
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (s) => ({ theme: s.theme, locale: s.locale }),
        onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      },
    ),
    { name: "Preferences", enabled: process.env.NODE_ENV === "development" },
  ),
);

// ❌ Wrong — persisting credentials or session flags to AsyncStorage
partialize: (s) => ({ accessToken: s.accessToken, isAuthenticated: s.isAuthenticated }),
```

---

## 5. `isAuthenticated` Tri-State — the hydration gate

`isAuthenticated` MUST stay tri-state: `null` → `false` → `true`. This is the
gate the router waits on; in `stores/auth.ts` it is documented as _"`null` until
the first session check resolves"_ and consumed in `app/_layout.tsx`:

```tsx
// app/_layout.tsx — AuthGuard
if (isAuthenticated === false) router.replace("/(auth)/signin");
if (isAuthenticated === true) {
  void loadProfile();
  router.replace("/(tabs)");
}
// isAuthenticated === null → render nothing, wait for checkSession to resolve
```

- NEVER initialise `isAuthenticated` to `false` or `true` — it MUST start `null`
  so the guard does not bounce to sign-in before SecureStore has been read.
- `checkSession` MUST force `false` on any SecureStore read failure. The
  just-added `try/catch` does exactly this — a failed read resolves to logged-out
  instead of leaving the flag stuck on `null`, which would block the gate forever
  and render a permanent blank screen:

```typescript
// stores/auth.ts — checkSession catch (keep this)
} catch {
  set({ isAuthenticated: false, isLocked: false });
}
```

NEVER swallow that error without flipping `isAuthenticated` to `false`.

---

## 6. Keep the Store and the Token Store in Sync

The store mirrors SecureStore; the two MUST never drift.

- **On token clear → flip the store to logged-out.** `signOut` already does this:
  it `Promise.all`s `tokenStore.clearTokens()` + `tokenStore.setBiometricEnabled(false)`,
  then `set({ isAuthenticated: false, user: null, ... })`. The 401 path in
  `lib/auth/fetch-with-auth.ts` clears tokens directly
  (`await tokenStore.clearTokens()` on a failed refresh) **without** touching the
  store — so the store can be left believing it is authenticated while no tokens
  exist. That gap MUST be closed (re-check on resume, below, covers it; a direct
  store flip from the fetch layer is also acceptable).
- **On resume → re-check.** Subscribe to React Native `AppState` and call
  `checkSession()` when state becomes `active` **(planned — no `AppState`
  listener exists yet)**, so a session cleared by the 401 path or expired in the
  background is reconciled into `isAuthenticated` the moment the app foregrounds.

```tsx
// ✅ Correct — planned resume re-check, reconciles store with SecureStore
import { AppState } from "react-native";

useEffect(() => {
  const sub = AppState.addEventListener("change", (s) => {
    if (s === "active") void useAuthStore.getState().checkSession();
  });
  return () => sub.remove();
}, []);
```

---

## 7. Named Setters + Individual Selectors (same as web)

Unchanged from `state/zustand.md`:

- **Named setters only** — one setter per field (`setAvatarUrl`,
  `setBiometricEnabled`), batch actions for multi-field updates (`setSession`,
  `signOut`, `reset`). NEVER a generic `updateField(key, value)` — it loses type
  safety and logger diff clarity.
- **Individual selectors, or `useShallow` for groups.** This is how consumers
  already read the store (`useAuthStore((s) => s.checkSession)`,
  `useAuthStore((s) => s.isAuthenticated)`, the derived `useAuthInitials`).

```tsx
// ✅ Correct — individual selectors (as used in app/_layout.tsx)
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
const checkSession = useAuthStore((s) => s.checkSession);

// ✅ Correct — multiple fields with useShallow
import { useShallow } from "zustand/react/shallow";
const { activeOrg, activeRole } = useAuthStore(
  useShallow((s) => ({ activeOrg: s.activeOrg, activeRole: s.activeRole })),
);

// ❌ Wrong — full-store destructuring (re-renders on ANY change)
const { isAuthenticated, checkSession } = useAuthStore();
```

Cross-store access (when a prefs store is added): read each store via its own
selector in the component — NEVER import one store into another.
