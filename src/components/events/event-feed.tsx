"use client";

import { Inbox } from "lucide-react";
import { useMemo, useState } from "react";

import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Category, Event } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL = "all";

/**
 * Client-side filtering: the feed is small enough that re-querying per filter
 * would be slower than filtering in memory, and it keeps the interaction instant.
 */
export function EventFeed({
  events,
  categories,
  locale,
  strings,
}: {
  events: Event[];
  categories: Category[];
  locale: Locale;
  strings: Dictionary["events"];
}) {
  const [activeId, setActiveId] = useState<string>(ALL);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events) {
      for (const category of event.categories) {
        map.set(category.id, (map.get(category.id) ?? 0) + 1);
      }
    }
    return map;
  }, [events]);

  const visible = useMemo(
    () =>
      activeId === ALL
        ? events
        : events.filter((event) =>
            event.categories.some((category) => category.id === activeId),
          ),
    [events, activeId],
  );

  return (
    <div className="space-y-8">
      <div role="group" aria-label={strings.filterLabel} className="flex flex-wrap gap-2">
        <FilterChip
          active={activeId === ALL}
          onClick={() => setActiveId(ALL)}
          label={strings.allUpdates}
          count={events.length}
        />
        {categories.map((category) => {
          const count = counts.get(category.id) ?? 0;
          if (count === 0) return null;
          return (
            <FilterChip
              key={category.id}
              active={activeId === category.id}
              onClick={() => setActiveId(category.id)}
              label={category.name}
              count={count}
              color={category.color}
            />
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/40 bg-card/60 px-6 py-16 text-center">
          <Inbox className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-heading text-lg text-foreground">
            {strings.emptyTitle}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {strings.emptyBody}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {visible.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              locale={locale}
              strings={strings}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: string | null;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-auto rounded-full border py-1.5 whitespace-normal transition-colors",
        active
          ? "border-transparent bg-saffron text-white hover:bg-saffron-deep hover:text-white"
          : "border-gold/40 bg-card/70 text-foreground hover:bg-accent",
      )}
      style={
        active && color
          ? { backgroundColor: color, borderColor: color, color: "#fff" }
          : undefined
      }
    >
      {label}
      <span
        className={cn(
          "ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] leading-none",
          active ? "bg-white/25 text-white" : "bg-muted text-muted-foreground",
        )}
      >
        {count}
      </span>
    </Button>
  );
}
