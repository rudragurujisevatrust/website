import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n/config";
import { navItems, SITE_URL } from "@/lib/site";

/**
 * One entry per public page per locale, each listing its translations under
 * `alternates.languages`. That pairing is what lets search engines serve a
 * Telugu speaker the Telugu page instead of the English one.
 *
 * `/admin` is deliberately absent — it is noindex and has nothing public.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = navItems.map((item) => item.href);

  return locales.flatMap((locale) =>
    paths.map((path) => {
      const suffix = path === "/" ? "" : path;
      return {
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: new Date(),
        changeFrequency: path === "/events" ? "daily" : "monthly",
        priority: path === "/" ? 1 : path === "/donate" ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((alt) => [alt, `${SITE_URL}/${alt}${suffix}`]),
          ),
        },
      } satisfies MetadataRoute.Sitemap[number];
    }),
  );
}
