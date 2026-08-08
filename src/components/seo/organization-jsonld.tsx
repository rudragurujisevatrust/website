import { type Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig, SITE_URL } from "@/lib/site";

/**
 * Structured data describing the trust itself, so a search engine is told what
 * this organisation is rather than left to infer it from prose.
 *
 * Scope is deliberately narrow: name, contact details, address, logo. Every
 * value here is a fact the trust has confirmed. Nothing is drawn from
 * `placeholder-data.ts` — those impact figures are invented, and inventing
 * numbers is bad enough on a charity's own page without also feeding them to
 * Google as machine-readable claims.
 *
 * `NGO` rather than the broader `Organization`: it is the schema.org type for
 * a non-governmental charitable body, and it is what earns the organisation
 * panel with the emblem and phone number attached.
 */
export async function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  // The trust's name in the three scripts this page is not written in. A
  // devotee searching in Telugu should reach the same entity as one searching
  // in English, and alternateName is how those are tied together.
  const others = await Promise.all(
    locales
      .filter((alt) => alt !== locale)
      .map(async (alt) => (await getDictionary(alt)).brand.name),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    // A stable identity for the entity, distinct from the page it appears on.
    "@id": `${SITE_URL}/#organization`,
    name: dict.brand.name,
    legalName: siteConfig.legalName,
    alternateName: [...new Set(others)],
    slogan: dict.brand.tagline,
    description: dict.meta.description,
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/gallery/trust-emblem.jpg`,
    image: `${SITE_URL}/og/${locale}.jpg`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Narayanpet",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      availableLanguage: [...locales],
    },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify does not escape HTML, so a "</script>" appearing in any
      // dictionary string would close this tag early and turn the rest into
      // markup. Escaping "<" is the fix Next's JSON-LD guide prescribes.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
