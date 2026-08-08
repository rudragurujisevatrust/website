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

const STORAGE_KEY = "rgst:chant-enabled";
const DEFAULT_VOLUME = 0.35;

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

  // Restore the visitor's previous choice. Defaults to on: the chant is part of
  // the experience on a devotional site.
  //
  // This must run after mount rather than in a lazy useState initializer: the
  // server has no access to localStorage, so reading it during the first render
  // would make the client markup disagree with the server's and break
  // hydration. Rendering the default and correcting here is the safe order.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setIsEnabled(stored === null ? true : stored === "true");
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
      window.localStorage.setItem(STORAGE_KEY, String(next));
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
