# Theming Rule — Semantic Variables Only

Every color in `.tsx`, `.ts`, and `.css` component files MUST come from a semantic CSS variable defined in `globals.css`. This rule has no exceptions for new code.

## Absolute Prohibitions

### 1. No `dark:` color variants in TSX/component files

```tsx
// ❌ NEVER
<div className="text-gray-800 dark:text-white/90" />
<div className="bg-white dark:bg-gray-900" />
<div className="border-gray-200 dark:border-gray-800" />

// ✅ ALWAYS
<div className="text-title-foreground" />
<div className="bg-sidebar" />
<div className="border-border" />
```

### 2. No arbitrary hex values

```tsx
// ❌ NEVER
<div className="bg-[#fff] text-[#101828] border-[#e4e7ec]" />

// ✅ ALWAYS — use the variable-backed class
<div className="bg-card text-foreground border-border" />
```

### 3. No Tailwind default palette for semantic colors

```tsx
// ❌ NEVER — Tailwind defaults not in project palette
<div className="text-blue-500 bg-green-100 text-red-600" />

// ✅ ALWAYS — project palette only
<div className="text-brand-500 bg-success-100 text-error-600" />
```

## Complete Color Mapping Reference

### Typography

| Old (light + dark:)                | New semantic class         |
| ---------------------------------- | -------------------------- |
| `text-gray-900 dark:text-white`    | `text-foreground`          |
| `text-gray-800 dark:text-white/90` | `text-title-foreground`    |
| `text-gray-800 dark:text-white/80` | `text-title-foreground/80` |
| `text-gray-700 dark:text-gray-300` | `text-body-foreground`     |
| `text-gray-700 dark:text-gray-400` | `text-body-foreground`     |
| `text-gray-600 dark:text-gray-400` | `text-muted-foreground`    |
| `text-gray-500 dark:text-gray-400` | `text-muted-foreground`    |
| `text-gray-400 dark:text-gray-500` | `text-subtle-foreground`   |
| `text-white dark:text-white`       | `text-foreground`          |

### Backgrounds

| Old (light + dark:)                        | New semantic class        |
| ------------------------------------------ | ------------------------- |
| `bg-gray-50 dark:bg-gray-950`              | `bg-background`           |
| `bg-white dark:bg-gray-dark`               | `bg-card`                 |
| `bg-white dark:bg-gray-900`                | `bg-sidebar`              |
| `bg-gray-100 dark:bg-white/5`              | `bg-secondary`            |
| `bg-gray-100 dark:bg-gray-800`             | `bg-surface-raised`       |
| `bg-gray-50 dark:bg-gray-800`              | `bg-surface-raised`       |
| `hover:bg-gray-100 dark:hover:bg-gray-800` | `hover:bg-surface-raised` |
| `hover:bg-gray-50 dark:hover:bg-gray-800`  | `hover:bg-surface-raised` |
| `hover:bg-gray-100 dark:hover:bg-white/5`  | `hover:bg-secondary`      |
| `bg-brand-50 dark:bg-brand-500/12`         | `bg-accent`               |

### Borders

| Old (light + dark:)                    | New semantic class     |
| -------------------------------------- | ---------------------- |
| `border-gray-200 dark:border-gray-800` | `border-border`        |
| `border-gray-100 dark:border-gray-700` | `border-border-subtle` |
| `border-gray-300 dark:border-gray-600` | `border-border-strong` |
| `border-gray-200 dark:border-gray-700` | `border-border`        |

### Brand / Accent

| Old (light + dark:)                  | New semantic class       |
| ------------------------------------ | ------------------------ |
| `text-brand-500 dark:text-brand-400` | `text-brand-foreground`  |
| `text-brand-600 dark:text-brand-400` | `text-accent-foreground` |
| `bg-brand-50 dark:bg-brand-500/12`   | `bg-accent`              |

### Status colors — use project palette, not Tailwind defaults

| ❌ Tailwind default                | ✅ Project palette                     |
| ---------------------------------- | -------------------------------------- |
| `text-green-500`                   | `text-success-500`                     |
| `bg-green-50 dark:bg-green-500/10` | `bg-success-50 dark:bg-success-500/10` |
| `text-red-500`                     | `text-error-500`                       |
| `bg-red-50 dark:bg-red-500/10`     | `bg-error-50 dark:bg-error-500/10`     |

## Allowed Exceptions (whitelist)

These patterns are permitted and do NOT need replacement:

| Pattern                                 | Reason                                          |
| --------------------------------------- | ----------------------------------------------- |
| `dark:hidden` / `dark:block`            | Visibility toggle, not a color                  |
| `dark:bg-input/30`                      | shadcn internals — opacity on semantic variable |
| `dark:aria-invalid:ring-destructive/40` | shadcn internals                                |
| `dark:data-[state=...]`                 | shadcn state variants                           |
| `dark:data-[variant=...]`               | shadcn variant overrides                        |
| `dark:placeholder:...`                  | shadcn input placeholder state                  |
| `bg-brand-500/10`, `bg-success-500/15`  | Transparencies on project palette colors        |
| `dark:bg-brand-500/12`                  | Only in `globals.css` @utility definitions      |
| SVG / canvas `bgColor` fields           | Fixed colors for visual seat-plan elements      |

## Available Semantic Classes (from globals.css)

```
Foreground:   text-foreground  text-title-foreground  text-body-foreground
              text-muted-foreground  text-subtle-foreground
              text-card-foreground  text-popover-foreground
              text-primary-foreground  text-secondary-foreground
              text-accent-foreground  text-brand-foreground

Background:   bg-background  bg-card  bg-sidebar  bg-popover
              bg-primary  bg-secondary  bg-muted  bg-accent
              bg-surface-raised  bg-destructive

Border:       border-border  border-border-subtle  border-border-strong
              border-input  ring-ring

Project palette (static, do NOT use with dark:):
              text-gray-{25..950}  text-brand-{25..950}  text-success-{25..950}
              text-error-{25..950}  text-warning-{25..950}  text-orange-{25..950}
              text-blue-light-{25..950}
```

## When a semantic variable is missing

If your design requires a color combination not covered above:

1. Add a new variable pair to `:root` and `.dark` in `globals.css`
2. Register it in the `@theme inline` block
3. Use the new Tailwind class — never reach for `dark:` as a shortcut
