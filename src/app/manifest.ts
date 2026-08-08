import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

/**
 * Lets devotees add the site to an Android home screen — worth having on a
 * site whose audience is overwhelmingly on phones.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.legalName,
    short_name: "Rudra Guruji",
    description:
      "Nithya Annadhanam, farmer support, medical aid and financial help — every day.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf6ea",
    theme_color: "#7a2e1e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
