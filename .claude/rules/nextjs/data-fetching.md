# Data Fetching Rules

## 1. Where to Fetch

| Data Type | Where to Fetch | How |
|-----------|---------------|-----|
| SEO-critical (titles, descriptions, links) | Server (`page.tsx`) | Direct `await` call |
| Static content (articles, FAQs) | Server (`page.tsx`) | Direct `await` + `generateStaticParams` |
| Interactive/filtered data (search results, listings) | Client component | TanStack Query `useQuery` |
| User mutations (booking, form submit) | Client component | TanStack Query `useMutation` |

## 2. Server-Side Fetching (in page.tsx)

```tsx
// ✅ Correct — server fetch in page.tsx
export default async function Page({ params }: Props) {
  const { id } = await params;

  const hotel = await fetchHotel(id).catch(() => null);
  if (!hotel) notFound();

  return (
    <div>
      <h1>{hotel.name}</h1> {/* SSR content */}
      <BookingClient hotelId={hotel.id} /> {/* Client handles interactive data */}
    </div>
  );
}
```

- Always use `.catch(() => null)` for graceful fallback
- Call `notFound()` when the resource doesn't exist
- Pass fetched data as **plain props** (serializable) to child components

## 3. Client-Side Fetching (TanStack Query)

### Queries

```tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { skipToken } from "@tanstack/react-query";

const { data, isLoading, isError } = useQuery({
  queryKey: ["hotels", "search", filters],
  queryFn: () => fetchHotels(filters),
  enabled: !!filters.destination, // or use skipToken pattern
});

// ✅ Preferred: skipToken pattern (type-safe conditional queries)
const { data } = useQuery({
  queryKey: ["hotels", "search", filters],
  queryFn: filters.destination ? () => fetchHotels(filters) : skipToken,
});
```

### Mutations

```tsx
const mutation = useMutation({
  mutationFn: (data: BookingData) => submitBooking(data),
  onSuccess: (result) => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    router.push(`/bookings/${result.id}`);
  },
  onError: (error) => {
    toast.error("Booking failed. Please try again.");
  },
});
```

## 4. Forbidden Patterns

```tsx
// ❌ NEVER use raw fetch in client components for API data
useEffect(() => {
  fetch("/api/hotels").then((r) => r.json()).then(setData);
}, []);

// ❌ NEVER use SWR alongside TanStack Query (pick one)
const { data } = useSWR("/api/hotels", fetcher);

// ❌ NEVER fetch in useEffect for data that could use TanStack Query
useEffect(() => {
  loadData();
}, [id]);

// ❌ NEVER use `enabled: false` — use skipToken instead
useQuery({ queryKey: ["hotels"], queryFn: fetchHotels, enabled: false });
```

## 5. Query Key Conventions

Use arrays with consistent structure:

```typescript
// [entity, action, ...params]
["hotels", "list", { page: 1, sort: "price" }]
["hotels", "detail", hotelId]
["hotels", "search", searchParams]
["bookings", "list", userId]
["bookings", "detail", bookingId]
```

## 6. Loading & Error States

Every query consumer MUST handle all three states:

```tsx
function HotelList() {
  const { data, isLoading, isError } = useQuery(/* ... */);

  if (isLoading) return <HotelListSkeleton />;
  if (isError) return <ErrorMessage message="Failed to load hotels" />;
  if (!data?.length) return <EmptyState message="No hotels found" />;

  return <div>{data.map((h) => <HotelCard key={h.id} hotel={h} />)}</div>;
}
```
