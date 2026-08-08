import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { DonateQR } from "@/components/donate/donate-qr";
import { EventCard } from "@/components/events/event-card";
import { GalleryPreview } from "@/components/gallery/gallery-preview";
import { Hero } from "@/components/home/hero";
import { SectionHeading } from "@/components/home/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { localePath } from "@/lib/i18n/config";
import { getCurrentDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { getPlaceholderEvents } from "@/lib/placeholder-data";
import { sevaKaryakramas } from "@/lib/seva";

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getCurrentDictionary();
  // Placeholder until the Supabase feed is wired up.
  const recentEvents = getPlaceholderEvents(dict).slice(0, 3);

  return (
    <>
      <Hero locale={locale} dict={dict} />

      {/* Mission — the standing karyakramas */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <SectionHeading
          eyebrow={dict.home.missionEyebrow}
          title={dict.home.missionTitle}
          description={dict.home.missionDescription}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sevaKaryakramas.map((seva) => {
            const item = dict.seva.items[seva.key];
            return (
              <Card
                key={seva.key}
                className="border-gold/30 bg-card/85 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <span className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <seva.icon className={`size-6 ${seva.accent}`} />
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 font-heading text-sm text-muted-foreground">
                    {item.titleLocal}
                  </p>
                  <p className="text-balance-pretty mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                </CardContent>
              </Card>
            );
          })}

          <Card className="flex items-center justify-center border-2 border-dashed border-saffron/40 bg-transparent shadow-none">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {dict.home.missionMoreLabel}
              </p>
              <Button asChild variant="link" className="mt-1 text-saffron-deep">
                <Link href={localePath("/seva", locale)}>
                  {dict.home.missionMoreCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery — real photographs from the trust's seva */}
      <div className="border-t border-gold/30">
        <GalleryPreview locale={locale} dict={dict} />
      </div>

      {/* Donate — QR front and centre */}
      <section
        id="donate"
        className="glow-diya border-y border-gold/30 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow={dict.home.donateEyebrow}
            title={dict.home.donateTitle}
            description={dict.home.donateDescription}
          />
          <div className="mt-12 flex justify-center">
            <DonateQR strings={dict.donate} />
          </div>
        </div>
      </section>

      {/* Recent updates */}
      <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <SectionHeading
          eyebrow={dict.home.recentEyebrow}
          title={dict.home.recentTitle}
          description={dict.home.recentDescription}
        />

        <div className="mt-12 space-y-6">
          {recentEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              locale={locale}
              strings={dict.events}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-saffron/50 text-saffron-deep hover:bg-accent"
          >
            <Link href={localePath("/events", locale)}>
              {dict.home.recentCta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
