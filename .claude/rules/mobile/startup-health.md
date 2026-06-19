# Startup Health — Anti-White-Screen Checklist for `apps/mobile`

> Read on demand for `apps/mobile`. Overrides the corresponding web SSR/hydration
> guidance for this app: there is **no** `src/` (so `@/*` → `./*`, not `./src/*`),
> the app uses **react-i18next** not `next-intl`, the **shadcn-style kit in
> `components/ui`** not shadcn/ui (gluestack-ui was removed),
> **expo-secure-store** not `localStorage`, and a **direct** `EXPO_PUBLIC_DAX_API_URL`
> not the Next.js `/api/dax` proxy. There is no SSR — a "white screen" here is a
> failed/blocked first client render, not a hydration mismatch.

This rule is the cross-cutting startup checklist for the Expo Router app. Every item
below maps to a real failure mode that produces a blank/white screen on launch. Had
this file existed, it would have prevented the reported white screen. Apply it before
touching `app/_layout.tsx`, any group `_layout.tsx`, the auth gate, or the token /
theme plumbing.

---

## 1. Wrap the root tree in an ErrorBoundary

A throw during the first render of `app/_layout.tsx` unmounts the whole tree and
leaves a white screen with no UI to recover from. The root layout MUST export an
`ErrorBoundary` (Expo Router renders it automatically when a route segment throws)
and the app MUST ship a `app/+not-found.tsx` so an unmatched deep link renders a
screen instead of nothing.

```tsx
// app/_layout.tsx — ErrorBoundary export
// ✅ Correct — Expo Router auto-renders this when any screen under the segment throws
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={themeVars.light} className="flex-1 bg-sidebar p-6">
        <Text>{error.message}</Text>
        <Button onPress={retry}>Retry</Button>
      </View>
    </GestureHandlerRootView>
  );
}
```

```tsx
// ❌ Wrong — no ErrorBoundary, no +not-found.tsx
// A thrown render or an unknown route → blank screen, no recovery path.
```

- The `ErrorBoundary` fallback MUST have the semantic CSS variables available —
  either render it inside `ThemeRoot` (see §4) or apply `themeVars[mode]`
  (`lib/theme-vars.ts`) to its root `View`, as `app/_layout.tsx` does — otherwise
  the recovery screen is also unstyled/white.
- `app/_layout.tsx` exports the `ErrorBoundary` and `app/+not-found.tsx` exists —
  do NOT regress either.

---

## 2. Gate the splash on `isAuthenticated`, never on `undetermined`

`useAuthStore.isAuthenticated` is `boolean | null` — `null` until the first
`checkSession()` resolves (`stores/auth.ts:33-34`, `:58`). The native splash MUST
stay visible until that flag is a concrete `true`/`false`, and MUST NEVER auto-hide
while auth is `null`. Hiding early reveals an empty navigator before `AuthGuard`'s
redirect runs (`app/_layout.tsx:25-31`) — the white flash.

```tsx
// app/_layout.tsx (planned splash wiring)
import * as SplashScreen from "expo-splash-screen";
void SplashScreen.preventAutoHideAsync(); // module scope

function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // ...existing checkSession + redirect effects...

  useEffect(() => {
    // ✅ Correct — only hide once auth is determined (not null)
    if (isAuthenticated !== null) void SplashScreen.hideAsync();
  }, [isAuthenticated]);

  return null;
}
```

```tsx
// ❌ Wrong — hides while auth is still null → empty Stack shows, then a redirect jumps
useEffect(() => { void SplashScreen.hideAsync(); }, []);
```

- ALWAYS call `preventAutoHideAsync()` at module scope and `hideAsync()` only inside
  the determined branch.
- NEVER drive the splash off a timer or off mount — drive it off the auth flag.

---

## 3. `checkSession` MUST try/catch and force `isAuthenticated = false` on failure

`checkSession()` reads the session from SecureStore (`tokenStore.hasSession()` /
`isBiometricEnabled()`). A SecureStore read can throw on device. If the throw escapes,
`isAuthenticated` stays stuck on `null` forever, the gate in §2 never resolves, and
the splash/blank screen never clears. The store already guards this — keep it.

```ts
// stores/auth.ts:67-84 — the fix, do NOT regress it
checkSession: async () => {
  try {
    const [has, biometricEnabled] = await Promise.all([
      tokenStore.hasSession(),
      tokenStore.isBiometricEnabled(),
    ]);
    set({ isAuthenticated: has, biometricEnabled, isLocked: has && biometricEnabled });
  } catch {
    // ✅ A SecureStore read failure resolves to logged-out rather than leaving
    // isAuthenticated stuck on `null` (which blocks the auth gate forever
    // and renders a permanent blank screen).
    set({ isAuthenticated: false, isLocked: false });
  }
},
```

```ts
// ❌ Wrong — an unguarded throw leaves isAuthenticated === null → permanent blank
checkSession: async () => {
  const has = await tokenStore.hasSession();
  set({ isAuthenticated: has });
},
```

- ANY async store action that gates first render MUST resolve its gate flag to a
  concrete value in both the success and the failure path. Never let a startup gate
  hang on its sentinel.

---

## 4. NEVER render kit components outside `ThemeRoot`

The provider (`components/ui/theme-provider.tsx`) injects the semantic color CSS
variables at runtime via NativeWind `vars()` (`themeVars[mode]`, derived from
`lib/theme.ts` `THEME`) and hosts the overlay machinery — `BottomSheetModalProvider`
(@gorhom/bottom-sheet) and `PortalHost` (@rn-primitives/portal, used by `Dialog`).
A component rendered above or outside that `<View>` resolves every `--token` var to
nothing → it renders unstyled / transparent / white, and overlay components
(`Dialog`, `BottomSheet`) cannot present for missing context.

```tsx
// app/_layout.tsx — the provider is the outermost styling wrapper
// ✅ Correct — everything that renders kit UI lives inside it
<GestureHandlerRootView style={{ flex: 1 }}>
  <ThemeRoot mode={colorScheme}>
    {/* QueryProvider → I18nProvider → ThemeProvider → Stack, AnimatedSplash */}
  </ThemeRoot>
</GestureHandlerRootView>
```

```tsx
// ❌ Wrong — kit UI / a portal target OUTSIDE the provider
<PortalHost />     {/* a Dialog portals here */}
<ThemeRoot mode={colorScheme}>... {/* too late — the portal already mounted unstyled */}
```

- The `ErrorBoundary` fallback (§1) and any portal host that renders kit UI MUST
  sit **inside** the provider (or apply `themeVars[mode]` itself, §1).
- `ThemeRoot` must itself sit inside `GestureHandlerRootView` (the bottom-sheet
  gestures depend on it) — keep the `app/_layout.tsx` nesting order.

### 4a. NEVER ship a `bg-`/`text-`/`border-` class that maps to no CSS var

Semantic mobile tokens are self-contained: the class is declared in the `semantic`
object in `apps/mobile/tailwind.config.js`, and the matching `--var` is injected at
runtime by `ThemeRoot` from `lib/theme-vars.ts` (derived from `lib/theme.ts`
`THEME`). Mobile colors are fully self-contained. A utility
class only produces a real color when **both** halves exist: the Tailwind color
entry **and** the `--var`. Ship a class whose var is undefined and the element
paints transparent — on a full-screen container that is a white screen. This is the
`bg-sidebar` incident: the class `bg-sidebar` on the auth shell renders blank
whenever `--sidebar` is absent. (`sidebar`/`--sidebar` are present in the current
config and `THEME` — keep them in sync; cross-ref `theming.md`.)

```tsx
// ✅ Correct — class backed by both a tailwind color entry and a --var
<View className="flex-1 bg-sidebar" />          // requires `sidebar` in THEME + tailwind.config.js

// ❌ Wrong — invented/typo'd token with no --var → transparent, no error
<View className="flex-1 bg-side-bar" />
```

- Use only tokens that exist in the `semantic` object AND in `THEME` (both
  schemes). When adding a semantic color, add it to `THEME` in `lib/theme.ts` and
  to the `semantic` object — never add the class alone (see `theming.md` §3).
- Static project palette classes (`bg-error-600`, `text-success-500`,
  `bg-brand-500`) are fine; do not reach for raw Tailwind defaults, and remember
  the gluestack numeric scales (`bg-primary-500`, …) no longer exist at all.

---

## 5. A custom layout with siblings before the navigator MUST wrap it in `flex-1`

When a group `_layout.tsx` renders its own chrome (header, switcher) as siblings
**above** the `<Stack>`/`<Tabs>`, the navigator collapses to zero height unless it is
wrapped in a flex child. A zero-height navigator paints nothing — white screen below
the chrome. This is the `(auth)/_layout.tsx` fix.

```tsx
// app/(auth)/_layout.tsx:8-26 — the fix
// ✅ Correct — chrome is a sibling, the Stack is wrapped in flex-1
<View className="flex-1 bg-sidebar">
  <SafeAreaView edges={["top"]} className="bg-sidebar">
    <View className="flex-row justify-end gap-2 px-6 pt-2 pb-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </View>
  </SafeAreaView>
  <View className="flex-1">      {/* ← without this, the Stack has 0 height */}
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }} />
  </View>
</View>
```

```tsx
// ❌ Wrong — Stack is a bare sibling with no flex parent → collapses to 0px
<View className="flex-1">
  <Header />
  <Stack />            {/* renders nothing visible */}
</View>
```

- The root `app/_layout.tsx` is exempt: its `<Stack>` has no sibling chrome above it
  (only `AuthGuard`, which returns `null`, and overlays after it).
- RULE: any navigator that is **not** the only child of its parent MUST be wrapped in a
  `<View className="flex-1">`.

---

## 6. Mobile colors are self-contained — no tokens-package build prerequisite

Mobile colors are fully self-contained: `global.css` is just the
three `@tailwind` directives, and `tailwind.config.js` declares the `semantic`
color object inline. Starting Metro requires **no** tokens build — the old
shared-tokens-package "`Cannot find module '.../dist/index.js'`" startup failure
cannot happen here anymore. (There is no shared design-tokens package in the
monorepo anymore — each app, web and mobile, owns its tokens directly.)

- Do NOT introduce a build-time-generated shared tokens require/import in
  `tailwind.config.js` or `global.css` — that would re-create the build-order
  failure mode this section used to track. The color chain is
  `THEME` (`lib/theme.ts`) → `themeVars` (`lib/theme-vars.ts`) → the `semantic`
  object in `tailwind.config.js` (§4a, cross-ref `theming.md`).

---

## White screen? Check in this order

1. **Metro** — does the bundler even start? Mobile colors are self-contained (§6);
   a module-resolution error on launch points elsewhere (e.g. a missing dependency).
2. **Auth gate hung** — is `isAuthenticated` stuck on `null`? Confirm `checkSession`'s
   try/catch forces `false` on failure (§3) and the splash hides only when the flag is
   determined (§2).
3. **Provider scope** — is a kit component (or the ErrorBoundary / portal target)
   rendering outside `ThemeRoot`? (§4)
4. **Dead token class** — is a full-screen container using a `bg-`/`text-`/`border-`
   class whose `--var` doesn't exist? (§4a, cross-ref `theming.md`)
5. **Collapsed navigator** — does a group `_layout.tsx` put chrome before a `Stack`/
   `Tabs` without a `flex-1` wrapper? (§5)
6. **Unhandled throw / bad route** — add the `ErrorBoundary` export and
   `app/+not-found.tsx` so the failure renders a screen instead of nothing (§1).
