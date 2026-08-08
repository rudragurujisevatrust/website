import type { Metadata } from "next";

import { EventFeed } from "@/components/events/event-feed";
import { SectionHeading } from "@/components/home/section-heading";
import { isLocale } from "@/lib/i18n/config";
import {
  getCurrentDictionary,
  getDictionary,
  getLocale,
} from "@/lib/i18n/dictionaries";
import {
  getPlaceholderCategories,
  getPlaceholderEvents,
} from "@/lib/placeholder-data";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/events">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.nav.events,
    description: dict.meta.eventsDescription,
  };
}

export default async function EventsPage() {
  const locale = await getLocale();
  const dict = await getCurrentDictionary();
  // Placeholder until the Supabase feed is wired up.
  const events = getPlaceholderEvents(dict);
  const categories = getPlaceholderCategories(dict);

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow={dict.events.eyebrow}
        title={dict.events.title}
        description={dict.events.description}
      />

      <div className="mt-12">
        <EventFeed
          events={events}
          categories={categories}
          locale={locale}
          strings={dict.events}
        />
      </div>
    </div>
  );
}
