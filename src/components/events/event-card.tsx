import { CalendarDays } from "lucide-react";

import {
  EventGallery,
  type GalleryStrings,
} from "@/components/events/event-gallery";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/config";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Dates render in the visitor's language but always in the Indian calendar
 * convention. `timeZone: UTC` keeps a date-only value from shifting a day.
 */
const dateLocales: Record<Locale, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  kn: "kn-IN",
};

export function formatEventDate(value: string, locale: Locale) {
  return new Date(value).toLocaleDateString(dateLocales[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** A category chip tinted with the colour the admin picked for that category. */
export function CategoryBadge({
  name,
  color,
  className,
}: {
  name: string;
  color?: string | null;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("border font-medium", className)}
      style={
        color
          ? {
              // color-mix keeps the chip legible in both themes without
              // needing a second hand-picked colour per category.
              color,
              borderColor: `color-mix(in oklab, ${color} 45%, transparent)`,
              backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)`,
            }
          : undefined
      }
    >
      {name}
    </Badge>
  );
}

export function EventCard({
  event,
  locale,
  strings,
  className,
}: {
  event: Event;
  locale: Locale;
  strings: GalleryStrings;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-gold/30 bg-card/90 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {event.categories.map((category) => (
            <CategoryBadge
              key={category.id}
              name={category.name}
              color={category.color}
            />
          ))}
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            <time dateTime={event.event_date}>
              {formatEventDate(event.event_date, locale)}
            </time>
          </span>
        </div>

        <h3 className="text-balance-pretty font-heading text-xl leading-snug font-semibold text-foreground sm:text-2xl">
          {event.title}
        </h3>

        <p className="text-balance-pretty text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground">
          {event.description}
        </p>

        <EventGallery
          images={event.images}
          title={event.title}
          strings={strings}
        />
      </CardContent>
    </Card>
  );
}
