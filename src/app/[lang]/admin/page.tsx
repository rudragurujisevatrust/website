import { Lock } from "lucide-react";
import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { isLocale } from "@/lib/i18n/config";
import { getCurrentDictionary, getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/admin">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.nav.admin, robots: { index: false, follow: false } };
}

/**
 * Placeholder. Phase 2 replaces this with the Supabase-authenticated dashboard
 * (event CRUD, image uploads, category management) behind a route guard.
 */
export default async function AdminPage() {
  const dict = await getCurrentDictionary();

  const planned = [
    dict.admin.planned1,
    dict.admin.planned2,
    dict.admin.planned3,
    dict.admin.planned4,
  ];

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-accent">
        <Lock className="size-6 text-saffron-deep" />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">
        {dict.admin.title}
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        {dict.admin.body}
      </p>
      <Card className="mt-8 w-full border-gold/30 bg-card/85 text-left">
        <CardContent className="p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-saffron-deep uppercase">
            {dict.admin.plannedLabel}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {planned.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
