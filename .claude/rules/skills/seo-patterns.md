# SEO Patterns

## Metadata

- **triggers**: seo, meta, og, sitemap, structured data, robots, core web vitals
- **priority**: 3
- **context**: next
- **conflicts**: none

## When to Activate

- Creating new pages that need to rank in search
- Implementing metadata (title, description, OG tags)
- Adding structured data (JSON-LD)
- Setting up sitemap.xml and robots.txt
- Optimizing Core Web Vitals

## Metadata API

### Static Metadata

```tsx
// app/[locale]/hotels/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels",
  description: "Find and book the best hotels worldwide",
  openGraph: {
    title: "Hotels",
    description: "Find and book the best hotels worldwide",
    type: "website",
    images: [{ url: "/og/hotels.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/hotels",
    languages: { en: "/en/hotels", ro: "/hotels", ru: "/ru/hotels" },
  },
};
```

### Dynamic Metadata

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, id } = await params;
  const hotel = await fetchHotel(id);
  const t = await getTranslations({ locale, namespace: "content.seo" });

  return {
    title: `${hotel.name} | ${t("hotels")}`,
    description: hotel.description.slice(0, 160),
    openGraph: {
      title: hotel.name,
      description: hotel.description.slice(0, 160),
      images: [{ url: hotel.mainImage, width: 1200, height: 630 }],
      type: "website",
    },
    alternates: {
      canonical: `/${locale}/hotels/${slug}/${id}`,
    },
  };
}
```

## JSON-LD Structured Data

```tsx
// In server component or page
function HotelJsonLd({ hotel }: { hotel: HotelDetail }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    image: hotel.images[0],
    address: {
      "@type": "PostalAddress",
      addressLocality: hotel.city,
      addressCountry: hotel.country,
    },
    starRating: {
      "@type": "Rating",
      ratingValue: hotel.stars,
    },
    priceRange: `${hotel.minPrice}€ - ${hotel.maxPrice}€`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

## Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hotels = await getAllHotelSlugs();

  const hotelUrls = hotels.map((h) => ({
    url: `https://mytour.ro/hotels/${h.slug}/${h.id}`,
    lastModified: h.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: "https://mytour.ro", lastModified: new Date(), priority: 1 },
    {
      url: "https://mytour.ro/hotels",
      lastModified: new Date(),
      priority: 0.9,
    },
    ...hotelUrls,
  ];
}
```

## Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/"] }],
    sitemap: "https://mytour.ro/sitemap.xml",
  };
}
```

## Heading Hierarchy

- Every page has exactly **one `<h1>`** (the page title)
- Headings follow a strict hierarchy: h1 → h2 → h3 (never skip levels)
- SSR headings for crawlers — don't hide h1 in client components

## Core Web Vitals

| Metric                          | Target  | Key Optimizations                   |
| ------------------------------- | ------- | ----------------------------------- |
| LCP (Largest Contentful Paint)  | < 2.5s  | Priority images, SSR, preload fonts |
| INP (Interaction to Next Paint) | < 200ms | Small client bundles, useTransition |
| CLS (Cumulative Layout Shift)   | < 0.1   | Image dimensions, font display swap |
