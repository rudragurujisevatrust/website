import type { Metadata } from "next";

import { SectionHeading } from "@/components/home/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { isLocale } from "@/lib/i18n/config";
import { getCurrentDictionary, getDictionary } from "@/lib/i18n/dictionaries";
import { sevaKaryakramas } from "@/lib/seva";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/seva">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.nav.seva, description: dict.meta.sevaDescription };
}

export default async function SevaPage() {
  const dict = await getCurrentDictionary();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow={dict.seva.eyebrow}
        title={dict.seva.title}
        description={dict.seva.description}
      />

      <div className="mt-12 space-y-6">
        {sevaKaryakramas.map((seva, index) => {
          const item = dict.seva.items[seva.key];
          return (
            <Card key={seva.key} className="border-gold/30 bg-card/85">
              <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:p-8">
                <div className="shrink-0">
                  <span className="flex size-14 items-center justify-center rounded-full bg-accent">
                    <seva.icon className={`size-7 ${seva.accent}`} />
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.18em] text-saffron-deep uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-0.5 font-heading text-base text-muted-foreground">
                    {item.titleLocal}
                  </p>
                  <p className="text-balance-pretty mt-4 leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
