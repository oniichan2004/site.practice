# Server/Client Component Split

## 1. Decision Tree

```
Does this component need:
  useState / useReducer? ────── YES → "use client"
  useEffect? ──────────────── YES → "use client"
  onClick / onChange / onSubmit? ── YES → "use client"
  Browser APIs (window, localStorage)? ── YES → "use client"
  useContext (client context)? ─── YES → "use client"
  Third-party client lib? ────── YES → "use client"
  None of the above? ────────── Server Component (default)
```

## 2. Push "use client" Down

Move the client boundary as low as possible in the component tree:

```tsx
// ✅ Correct — only the interactive part is client
// page.tsx (server)
export default async function Page() {
  const data = await fetchData();
  return (
    <section>
      <h1>Static Title</h1>         {/* Server — in initial HTML */}
      <p>Static description</p>      {/* Server — in initial HTML */}
      <InteractiveForm data={data} /> {/* Client — hydrates */}
    </section>
  );
}

// ❌ Wrong — entire page is client
"use client";
export default function Page() {
  const { data } = useQuery(/* ... */);
  return (
    <section>
      <h1>Static Title</h1>           {/* Unnecessarily client-rendered */}
      <p>Static description</p>        {/* Unnecessarily client-rendered */}
      <InteractiveForm data={data} />
    </section>
  );
}
```

## 3. Passing Server Data to Client Components

Server components pass data as **serializable props** to client components:

```tsx
// ✅ Correct — server fetches, client receives
// page.tsx (server)
const hotel = await fetchHotel(id);
<BookingFormClient hotelId={hotel.id} hotelName={hotel.name} price={hotel.price} />

// ❌ Wrong — passing non-serializable data
<BookingFormClient fetchFn={fetchHotel} /> // Functions can't cross the boundary
<BookingFormClient hotel={hotelWithMethods} /> // Classes can't cross
```

## 4. What CAN'T Cross the Boundary

These cannot be passed from server → client as props:
- Functions (callbacks are fine as event handlers WITHIN client components)
- Class instances
- Symbols
- DOM nodes
- Streams

These CAN be passed:
- Primitives (string, number, boolean, null, undefined)
- Plain objects (JSON-serializable)
- Arrays
- Date (serialized)
- FormData
- React elements (as `children`)

## 5. Component Placement

```
components/pages/<name>/
├── ClientComponent.tsx        # "use client" — interactive
├── useClientHook.ts           # Hook for client logic
└── server/
    ├── ServerSection.tsx      # No directive — server by default
    └── StaticContent.tsx      # No directive — server by default
```
