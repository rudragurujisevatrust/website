import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * The slice of the dictionary the persistent shell (sidebar, header, audio
 * button) needs. Client Components receive only this rather than the whole
 * dictionary, so page prose and the demo feed never get serialised into the
 * RSC payload.
 */
export type ChromeDict = Pick<
  Dictionary,
  "nav" | "brand" | "language" | "audio"
>;

export function pickChrome(dict: Dictionary): ChromeDict {
  return {
    nav: dict.nav,
    brand: dict.brand,
    language: dict.language,
    audio: dict.audio,
  };
}
