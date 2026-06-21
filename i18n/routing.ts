import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Locales exposed in the URL (e.g. /en, /ro, /ru)
  locales: ["en", "ro", "ru"],
  defaultLocale: "en",
  // Always show the locale prefix so both /en and /ro appear in the URL
  localePrefix: "always",
});
