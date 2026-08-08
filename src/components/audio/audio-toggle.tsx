"use client";

import { Music, Pause, Volume2, VolumeX } from "lucide-react";

import { useBackgroundAudio } from "@/components/audio/audio-provider";
import { Button } from "@/components/ui/button";
import type { ChromeDict } from "@/lib/i18n/chrome";
import { cn } from "@/lib/utils";

type AudioStrings = ChromeDict["audio"];

/**
 * Floating, always-visible control for the Om Namah Shivaya chant.
 * Pinned bottom-right so it stays reachable on every page and screen size.
 */
export function AudioToggle({
  strings,
  className,
}: {
  strings: AudioStrings;
  className?: string;
}) {
  const { isEnabled, isAudible, hasError, toggle } = useBackgroundAudio();

  // Keyed off `isAudible`, not `isPlaying`: while the browser holds us in muted
  // autoplay the element *is* playing, and offering "pause" for silence would
  // be a lie.
  const label = hasError
    ? strings.unavailable
    : isAudible
      ? strings.pause
      : isEnabled
        ? strings.waiting
        : strings.play;

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 z-50 flex items-center gap-2 sm:right-6 sm:bottom-6",
        className,
      )}
    >
      {/* Waiting-for-gesture hint: the chant is queued but the browser has not
          allowed sound yet, so tell the visitor what unlocks it. */}
      {isEnabled && !isAudible && !hasError ? (
        <span className="hidden max-w-52 rounded-full border border-gold/40 bg-card/95 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur sm:inline-block">
          {strings.hint}
        </span>
      ) : null}

      <Button
        type="button"
        onClick={toggle}
        disabled={hasError}
        aria-label={label}
        aria-pressed={isEnabled}
        title={label}
        className={cn(
          "group relative size-14 rounded-full border-2 shadow-lg transition-all",
          "border-gold/60 bg-gradient-to-br from-saffron to-saffron-deep text-white",
          "hover:scale-105 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-gold/50",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {/* Pulsing halo while the chant is audible, like a lit diya. */}
        {isAudible ? (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-gold/40 [animation-duration:2.6s]"
          />
        ) : null}

        <span className="relative flex items-center justify-center">
          {hasError ? (
            <VolumeX className="size-6" />
          ) : isAudible ? (
            <Pause className="size-6 fill-current" />
          ) : isEnabled ? (
            <Music className="size-6" />
          ) : (
            <Volume2 className="size-6" />
          )}
        </span>
      </Button>
    </div>
  );
}

/** Compact inline variant for the sidebar footer. */
export function AudioToggleInline({
  strings,
  mantra,
}: {
  strings: AudioStrings;
  mantra: string;
}) {
  const { isEnabled, isAudible, hasError, toggle } = useBackgroundAudio();

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={hasError}
      aria-pressed={isEnabled}
      aria-label={hasError ? strings.unavailable : isAudible ? strings.pause : strings.play}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
        "bg-sidebar-accent/60 text-sidebar-foreground hover:bg-sidebar-accent",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isAudible
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "bg-sidebar-border/60 text-sidebar-foreground",
        )}
      >
        {hasError ? (
          <VolumeX className="size-4" />
        ) : isAudible ? (
          <Pause className="size-4 fill-current" />
        ) : (
          <Volume2 className="size-4" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{mantra}</span>
        <span className="block truncate text-xs text-sidebar-foreground/70">
          {hasError
            ? strings.notFound
            : isAudible
              ? strings.playing
              : isEnabled
                ? strings.tapToStart
                : strings.muted}
        </span>
      </span>
    </button>
  );
}
