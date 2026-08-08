"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AUDIO_TRACK_SRC } from "@/lib/site";

const DEFAULT_VOLUME = 0.35;

/** Storage key used by earlier builds. Read no longer; cleared on sight. */
const LEGACY_STORAGE_KEY = "rgst:chant-enabled";

/**
 * The visitor's choice for the current visit, held in module scope rather than
 * in localStorage.
 *
 * Deliberate. A persisted preference used to outlive the visit forever: anyone
 * who once tapped pause — or entered without sound — was silent on every later
 * visit and never even saw the gate again, because the gate renders only while
 * `isEnabled` is true, and without that gesture prompt no browser will ever
 * allow the chant to become audible. Module scope resets when the document
 * loads, so every fresh visit offers the chant, while a pause still holds
 * across client-side navigation — including a language switch, which remounts
 * this provider along with the `[lang]` layout.
 */
let visitChoice: boolean | null = null;

type AudioState = {
  /** The user wants the chant on. */
  isEnabled: boolean;
  /** The element is running — but possibly muted, see `isAudible`. */
  isPlaying: boolean;
  /** Sound is actually reaching the visitor. This is what the UI labels. */
  isAudible: boolean;
  /** The track could not be loaded (missing file, bad codec, offline). */
  hasError: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (value: number) => void;
};

const AudioContext = createContext<AudioState | null>(null);

export function useBackgroundAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useBackgroundAudio must be used inside <AudioProvider>");
  }
  return context;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** True while we are running silently, waiting for a gesture to unmute. */
  const silentFallbackRef = useRef(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudible, setIsAudible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  /** Mirrors `isEnabled` for handlers that must read it after a state change. */
  const isEnabledRef = useRef(false);

  // Default to on: the chant is part of the experience on a devotional site.
  //
  // This runs after mount rather than in a lazy useState initializer so the
  // server renders `false` and the full-screen gate stays out of the SSR HTML.
  // If the client bundle ever fails to load, that keeps an undismissable
  // overlay from stranding the visitor on a page they cannot use.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setIsEnabled(visitChoice ?? true);
    // Evict the abandoned key so it cannot resurface in a future debug session.
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }, []);

  // Single <audio> element created imperatively so it is never torn down by a
  // re-render and playback survives client-side navigation.
  useEffect(() => {
    const audio = new Audio(AUDIO_TRACK_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = DEFAULT_VOLUME;
    audioRef.current = audio;

    const sync = () => {
      setIsPlaying(!audio.paused);
      setIsAudible(!audio.paused && !audio.muted);
    };
    const onError = () => {
      setHasError(true);
      setIsPlaying(false);
      setIsAudible(false);
    };

    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("volumechange", sync); // fires on mute/unmute too
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("volumechange", sync);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  /**
   * Start the chant as early as the browser permits.
   *
   * Every browser blocks *audible* autoplay until the visitor has interacted
   * with the page — that is a platform rule, not a setting we control. Muted
   * autoplay is allowed though, so when the audible attempt is refused we start
   * muted anyway. The track is then genuinely running from page load, and the
   * first gesture only has to flip `muted`, which makes the chant begin
   * effectively the instant the visitor touches anything.
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (!isEnabled) {
      audio.pause();
      return;
    }

    let cancelled = false;
    audio.muted = false;
    audio.play().catch(() => {
      if (cancelled) return;
      // Audible autoplay refused — run silently until a gesture arrives.
      silentFallbackRef.current = true;
      audio.muted = true;
      audio.play().catch(() => {});
    });

    return () => {
      cancelled = true;
    };
  }, [isEnabled, hasError]);

  /**
   * The first genuine gesture unmutes. Restarting from zero means the chant is
   * heard from its opening syllable rather than dropping in mid-word.
   *
   * Only events the HTML spec counts as "activation triggering" are listened
   * for. Scroll and wheel are deliberately absent: they feel like interaction
   * but do NOT grant a browser's autoplay permission, so listening for them
   * would just fail silently and mislead the next person reading this.
   */
  useEffect(() => {
    if (!isEnabled || isAudible || hasError) return;

    const events = [
      "pointerdown",
      "pointerup",
      "touchend",
      "keydown",
      "click",
    ] as const;

    const start = () => {
      const audio = audioRef.current;
      // Re-check intent: the same click that unblocks audio may also have been
      // the visitor choosing "enter without sound", and that handler runs first.
      if (!audio || !isEnabledRef.current) return;
      if (silentFallbackRef.current) {
        silentFallbackRef.current = false;
        audio.currentTime = 0;
      }
      audio.muted = false;
      audio.play().catch(() => {});
    };

    for (const event of events) {
      document.addEventListener(event, start, { once: true, passive: true });
    }
    return () => {
      for (const event of events) {
        document.removeEventListener(event, start);
      }
    };
  }, [isEnabled, isAudible, hasError]);

  const toggle = useCallback(() => {
    setIsEnabled((previous) => {
      const next = !previous;
      visitChoice = next;
      return next;
    });
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.min(1, Math.max(0, value)));
  }, []);

  const value = useMemo<AudioState>(
    () => ({
      isEnabled,
      isPlaying,
      isAudible,
      hasError,
      volume,
      toggle,
      setVolume,
    }),
    [isEnabled, isPlaying, isAudible, hasError, volume, toggle, setVolume],
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}
