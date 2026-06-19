# Tailwind CSS Patterns

## Metadata

- **triggers**: styling, responsive, grid, flex, dark mode, container query, layout
- **priority**: 1
- **context**: tailwindcss
- **conflicts**: none

## When to Activate

- Building responsive layouts
- Implementing complex grid systems
- Adding animations and transitions
- Implementing dark mode
- Creating reusable layout patterns

## Responsive Layout Patterns

### Hero Section

```tsx
<section className="relative w-full bg-accent py-12 md:py-20 lg:py-28">
  <div className="mx-auto max-w-7xl px-4 md:px-6">
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground md:text-xl">{subtitle}</p>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <Image src={image} alt="" fill className="object-cover" />
      </div>
    </div>
  </div>
</section>
```

### Card Grid (Responsive)

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <Card key={item.id} className="flex flex-col">
      <CardContent className="flex-1">{/* ... */}</CardContent>
      <CardFooter>{/* ... */}</CardFooter>
    </Card>
  ))}
</div>
```

### Sidebar Layout

```tsx
<div className="flex min-h-screen">
  <aside className="hidden w-64 shrink-0 border-r md:block">
    <nav className="sticky top-0 p-4">{/* sidebar */}</nav>
  </aside>
  <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
</div>
```

### Sticky Header

```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
    <Logo />
    <Nav />
  </div>
</header>
```

## Animation Patterns

### Hover Effects

```tsx
// Scale on hover
<div className="transition-transform hover:scale-105" />

// Color transition
<button className="transition-colors hover:bg-primary/90" />

// Shadow lift
<div className="transition-shadow hover:shadow-lg" />

// Combined
<Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" />
```

### Enter Animations (with tailwindcss-animate)

```tsx
<div className="animate-in fade-in slide-in-from-bottom-4 duration-500" />
<div className="animate-in fade-in zoom-in-95 duration-300" />
```

### Skeleton Loading

```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 w-3/4 rounded bg-muted" />
  <div className="h-4 w-1/2 rounded bg-muted" />
  <div className="h-32 rounded-lg bg-muted" />
</div>
```

## Spacing Scale Reference

| Class             | Size |
| ----------------- | ---- |
| `p-1` / `gap-1`   | 4px  |
| `p-2` / `gap-2`   | 8px  |
| `p-3` / `gap-3`   | 12px |
| `p-4` / `gap-4`   | 16px |
| `p-6` / `gap-6`   | 24px |
| `p-8` / `gap-8`   | 32px |
| `p-12` / `gap-12` | 48px |
| `p-16` / `gap-16` | 64px |

## Truncation and Text Overflow

```tsx
// Single line truncation
<p className="truncate">Long text here...</p>

// Multi-line clamp
<p className="line-clamp-3">Will show max 3 lines with ellipsis...</p>

// No-wrap
<span className="whitespace-nowrap">Never wraps</span>
```

## Dark Mode (CSS Variables)

With theme CSS variables, dark mode works automatically:

```tsx
// These adapt to dark mode via CSS variables
<div className="bg-background text-foreground" />
<div className="bg-card text-card-foreground" />
<div className="border-border" />
```

No need for `dark:` prefix when using theme variables correctly.
