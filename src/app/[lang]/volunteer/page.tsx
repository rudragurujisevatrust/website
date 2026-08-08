import { Clock, HandHeart, Mail, Phone, Truck, Utensils } from "lucide-react";
import type { Metadata } from "next";

import { SectionHeading } from "@/components/home/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isLocale } from "@/lib/i18n/config";
import { getCurrentDictionary, getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/volunteer">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.nav.volunteer,
    description: dict.meta.volunteerDescription,
  };
}

export default async function VolunteerPage() {
  const dict = await getCurrentDictionary();

  const roles = [
    { icon: Utensils, ...dict.volunteer.roles.kitchen },
    { icon: HandHeart, ...dict.volunteer.roles.serving },
    { icon: Truck, ...dict.volunteer.roles.transport },
    { icon: Clock, ...dict.volunteer.roles.weekend },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow={dict.volunteer.eyebrow}
        title={dict.volunteer.title}
        description={dict.volunteer.description}
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.title} className="border-gold/30 bg-card/85">
            <CardContent className="p-6">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent">
                <role.icon className="size-5 text-saffron-deep" />
              </span>
              <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
                {role.title}
              </h2>
              <p className="mt-1 text-sm font-medium text-saffron-deep">
                {role.time}
              </p>
              <p className="text-balance-pretty mt-3 text-sm leading-relaxed text-muted-foreground">
                {role.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glow-diya mt-10 border-gold/40">
        <CardContent className="p-8 text-center">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            {dict.volunteer.ctaTitle}
          </h2>
          <p className="text-balance-pretty mx-auto mt-3 max-w-lg leading-relaxed text-muted-foreground">
            {dict.volunteer.ctaBody}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-saffron text-white hover:bg-saffron-deep"
            >
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                <Phone className="size-4" />
                {siteConfig.phone}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-saffron/50 text-saffron-deep hover:bg-accent"
            >
              <a href={`mailto:${siteConfig.email}`}>
                <Mail className="size-4" />
                {dict.volunteer.ctaWrite}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
