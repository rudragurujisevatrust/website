"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SideNavContent } from "@/components/layout/side-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ChromeDict } from "@/lib/i18n/chrome";
import { type Locale, localePath } from "@/lib/i18n/config";

/**
 * Always-visible top bar. On narrow screens it carries the drawer trigger and
 * the brand; on desktop the sidebar already shows those, so only the language
 * switcher remains — but the bar itself never disappears, which is what keeps
 * the language control reachable from every page at every width.
 */
export function SiteHeader({
  locale,
  chrome,
}: {
  locale: Locale;
  chrome: ChromeDict;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes — including on back/forward,
  // which no link handler would catch. Adjusting state during render is React's
  // documented alternative to a route-watching effect: it re-renders before
  // anything is painted, so the drawer never flashes open on the new page.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground">
      {/* Drawer trigger — mobile only; desktop has the fixed rail. */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={chrome.nav.openMenu}
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="w-[19rem] gap-0 border-sidebar-border bg-sidebar p-0"
          >
            <SheetTitle className="sr-only">{chrome.nav.menuTitle}</SheetTitle>
            <SheetDescription className="sr-only">
              {chrome.nav.menuDescription}
            </SheetDescription>
            <SideNavContent
              locale={locale}
              chrome={chrome}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <Link
        href={localePath("/", locale)}
        className="flex min-w-0 items-center gap-2.5 lg:hidden"
      >
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-sidebar-primary/70 bg-sidebar-accent text-lg leading-none text-sidebar-primary"
        >
          ॐ
        </span>
        <span className="min-w-0 font-heading text-sm leading-tight font-semibold">
          <span className="block truncate">{chrome.brand.nameLine1}</span>
          <span className="block truncate text-sidebar-primary">
            {chrome.brand.nameLine2}
          </span>
        </span>
      </Link>

      {/* Mantra fills the desktop bar, which would otherwise be empty. */}
      <p className="hidden font-heading text-base text-sidebar-primary/90 lg:block">
        {chrome.brand.mantra}
      </p>

      <LanguageSwitcher
        locale={locale}
        label={chrome.language.label}
        chooseLabel={chrome.language.choose}
        className="ml-auto"
      />
    </header>
  );
}
