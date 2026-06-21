import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "./i18n/routing";

// Next.js 16 proxy convention (formerly middleware.ts)
const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Home page is kept clean: "/" serves the default-locale home with no prefix.
  // Internally rewrite to the localized route so the [locale] segment still resolves.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}`;
    return NextResponse.rewrite(url);
  }

  // Avoid a duplicate prefixed home for the default locale: "/en" -> "/".
  if (pathname === `/${routing.defaultLocale}`) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Every other route keeps the locale prefix (/en/..., /ro/..., and "/ro").
  return handleI18nRouting(request);
}

export const config = {
  // Match all paths except API routes, Next internals, and static files
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
