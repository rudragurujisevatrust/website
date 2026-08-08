import { ArrowRight, HeartHandshake } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { type Locale, localePath } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { getTrustStats } from "@/lib/placeholder-data";

export function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const stats = getTrustStats(dict);

  return (
    <section className="glow-diya relative overflow-hidden border-b border-gold/30">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-24">
        <p className="font-heading text-2xl text-saffron-deep sm:text-3xl">
          {dict.brand.mantra}
        </p>

        <h1 className="text-balance-pretty mt-5 font-heading text-4xl leading-[1.15] font-semibold text-foreground sm:text-5xl lg:text-6xl">
          {dict.brand.name}
        </h1>

        <div
          aria-hidden
          className="border-toran mx-auto mt-7 h-3 w-40 opacity-70"
        />

        <p className="text-balance-pretty mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {dict.home.heroIntro__part1}
          <strong className="font-semibold text-foreground">
            {dict.home.heroIntro__strong}
          </strong>
          {dict.home.heroIntro__part2}
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-saffron text-white shadow-md hover:bg-saffron-deep"
          >
            <Link href={localePath("/donate", locale)}>
              <HeartHandshake className="size-4" />
              {dict.home.ctaDonate}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-saffron/50 text-saffron-deep hover:bg-accent"
          >
            <Link href={localePath("/events", locale)}>
              {dict.home.ctaEvents}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Impact figures */}
        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-heading text-3xl font-semibold text-saffron-deep sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs leading-snug text-muted-foreground sm:text-sm">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
