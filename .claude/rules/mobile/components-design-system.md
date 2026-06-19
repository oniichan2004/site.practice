# Mobile Components & Design System — `apps/mobile`

> Read on demand before building or editing any UI under `apps/mobile/components/`.
> This rule **overrides** the web `react/component-patterns.md` and `styling/shadcn-ui.md`
> for the mobile app. Key divergences from the web rules: no `src/` (the `@/*` alias
> maps to `./*`), `react-i18next` not `next-intl`, a **shadcn-style kit built on
> rn-primitives + @gorhom/bottom-sheet, not shadcn/ui** (and NOT gluestack-ui — that
> was fully removed), NativeWind `className` on React Native primitives (no DOM, no
> `next/image`), `SecureStore` not `localStorage`, and the DAX API is hit directly
> (no Next.js proxy). The kit speaks **one styling language** — `cva` + `cn` +
> semantic tokens — everywhere.

---

## 1. The barrel is the contract — check it before building

`apps/mobile/components/ui/index.ts` is the **single source of truth** for what UI
exists. Before building anything custom, read it — if a component is exported there,
USE it; do not reimplement.

- ALWAYS import from the package entry `@/components/ui` — NEVER deep-path into a
  component file. This is now **lint-enforced** (`apps/mobile/eslint.config.js`):
  outside the kit, `@/components/ui/*` deep imports and all `@gluestack-ui/*` /
  `@legendapp/motion` imports are errors.
- Inside the kit, the reverse boundary is also lint-enforced: `components/ui/**`
  must NOT import `@/stores/*`, `@/lib/api/*`, or `@/providers/*`.

```tsx
// ✅ Correct — barrel import
import { Button, Dialog, DialogContent, FormField, Text } from "@/components/ui";

// ❌ Wrong — deep path bypasses the barrel (ESLint error)
import { Button } from "@/components/ui/button";

// ❌ Wrong — gluestack is gone for good (ESLint error everywhere)
import { createButton } from "@gluestack-ui/core";
```

The only files that may deep-import are siblings **inside** `components/ui/*` (e.g.
`form-field.tsx` importing `@/components/ui/input`) — and even there they use the
`@/` alias, never a relative `../`.

What the barrel currently exports (read the file for the exact list — do not trust
this table to stay current):

| Group | Exports |
|---|---|
| Forms & actions | `Text` (+`TextClassContext`), `Icon`, `Input`, `Label`, `FormField`, `Button` |
| Display | `Badge`, `Avatar` (+`AvatarFallback`, `AvatarImage`), `Separator`, `Skeleton`, `Spinner` |
| Feedback & overlay | `Dialog` (+`DialogClose/Content/Description/Footer/Header/Title/Trigger`), `BottomSheet` (+`BottomSheetContent/Item/Title`) |
| App shell | `SafeScreen`, `LoadingScreen`, `AnimatedSplash`, `ThemeRoot` |

---

## 2. One styling language — `cva` + `cn` + semantic tokens

The two-token-language era is over. Every component — kit and screen alike — styles
with `cva` variants, `cn` from `@/lib/utils`, and **semantic tokens** only
(`bg-background`, `text-foreground`, `bg-card`, `border-border`,
`text-title-foreground`, `bg-muted`, `text-muted-foreground`, `bg-primary`,
`text-primary-foreground`, `bg-accent`, `bg-sidebar`, …).

- gluestack numeric scales (`bg-primary-500`, `text-typography-700`,
  `border-outline-200`, …) **no longer exist** — `tailwind.config.js` does not
  define them (nor the old safelist). Writing one produces an undefined class that
  NativeWind drops silently.
- `tva`, `withStyleContext`, `@gluestack-ui/*`, and `@legendapp/motion` are removed;
  ESLint bans the imports everywhere.

```tsx
// ✅ Correct — semantic tokens, same language on kit and screen code
<View className="flex-1 gap-3 rounded-2xl border border-border bg-card p-4">
  <Text variant="h4">Card title</Text>
  <Button size="sm">Save</Button>
</View>

// ❌ Wrong — gluestack scale token; the class no longer resolves to anything
<Pressable className="bg-primary-500 active:bg-primary-600" />
```

See `.claude/rules/mobile/theming.md` for the token source of truth
(`lib/theme.ts` `THEME` → `lib/theme-vars.ts` → the `semantic` object in
`tailwind.config.js`).

---

## 3. `Text` is the single typography and the single form/text story

The `Text` component (`components/ui/text.tsx`) and its `variant` system ARE the
typography source for the app. Its variants (`h1`–`h4`, `p`, `lead`, `large`,
`small`, `muted`, `code`, `blockquote`, `default`) are the only sanctioned text
sizes/weights.

- ALWAYS reach for `<Text variant="…">` for headings and body copy. Do NOT introduce
  ad-hoc `text-2xl font-semibold` strings to fake a heading that a variant already
  covers.
- `Input` + `Label` + `FormField` (`components/ui/{input,label,form-field}.tsx`) are
  the single form story. `FormField` already wires `Label`, the invalid border, and
  the error/helper line using `Text` — use it instead of re-stitching the pieces.
- `Button`, `Badge`, and `BottomSheetItem` accept **plain string children** — they
  run children through `wrapTextChildren` (from `text.tsx`), which wraps raw
  strings/numbers in `<Text>` automatically. Their text styling (color, size) flows
  down via `TextClassContext`, so `<Button>Save</Button>` is correct; there is no
  `ButtonText`/`ButtonIcon` compound API anymore.

```tsx
// ✅ Correct — variant carries the type scale; FormField is the form unit
<Text variant="h2">Primitives</Text>
<FormField label="Email" placeholder="you@example.com" error={emailError} />

// ❌ Wrong — re-implementing a heading variant by hand
<Text className="text-3xl font-semibold tracking-tight">Primitives</Text>

// ❌ Wrong — hand-stitching what FormField already does
<View>
  <Label>Email</Label>
  <Input className="border-destructive" aria-invalid />
  <Text variant="small" className="text-destructive">{emailError}</Text>
</View>
```

The error/helper precedence inside `FormField` is fixed: `error` (red `small`) wins
over `helperText` (`muted`). Pass one — do not render your own message line.

---

## 4. `ThemeRoot` is the styling provider — overlays render only inside it

`ThemeRoot` (`components/ui/theme-provider.tsx`) replaced `GluestackUIProvider`. It
injects `themeVars[mode]` (the semantic CSS variables, derived from the single color
source `lib/theme.ts` `THEME`), syncs the NativeWind color scheme, and hosts the
overlay machinery: `BottomSheetModalProvider` (@gorhom/bottom-sheet) and
`PortalHost` (@rn-primitives/portal, used by `Dialog`). It must sit **inside**
`GestureHandlerRootView`. The app mounts it once at the root in `app/_layout.tsx`:

```tsx
// apps/mobile/app/_layout.tsx — the single provider mount
<GestureHandlerRootView style={{ flex: 1 }}>
  <ThemeRoot mode={colorScheme}>
    <QueryProvider>{/* … rest of the app … */}</QueryProvider>
  </ThemeRoot>
</GestureHandlerRootView>
```

- NEVER mount a second `ThemeRoot` deeper in the tree.
- NEVER render kit components (a test harness, a storybook-style preview, a detached
  portal target) outside it — every semantic `--token` var resolves to nothing and
  the element paints transparent/white.
- `Dialog` and `BottomSheet` depend on `ThemeRoot`'s `PortalHost` /
  `BottomSheetModalProvider` — outside it they cannot present at all.

---

## 5. Composition over props; `cva` + `cn` only

Build UI by composing the exported parts — do not invent monolithic mega-prop
components. `tva` is gone; every component uses `cva` for variants and `cn` from
`@/lib/utils` to merge a passed `className` **last** (so callers can override).

```tsx
// ✅ Correct — Button API: variant/size/loading, string children auto-wrapped
<Button variant="outline" size="sm" loading={isSaving} onPress={onSave}>
  Save
</Button>

// ✅ Correct — element children pass through and pick up TextClassContext
<Button variant="ghost" size="icon">
  <Icon as={Plus} />
</Button>

// ❌ Wrong — the old gluestack compound API no longer exists
<Button action="primary"><ButtonText>Save</ButtonText></Button>
```

- `Button` variants: `default | secondary | destructive | outline | ghost | link`;
  sizes: `default | sm | lg | icon`; `loading` shows a `Spinner` and disables (it
  replaced `ButtonSpinner`).
- When a component needs text styling for its children, provide it via
  `TextClassContext.Provider` (see `button.tsx`, `badge.tsx`) — never by cloning
  children.
- Customize via the `className` prop only — NEVER edit a kit component to apply a
  one-off, screen-specific look.

---

## 6. `SafeScreen` is the screen wrapper

Every screen (a `app/**/` route's default export, or its top-level page component)
wraps its content in `SafeScreen` (`components/ui/safe-screen.tsx`) — it owns the
safe-area insets, `bg-background`, optional scrolling, and `keyboardShouldPersistTaps`.

- ALWAYS wrap screen content in `SafeScreen`. Do NOT hand-roll
  `SafeAreaView` + `ScrollView` + `bg-background` per screen.
- Use `scroll` for scrollable screens and `contentClassName` for inner padding; pass
  `edges` to control which insets apply.
- Per the web `ssr-patterns.md` carry-over: keep layout chrome (insets, background,
  scroll) in `SafeScreen`/layout components, not duplicated inside leaf widgets.

```tsx
// ✅ Correct — the design screen, app/(tabs)/design.tsx
export default function DesignScreen() {
  return (
    <SafeScreen scroll edges={[]} contentClassName="px-4 pt-4">
      <DesignShowcase />
    </SafeScreen>
  );
}
```

Sticky chrome (logo, theme toggle, language switcher, avatar) lives in
`components/layout/app-header.tsx` and its siblings — reuse those, don't re-create
header rows inline.

---

## 7. Re-adding a component — the RNR procedure

The unwired gluestack scaffolds were **deleted**, not quarantined — there is no
dormant inventory to wire up. When the app needs a component the kit doesn't have
(Card, Checkbox, Switch, Radio, Alert, …), re-add it from a **React Native
Reusables (RNR) recipe**, in this order:

1. Take the RNR recipe for the component.
2. Reconcile its tokens to the project's semantic classes (§2) — no raw Tailwind
   palette, no hex, no invented keys.
3. Verify it renders under `ThemeRoot` (§4) and uses `cva` + `cn` (§5).
4. Export it from the barrel (`components/ui/index.ts`).
5. Demo it in the design showcase (`app/(tabs)/design.tsx` →
   `components/pages/design/`).
6. Document it in `apps/mobile/docs/design-system.md`.

- NEVER add a half-reconciled component to the barrel "to use it once". An export
  in the barrel is a promise that the component is token-reconciled, demoed, and
  documented.
- NEVER copy an old gluestack component back from git history — RNR recipes are the
  source for new primitives.

---

## 8. Document every newly added component

When you add a component to the barrel, document it in
`apps/mobile/docs/design-system.md` (the kit's living doc — variant/prop API plus a
minimal usage snippet) and add a live preview to the design showcase so it stays
demonstrable.

- The showcase lives at `app/(tabs)/design.tsx` → `DesignShowcase` →
  `components/pages/design/sections/*`. Add the new component to the relevant
  section (or a new `*Section.tsx`) so reviewers can see it rendered.
- A component that is in the barrel but neither shown in the showcase nor documented
  is incomplete — finish both before considering the work done.

---

## 9. Pre-component checklist

Before creating or editing a mobile UI component, confirm in order:

1. **Check the barrel** (`components/ui/index.ts`) — does it already exist? If yes,
   reuse via `@/components/ui`; deep imports are an ESLint error (§1).
2. **One styling language** — `cva` + `cn` + semantic tokens; no gluestack scale
   classes (they no longer resolve), no `@gluestack-ui/*` imports (§2).
3. **Typography/forms** → `Text` variants and `FormField`/`Input`/`Label`; string
   children of `Button`/`Badge` are auto-wrapped — no compound `*Text` parts (§3).
4. **Overlay or themed component?** → confirm it renders under the root `ThemeRoot`
   (§4); never mount a second one.
5. **Variants** → `cva` for variants, `cn` to merge `className` last (§5).
6. **Screen?** → wrap in `SafeScreen` (§6).
7. **Missing component?** → follow the RNR re-add procedure: recipe → token
   reconcile → barrel → showcase → docs (§7–§8).

When in doubt about whether a component belongs in the kit or in
`components/pages/<slug>/`, ask: if two screens need it, it's a kit candidate.
