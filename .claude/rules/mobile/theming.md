# Mobile Theming Rule — One Token System, One Source

> Read on demand for `apps/mobile`. Overrides the web `theming.md` for this app:
> there is **no `src/`** so `@/*` maps to `./*`, fonts load via `useFonts` (not
> `next/font`), the design system is the **shadcn-style kit in `components/ui`**
> (gluestack-ui was fully removed), and colors come from **one token system** —
> semantic tokens, everywhere. There is no `globals.css` and no shared tokens
> package; the variables are injected at runtime by
> `ThemeRoot` from `lib/theme-vars.ts`, derived from the single color source
> `lib/theme.ts`.

Every color in `apps/mobile/**/*.{ts,tsx}` MUST be a declared semantic token (or a
declared static project-palette key). Using a color class that isn't a declared key
produces an **undefined class** — NativeWind drops it silently, which is exactly the
`bg-sidebar` bug that rendered a white screen. This rule has no exceptions for new
code.

---

## 1. The one token system (and where it comes from)

Semantic classes — `bg-background`, `text-foreground`, `bg-card`, `bg-sidebar`,
`border-border`, `text-title-foreground`, `bg-surface-raised`, … — are legal in ALL
mobile code: `app/**`, `components/**` (kit included), `providers/**`. The chain
behind them, self-contained in `apps/mobile`:

| Piece | File | Role |
|---|---|---|
| `THEME` | `lib/theme.ts` | **Single source of color truth** — every token as an `hsl(...)` string per scheme; also feeds `NAV_THEME` and native `color` props |
| `themeVars` | `lib/theme-vars.ts` | **Derived** from `THEME` (camelCase key → `--kebab-case` var) — never hand-maintained |
| `ThemeRoot` | `components/ui/theme-provider.tsx` | Injects `themeVars[mode]` via NativeWind `vars()` and syncs the color scheme — this is what switches light/dark at runtime |
| `semantic` object | `tailwind.config.js` | Maps each class to `hsl(var(--token))` so `bg-sidebar` etc. resolve against the injected set |

```tsx
// ✅ Everywhere — semantic tokens, one language
<View className="flex-1 bg-sidebar">
  <Text variant="h3" className="text-title-foreground">…</Text>
</View>

// ❌ Nowhere — gluestack numeric scales no longer exist (see §4)
<Pressable className="bg-primary-500 active:bg-primary-600">…</Pressable>
```

For code that can't read a CSS class (gorhom sheet `backgroundStyle`, icon tints,
navigation theme), resolve the color from `THEME[scheme]` directly — e.g.
`components/ui/bottom-sheet.tsx` passes `palette.card` / `palette.mutedForeground`.
That is the sanctioned native-color-from-`THEME` exception, not a licence for hex.

---

## 2. NEVER use an undeclared semantic color class

This is the white-screen bug. A `bg-*` / `text-*` / `border-*` semantic class is only
real if its key is declared in the `semantic` object in
`apps/mobile/tailwind.config.js` AND its `--var` exists in `THEME` (both schemes).
`bg-sidebar` worked **only after** `sidebar` was added to both halves. Before that,
the class was undefined, NativeWind emitted nothing, and the screen painted white.

```tsx
// ❌ NEVER — if `panel` is not a declared key, this class is dropped silently
<View className="bg-panel" />

// ✅ ALWAYS — use a class whose key exists in the tailwind.config.js `semantic` object
<View className="bg-surface-raised" />
```

Declared semantic keys (from the `semantic` object in `tailwind.config.js`):

```
Backgrounds:  bg-background  bg-card  bg-sidebar  bg-popover  bg-muted  bg-accent
              bg-secondary  bg-primary  bg-surface-raised  bg-destructive
Foreground:   text-foreground  text-card-foreground  text-popover-foreground
              text-muted-foreground  text-accent-foreground  text-secondary-foreground
              text-primary-foreground  text-destructive-foreground
              text-title-foreground  text-body-foreground  text-subtle-foreground
              text-brand-foreground  text-sidebar-foreground
Borders:      border-border  border-input  ring-ring
Project palette (static hex, do NOT pair with dark:):  brand-{25..950}  gray-{25..950,dark}
              success/error/warning/orange-{50,100,500,600(,700)}  chart-{1..5}
```

If you reference any key not in this list, you are creating the `bg-sidebar` bug
again. Stop and add the token first (§3).

---

## 3. Adding a new semantic color is a TWO-step change — no rebuild, no hand-edits

A semantic token does not exist until BOTH halves agree. Everything happens inside
`apps/mobile`:

1. **Add the token to `THEME` in `lib/theme.ts` — BOTH schemes** (`light` **and**
   `dark`). Light-only (or dark-only) means a missing value in one theme, i.e. a
   broken class in that theme. `themeVars` (`lib/theme-vars.ts`) derives the
   `--kebab-case` variable from it automatically.
2. **Register the Tailwind class** in the `semantic` object in `tailwind.config.js`
   as `"<name>": "hsl(var(--<name>))"`. Skipping this means the variable exists but
   no `bg-<name>` / `text-<name>` class is generated — the class stays undefined.

```ts
// 1) lib/theme.ts — BOTH schemes (themeVars derives --panel automatically)
light: { /* … */ panel: "hsl(0 0% 100%)" },
dark:  { /* … */ panel: "hsl(217 33% 14%)" },

// 2) tailwind.config.js — the `semantic` object
panel: "hsl(var(--panel))",
```

NEVER hand-edit values in `lib/theme-vars.ts` — it is **derived** from `THEME`
(`toCssVars`), never maintained in parallel. The same goes for `NAV_THEME`
(React Navigation), which is derived in `lib/theme.ts` from the same object. Change
a color in ONE place (`THEME`) and every consumer stays in sync.

---

## 4. gluestack numeric scales no longer exist — semantic tokens only, everywhere

`bg-primary-500`, `text-typography-700`, `border-outline-200`, etc. were the
gluestack token language. gluestack is removed: `tailwind.config.js` no longer
defines the numeric scales (and the old `safelist` that protected them is gone).
Any such class is now an **undefined class** — NativeWind drops it silently and the
element paints transparent (the §2 failure mode).

```tsx
// ❌ NEVER — anywhere, including components/ui
<View className="bg-primary-500" />
<Text className="text-typography-700" />

// ✅ ALWAYS — the semantic token
<View className="bg-primary" />
<Text className="text-foreground" />
```

If you find a leftover scale class while editing a file, replace it with the
semantic equivalent — do not "preserve" it; it renders nothing.

---

## 5. NEVER hardcode hex, NEVER use `dark:` color variants

Same as web `theming.md`. Semantic tokens already adapt to dark mode: `ThemeRoot`
injects `themeVars.light` / `themeVars.dark` per the active scheme and syncs the
NativeWind color scheme (`darkMode: "class"`). A `dark:` color variant is redundant
and a hex literal bypasses theming.

```tsx
// ❌ NEVER
<View className="bg-[#fff] dark:bg-[#181719]" />
<Text className="text-gray-800 dark:text-white/90" />

// ✅ ALWAYS — one class, adapts via the injected variable set
<View className="bg-card" />
<Text className="text-title-foreground" />
```

Allowed, exactly as on web: `dark:hidden` / `dark:block` (visibility, not color) and
the kit-internal `dark:` state/variant selectors that ship inside `components/ui/**`
(e.g. `input.tsx`'s `dark:bg-input/30`). SVG / canvas fixed colors for visual
elements are also exempt — `AnimatedSplash` is the documented example (a full-bleed
branded screen with fixed `StyleSheet` colors, intentionally scheme-independent).

---

## 6. Colors are self-contained — no shared tokens package

Mobile colors are fully self-contained: `global.css` is just the three
`@tailwind` directives, and `tailwind.config.js` declares the `semantic` object
inline. There is **no generated CSS to import and no tokens build to run** before
starting the mobile app. There is no shared design-tokens package in the monorepo
anymore — each app, web and mobile, owns its tokens directly (the web apps inline
theirs in `globals.css`).

- Do NOT introduce a build-time-generated shared tokens import "to share tokens" —
  the mobile chain is `THEME` → `themeVars` → `tailwind.config.js` (§1), by design.

---

## 7. Reference a font only after you load it

`tailwind.config.js` registers `fontFamily.outfit = ["Outfit", "sans-serif"]`, so
`font-outfit` is a valid class — but **Outfit is not loaded anywhere** (no `useFonts`
/ `expo-font` call in `app/_layout.tsx`), and no file currently uses the class.

- If you want `font-outfit` to actually render Outfit, load it first via `useFonts`
  (e.g. in `app/_layout.tsx`, gating render until fonts are ready), then use the class.
- Otherwise don't reach for the `font-outfit` class — it silently falls back to the
  system font. Do not assume a registered `fontFamily` key means the font exists.

---

## 8. Pre-edit checklist (colors on mobile)

Before adding any color class under `apps/mobile/`:

1. **Is the key declared?** Confirm it exists in the `semantic` object in
   `tailwind.config.js` (and in `THEME`). If not, you are about to recreate the
   `bg-sidebar` bug (§2).
2. **Need a new token?** Add it to BOTH schemes in `THEME` (`lib/theme.ts`) AND to
   the `semantic` object in `tailwind.config.js` — never hand-edit
   `lib/theme-vars.ts` (§3).
3. **No gluestack scale classes** — they no longer exist anywhere (§4).
4. **No hex, no `dark:` color variants** (§5). Native color props read
   `THEME[scheme]`, not literals (§1).
5. **Touching fonts?** Don't reference `font-outfit` unless Outfit is loaded via
   `useFonts` (§7).
