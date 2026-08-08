/**
 * Supported locales. `en` is the source of truth for the dictionary shape and
 * the fallback when a visitor's Accept-Language matches nothing.
 */
export const locales = ["en", "hi", "te", "kn"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Names are written in each language's own script — a Telugu speaker looks for
 * "తెలుగు", not "Telugu". `label` is the short form used in the compact
 * switcher on narrow screens.
 */
export const localeMeta: Record<
  Locale,
  { native: string; english: string; label: string }
> = {
  en: { native: "English", english: "English", label: "EN" },
  hi: { native: "हिन्दी", english: "Hindi", label: "हि" },
  te: { native: "తెలుగు", english: "Telugu", label: "తె" },
  kn: { native: "ಕನ್ನಡ", english: "Kannada", label: "ಕ" },
};

/** Prefixes a path with the locale segment: ("/events", "te") → "/te/events". */
export function localePath(path: string, locale: Locale) {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

/**
 * Strips the locale prefix from a pathname, so the language switcher can keep
 * the visitor on the page they are already reading.
 * "/te/events" → "/events";  "/kn" → "/".
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}
