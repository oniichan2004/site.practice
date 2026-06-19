# Zustand Advanced Patterns

## Metadata

- **triggers**: state, store, selector, persist, slice, zustand, middleware, logger
- **priority**: 2
- **context**: zustand
- **conflicts**: none

## When to Activate

- Designing store architecture for complex features
- Implementing cross-store communication
- Adding extra middleware around the mandatory stack
- Testing stores
- Handling complex state updates

## Shared Logger Middleware

Every store uses a shared logger imported from `@/stores/middleware/logger`. Rule 1 in `state/zustand.md` mandates the stack:

```
devtools(persist(logger(creator, { name })))
```

Implementation — keep this file as the single source of truth, DO NOT re-define the logger per store:

```typescript
// src/stores/middleware/logger.ts
import type { StateCreator, StoreMutatorIdentifier } from "zustand";

type LoggerOptions = {
  name: string;
  color?: string;
};

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  creator: StateCreator<T, Mps, Mcs>,
  options: LoggerOptions,
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(
  creator: StateCreator<T, [], []>,
  options: LoggerOptions,
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (creator, options) => (set, get, api) => {
  if (process.env.NODE_ENV !== "development") {
    return creator(set, get, api);
  }

  const { name, color = "#6366f1" } = options;

  const loggedSet: typeof set = (...args) => {
    const prev = get();
    set(...(args as Parameters<typeof set>));
    const next = get();

    const changed: Record<string, { from: unknown; to: unknown }> = {};
    for (const key of Object.keys(next as object)) {
      const k = key as keyof typeof next;
      const prevValue = (prev as typeof next)[k];
      const nextValue = next[k];
      if (typeof nextValue !== "function" && prevValue !== nextValue) {
        changed[key as string] = { from: prevValue, to: nextValue };
      }
    }

    if (Object.keys(changed).length === 0) return;

    console.groupCollapsed(
      `%c[${name}] ${Object.keys(changed).join(", ")}`,
      `color: ${color}; font-weight: bold;`,
    );
    console.log("Changed:", changed);
    console.log("Full state:", { ...next });
    console.groupEnd();
  };

  return creator(loggedSet, get, api);
};

export const logger = loggerImpl as unknown as Logger;
```

## Adding Optional Middleware

Wrap extras AROUND the mandatory stack — never replace it. Example with `subscribeWithSelector`:

```typescript
import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";

import { logger } from "@/stores/middleware/logger";

export const useStore = create<State>()(
  devtools(
    subscribeWithSelector(
      persist(
        logger(
          (set, get) => ({
            // state and actions
          }),
          { name: "MyStore" },
        ),
        {
          name: "my-store",
          storage: createJSONStorage(() => localStorage),
        },
      ),
    ),
    { name: "MyStore", enabled: process.env.NODE_ENV === "development" },
  ),
);
```

## Slice Pattern (Large Stores)

Split a large store into slices for maintainability:

```typescript
// slices/filtersSlice.ts
export interface FiltersSlice {
  destination: string;
  stars: number[];
  priceRange: [number, number];
  setDestination: (v: string) => void;
  setStars: (v: number[]) => void;
  setPriceRange: (v: [number, number]) => void;
}

export const createFiltersSlice: StateCreator<
  FiltersSlice & SortSlice, // combined type
  [],
  [],
  FiltersSlice
> = (set) => ({
  destination: "",
  stars: [],
  priceRange: [0, 10000],
  setDestination: (destination) =>
    set({ destination }, false, "filters/setDestination"),
  setStars: (stars) => set({ stars }, false, "filters/setStars"),
  setPriceRange: (priceRange) =>
    set({ priceRange }, false, "filters/setPriceRange"),
});

// store.ts — combine slices
export const useSearchStore = create<FiltersSlice & SortSlice>()(
  devtools((...a) => ({
    ...createFiltersSlice(...a),
    ...createSortSlice(...a),
  })),
);
```

## Middleware Stack

```typescript
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

export const useStore = create<State>()(
  devtools(
    // Outer: devtools (wraps everything)
    subscribeWithSelector(
      // Middle: enables fine-grained subscriptions
      persist(
        // Inner: persistence
        (set, get) => ({
          // state and actions
        }),
        { name: "store-key", storage: createJSONStorage(() => localStorage) },
      ),
    ),
    { name: "my-store" },
  ),
);
```

## Subscribe to Changes (Outside React)

```typescript
// Subscribe to specific field changes
const unsub = useStore.subscribe(
  (state) => state.destination,
  (destination, prevDestination) => {
    console.log("Destination changed:", prevDestination, "→", destination);
    analytics.track("destination_changed", { destination });
  },
);

// Cleanup
unsub();
```

## Transient Updates (No Re-render)

For high-frequency updates (drag, scroll, animation):

```typescript
interface TransientState {
  scrollY: number;
  // Use getState/setState directly — no React re-render
}

// Outside React
useStore.setState({ scrollY: window.scrollY });
const current = useStore.getState().scrollY;
```

## Computed Values (Derived State)

Compute in selectors, not in store:

```typescript
// ✅ Computed in selector
const totalPrice = useBookingStore((s) => s.nights * s.pricePerNight);

// ✅ Complex computed with useShallow
const summary = useBookingStore(
  useShallow((s) => ({
    total: s.nights * s.pricePerNight,
    hasDiscount: s.nights >= 7,
    discount: s.nights >= 7 ? 0.1 : 0,
  })),
);

// ❌ Don't store computed values
set({ totalPrice: nights * pricePerNight }); // Derived data shouldn't be stored
```

## Testing Stores

```typescript
import { useSearchStore } from "./useSearchStore";

describe("useSearchStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useSearchStore.setState({
      destination: "",
      stars: [],
      priceRange: [0, 10000],
    });
  });

  it("should update destination", () => {
    useSearchStore.getState().setDestination("Turkey");
    expect(useSearchStore.getState().destination).toBe("Turkey");
  });

  it("should reset all filters", () => {
    useSearchStore.getState().setDestination("Turkey");
    useSearchStore.getState().setStars([4, 5]);
    useSearchStore.getState().reset();
    expect(useSearchStore.getState().destination).toBe("");
    expect(useSearchStore.getState().stars).toEqual([]);
  });
});
```
