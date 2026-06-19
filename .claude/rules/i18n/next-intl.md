# next-intl Rules

## 1. Navigation — Always Use i18n-Aware Imports

All navigation APIs must come from the project's i18n navigation module — they automatically handle locale prefixes:

```tsx
// ✅ Correct — locale-aware, no extra redirect
import { Link, useRouter, usePathname, redirect } from "@/i18n/navigation";

// ❌ Wrong — loses locale, causes redirect flash
import Link from "next/link";
import { useRouter, usePathname, redirect } from "next/navigation";
```

### What stays in next/navigation

Only these imports are allowed from next/navigation (not provided by next-intl):

```tsx
import { useParams, useSearchParams, notFound } from "next/navigation";
```

### If a file needs both

```tsx
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
```

## 2. Client Components — useTranslations

```tsx
"use client";
import { useTranslations } from "next-intl";

export function BookingButton() {
  const t = useTranslations("content.common");
  return <Button>{t("bookNow")}</Button>;
}
```

## 3. Server Components — getTranslations

```tsx
import { getTranslations } from "next-intl/server";

export default async function HeroSection() {
  const t = await getTranslations("content.common");
  return <h1>{t("heroTitle")}</h1>;
}
```

## 4. All Text Must Be Translated

- **NEVER** hardcode user-facing text in any language
- When adding a new key, add it to **ALL** locale files
- Use ICU message syntax for interpolation and plurals

```json
// locales/en/common.json
{
  "content": {
    "common": {
      "bookNow": "Book Now",
      "guests": "{count, plural, one {# guest} other {# guests}}",
      "priceFrom": "From {price} {currency}"
    }
  }
}
```

```tsx
// Usage
t("guests", { count: 3 })       // "3 guests"
t("priceFrom", { price: 99, currency: "€" })  // "From 99 €"
```

## 5. Do NOT Translate

- Brand names and trademarks
- Technical identifiers (CSS classes, keys, IDs)
- URLs and paths
- Code and technical content
- Debug/dev-only content

## 6. Locale File Organization

```
i18n/locales/
├── en/common.json
├── ro/common.json
├── ru/common.json
└── uk/common.json
```

Keep translations organized by namespace within the JSON. Use dot notation in code:

```tsx
// Accessing nested keys
const t = useTranslations("content");
t("hotels.searchTitle");       // content.hotels.searchTitle
t("common.bookNow");           // content.common.bookNow
```
