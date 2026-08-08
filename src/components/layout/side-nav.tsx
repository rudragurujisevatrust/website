"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AudioToggleInline } from "@/components/audio/audio-toggle";
import { Separator } from "@/components/ui/separator";
import { type Locale, localePath, stripLocale } from "@/lib/i18n/config";
import type { ChromeDict } from "@/lib/i18n/chrome";
import { adminNavItem, navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(basePath: string, href: string) {
  return href === "/" ? basePath === "/" : basePath.startsWith(href);
}

/**
 * Sidebar contents, shared by the fixed desktop rail and the mobile sheet.
 * `onNavigate` lets the mobile sheet close itself after a link is tapped.
 */
export function SideNavContent({
  locale,
  chrome,
  onNavigate,
}: {
  locale: Locale;
  chrome: ChromeDict;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  // Compare against the locale-stripped path so "/te/events" still marks
  // Daily Events active.
  const basePath = stripLocale(pathname);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="relative px-5 pt-6 pb-5">
        <Link
          href={localePath("/", locale)}
          onClick={onNavigate}
          className="flex items-start gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
        >
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-sidebar-primary/70 bg-sidebar-accent text-2xl leading-none text-sidebar-primary"
          >
            ॐ
          </span>
          <span className="min-w-0">
            <span className="block font-heading text-[15px] leading-tight font-semibold text-sidebar-foreground">
              {chrome.brand.nameLine1}
            </span>
            <span className="block font-heading text-[15px] leading-tight font-semibold text-sidebar-primary">
              {chrome.brand.nameLine2}
            </span>
            <span className="mt-1 block text-[11px] leading-snug tracking-wide text-sidebar-foreground/60">
              {chrome.brand.tagline}
            </span>
          </span>
        </Link>
        <div
          aria-hidden
          className="border-toran absolute inset-x-0 bottom-0 h-3 opacity-30"
        />
      </div>

      {/* Primary navigation */}
      <nav
        aria-label={chrome.nav.mainLabel}
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(basePath, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={localePath(item.href, locale)}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
                    active
                      ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-[18px] shrink-0",
                      active
                        ? "text-sidebar-primary-foreground"
                        : "text-sidebar-primary",
                    )}
                  />
                  <span className="min-w-0 flex-1">{chrome.nav[item.key]}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Separator className="my-4 bg-sidebar-border" />

        <Link
          href={localePath(adminNavItem.href, locale)}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
            isActive(basePath, adminNavItem.href)
              ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
              : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <adminNavItem.icon className="size-[18px] shrink-0" />
          <span className="flex-1">{chrome.nav.admin}</span>
        </Link>
      </nav>

      {/* Chant control + mantra */}
      <div className="space-y-3 border-t border-sidebar-border px-3 py-4">
        <AudioToggleInline strings={chrome.audio} mantra={chrome.brand.mantra} />
        <p className="text-center font-heading text-sm text-sidebar-primary/90">
          {chrome.brand.mantra}
        </p>
      </div>
    </div>
  );
}

/** Fixed rail, desktop only. */
export function DesktopSideNav({
  locale,
  chrome,
}: {
  locale: Locale;
  chrome: ChromeDict;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-sidebar-border lg:block">
      <SideNavContent locale={locale} chrome={chrome} />
    </aside>
  );
}
