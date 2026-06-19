# Next.js App Router Rules

## 1. File Conventions

Every route segment can have these special files:

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI — makes the segment publicly accessible |
| `layout.tsx` | Shared UI wrapping children — persists across navigations |
| `loading.tsx` | Loading UI — shown while page content loads |
| `error.tsx` | Error boundary — catches errors in the segment |
| `not-found.tsx` | 404 UI for the segment |
| `template.tsx` | Like layout but re-mounts on navigation |

```
app/
├── [locale]/
│   ├── layout.tsx          # Root locale layout (providers, nav, footer)
│   ├── page.tsx            # Homepage
│   ├── hotels/
│   │   ├── page.tsx        # /hotels listing
│   │   ├── loading.tsx     # Loading skeleton
│   │   ├── [slug]/
│   │   │   └── page.tsx    # /hotels/turkey
│   │   └── [slug]/[id]/
│   │       └── page.tsx    # /hotels/turkey/123
```

## 2. Page Components Are Server Components

- `page.tsx` is a **server component** by default — keep it that way
- Fetch data directly in page.tsx using `async/await`
- Pass data as props to child components
- NEVER add `"use client"` to a page.tsx unless it's entirely interactive with no SEO content

```tsx
// ✅ Correct — server component page
export default async function HotelsPage({ params }: Props) {
  const { locale } = await params;
  const data = await fetchHotels();

  return (
    <div>
      <h1>Hotels</h1> {/* SSR — visible to crawlers */}
      <HotelListingClient hotels={data} /> {/* Client component for interactivity */}
    </div>
  );
}
```

## 3. Metadata API

Use the Metadata API for SEO — never use `<Head>` or manual `<meta>` tags:

```tsx
// ✅ Static metadata
export const metadata: Metadata = {
  title: "Hotels in Turkey",
  description: "Find the best hotels in Turkey",
};

// ✅ Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await fetchHotel(slug);
  return {
    title: hotel.name,
    description: hotel.description,
    openGraph: { images: [hotel.imageUrl] },
  };
}
```

## 4. Route Groups

Use `(group)` folders for organization without affecting the URL:

```
app/[locale]/
├── (marketing)/        # Doesn't appear in URL
│   ├── about/page.tsx  # /about
│   └── blog/page.tsx   # /blog
├── (app)/              # Doesn't appear in URL
│   ├── dashboard/page.tsx  # /dashboard
│   └── settings/page.tsx   # /settings
```

## 5. Dynamic Routes

- Use `[param]` for dynamic segments
- Use `[...slug]` for catch-all segments
- Use `[[...slug]]` for optional catch-all
- Always validate params with Zod before using

```tsx
// ✅ Validate params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = z.string().uuid().parse(id);
  // ...
}
```

## 6. Async APIs (Next.js 15+)

In Next.js 15+, `params`, `searchParams`, `cookies()`, `headers()` are async:

```tsx
// ✅ Correct — await params
export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
}

// ✅ Correct — await searchParams
export default async function Page({ searchParams }: Props) {
  const { query } = await searchParams;
}

// ❌ Wrong — sync access (deprecated)
export default function Page({ params }: Props) {
  const { slug } = params; // Error in Next.js 15+
}
```
