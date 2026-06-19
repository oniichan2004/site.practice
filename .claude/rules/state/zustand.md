# Zustand Rules

## 1. Mandatory Middleware Stack

EVERY Zustand store MUST wrap its creator with `devtools(persist(logger(...)))` — in that exact order. No exceptions.

- **`devtools`** (outer) — Redux DevTools inspection, gated by `enabled: process.env.NODE_ENV === "development"`
- **`persist`** (middle) — `localStorage` hydration, scoped with `partialize`
- **`logger`** (inner) — grouped console log of every mutation in development; imported from `@/stores/middleware/logger`

### Canonical template

```typescript
"use client";

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { logger } from "@/stores/middleware/logger";

interface SearchFormData {
  destination: string;
  guests: number;
}

interface SearchFormUIState {
  isOpen: boolean;
  _hasHydrated: boolean;
}

interface SearchFormActions {
  setDestination: (v: string) => void;
  setGuests: (v: number) => void;
  setIsOpen: (v: boolean) => void;
  setHasHydrated: (v: boolean) => void;
  reset: () => void;
}

type SearchFormStore = SearchFormData & SearchFormUIState & SearchFormActions;

const initialData: SearchFormData = {
  destination: "",
  guests: 2,
};

export const useSearchForm = create<SearchFormStore>()(
  devtools(
    persist(
      logger(
        (set) => ({
          ...initialData,
          isOpen: false,
          _hasHydrated: false,

          setDestination: (destination) => set({ destination }),
          setGuests: (guests) => set({ guests }),
          setIsOpen: (isOpen) => set({ isOpen }),
          setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
          reset: () => set({ ...initialData, isOpen: false }),
        }),
        { name: "SearchForm" },
      ),
      {
        name: "search-form",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          destination: state.destination,
          guests: state.guests,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
    {
      name: "SearchForm",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
```

### `partialize` rules

- Persist ONLY data fields — never transient UI flags (`isOpen`, `*Error`, `_hasHydrated`)
- If truly nothing should persist, still wrap with `persist` and use `partialize: () => ({} as never)` — keeps the middleware shape consistent across stores
- Use `onRehydrateStorage` for post-hydration work: flipping `_hasHydrated`, dropping expired dates, normalising legacy shapes

### Logger behavior

- Active ONLY when `process.env.NODE_ENV === "development"` — zero runtime cost in production
- Imported from `@/stores/middleware/logger` — NEVER inline the logger implementation per store
- Logs `[StoreName] changedKeys` grouped with `from`/`to` diff + full next state
- Accepts `{ name, color? }` options; pick a unique `name` per store (matches the `devtools` `name`)

## 2. Store Structure

Each store manages a **single domain** of client UI state. Split the store type into three interfaces so `partialize` can target data only:

```typescript
interface FiltersData {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

interface FiltersUIState {
  isOpen: boolean;
  _hasHydrated: boolean;
}

interface FiltersActions {
  setDestination: (value: string) => void;
  setCheckIn: (value: Date | null) => void;
  setCheckOut: (value: Date | null) => void;
  setGuests: (value: number) => void;

  setDates: (checkIn: Date, checkOut: Date) => void;
  setIsOpen: (isOpen: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  reset: () => void;
}

type FiltersStore = FiltersData & FiltersUIState & FiltersActions;
```

Wrap the implementation with the mandatory middleware stack from Section 1.

## 3. Selectors — ALWAYS Use Individual or useShallow

```typescript
// ✅ Correct — individual selector (no unnecessary re-renders)
const destination = useSearchForm((s) => s.destination);
const setDestination = useSearchForm((s) => s.setDestination);

// ✅ Correct — multiple fields with useShallow
import { useShallow } from "zustand/react/shallow";

const { checkIn, checkOut, setDates } = useSearchForm(
  useShallow((s) => ({
    checkIn: s.checkIn,
    checkOut: s.checkOut,
    setDates: s.setDates,
  })),
);

// ❌ Wrong — full-store destructuring (re-renders on ANY change)
const { destination, checkIn, setDestination } = useSearchForm();

// ❌ Wrong — generic updateField function
set({ [field]: value }); // No type safety, no logger clarity
```

## 4. Named Setters Only

- One setter per field: `setFieldName`
- Batch actions for multi-field updates: `setDates`, `reset`
- NEVER use generic `updateField(key, value)` — loses type safety and logger clarity
- Inside a setter, call `set({ ... })` with the exact partial — keep it explicit so the logger can diff it

## 5. SSR Hydration Pattern

The mandatory stack already wraps with `persist`. For stores whose UI must not flash stale content on first paint, expose a `_hasHydrated` flag and guard consumers:

```typescript
// In component — guard against hydration mismatch
function RecentSearches() {
  const hasHydrated = useRecentSearches((s) => s._hasHydrated);
  const searches = useRecentSearches((s) => s.recentSearches);

  if (!hasHydrated) return <Skeleton />;
  return <div>{searches.map(/* ... */)}</div>;
}
```

For stores that must fully control when hydration happens (e.g., theme with document-class side effects), pair `skipHydration: true` with a manual `useStore.persist.rehydrate()` call inside a `useEffect`.

## 6. Store Boundaries

- **Zustand** = Client UI state (form values, filters, modals, temporary selections)
- **TanStack Query** = Server/async state (API data, cached responses)
- NEVER use Zustand for API data — use TanStack Query
- NEVER use TanStack Query for UI state — use Zustand
- Cross-store access: read via selectors in components, not by importing stores into each other
