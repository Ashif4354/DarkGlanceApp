import { useState, useEffect, useRef, useCallback } from "react";
import { X, Volume2, VolumeX } from "lucide-react";

export type EggViewProps = {
  close: () => void;
  stars?: number;
  progress?: number;
  onSound?: () => void;
};
export function LogPose({
  progress: externalProgress,
  next = "about",
  onClick,
}: {
  progress?: number;
  next: string;
  onClick: () => void;
}) {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (externalProgress !== undefined) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const max =
            document.documentElement.scrollHeight - window.innerHeight || 1;
          setInternalProgress(Math.min(window.scrollY / max, 1));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [externalProgress]);

  const progress = externalProgress !== undefined ? externalProgress : internalProgress;

  return (
    <button
      className="log-pose"
      onClick={onClick}
      aria-label={`Next stop: ${next}`}
      title={`Next stop: ${next}`}
    >
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="19" />
        <circle
          className="pose-progress"
          cx="24"
          cy="24"
          r="19"
          style={{ strokeDashoffset: 119.4 * (1 - progress) }}
        />
        <path d="m24 9 4 16-4 14-4-14z" />
      </svg>
      <span>
        Next stop
        <br />
        {next}
      </span>
    </button>
  );
}
export function SnailPhone({
  muted,
  setMuted,
  reveal,
  onPick,
}: {
  muted: boolean;
  setMuted: (v: boolean) => void;
  reveal: boolean;
  onPick: () => void;
}) {
  return (
    <div className={`snail ${reveal ? "snail-reveal" : ""}`}>
      <button
        className="snail-doodle"
        onClick={onPick}
        aria-label="Pick up the Den Den Mushi"
      >
        <span className="snail-shell">〰</span>
        <span className="snail-face">◡</span>
        <span className="snail-antenna">⌁</span>
      </button>
      <div>
        <button className="button button-small" onClick={onPick}>
          {reveal ? "Call answered" : "Pick up the call"}
        </button>
        <button
          className="sound-toggle"
          onClick={() => setMuted(!muted)}
          aria-label={muted ? "Enable sound" : "Mute sound"}
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />} Sound{" "}
          {muted ? "off" : "on"}
        </button>
      </div>
    </div>
  );
}
export function FruitHint({
  skill,
  close,
}: {
  skill: string;
  close: () => void;
}) {
  const jokes: Record<string, [string, string]> = {
    Python: ["Automates the tedious bits.", "Indentation errors."],
    JavaScript: ["Runs almost everywhere.", "One more async edge case."],
    React: ["Composes interfaces fast.", "Too many rerenders."],
    Node: ["Brings JS to the backend.", "Callback déjà vu."],
  };
  const joke = jokes[skill] || [
    "Makes the build happen.",
    "A missing semicolon.",
  ];
  return (
    <div className="fruit-hint">
      <button onClick={close} aria-label="Dismiss">
        <X size={13} />
      </button>
      <strong>
        {skill}-{skill} no Mi
      </strong>
      <span>POWER · {joke[0]}</span>
      <span>WEAKNESS · {joke[1]}</span>
    </div>
  );
}
export function Poneglyph({
  index,
  onCollect,
}: {
  index: number;
  onCollect: () => void;
}) {
  return (
    <button
      className="poneglyph"
      onClick={onCollect}
      aria-label={`Collect hidden glyph fragment ${index}`}
      title="Ancient inscription"
    >
      ⌘
    </button>
  );
}
export const DENDEN_AUDIO = {
  ring: "https://cdn.darkglance.in/portfolio/assets/dendenmushi-pere.mp3",
  pickup: "https://cdn.darkglance.in/portfolio/assets/dendenmushi-gachak.mp3",
  rickroll: "https://cdn.darkglance.in/portfolio/assets/rickroll.mp3",
} as const;

// Module-level cache so audio elements are created once and kept in memory
const audioCache = new Map<string, HTMLAudioElement>();

function getCachedAudio(url: string, loop = false): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  let audio = audioCache.get(url);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = "auto";
    audioCache.set(url, audio);
  }
  audio.loop = loop;
  return audio;
}

function safePlay(audio: HTMLAudioElement): Promise<void> {
  try {
    const promise = audio.play();
    if (promise !== undefined) {
      return promise.catch(() => {
        // Handled: browser autoplay restrictions or pause interrupts
      });
    }
  } catch {}
  return Promise.resolve();
}

function safePause(audio: HTMLAudioElement, reset = false) {
  try {
    audio.pause();
    if (reset) {
      audio.currentTime = 0;
    }
  } catch {}
}

export type AudioBellOptions = {
  isRinging?: boolean;
  rickrollDelaySeconds?: number;
};

export function useAudioBell(options?: AudioBellOptions) {
  const [muted, setMutedState] = useState(true);
  const isRinging = Boolean(options?.isRinging);
  const rickrollDelaySeconds = options?.rickrollDelaySeconds ?? 2;

  const isRingingRef = useRef(isRinging);
  isRingingRef.current = isRinging;

  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const ringAudioRef = useRef<HTMLAudioElement | null>(null);
  const pickupAudioRef = useRef<HTMLAudioElement | null>(null);
  const rickrollAudioRef = useRef<HTMLAudioElement | null>(null);
  const rickrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRickrollingRef = useRef(false);

  // Preload and cache all audio files on mount
  useEffect(() => {
    const ringAudio = getCachedAudio(DENDEN_AUDIO.ring, true);
    const pickupAudio = getCachedAudio(DENDEN_AUDIO.pickup, false);
    const rickrollAudio = getCachedAudio(DENDEN_AUDIO.rickroll, false);
    ringAudioRef.current = ringAudio;
    pickupAudioRef.current = pickupAudio;
    rickrollAudioRef.current = rickrollAudio;

    // Trigger preload into browser HTTP and media buffer cache
    ringAudio?.load();
    pickupAudio?.load();
    rickrollAudio?.load();

    // CacheStorage warming if supported
    if (typeof window !== "undefined" && "caches" in window) {
      caches
        .open("darkglance-audio-cache-v1")
        .then((cache) => {
          [DENDEN_AUDIO.ring, DENDEN_AUDIO.pickup, DENDEN_AUDIO.rickroll].forEach((url) => {
            cache.match(url).then((matched) => {
              if (!matched) {
                fetch(url, { mode: "no-cors" })
                  .then((res) => cache.put(url, res))
                  .catch(() => {});
              }
            });
          });
        })
        .catch(() => {});
    }
  }, []);

  // Synchronize playback with sound toggle & ringing state
  useEffect(() => {
    const ringAudio = ringAudioRef.current ?? getCachedAudio(DENDEN_AUDIO.ring, true);
    if (!ringAudio) return;

    if (!muted && isRinging) {
      safePlay(ringAudio);
    } else {
      safePause(ringAudio, true);
    }

    return () => {
      safePause(ringAudio, true);
    };
  }, [muted, isRinging]);

  // Pause playback if the user leaves/switches the tab, resume if still playing on return
  useEffect(() => {
    const handleVisibility = () => {
      const ringAudio = ringAudioRef.current ?? getCachedAudio(DENDEN_AUDIO.ring, true);
      const rickrollAudio = rickrollAudioRef.current ?? getCachedAudio(DENDEN_AUDIO.rickroll, false);
      if (document.hidden) {
        if (ringAudio) safePause(ringAudio, false);
        if (rickrollAudio) safePause(rickrollAudio, false);
      } else if (!mutedRef.current) {
        if (isRingingRef.current && ringAudio) {
          safePlay(ringAudio);
        } else if (isRickrollingRef.current && rickrollAudio) {
          safePlay(rickrollAudio);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Handle direct user gesture for muting/unmuting
  const setMuted = useCallback((nextMuted: boolean | ((prev: boolean) => boolean)) => {
    setMutedState((prev) => {
      const resolved = typeof nextMuted === "function" ? nextMuted(prev) : nextMuted;
      const ringAudio = ringAudioRef.current ?? getCachedAudio(DENDEN_AUDIO.ring, true);
      const rickrollAudio = rickrollAudioRef.current ?? getCachedAudio(DENDEN_AUDIO.rickroll, false);

      if (resolved) {
        // Muted: stop ringing, cancel pending rickroll, pause active playback
        if (ringAudio) safePause(ringAudio, true);
        if (rickrollTimerRef.current) {
          clearTimeout(rickrollTimerRef.current);
          rickrollTimerRef.current = null;
        }
        if (rickrollAudio) safePause(rickrollAudio, false);
      } else {
        // Unmuted: resume ringing if still incoming or resume rickroll if previously active
        if (isRingingRef.current && ringAudio) {
          ringAudio.currentTime = 0;
          safePlay(ringAudio);
        } else if (isRickrollingRef.current && rickrollAudio) {
          safePlay(rickrollAudio);
        }
      }
      return resolved;
    });
  }, []);

  // Called when picking up the phone: stops ringing, plays pickup sound, and queues Rickroll
  const play = useCallback(() => {
    // 1. Immediately stop the ringing loop
    const ringAudio = ringAudioRef.current ?? getCachedAudio(DENDEN_AUDIO.ring, true);
    if (ringAudio) {
      safePause(ringAudio, true);
    }

    if (rickrollTimerRef.current) {
      clearTimeout(rickrollTimerRef.current);
      rickrollTimerRef.current = null;
    }

    // 2. Play pickup audio if sound is on
    if (!mutedRef.current) {
      const pickupAudio = pickupAudioRef.current ?? getCachedAudio(DENDEN_AUDIO.pickup, false);
      if (pickupAudio) {
        pickupAudio.currentTime = 0;
        safePlay(pickupAudio);
      }

      // 3. Wait N seconds and play Rickroll audio
      const delayMs = Math.max(0, rickrollDelaySeconds * 1000);
      rickrollTimerRef.current = setTimeout(() => {
        rickrollTimerRef.current = null;
        if (!mutedRef.current) {
          const rickrollAudio = rickrollAudioRef.current ?? getCachedAudio(DENDEN_AUDIO.rickroll, false);
          if (rickrollAudio) {
            isRickrollingRef.current = true;
            rickrollAudio.currentTime = 0;
            safePlay(rickrollAudio);
            rickrollAudio.onended = () => {
              isRickrollingRef.current = false;
            };
          }
        }
      }, delayMs);
    }
  }, [rickrollDelaySeconds]);

  // Clean up timer and stop playback on unmount
  useEffect(() => {
    return () => {
      if (rickrollTimerRef.current) {
        clearTimeout(rickrollTimerRef.current);
      }
      const ringAudio = ringAudioRef.current;
      const rickrollAudio = rickrollAudioRef.current;
      if (ringAudio) safePause(ringAudio, true);
      if (rickrollAudio) safePause(rickrollAudio, true);
    };
  }, []);

  return { muted, setMuted, play, playPickup: play };
}
