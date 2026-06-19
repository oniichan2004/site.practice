# TypeScript Strict Rules

## 1. No `any` — Ever

- **NEVER** use `any` — use `unknown` + type guards, generics, or proper types
- The only acceptable escape hatch is `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a comment explaining WHY

```typescript
// ✅ Correct
function processData(data: unknown): NormalizedData {
  const parsed = DataSchema.parse(data);
  return normalize(parsed);
}

// ✅ Correct — generic
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

// ❌ Wrong
function processData(data: any): any {
  return data.items;
}
```

## 2. Explicit Types

- All function parameters MUST have explicit types
- All component props MUST have a defined `interface` or `type`
- Return types explicit for non-trivial functions (more than a single expression)
- Use `React.ComponentProps<"element">` for extending native HTML props

```typescript
// ✅ Correct
interface CardProps {
  title: string;
  description: string;
  onAction: (id: string) => void;
  className?: string;
}

function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale).format(date);
}

// ❌ Wrong — no types
function formatDate(date, locale) {
  return new Intl.DateTimeFormat(locale).format(date);
}
```

## 3. Type Derivation

- Derive types from API contracts when available — do NOT define API types manually
- Use `typeof`, `ReturnType`, `Awaited`, `Parameters` for type derivation
- Use `satisfies` for type-checked object literals

```typescript
// ✅ Correct — derive from contract
export type { SearchResponse, NormalizedOffer } from "@travel/api-contract";

// ✅ Correct — derive from function
type QueryResult = Awaited<ReturnType<typeof client.hotels.getById>>;

// ✅ Correct — satisfies
const config = {
  maxRetries: 3,
  timeout: 5000,
} satisfies RequestConfig;

// ❌ Wrong — manual type that duplicates API contract
interface SearchResponse {
  results: Array<{ id: string; name: string }>;
}
```

## 4. Zod Validation

- Use Zod schemas for runtime validation at system boundaries (API responses, form inputs, URL params)
- Co-locate schemas with their types
- Prefer `.parse()` (throws) over `.safeParse()` unless you need custom error handling

```typescript
// ✅ Correct
import { z } from "zod";

const SearchParamsSchema = z.object({
  query: z.string().min(1),
  page: z.coerce.number().int().positive().default(1),
  sort: z.enum(["price", "rating", "distance"]).default("price"),
});

type SearchParams = z.infer<typeof SearchParamsSchema>;
```

## 5. Strict Null Handling

- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of `||` for defaults
- Never use non-null assertion (`!`) without a comment explaining why it's safe
- Handle null/undefined cases explicitly

```typescript
// ✅ Correct
const name = user?.profile?.displayName ?? "Anonymous";

// ❌ Wrong — || treats 0 and "" as falsy
const count = response.total || 10;

// ❌ Wrong — non-null assertion without explanation
const element = document.querySelector(".btn")!;
```
