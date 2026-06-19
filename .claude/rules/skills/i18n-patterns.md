# i18n Advanced Patterns

## Metadata

- **triggers**: translation, locale, i18n, intl, language, RTL, plurals
- **priority**: 2
- **context**: next-intl
- **conflicts**: none

## When to Activate

- Implementing complex translations (plurals, gender, variables)
- Formatting dates, numbers, and currencies per locale
- Building language switcher component
- Handling dynamic content translation
- Setting up routing with locales

## ICU Message Syntax

### Plurals

```json
{
  "results": "{count, plural, =0 {No results found} one {# result found} other {# results found}}",
  "nights": "{count, plural, one {# night} other {# nights}}"
}
```

```tsx
t("results", { count: 0 }); // "No results found"
t("results", { count: 1 }); // "1 result found"
t("results", { count: 42 }); // "42 results found"
```

### Select (Gender, Status)

```json
{
  "greeting": "{gender, select, male {Mr.} female {Ms.} other {}} {name}"
}
```

### Nested Interpolation

```json
{
  "pricePerNight": "From {price, number, ::currency/EUR} per night"
}
```

## Date & Number Formatting

```tsx
import { useFormatter } from "next-intl";

function PriceDisplay({ amount, currency }: Props) {
  const format = useFormatter();

  return <span>{format.number(amount, { style: "currency", currency })}</span>;
}

function DateDisplay({ date }: { date: Date }) {
  const format = useFormatter();

  return (
    <time dateTime={date.toISOString()}>
      {format.dateTime(date, { dateStyle: "long" })}
    </time>
  );
}

// Relative time
function TimeAgo({ date }: { date: Date }) {
  const format = useFormatter();
  return <span>{format.relativeTime(date)}</span>;
  // "2 hours ago", "in 3 days", etc.
}
```

## Language Switcher

```tsx
"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {loc.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

## Routing Configuration

```typescript
// i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ro", "en", "ru", "uk"],
  defaultLocale: "ro",
  localePrefix: "as-needed", // Default locale has no prefix
});

// i18n/navigation.ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

## Server-Side Translation in Metadata

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "content.seo" });

  return {
    title: t("hotelsTitle"),
    description: t("hotelsDescription"),
  };
}
```

## Dynamic Content Translation

For content from API/CMS that comes in multiple languages:

```tsx
// API returns: { name_ro: "...", name_en: "...", name_ru: "...", name_uk: "..." }
function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string,
): string {
  const key = `${field}_${locale}` as keyof T;
  const fallbackKey = `${field}_en` as keyof T;
  return (item[key] as string) || (item[fallbackKey] as string) || "";
}

// Usage
const name = getLocalizedField(hotel, "name", locale);
```
