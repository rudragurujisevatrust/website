"use client";

import { Check, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  type Locale,
  localeMeta,
  localePath,
  locales,
  stripLocale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Language chooser. Every option is a real `<Link>` to the same page under a
 * different locale prefix, so switching keeps the visitor where they are, works
 * without JavaScript, and lets each language be bookmarked and shared.
 */
export function LanguageSwitcher({
  locale,
  label,
  chooseLabel,
  className,
  align = "end",
}: {
  locale: Locale;
  label: string;
  chooseLabel: string;
  className?: string;
  align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const basePath = stripLocale(pathname);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={chooseLabel}
        title={label}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
          "border-gold/50 bg-card/80 text-foreground hover:bg-accent",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        )}
      >
        <Globe className="size-4 shrink-0 text-saffron-deep" />
        <span className="font-medium">{localeMeta[locale].native}</span>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={chooseLabel}
          className={cn(
            "absolute top-full z-50 mt-2 min-w-48 overflow-hidden rounded-xl border border-gold/40 bg-popover shadow-lg",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          <p className="border-b border-gold/25 bg-secondary/60 px-3 py-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            {chooseLabel}
          </p>
          <ul className="p-1">
            {locales.map((option) => {
              const active = option === locale;
              return (
                <li key={option}>
                  <Link
                    href={localePath(basePath, option)}
                    hrefLang={option}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "text-foreground hover:bg-accent/70",
                    )}
                  >
                    <span className="flex-1">
                      <span className="block">{localeMeta[option].native}</span>
                      {localeMeta[option].native !==
                      localeMeta[option].english ? (
                        <span className="block text-xs text-muted-foreground">
                          {localeMeta[option].english}
                        </span>
                      ) : null}
                    </span>
                    {active ? (
                      <Check className="size-4 shrink-0 text-saffron-deep" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
