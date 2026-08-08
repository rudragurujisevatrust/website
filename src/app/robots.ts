import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin portal is already noindex; keeping crawlers out of it too
      // means the login page never shows up in results.
      disallow: ["/*/admin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
