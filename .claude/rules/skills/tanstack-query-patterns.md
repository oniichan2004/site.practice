# TanStack Query Advanced Patterns

## Metadata

- **triggers**: fetch, query, mutation, cache, server state, infinite scroll, prefetch
- **priority**: 2
- **context**: tanstack-query
- **conflicts**: none

## When to Activate

- Implementing complex data fetching flows
- Building infinite scroll or pagination
- Implementing optimistic updates
- Prefetching data for navigation
- Managing cache invalidation strategies

## Dependent Queries

Query that depends on another query's result:

```tsx
const { data: user } = useQuery({
  queryKey: ["user", "me"],
  queryFn: fetchCurrentUser,
});

const { data: bookings } = useQuery({
  queryKey: ["bookings", user?.id],
  queryFn: user?.id ? () => fetchBookings(user.id) : skipToken,
});
```

## Infinite Scroll

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery({
    queryKey: ["hotels", "search", filters],
    queryFn: ({ pageParam }) => searchHotels({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });

// Flatten pages
const hotels = data?.pages.flatMap((page) => page.results) ?? [];

// Load more
<Button
  onClick={() => fetchNextPage()}
  disabled={!hasNextPage || isFetchingNextPage}
>
  {isFetchingNextPage
    ? "Loading..."
    : hasNextPage
      ? "Load More"
      : "No more results"}
</Button>;
```

## Optimistic Updates

```tsx
const queryClient = useQueryClient();

const toggleFavorite = useMutation({
  mutationFn: (hotelId: string) => client.favorites.toggle({ hotelId }),

  onMutate: async (hotelId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["favorites"] });

    // Snapshot previous value
    const previous = queryClient.getQueryData<string[]>(["favorites"]);

    // Optimistically update
    queryClient.setQueryData<string[]>(["favorites"], (old = []) =>
      old.includes(hotelId)
        ? old.filter((id) => id !== hotelId)
        : [...old, hotelId],
    );

    return { previous };
  },

  onError: (err, hotelId, context) => {
    // Rollback on error
    queryClient.setQueryData(["favorites"], context?.previous);
    toast.error("Failed to update favorites");
  },

  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  },
});
```

## Prefetching

```tsx
// Prefetch on hover (for navigation)
function HotelCard({ hotel }: Props) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ["hotels", "detail", hotel.id],
      queryFn: () => fetchHotel(hotel.id),
      staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    });
  };

  return (
    <Link href={`/hotels/${hotel.id}`} onMouseEnter={handleMouseEnter}>
      {/* ... */}
    </Link>
  );
}

// Prefetch in server component (for SSR hydration)
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export default async function Page({ params }: Props) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(hotelQueries.detail(params.id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HotelDetailClient id={params.id} />
    </HydrationBoundary>
  );
}
```

## Polling

```tsx
const { data } = useQuery({
  queryKey: ["booking", "status", bookingId],
  queryFn: () => fetchBookingStatus(bookingId),
  refetchInterval: (query) =>
    query.state.data?.status === "confirmed" ? false : 5000,
});
```

## Query Invalidation Strategies

```typescript
// Broad — invalidate all hotel queries
queryClient.invalidateQueries({ queryKey: ["hotels"] });

// Specific — only hotel detail
queryClient.invalidateQueries({ queryKey: ["hotels", "detail", id] });

// Exact match — only this exact key
queryClient.invalidateQueries({ queryKey: ["hotels", "list"], exact: true });

// Predicate — custom logic
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === "hotels" &&
    query.state.dataUpdatedAt < Date.now() - 60000,
});
```
