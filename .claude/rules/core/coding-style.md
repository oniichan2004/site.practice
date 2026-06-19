# Coding Style Rules

## 1. Immutability

ALWAYS create new objects/arrays — NEVER mutate in place:

```typescript
// ✅ Correct — new object
const updated = { ...user, name: "New Name" };
const withItem = [...items, newItem];
const without = items.filter((i) => i.id !== targetId);

// ❌ Wrong — mutation
user.name = "New Name";
items.push(newItem);
items.splice(index, 1);
```

## 2. File Size

- Components: **max 500 lines** — refactor if larger
- Utility files: **max 300 lines** — split into focused modules
- If a file grows too large:
  - Extract hooks into separate files
  - Split sub-components into their own files
  - Move utility functions to a `utils/` file

## 3. Naming Conventions

**Files**: kebab-case for files, PascalCase for components

```
components/pages/hotels/HotelCard.tsx        ✅
components/pages/hotels/hotel-card.tsx        ✅
hooks/useHotelSearch.ts                      ✅
utils/format-date.ts                         ✅
```

**Variables & functions**: camelCase, descriptive

```typescript
// ✅ Descriptive
const isUserAuthenticated = true;
const totalSearchResults = 42;
function formatCurrency(amount: number, currency: string): string {}
function handleSubmitBooking(data: BookingData): Promise<void> {}

// ❌ Unclear
const flag = true;
const x = 42;
function process(d) {}
```

**Components**: PascalCase, noun or noun phrase

```typescript
// ✅
function HotelCard({ hotel }: Props) {}
function SearchResultsGrid({ results }: Props) {}
function DateRangePicker({ onChange }: Props) {}

// ❌
function hotelCard() {}
function RenderResults() {}
```

**Hooks**: camelCase, start with `use`

```typescript
// ✅
function useHotelSearch() {}
function useDebounce<T>(value: T, delay: number): T {}

// ❌
function HotelSearchHook() {}
function getDebounced() {}
```

**Boolean variables**: start with `is`, `has`, `should`, `can`

```typescript
const isLoading = true;
const hasPermission = false;
const shouldShowModal = true;
const canEdit = user.role === "admin";
```

## 4. Error Handling

- Handle errors explicitly at every level
- Provide user-friendly messages in UI code
- Never silently swallow errors

```typescript
// ✅ Correct
try {
  const result = await submitBooking(data);
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error("Please check your booking details");
  } else {
    toast.error("Something went wrong. Please try again.");
    console.error("Booking submission failed:", error);
  }
}

// ❌ Wrong — silent catch
try {
  await submitBooking(data);
} catch {}
```

## 5. No Magic Numbers or Strings

```typescript
// ✅ Correct
const MAX_RESULTS_PER_PAGE = 20;
const DEBOUNCE_MS = 300;
const SEARCH_TYPES = { HOTELS: "hotels", FLIGHTS: "flights" } as const;

// ❌ Wrong
if (results.length > 20) {
}
setTimeout(callback, 300);
if (type === "hotels") {
}
```

## 6. Import Organization

Group imports in this order, separated by blank lines:

1. External libraries (react, next, etc.)
2. Internal aliases (@/ paths)
3. Relative imports
4. Type-only imports

```typescript
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui";
import { useHotelSearch } from "@/hooks/useHotelSearch";

import { HotelCard } from "./HotelCard";
import { SearchFilters } from "./SearchFilters";

import type { Hotel, SearchParams } from "@/types/hotels";
```
