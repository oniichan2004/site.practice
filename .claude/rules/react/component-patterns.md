# React Component Patterns

## 1. Composition Over Inheritance

Build complex UI by composing small, focused components:

```tsx
// ✅ Correct — composition
<Card>
  <CardHeader>
    <CardTitle>Hotel Name</CardTitle>
    <CardDescription>City, Country</CardDescription>
  </CardHeader>
  <CardContent>
    <PriceDisplay amount={99} currency="EUR" />
  </CardContent>
  <CardFooter>
    <Button>Book Now</Button>
  </CardFooter>
</Card>

// ❌ Wrong — monolithic component with too many props
<Card
  title="Hotel Name"
  description="City, Country"
  price={99}
  currency="EUR"
  buttonText="Book Now"
  onButtonClick={handleBook}
  showImage
  imageUrl="..."
/>
```

## 2. Props Interface Pattern

```tsx
// ✅ Correct — explicit interface, extending native props when needed
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

function Button({
  variant = "default",
  size = "default",
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

## 3. Children vs Render Props

- Use `children` for simple content projection
- Use render props / slots only when the child needs parent data

```tsx
// ✅ Children — simple case
<Modal>
  <ModalTitle>Confirm</ModalTitle>
  <ModalBody>Are you sure?</ModalBody>
</Modal>

// ✅ Render prop — child needs parent data
<Autocomplete
  options={cities}
  renderOption={(city) => (
    <div className="flex items-center gap-2">
      <Flag code={city.countryCode} />
      <span>{city.name}</span>
    </div>
  )}
/>
```

## 4. forwardRef Pattern

When a component needs to expose its DOM ref:

```tsx
import { forwardRef } from "react";

interface InputProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} className={cn("input-base", className)} {...props} />
        {error && <span className="text-destructive text-sm">{error}</span>}
      </div>
    );
  },
);
Input.displayName = "Input";
```

## 5. State Ownership

- Each component owns its loading, error, and empty states
- Parent passes **flags** (`isLoading`, `isError`), child decides **what to render**

```tsx
// ✅ Correct — component owns its states
function HotelList({ hotels, isLoading, isError }: Props) {
  if (isLoading) return <HotelListSkeleton />;
  if (isError) return <ErrorMessage />;
  if (!hotels.length) return <EmptyState />;
  return (
    <div>
      {hotels.map((h) => (
        <HotelCard key={h.id} hotel={h} />
      ))}
    </div>
  );
}

// ❌ Wrong — parent renders child's states
{
  isLoading ? <Skeleton /> : <HotelList hotels={hotels} />;
}
```

## 6. One Component Per File

- Each component gets its own file
- Exception: small, tightly-coupled sub-components (< 30 lines) can share a file
- **Layered file structure** — see `architecture.md`. Component `.tsx` files live
  in `components/`. Hooks, types, mock data, utilities, schemas, and registries
  belong in their dedicated top-level folders (`hooks/`, `types/`,
  `data/mock-data/`, `lib/utils/`, `lib/schemas/`, `lib/registries/`) under a
  per-page subfolder. Never co-locate non-component files inside `components/`.
