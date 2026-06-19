"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  // `undefined` until mounted — no theme is known during SSR / first render,
  // which keeps the server and client markup identical (no hydration mismatch).
  resolvedTheme: ResolvedTheme | undefined;
}

interface ThemeContextValue extends ThemeState {
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(resolved: ResolvedTheme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ThemeState>({
    theme: "system",
    resolvedTheme: undefined,
  });

  // Read the stored preference and apply the theme after mount. The synchronous
  // setState is intentional: it must run post-mount so the first client render
  // matches the server (resolvedTheme === undefined) and avoids a hydration
  // mismatch — this is the sanctioned "sync from an external system" use of an effect.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored ?? "system";
    const resolved = initial === "system" ? getSystemTheme() : initial;

    applyThemeClass(resolved);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount init, see comment above
    setState({ theme: initial, resolvedTheme: resolved });
  }, []);

  // Follow OS changes while the preference is "system".
  useEffect(() => {
    if (state.theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (): void => {
      const resolved = getSystemTheme();
      applyThemeClass(resolved);
      setState((prev) => ({ ...prev, resolvedTheme: resolved }));
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [state.theme]);

  const setTheme = useCallback((next: Theme): void => {
    const resolved = next === "system" ? getSystemTheme() : next;

    applyThemeClass(resolved);
    localStorage.setItem(STORAGE_KEY, next);
    setState({ theme: next, resolvedTheme: resolved });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: state.theme, resolvedTheme: state.resolvedTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
