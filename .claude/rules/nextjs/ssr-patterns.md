# SSR Patterns Rules

## 1. Default to Server Components

Every component is a server component by default. Add `"use client"` ONLY when the component needs:
- `useState`, `useEffect`, `useReducer`
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`window`, `document`, `localStorage`)
- Context consumers (`useContext`)
- Third-party client libraries (maps, carousels, animation libraries)

## 2. Server/Client Split Pattern

The page.tsx is the orchestrator — it composes server and client components:

```tsx
// app/[locale]/hotels/page.tsx — SERVER (no "use client")
export default async function HotelsPage({ params }: Props) {
  const { locale } = await params;
  const popularData = await fetchPopular().catch(() => null);

  return (
    <div>
      {/* SSR: SEO-critical content */}
      <HeroSection title="Hotels" description="Find your perfect stay" />

      {/* CLIENT: Interactive content */}
      <HotelSearchClient />

      {/* SSR: Static content with fetched data */}
      {popularData && <PopularDestinationsServer destinations={popularData} />}

      {/* SSR: Static informational content */}
      <InfoSectionServer />
    </div>
  );
}
```

## 3. Client Component Rules

- Keep client components **small and focused** on interactivity
- NO layout wrappers in client components (no `min-h-screen`, no container)
- NO SEO-critical content in client components (headings, descriptions, link lists)
- The parent (server) handles layout — client handles interaction

```tsx
// ✅ Correct — focused client component
"use client";
export function HotelSearchClient() {
  const [filters, setFilters] = useState(initialFilters);
  const { data, isLoading } = useQuery(/* ... */);

  return (
    <>
      <Filters value={filters} onChange={setFilters} />
      <ResultsGrid results={data} isLoading={isLoading} />
    </>
  );
}

// ❌ Wrong — client component doing layout + SEO + interactivity
"use client";
export function HotelsPageContent() {
  return (
    <div className="min-h-screen bg-accent"> {/* Layout belongs in server */}
      <h1>Hotels</h1> {/* SEO content belongs in server */}
      <SearchForm />
      <ResultsGrid />
    </div>
  );
}
```

## 4. Server Component Rules

- Can be `async` — use `await` for data fetching and translations
- Use `getTranslations` from `next-intl/server` (NOT `useTranslations`)
- Receive data as props — NO hooks, NO state, NO effects
- Can import client components — they hydrate independently

```tsx
// ✅ Correct server component
import { getTranslations } from "next-intl/server";

interface Props {
  destinations: { id: string; name: string; minPrice: number }[];
}

export default async function PopularDestinationsServer({ destinations }: Props) {
  const t = await getTranslations("content.popular");

  return (
    <section>
      <h2>{t("title")}</h2>
      {destinations.map((d) => (
        <Link key={d.id} href={`/hotels/${d.id}`}>
          {d.name} — from {d.minPrice}€
        </Link>
      ))}
    </section>
  );
}
```

## 5. File Organization for Server/Client Split

```
components/pages/hotels/
├── HotelSearchClient.tsx           # "use client" — search + filters
├── HotelOfferGrid.tsx              # "use client" — interactive grid
├── HotelOfferCard.tsx              # "use client" — card with actions
├── useHotelFilters.ts              # Hook for filter logic
└── server/
    ├── PopularDestinationsServer.tsx  # SSR — links, images
    └── InfoSectionServer.tsx          # SSR — static text
```

## 6. When to Use SSG (generateStaticParams)

Use static generation for content that:
- Doesn't change frequently (blog posts, destination pages)
- Has a finite, known set of URLs
- Benefits from CDN caching

```tsx
export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}
```
