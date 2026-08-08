import type { NextConfig } from "next";

// Event photos are served from Supabase Storage's public bucket. next/image
// refuses remote hosts that are not allow-listed, so derive the hostname from
// the project URL rather than hard-coding it.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  // `next dev` serves /_next/static and /_next/hmr only to hosts it trusts.
  // Reaching the dev server over Tailscale or the LAN instead of localhost
  // gets every client chunk blocked, so the page renders from SSR HTML with
  // no JavaScript at all — the nav drawer and buttons go dead. Dev-only; the
  // production build is unaffected.
  allowedDevOrigins: ["100.92.170.76", "192.168.1.3"],
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // Placeholder art ships as SVG; safe because these are our own files.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
