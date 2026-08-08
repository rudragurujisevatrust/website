import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { type Locale, localePath } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { navItems, siteConfig } from "@/lib/site";

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="mt-16 border-t border-border bg-maroon text-sandal">
      <div
        aria-hidden
        className="border-toran h-3 w-full opacity-40"
        style={{ transform: "rotate(180deg)" }}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold text-gold">
            {dict.brand.name}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sandal/80">
            {dict.meta.description}
          </p>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold tracking-wide text-gold uppercase">
            {dict.footer.explore}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(item.href, locale)}
                  className="text-sandal/80 transition-colors hover:text-gold"
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold tracking-wide text-gold uppercase">
            {dict.footer.reach}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-sandal/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-gold"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="break-all transition-colors hover:text-gold"
              >
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sandal/15 px-6 py-5 text-center">
        <p className="font-heading text-base text-gold">{dict.brand.mantra}</p>
        <p className="mt-2 text-xs text-sandal/60">
          © {new Date().getFullYear()} {dict.brand.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
