# React Hooks Rules

## 1. Rules of Hooks (Enforced)

- Call hooks only at the **top level** — never inside loops, conditions, or nested functions
- Call hooks only from **React components** or **custom hooks**
- Custom hooks MUST start with `use`

## 2. Custom Hook Extraction

Extract a custom hook when:
- A component has **> 20 lines** of hook/logic code
- The same logic is used in **2+ components**
- The logic is **testable independently** from the UI

```tsx
// ✅ Extracted hook
function useHotelSearch(initialFilters: Filters) {
  const [filters, setFilters] = useState(initialFilters);
  const debouncedFilters = useDebounce(filters, 300);

  const query = useQuery({
    queryKey: ["hotels", "search", debouncedFilters],
    queryFn: () => searchHotels(debouncedFilters),
  });

  const updateFilter = useCallback((key: keyof Filters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { filters, updateFilter, ...query };
}

// Component stays clean
function HotelSearchClient() {
  const { filters, updateFilter, data, isLoading } = useHotelSearch(defaultFilters);
  return (/* pure UI */);
}
```

## 3. Memoization — Only When Measured

Do NOT prematurely memoize. Use `useMemo` / `useCallback` ONLY when:
- You've **measured** a performance problem (React DevTools Profiler)
- The value is passed as a dep to another hook or child that would re-run
- The computation is genuinely expensive (> 1ms)

```tsx
// ✅ Justified — expensive computation
const sortedResults = useMemo(
  () => results.sort((a, b) => complexSort(a, b)),
  [results]
);

// ✅ Justified — stable reference for child component
const handleSelect = useCallback(
  (id: string) => setSelected(id),
  []
);

// ❌ Unjustified — simple derivation, no perf issue
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
// Just use: const fullName = `${first} ${last}`;
```

## 4. useEffect Guidelines

- **Avoid useEffect** for data fetching — use TanStack Query
- **Avoid useEffect** for derived state — compute during render
- Use useEffect ONLY for: subscriptions, DOM mutations, external system sync

```tsx
// ✅ Correct — sync with external system
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}, [onClose]);

// ❌ Wrong — derived state in useEffect
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
// Just use: const fullName = `${firstName} ${lastName}`;

// ❌ Wrong — data fetching in useEffect
useEffect(() => {
  fetchData().then(setData);
}, []);
// Use TanStack Query instead
```

## 5. useTransition for Non-Urgent Updates

Use `useTransition` for updates that can be deferred (e.g., filtering large lists):

```tsx
const [isPending, startTransition] = useTransition();

function handleFilterChange(value: string) {
  startTransition(() => {
    setFilter(value); // Non-urgent — won't block input
  });
}
```
