import { lang } from "next/root-params";

import { type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * Dictionaries are lazily imported so a page only ships the locale it renders.
 * Because every page is a Server Component, none of this reaches the browser
 * bundle — only the resulting HTML does.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/lib/i18n/dictionaries/en").then((m) => m.default),
  hi: () => import("@/lib/i18n/dictionaries/hi").then((m) => m.default),
  te: () => import("@/lib/i18n/dictionaries/te").then((m) => m.default),
  kn: () => import("@/lib/i18n/dictionaries/kn").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

/**
 * Reads the locale from the `[lang]` root segment, so nested Server Components
 * don't need it drilled through props. Server-side only — Client Components
 * must receive what they need as props.
 */
export async function getLocale(): Promise<Locale> {
  // `lang` is validated in app/[lang]/layout.tsx, which 404s anything unknown
  // before a page renders, so the cast is safe here.
  return (await lang()) as Locale;
}

export async function getCurrentDictionary(): Promise<Dictionary> {
  return getDictionary(await getLocale());
}

export type { Dictionary };
