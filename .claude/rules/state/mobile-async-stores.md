# Mobile Async Store Rules (`apps/mobile`)

These rules apply to every Zustand store under `apps/mobile/stores/`. They are the
React Native counterpart to the web `state/zustand.md` rule — adapted because RN has
no `window`/`localStorage` and no Redux DevTools.

## 1. Mandatory Middleware Stack

EVERY mobile store MUST wrap its creator with `persist(logger(...))` — in that exact
order. No `devtools` (Redux DevTools is unavailable in RN; the `logger` console
output is the debugging mechanism).

- **`persist`** (outer) — AsyncStorage hydration, scoped with `partialize`
- **`logger`** (inner) — grouped console diff of every mutation, gated by `__DEV__`;
  imported from `@/stores/middleware/logger` (NEVER inlined per store)

### Canonical template

```typescript
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { logger } from "@/stores/middleware/logger";

interface ExampleData {
  selectedId: string | null;
}

interface ExampleUIState {
  isSheetOpen: boolean;
  _hasHydrated: boolean;
}

interface ExampleActions {
  setSelectedId: (id: string | null) => void;
  setSheetOpen: (open: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  reset: () => void;
}

type ExampleStore = ExampleData & ExampleUIState & ExampleActions;

const initialData: ExampleData = { selectedId: null };

export const useExampleStore = create<ExampleStore>()(
  persist(
    logger(
      (set) => ({
        ...initialData,
        isSheetOpen: false,
        _hasHydrated: false,

        setSelectedId: (selectedId) => set({ selectedId }),
        setSheetOpen: (isSheetOpen) => set({ isSheetOpen }),
        setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
        reset: () => set({ ...initialData, isSheetOpen: false }),
      }),
      { name: "ExampleStore" },
    ),
    {
      name: "dax-example",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selectedId: state.selectedId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
```

## 2. Logger

- Lives at `apps/mobile/stores/middleware/logger.ts` — a single shared module.
- Gated by the RN `__DEV__` global (inlined `false` in production → zero cost). Do
  NOT gate it with `process.env.NODE_ENV` here; `__DEV__` is the RN idiom.
- Accepts `{ name, color? }`; pick a unique `name` per store (PascalCase, e.g.
  `"AuthStore"`).
- Logs `[StoreName] changedKeys` grouped with a `from`/`to` diff + the full next
  state, so store mutations are traceable in the Metro/Expo console.

## 3. `persist` + AsyncStorage

- Storage MUST be `createJSONStorage(() => AsyncStorage)` from
  `@react-native-async-storage/async-storage`. Never use `localStorage` (it only
  exists on web) and never read AsyncStorage directly inside a store.
- `name` is the AsyncStorage key — kebab-case, prefixed `dax-` (e.g. `dax-auth`).
- `partialize` persists ONLY durable data fields. NEVER persist transient UI flags
  (`isSheetOpen`, `*Error`, `isLoading*`, `_hasHydrated`).
- If nothing should persist, still wrap with `persist` and use
  `partialize: () => ({} as never)` to keep the middleware shape consistent.

## 4. Hydration

- Expose a `_hasHydrated: boolean` flag plus a `setHasHydrated` setter.
- Flip it from `false` → `true` inside `onRehydrateStorage`.
- Consumers that must not flash stale/empty content guard on it:

```typescript
const hasHydrated = useExampleStore((s) => s._hasHydrated);
if (!hasHydrated) return <LoadingScreen />;
```

## 5. SecureStore Exception (sensitive data)

- Secrets (auth tokens, biometric flags) live in **SecureStore** (`expo-secure-store`),
  NOT in a persisted Zustand store. AsyncStorage is plaintext.
- A store MAY cache derived, non-sensitive profile data (e.g. `user`, `memberships`)
  in AsyncStorage for instant first paint, but MUST NOT persist the authentication
  decision itself. `isAuthenticated` is derived at startup from
  `tokenStore.hasSession()` and MUST be excluded from `partialize`, so SecureStore
  remains the single source of truth for session validity.
- Example: `stores/auth.ts` partializes `user`/`memberships`/`activeOrg`/`activeRole`
  only — never `isAuthenticated`, never tokens.

## 6. Selectors — Individual or `useShallow`

```typescript
// ✅ Individual selectors
const selectedId = useExampleStore((s) => s.selectedId);
const setSelectedId = useExampleStore((s) => s.setSelectedId);

// ✅ Multiple fields with useShallow
import { useShallow } from "zustand/react/shallow";
const { isSheetOpen, setSheetOpen } = useExampleStore(
  useShallow((s) => ({ isSheetOpen: s.isSheetOpen, setSheetOpen: s.setSheetOpen })),
);

// ❌ Full-store destructuring — re-renders on ANY change
const { selectedId, setSelectedId } = useExampleStore();
```

## 7. Named Setters Only

- One setter per field: `setFieldName`. Batch actions for multi-field updates
  (`setSession`, `reset`).
- NEVER a generic `updateField(key, value)` — it loses type safety and logger clarity.
- Inside a setter call `set({ ... })` with the exact partial, so the logger diff is
  meaningful.

## 8. Store Boundaries

- **Zustand** = client UI state + small cached snapshots for first paint.
- **TanStack Query** = server/async state (the API is the source of truth).
- NEVER fetch API data inside a store action long-term; move `me()`-style reads to a
  query and feed the result in via a setter (`setSession`).
