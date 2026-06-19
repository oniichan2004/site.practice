# Next.js App Router Patterns

Advanced patterns for the Next.js App Router beyond the basic rules.

## Metadata

- **triggers**: routing, layout, page, middleware, metadata, streaming, parallel routes
- **priority**: 1
- **context**: next
- **conflicts**: none

## When to Activate

- Creating new pages or route segments
- Working with complex routing (parallel routes, intercepting routes)
- Implementing middleware (auth, redirects, i18n)
- Optimizing caching and revalidation strategies
- Debugging SSR/hydration issues

## Layout Nesting

Layouts persist across navigations and wrap child segments:

```
app/[locale]/layout.tsx          → Root layout (nav, footer, providers)
app/[locale]/hotels/layout.tsx   → Hotels section layout (sidebar, filters)
app/[locale]/hotels/[id]/page.tsx → Hotel detail (inherits both layouts)
```

Rules:

- Layouts NEVER re-mount on navigation — use `template.tsx` if you need re-mounting
- Don't fetch user-specific data in root layout (blocks all pages)
- Use route groups `(group)` to share layouts without affecting URL

## Parallel Routes

Render multiple pages in the same layout simultaneously:

```
app/[locale]/dashboard/
├── layout.tsx
├── page.tsx
├── @analytics/page.tsx     → Renders in `{analytics}` slot
├── @activity/page.tsx      → Renders in `{activity}` slot
└── @analytics/loading.tsx  → Loading state for analytics slot
```

```tsx
// layout.tsx
export default function Layout({
  children,
  analytics,
  activity,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  activity: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>{children}</div>
      <div>{analytics}</div>
      <div>{activity}</div>
    </div>
  );
}
```

## Intercepting Routes

Show a modal for a route while keeping the background page:

```
app/[locale]/hotels/
├── page.tsx                    → Hotel listing
├── [id]/page.tsx               → Full hotel detail page
└── (.)hotels/[id]/page.tsx     → Intercepted: modal over listing
```

Conventions: `(.)` same level, `(..)` one level up, `(...)` from root.

## Middleware

```typescript
// middleware.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Auth check
  const token = request.cookies.get("session");
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
```

## Caching Strategies

| Strategy         | When                         | How                                          |
| ---------------- | ---------------------------- | -------------------------------------------- |
| Static (default) | Content rarely changes       | `generateStaticParams()`                     |
| ISR              | Content changes periodically | `revalidate: 3600` in fetch or route segment |
| Dynamic          | Content changes per request  | `export const dynamic = "force-dynamic"`     |
| On-demand        | Content changes on event     | `revalidatePath()` or `revalidateTag()`      |

```tsx
// ISR — revalidate every hour
export const revalidate = 3600;

// On-demand revalidation (in Server Action or Route Handler)
import { revalidatePath, revalidateTag } from "next/cache";
revalidatePath("/hotels");
revalidateTag("hotel-list");
```

## Streaming with Suspense

```tsx
export default async function Page() {
  return (
    <>
      {/* Renders immediately */}
      <HeroSection />

      {/* Streams when data is ready */}
      <Suspense fallback={<HotelsSkeleton />}>
        <HotelsSection /> {/* async server component */}
      </Suspense>

      {/* Streams independently */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsSection /> {/* async server component */}
      </Suspense>
    </>
  );
}
```

## Route Handlers (API Routes)

```typescript
// app/api/hotels/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  const hotels = await searchHotels(query);
  return NextResponse.json(hotels);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = BookingSchema.parse(body);
  const result = await createBooking(parsed);
  return NextResponse.json(result, { status: 201 });
}
```
