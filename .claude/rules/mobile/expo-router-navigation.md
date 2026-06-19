# Expo Router Navigation Rules (apps/mobile)

> Read on demand for `apps/mobile` work — overrides the web App Router rules
> (`nextjs/app-router.md`, `nextjs/ssr-patterns.md`) for this app. Key divergences:
> this is **Expo Router** (file-based, but native — no RSC, no `"use client"`, every
> screen is a client component); `@/*` maps to **`./*`** (there is no `src/`); auth
> session lives in **SecureStore** (`tokenStore`), not `localStorage`; i18n is
> **react-i18next** (`useTranslation`), not `next-intl`; UI is **gluestack-ui**, not
> shadcn. Navigation, the auth gate, and the splash are controlled declaratively here,
> not with the web's middleware/`redirect()`.

The `apps/mobile` route tree is the source of truth for navigation. Each route group
maps to a directory under `apps/mobile/app/`, and **every navigator screen name must
resolve to a real file in that tree**. The rules below are mandatory for new code.

---

## 1. Route groups & file conventions

The router reads the filesystem. Today's tree:

```
apps/mobile/app/
├── _layout.tsx            ← root Stack: (auth) + (tabs), providers, AuthGuard, splash
├── (auth)/
│   ├── _layout.tsx        ← auth shell (lang/theme switchers + Stack)
│   ├── signin.tsx
│   └── reset-password.tsx
└── (tabs)/
    ├── _layout.tsx        ← bottom Tabs
    ├── index.tsx          ← dashboard tab
    ├── design.tsx         ← design-system tab
    └── profile.tsx        ← hidden tab (href: null)
```

| File | Purpose |
|---|---|
| `_layout.tsx` | Declares the navigator (`Stack` / `Tabs`) for that segment |
| `(group)/` | Route **group** — organises files without adding a URL segment |
| `index.tsx` | The default route of its segment |
| `+not-found.tsx` | Catch-all 404 screen (root level) — **(planned)** |
| `[param].tsx` | Dynamic segment |

- Parentheses groups (`(auth)`, `(tabs)`) do **not** appear in the path — they exist
  to give a segment its own `_layout.tsx` and to gate it (see §3).
- A screen hidden from a `Tabs` bar still needs a real file — `profile.tsx` is shown
  in the tree but kept out of the bar with `options={{ href: null }}` in
  `app/(tabs)/_layout.tsx`. That is the correct way to hide a tab; do **not** delete
  the file.

---

## 2. Every `Screen` name MUST back a real route file

A `Tabs.Screen` / `Stack.Screen` whose `name` has no matching file is a **dangling
route**: Expo Router warns, and on a tab bar it renders a ghost button that navigates
nowhere. A dangling `routes` tab was just removed from `app/(tabs)/_layout.tsx` for
exactly this reason — there was no `app/(tabs)/routes.tsx`.

```tsx
// ✅ Correct — app/(tabs)/_layout.tsx, every name has a file
<Tabs screenOptions={{ headerShown: true, header: () => <AppHeader /> }}>
  <Tabs.Screen name="index" options={{ title: t("sidebar.dashboard") }} />
  <Tabs.Screen name="design" options={{ title: t("sidebar.designSystem") }} />
  <Tabs.Screen name="profile" options={{ href: null }} />
</Tabs>

// ❌ Wrong — "routes" has no app/(tabs)/routes.tsx → ghost tab, router warning
<Tabs.Screen name="routes" options={{ title: t("sidebar.routes") }} />
```

- ALWAYS create the route file **before** (or in the same change as) adding its
  `Screen`. NEVER add a `Screen` "to be filled in later".
- The root `Stack` in `app/_layout.tsx` declares exactly the two groups that exist —
  `<Stack.Screen name="(auth)" />` and `<Stack.Screen name="(tabs)" />`. Adding a
  third `Stack.Screen` requires a third directory under `app/`.
- You do not need to declare every screen explicitly; the router auto-registers files.
  Declare a `Screen` only to set its `options`. But any name you **do** declare must
  exist.

---

## 3. Gate auth declaratively with `<Redirect>` — not `router.replace` in an effect

The current gate in `app/_layout.tsx` is imperative and runs inside a `useEffect`:

```tsx
// ❌ Current AuthGuard (app/_layout.tsx) — to be replaced
function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkSession = useAuthStore((s) => s.checkSession);
  const loadProfile = useAuthStore((s) => s.loadProfile);

  useEffect(() => { checkSession(); }, [checkSession]);

  useEffect(() => {
    if (isAuthenticated === false) router.replace("/(auth)/signin");
    if (isAuthenticated === true) {
      void loadProfile();
      router.replace("/(tabs)");      // imperative navigation as a side effect
    }
  }, [isAuthenticated, loadProfile]);

  return null;                         // also violates §5 — never render null
}
```

Problems: navigation fires from a side effect after the first paint (visible flash of
the wrong group), the gate is invisible to the router until the effect runs, and it
returns `null`. **MUST** instead decide the destination during render with
`<Redirect>` so the router never mounts the wrong group:

```tsx
// ✅ Correct — app/index.tsx (planned), the auth-decider screen
import { Redirect } from "expo-router";

import { useAuthStore } from "@/stores/auth";
import { LoadingScreen } from "@/components/ui/loading-screen"; // planned

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // `null` = the first SecureStore session check hasn't resolved yet.
  if (isAuthenticated === null) return <LoadingScreen />;       // §5

  return isAuthenticated ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/signin" />
  );
}
```

- The `null` / `true` / `false` tri-state is intentional: `isAuthenticated` in
  `stores/auth.ts` starts `null` and only flips once `checkSession()` resolves the
  SecureStore read. `null` MUST map to a loading view, never to a redirect.
- `checkSession()` still runs once at startup — call it from the root layout's
  `useEffect` (a legitimate "sync with external system" effect per
  `react/hooks-rules.md` §4). The **redirect decision** moves out of the effect and
  into render.
- Post-login navigation from inside `signin.tsx` after a successful
  `authClient.login(...)` (`router.replace("/(tabs)")`) is fine — that's an explicit
  user-action handler, not the standing auth gate. Do not confuse the two: the *gate*
  is declarative, *user actions* navigate imperatively.
- NEVER rely **solely** on imperative `router.replace` inside a `useEffect` to keep an
  unauthenticated user out of `(tabs)`. The declarative redirect is the gate; an
  effect is at best a redundant backstop.

---

## 4. `unstable_settings.anchor` MUST NOT point at the authenticated group

`app/_layout.tsx` currently anchors to the protected group:

```tsx
// ❌ Wrong — current app/_layout.tsx
export const unstable_settings = { anchor: "(tabs)" };
```

The `anchor` is the segment the router treats as the back-stack root / deep-link
fallback. Anchoring to `(tabs)` tells the router the authenticated area is the
home base, so a cold deep-link or a back gesture can land an unauthenticated user
inside `(tabs)` before the gate resolves.

```tsx
// ✅ Correct — anchor the neutral decider (or the auth group)
export const unstable_settings = { anchor: "index" }; // app/index.tsx (planned)
```

- MUST anchor to the auth-decider `app/index.tsx` (planned, §3) or to `(auth)`.
- NEVER anchor to `(tabs)` or any other authenticated group.

---

## 5. An auth gate / loading screen MUST render a view, never `null`

Returning `null` while auth is undetermined paints a blank (white on light theme)
screen with no feedback — and combined with the splash rules in §6 it can look like a
frozen app.

```tsx
// ❌ Wrong — current AuthGuard returns null
return null;

// ✅ Correct — a themed loading view
return (
  <View className="flex-1 items-center justify-center bg-sidebar">
    <ActivityIndicator />
  </View>
);
```

- NEVER `return null` from a screen or gate that the user can actually be sitting on.
- The loading view MUST use theme tokens (`bg-sidebar`, etc.) per `theming.md`, not a
  bare unstyled `<View>`, so it matches light/dark.

---

## 6. Control the splash explicitly — keep it up until auth is *determined*

`app.json` configures the `expo-splash-screen` plugin, which by default auto-hides as
soon as the first frame paints. Because the first frame can render **before**
`checkSession()` has read SecureStore (`isAuthenticated === null`), the splash can
vanish to reveal the loading/blank state. MUST take manual control:

```tsx
// ✅ Correct — app/_layout.tsx
import * as SplashScreen from "expo-splash-screen";

// Module scope: stop the auto-hide before first paint.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    // Hide only once the session check has resolved to a real boolean.
    if (isAuthenticated !== null) void SplashScreen.hideAsync();
  }, [isAuthenticated]);

  // ...providers + <Stack>
}
```

- MUST call `SplashScreen.preventAutoHideAsync()` at module scope (before the first
  render) and tie `SplashScreen.hideAsync()` to `isAuthenticated !== null`.
- NEVER hide the splash while `isAuthenticated === null` — that is the exact window the
  splash exists to cover.
- Gate `hideAsync` on the auth tri-state from `stores/auth.ts`, not on `null` itself
  being truthy/falsy — `isAuthenticated === false` (logged out) is a *determined*
  state and SHOULD hide the splash.

---

## 7. Respect `typedRoutes` — NEVER cast an `href` to `any`

`app.json` sets `experiments.typedRoutes: true`, so every `Link href` / `router.push`
target is checked against the real route tree. Casting defeats the one guard that
catches a broken link at compile time.

```tsx
// ❌ Wrong — app/(auth)/signin.tsx (~line 284) bypasses typedRoutes
<Link href={"/reset-password" as any} asChild>

// ✅ Correct — typed, group-qualified href
<Link href="/(auth)/reset-password" asChild>
```

- NEVER `as any` (or `as Href`) an `href` to silence a type error — the error means
  the route is wrong or doesn't exist (`reset-password.tsx` lives under `(auth)`, so
  the bare `/reset-password` is what failed the check). Fix the path instead.
- If `typedRoutes` cannot resolve a genuinely dynamic target, build it with the typed
  `Href` object form (`{ pathname, params }`), never a string cast.

---

## 8. Ship `+not-found.tsx` and a root error boundary

- MUST add `app/+not-found.tsx` (planned) so an unknown deep link renders a real
  screen with a "go home" `<Link href="/" />` instead of the dev red box / a blank
  native view.
- MUST export a root `ErrorBoundary` from `app/_layout.tsx` (planned) so a render
  error in any screen is caught and shown as a themed fallback rather than crashing to
  a white screen. Expo Router renders a layout's exported `ErrorBoundary` for errors in
  that segment.

```tsx
// ✅ app/_layout.tsx (planned) — Expo Router picks this export up automatically
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-sidebar p-6">
      <Text variant="muted">{error.message}</Text>
      <Button onPress={retry}>
        <ButtonText>{t("common.retry")}</ButtonText>
      </Button>
    </View>
  );
}
```

---

## 9. A custom layout with siblings before a `Stack` MUST wrap the navigator in `flex-1`

When a `_layout.tsx` renders its own chrome (header, switchers) **as siblings** above
the navigator, the navigator does not inherit a height and collapses to zero —
rendering as a blank white screen below the chrome. This was the bug fixed in
`app/(auth)/_layout.tsx`: the `<Stack>` is wrapped in a `flex-1` `View`.

```tsx
// ✅ Correct — app/(auth)/_layout.tsx
export default function AuthLayout() {
  return (
    <View className="flex-1 bg-sidebar">
      <SafeAreaView edges={["top"]} className="bg-sidebar">
        <View className="flex-row justify-end gap-2 px-6 pt-2 pb-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </View>
      </SafeAreaView>
      <View className="flex-1">           {/* gives the Stack its height */}
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

// ❌ Wrong — Stack has no flex parent → zero height → white screen
return (
  <View className="flex-1 bg-sidebar">
    <Header />
    <Stack screenOptions={{ headerShown: false }} />  {/* collapses */}
  </View>
);
```

- A bare `_layout.tsx` that returns only `<Stack />` / `<Tabs />` (like
  `app/(tabs)/_layout.tsx`) needs no wrapper — the navigator fills the screen.
- The moment you add a sibling element next to the navigator, the navigator MUST be
  wrapped in a `flex-1` `View` (or the root must be a flex column that lets it grow).
- Use `className="flex-1"` (NativeWind) to match the codebase; do not reach for an
  inline `style={{ flex: 1 }}` except at the `GestureHandlerRootView` root, where
  `app/_layout.tsx` already does so.

---

## 10. Pre-navigation checklist

Before adding or changing a route, confirm in order:

1. The route **file exists** for every `Screen` name you declare (§1, §2).
2. The auth decision is **declarative** (`<Redirect>`), not an effect-only
   `router.replace` (§3).
3. `unstable_settings.anchor` does **not** point at `(tabs)` (§4).
4. No gate or loading state returns `null` (§5).
5. The splash is held until `isAuthenticated !== null` (§6).
6. Every `href` is **typed** — no `as any` (§7).
7. Any custom layout with chrome wraps its navigator in `flex-1` (§9).
