import { NextResponse } from "next/server";

import { defaultLocale, type Locale, locales } from "@/lib/i18n/config";

/**
 * Locale routing. Every page lives under `/[lang]/…`, so a request without a
 * locale prefix ("/", "/donate") is redirected to the visitor's best match.
 *
 * Next.js 16 renamed `middleware.ts` to `proxy.ts`; the exported function must
 * be named `proxy` and always runs on the Node.js runtime.
 */

/**
 * Picks the best supported locale from an Accept-Language header.
 * Parses quality values ("hi-IN,hi;q=0.9,en;q=0.8") and matches on the base
 * language tag, so "te-IN" and "te" both resolve to Telugu.
 */
function getLocale(request: Request): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.trim().slice(2)) : 1;
      return {
        base: tag.trim().toLowerCase().split("-")[0],
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((entry) => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const entry of ranked) {
    const match = locales.find((locale) => locale === entry.base);
    if (match) return match;
  }
  return defaultLocale;
}

export function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = getLocale(request);
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the API surface, and anything with a file extension
  // (favicon.ico, /placeholders/*.svg, /audio/*.mp3) — those must not be
  // rewritten to a locale path.
  matcher: ["/((?!_next|api|.*\\.[\\w]+$).*)"],
};
