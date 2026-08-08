"use client";

import { useBackgroundAudio } from "@/components/audio/audio-provider";
import type { ChromeDict } from "@/lib/i18n/chrome";
import { cn } from "@/lib/utils";

/**
 * Opening gate that turns the browser's mandatory first gesture into the act of
 * entering the site, so the chant is playing from the visitor's first moment
 * inside rather than after some unrelated click.
 *
 * Every browser refuses to play audio with sound until the visitor has
 * interacted with the page — there is no way around that, and a site that could
 * bypass it could also blare noise at people unprompted. So this asks for the
 * gesture rather than waiting and hoping for one.
 *
 * Visibility is derived, never stored: the gate is on screen exactly while the
 * chant is wanted but silent. The moment audio flows it disappears, and a
 * visitor who chose to enter without sound has `isEnabled` false in
 * localStorage, so it never returns for them on any later visit.
 */
export function AudioGate({
  strings,
  mantra,
}: {
  strings: ChromeDict["audio"];
  mantra: string;
}) {
  const { isEnabled, isAudible, hasError, toggle } = useBackgroundAudio();

  // `isEnabled` is false during SSR and until the localStorage read lands after
  // mount, so nothing is rendered on the server and there is no hydration flash.
  if (!isEnabled || isAudible || hasError) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={strings.gateTitle}
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 px-6 text-center",
        "bg-maroon/97 text-sandal backdrop-blur-sm",
        "animate-in fade-in duration-500",
      )}
    >
      <span
        aria-hidden
        className="flex size-24 items-center justify-center rounded-full border-2 border-gold/70 bg-maroon text-5xl leading-none text-gold shadow-2xl"
      >
        ॐ
      </span>

      <p className="font-heading text-2xl text-gold sm:text-3xl">{mantra}</p>

      <h2 className="font-heading text-xl font-semibold text-sandal sm:text-2xl">
        {strings.gateTitle}
      </h2>

      <p className="max-w-sm text-sm leading-relaxed text-sandal/75">
        {strings.gateBody}
      </p>

      {/*
       * No click handler needed: any pointer or key event anywhere is the
       * qualifying gesture, the provider's listener starts the chant, and this
       * gate then unmounts because `isAudible` turns true. Handlers here would
       * in fact never fire — the unmount beats React's click.
       */}
      <button
        type="button"
        autoFocus
        className={cn(
          "mt-1 rounded-full border-2 border-gold/60 bg-gradient-to-br from-saffron to-saffron-deep",
          "px-10 py-3 font-heading text-lg font-semibold text-white shadow-lg transition-transform",
          "hover:scale-105 focus-visible:ring-4 focus-visible:ring-gold/60 focus-visible:outline-none",
        )}
      >
        {strings.gateEnter}
      </button>

      {/*
       * Never trap anyone who does not want sound. `onPointerDown` rather than
       * onClick: the same gesture unmutes the chant and unmounts this gate, so
       * a click handler would never run. Firing on pointerdown lets `toggle`
       * record the preference first, and the provider re-checks that intent
       * before it starts playing.
       */}
      <button
        type="button"
        onPointerDown={toggle}
        className="text-xs text-sandal/60 underline underline-offset-4 transition-colors hover:text-gold"
      >
        {strings.gateSkip}
      </button>
    </div>
  );
}
