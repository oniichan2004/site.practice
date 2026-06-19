# Performance Rules

## 1. Images — Always Use next/image

```tsx
import Image from "next/image";

// ✅ Correct
<Image
  src={hotel.imageUrl}
  alt={hotel.name}
  width={400}
  height={300}
  className="rounded-lg object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// ❌ Wrong — raw img tag
<img src={hotel.imageUrl} alt={hotel.name} />
```

- Always provide `width` and `height` (or use `fill` with a sized container)
- Always provide meaningful `alt` text
- Use `sizes` prop for responsive images
- Use `priority` for above-the-fold images (LCP candidates)
- Use `loading="lazy"` for below-the-fold (default behavior)

## 2. Fonts — Use next/font

```tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
```

- Always use `next/font` — never load fonts via `<link>` or CSS `@import`
- Set `display: "swap"` to prevent FOIT (Flash of Invisible Text)
- Subset fonts to only the character sets you need

## 3. Code Splitting — Dynamic Imports

Heavy components that aren't needed immediately should be dynamically imported:

```tsx
import dynamic from "next/dynamic";

// ✅ Lazy-load heavy components
const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <MapSkeleton />,
  ssr: false, // Maps don't need SSR
});

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  loading: () => <EditorSkeleton />,
});
```

Use dynamic imports for:
- Maps (Google Maps, Maplibre)
- Rich text editors
- Chart libraries
- Media players
- Any component > 50KB that isn't above-the-fold

## 4. Suspense Boundaries

Wrap async/heavy sections in Suspense for streaming SSR:

```tsx
import { Suspense } from "react";

export default async function Page() {
  return (
    <div>
      <HeroSection /> {/* Renders immediately */}

      <Suspense fallback={<SearchSkeleton />}>
        <SearchSection /> {/* Streams when ready */}
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsSection /> {/* Streams independently */}
      </Suspense>
    </div>
  );
}
```

## 5. Avoid Re-render Waste

- Use individual Zustand selectors (not full-store destructuring)
- Memoize only when you've **measured** a performance problem — don't premature optimize
- Keep client components small — less JS to hydrate
- Move static content to server components

## 6. Bundle Analysis

When optimizing, use the bundle analyzer:

```bash
# In next.config.js, enable @next/bundle-analyzer
ANALYZE=true next build
```

Watch for:
- Duplicate packages
- Large dependencies that could be replaced
- Client bundles importing server-only code
- Unused exports (tree-shaking failures)
