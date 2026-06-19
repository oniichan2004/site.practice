# Tailwind CSS Rules

## 1. Theme CSS Variables Only

NEVER hardcode colors. Use CSS variables from the theme:

```tsx
// ✅ Correct — theme tokens
<div className="bg-background text-foreground" />
<div className="bg-primary text-primary-foreground" />
<div className="bg-accent text-accent-foreground" />
<div className="bg-muted text-muted-foreground" />
<div className="border-border" />
<div className="bg-destructive text-destructive-foreground" />

// ❌ Wrong — hardcoded colors
<div className="bg-blue-500 text-white" />
<div className="bg-[#ff6600]" />
<div style={{ backgroundColor: "#333" }} />
```

## 2. Tailwind Scale — Avoid Arbitrary Values

Use Tailwind's built-in scale. Arbitrary values (`[]`) only when NO scale equivalent exists:

```tsx
// ✅ Correct — Tailwind scale
<div className="p-4 mt-6 gap-3 rounded-lg text-sm" />

// ⚠️ Acceptable — no scale equivalent
<div className="w-[calc(100%-2rem)]" />
<div className="max-w-[420px]" />

// ❌ Wrong — scale equivalent exists
<div className="p-[16px]" />   // Use p-4
<div className="mt-[24px]" />  // Use mt-6
<div className="gap-[12px]" /> // Use gap-3
```

## 3. Responsive Design — Mobile First

Use Tailwind breakpoints. NEVER use custom media queries or arbitrary breakpoints:

```tsx
// ✅ Correct — mobile-first with Tailwind breakpoints
<div className="flex flex-col md:flex-row" />
<div className="text-sm md:text-base lg:text-lg" />
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
<div className="px-4 md:px-6 lg:px-8" />

// ❌ Wrong — arbitrary breakpoints
<div className="max-[600px]:flex-col" />

// ❌ Wrong — CSS media queries
@media (max-width: 600px) { ... }
```

**Breakpoints reference**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 4. className Merging — Use cn()

Always use the project's `cn()` utility (clsx + tailwind-merge) for conditional classes:

```tsx
import { cn } from "@/lib/utils";

// ✅ Correct
<div className={cn(
  "flex items-center gap-2 rounded-lg p-3",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 pointer-events-none",
  className // Allow parent overrides
)} />

// ❌ Wrong — string concatenation
<div className={`flex items-center ${isActive ? "bg-primary" : ""}`} />

// ❌ Wrong — template literal without merge
<div className={`${baseClasses} ${conditionalClass}`} />
```

## 5. No Inline Styles

```tsx
// ✅ Correct — Tailwind utilities
<div className="flex items-center justify-between p-4" />

// ⚠️ Acceptable — truly dynamic values (computed at runtime)
<div style={{ transform: `translateX(${offset}px)` }} />
<div style={{ '--progress': `${percent}%` } as React.CSSProperties} />

// ❌ Wrong — static styles inline
<div style={{ display: "flex", padding: "16px" }} />
```

## 6. Layout Patterns

```tsx
// Flexbox
<div className="flex items-center justify-between gap-4" />
<div className="flex flex-col gap-2" />

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />

// Container
<div className="mx-auto max-w-7xl px-4 md:px-6" />

// Full-width section with constrained content
<section className="w-full bg-accent">
  <div className="mx-auto max-w-7xl px-4 py-12">
    {/* content */}
  </div>
</section>
```
