import type { Metadata, Viewport } from "next";
import {
  Marcellus,
  Mukta,
  Noto_Sans_Kannada,
  Noto_Sans_Telugu,
} from "next/font/google";
import { notFound } from "next/navigation";

import { AudioGate } from "@/components/audio/audio-gate";
import { AudioProvider } from "@/components/audio/audio-provider";
import { AudioToggle } from "@/components/audio/audio-toggle";
import { DesktopSideNav } from "@/components/layout/side-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { pickChrome } from "@/lib/i18n/chrome";
import { isLocale, localeMeta, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig, SITE_URL } from "@/lib/site";

import "../globals.css";

// One font per script. Marcellus has no Devanagari, Telugu or Kannada glyphs,
// so those locales use their script font for headings too — globals.css swaps
// --font-display / --font-body based on the html[lang] attribute.
const display = Marcellus({
  variable: "--font-latin-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const body = Mukta({
  variable: "--font-latin-body",
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const telugu = Noto_Sans_Telugu({
  variable: "--font-telugu",
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const kannada = Noto_Sans_Kannada({
  variable: "--font-kannada",
  subsets: ["kannada"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Prerender all four locales at build time. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  // Per-locale share card, so a link pasted into WhatsApp previews with the
  // trust's name in the reader's own script rather than a blank box.
  const ogImage = {
    url: `/og/${lang}.jpg`,
    width: 1200,
    height: 630,
    alt: `${dict.brand.name} — ${dict.brand.tagline}`,
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${dict.brand.name} — ${dict.brand.tagline}`,
      template: `%s | ${dict.brand.name}`,
    },
    description: dict.meta.description,
    openGraph: {
      title: dict.brand.name,
      description: dict.meta.description,
      type: "website",
      siteName: dict.brand.name,
      locale: lang === "en" ? "en_IN" : `${lang}_IN`,
      url: `/${lang}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.brand.name,
      description: dict.meta.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/${lang}`,
      // Tells search engines these pages are translations of one another.
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `/${locale}`]),
      ),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#7a2e1e",
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  // 404 unknown locales rather than rendering a half-translated page.
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const chrome = pickChrome(dict);

  return (
    <html
      lang={lang}
      className={`${display.variable} ${body.variable} ${telugu.variable} ${kannada.variable} h-full antialiased`}
    >
      <head>
        {/* Helps assistive tech and search engines find the other languages. */}
        {locales
          .filter((locale) => locale !== lang)
          .map((locale) => (
            <link
              key={locale}
              rel="alternate"
              hrefLang={locale}
              href={`/${locale}`}
              title={localeMeta[locale].native}
            />
          ))}
        <meta name="apple-mobile-web-app-title" content={siteConfig.legalName} />
      </head>
      <body className="min-h-full">
        {/*
         * Visually hidden until focused. Without it a keyboard user tabs through
         * every sidebar link on every page before reaching the content.
         */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-saffron focus:px-4 focus:py-2.5 focus:font-medium focus:text-white focus:shadow-lg focus:ring-2 focus:ring-gold focus:outline-none"
        >
          {dict.nav.skipToContent}
        </a>

        <AudioProvider>
          <DesktopSideNav locale={lang} chrome={chrome} />

          {/* Offset by the fixed rail width on desktop only. */}
          <div className="flex min-h-svh flex-col lg:pl-72">
            <SiteHeader locale={lang} chrome={chrome} />
            {/* tabIndex -1 so the skip link can actually place focus here. */}
            <main
              id="main"
              tabIndex={-1}
              className="texture-temple flex-1 focus:outline-none"
            >
              {children}
            </main>
            <SiteFooter locale={lang} dict={dict} />
          </div>

          <AudioGate strings={dict.audio} mantra={dict.brand.mantra} />
          <AudioToggle strings={dict.audio} />
          <Toaster position="top-center" richColors />
        </AudioProvider>
      </body>
    </html>
  );
}
