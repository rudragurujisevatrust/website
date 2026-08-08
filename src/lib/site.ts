import {
  HandHeart,
  Home,
  Images,
  Info,
  type LucideIcon,
  Newspaper,
  QrCode,
  Sprout,
  Users,
} from "lucide-react";

/**
 * Non-translatable trust details. Everything a visitor reads as prose lives in
 * the dictionaries under `src/lib/i18n/dictionaries/`; only facts that are the
 * same in every language belong here.
 */
export const siteConfig = {
  /** Legal name, kept in Latin script for metadata and payment records. */
  legalName: "Rudra Guruji Naga Sadhu Charitable Trust",
  phone: "+91 80087 21696",
  address: "Narayanpet District, Telangana, India",
  /** The trust's own address, supplied 2026-08-08. Reached from the footer,
   *  the donate page, the donate QR card and the volunteer page. */
  email: "rudragurujisevatrust@gmail.com",
  upi: {
    vpa: "9581916714@ybl",
    /**
     * Display hint only — UPI apps show the name registered against the VPA,
     * not this string. Payment routes on the `vpa` alone.
     */
    payeeName: "Rudra Guruji Naga Sadhu Charitable Trust",
    currency: "INR",
  },
} as const;

/** Keys into `dictionary.nav`, so a nav label is never a hard-coded string. */
export type NavKey =
  | "home"
  | "events"
  | "gallery"
  | "seva"
  | "donate"
  | "volunteer"
  | "about";

export type NavItem = {
  key: NavKey;
  /** Locale-less path; prefixed with the active locale at render time. */
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { key: "home", href: "/", icon: Home },
  { key: "events", href: "/events", icon: Newspaper },
  { key: "gallery", href: "/gallery", icon: Images },
  { key: "seva", href: "/seva", icon: Sprout },
  { key: "donate", href: "/donate", icon: QrCode },
  { key: "volunteer", href: "/volunteer", icon: Users },
  { key: "about", href: "/about", icon: Info },
];

export const adminNavItem = {
  href: "/admin",
  icon: HandHeart,
} as const;

/** Path to the looping background chant. See public/audio/README.md. */
export const AUDIO_TRACK_SRC = "/audio/om-namah-shivaya.mp3";

/**
 * Canonical origin for every absolute URL the site hands to another machine:
 * the canonical tags, the Open Graph images, the sitemap and robots.txt.
 * Relative paths are not an option — Google and WhatsApp fetch these from
 * their own servers, where "/og/en.jpg" means nothing.
 *
 * Deriving it rather than requiring configuration is deliberate. Left unset it
 * used to fall back to localhost silently, and a live site whose canonical tag
 * points at localhost is not merely unindexed: it tells Google the real copy of
 * the page lives somewhere Google cannot reach, so the page is dropped, and it
 * leaves every WhatsApp share preview blank. That failure is invisible from
 * the site itself — the pages look perfect — which is exactly why it should
 * not depend on someone remembering to set a variable.
 *
 * Read at build time; all three consumers are server-only, so this needs no
 * NEXT_PUBLIC_ prefix and never reaches the browser.
 */
function resolveSiteUrl(): string {
  // An explicit value always wins: the only way to name a domain that is not
  // yet pointed at Vercel, and the only knob that works off Vercel entirely.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel injects this: the project's *production* domain — the custom domain
  // once one is attached, the .vercel.app one until then. Deliberately not
  // VERCEL_URL, which is per-deployment and changes on every push; canonicals
  // built from that would point at a one-off build nobody links to.
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  return "http://localhost:3001";
}

export const SITE_URL = resolveSiteUrl();
