import type { Metadata } from "next";

import { SectionHeading } from "@/components/home/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { isLocale } from "@/lib/i18n/config";
import { getCurrentDictionary, getDictionary } from "@/lib/i18n/dictionaries";
import { getTrustStats } from "@/lib/placeholder-data";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.nav.about, description: dict.meta.aboutDescription };
}

export default async function AboutPage() {
  const dict = await getCurrentDictionary();
  const stats = getTrustStats(dict);

  const principles = [
    dict.about.principles.anna,
    dict.about.principles.rupee,
    dict.about.principles.quiet,
    dict.about.principles.accounts,
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        description={dict.about.description}
      />

      <Card className="mt-12 border-gold/30 bg-card/85">
        <CardContent className="space-y-5 p-6 leading-relaxed text-muted-foreground sm:p-8">
          <p className="text-balance-pretty">
            {dict.about.story1__prefix}
            <strong className="font-semibold text-foreground">
              {dict.brand.name}
            </strong>
            {dict.about.story1__suffix}
          </p>
          <p className="text-balance-pretty">{dict.about.story2}</p>
          <p className="text-balance-pretty">{dict.about.story3}</p>
          <p className="text-balance-pretty italic">
            &ldquo;{dict.about.quote}&rdquo;
          </p>
        </CardContent>
      </Card>

      <div className="mt-14">
        <h2 className="text-center font-heading text-2xl font-semibold text-foreground">
          {dict.about.principlesTitle}
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {principles.map((principle) => (
            <Card key={principle.title} className="border-gold/30 bg-card/85">
              <CardContent className="p-6">
                <h3 className="font-heading text-lg font-semibold text-saffron-deep">
                  {principle.title}
                </h3>
                <p className="text-balance-pretty mt-2 text-sm leading-relaxed text-muted-foreground">
                  {principle.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="glow-diya mt-14 rounded-2xl border border-gold/40 px-6 py-10">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-heading text-3xl font-semibold text-saffron-deep">
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs leading-snug text-muted-foreground">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-12 text-center font-heading text-xl text-saffron-deep">
        {dict.brand.mantra}
      </p>
    </div>
  );
}
