"use client";

import { Sun, Moon } from "lucide-react";

import { useTheme } from "@/components/common/theme-provider";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center size-9 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
