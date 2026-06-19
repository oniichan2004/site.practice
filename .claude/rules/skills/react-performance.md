# React Performance Patterns

## Metadata

- **triggers**: performance, slow, re-render, virtualization, bundle, lazy, memo
- **priority**: 2
- **context**: react
- **conflicts**: none

## When to Activate

- Debugging slow renders or janky UI
- Working with large lists or data tables
- Optimizing bundle size
- Reducing unnecessary re-renders
- Implementing code splitting

## Measure Before Optimizing

NEVER optimize blindly. Use these tools first:

1. **React DevTools Profiler** — record interactions, find slow components
2. **Chrome Performance tab** — identify long tasks, layout thrashing
3. **`why-did-you-render`** — log unnecessary re-renders in dev
4. **Bundle analyzer** — `ANALYZE=true next build`

## Re-render Prevention

### 1. Proper Zustand Selectors

```tsx
// ✅ Only re-renders when `destination` changes
const destination = useStore((s) => s.destination);

// ❌ Re-renders on ANY store change
const { destination } = useStore();
```

### 2. Component Splitting

Split expensive children from frequently-updating parents:

```tsx
// ✅ SearchInput re-renders on keystroke, but ResultsGrid doesn't
function SearchPage() {
  return (
    <>
      <SearchInput /> {/* Has local state, re-renders often */}
      <ResultsGrid /> {/* Reads from query cache, re-renders rarely */}
    </>
  );
}

// ❌ Both re-render on every keystroke
function SearchPage() {
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultsGrid query={query} /> {/* Re-renders on every keystroke */}
    </>
  );
}
```

### 3. React.memo — Only When Measured

```tsx
// ✅ Justified — expensive component that receives stable props
const ExpensiveChart = React.memo(function ExpensiveChart({ data }: Props) {
  // Complex SVG rendering
  return <svg>...</svg>;
});

// ❌ Unjustified — simple component
const Label = React.memo(({ text }: { text: string }) => <span>{text}</span>);
```

## Virtualization

For lists with 100+ items, use virtualization:

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              transform: `translateY(${virtualRow.start}px)`,
              height: `${virtualRow.size}px`,
              width: "100%",
            }}
          >
            <ItemCard item={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Code Splitting

```tsx
// Heavy components — dynamic import
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});
const Chart = dynamic(() => import("./Chart"), {
  loading: () => <ChartSkeleton />,
});
const Editor = dynamic(() => import("./Editor"), {
  loading: () => <EditorSkeleton />,
});

// Route-based splitting — automatic with Next.js App Router (each page is a separate bundle)
```

## Image Optimization

```tsx
// Above the fold — priority loading
<Image src={heroImage} alt="..." priority sizes="100vw" />

// Below the fold — lazy loading (default)
<Image src={galleryImage} alt="..." sizes="(max-width: 768px) 100vw, 50vw" />

// Thumbnail — small size
<Image src={thumb} alt="..." width={80} height={80} quality={75} />
```

## Suspense for Data Loading

```tsx
// Parent renders immediately, children stream when ready
<Suspense fallback={<Skeleton />}>
  <AsyncDataComponent /> {/* Suspends until data is ready */}
</Suspense>
```
