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
  // TODO: the trust has not supplied an email address yet — this is a guess and
  // will bounce. Replace it, or remove the mailto links, before going live.
  email: "seva@rudragurujitrust.org",
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
 * Canonical origin, used for absolute URLs in Open Graph tags and the sitemap.
 * Social apps (WhatsApp especially) refuse relative image paths, so this must
 * be the real domain in production — set NEXT_PUBLIC_SITE_URL at build time.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"
).replace(/\/$/, "");
