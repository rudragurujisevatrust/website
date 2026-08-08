import { Soup, Sprout, Stethoscope } from "lucide-react";
import type { Metadata } from "next";

import { DonateQR } from "@/components/donate/donate-qr";
import { SectionHeading } from "@/components/home/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { isLocale } from "@/lib/i18n/config";
import { getCurrentDictionary, getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/donate">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.nav.donate, description: dict.meta.donateDescription };
}

export default async function DonatePage() {
  const dict = await getCurrentDictionary();

  const impact = [
    { icon: Soup, ...dict.donate.impact.meal },
    { icon: Sprout, ...dict.donate.impact.seed },
    { icon: Stethoscope, ...dict.donate.impact.hospital },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow={dict.donate.eyebrow}
        title={dict.donate.title}
        description={dict.donate.description}
      />

      <div className="mt-12 flex justify-center">
        <DonateQR strings={dict.donate} />
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-3">
        {impact.map((item) => (
          <Card key={item.title} className="border-gold/30 bg-card/85">
            <CardContent className="p-6 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent">
                <item.icon className="size-6 text-saffron-deep" />
              </span>
              <p className="mt-4 font-heading text-3xl font-semibold text-saffron-deep">
                {item.amount}
              </p>
              <p className="mt-1 font-heading text-lg text-foreground">
                {item.title}
              </p>
              <p className="text-balance-pretty mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-10 border-gold/30 bg-secondary/50">
        <CardContent className="p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {dict.donate.otherTitle}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="font-semibold text-foreground">
                {dict.donate.otherSponsorStrong}
              </strong>
              {dict.donate.otherSponsorRest}
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                {dict.donate.otherBankStrong}
              </strong>
              {dict.donate.otherBankRest}
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                {dict.donate.otherKindStrong}
              </strong>
              {dict.donate.otherKindRest}
            </li>
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">
            {dict.donate.reachPrefix}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-saffron-deep underline underline-offset-2"
            >
              {siteConfig.email}
            </a>
            {dict.donate.reachJoin}
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="text-saffron-deep underline underline-offset-2"
            >
              {siteConfig.phone}
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
