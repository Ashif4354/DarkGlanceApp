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
    let max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const updateMax = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    window.addEventListener("resize", updateMax, { passive: true });

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setInternalProgress(Math.min(window.scrollY / max, 1));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateMax();
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateMax);
    };
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

export function HagoromoClouds() {
  return (
    <div className="hagoromo-container" aria-hidden="true">
      <svg
        className="hagoromo-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cloud-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="70%" stopColor="#fffcf5" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffefd4" stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id="cloud-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#ffe4b0" />
            <stop offset="100%" stopColor="#ffb340" />
          </linearGradient>
          <radialGradient id="sun-sparkle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#ffe082" />
            <stop offset="100%" stopColor="#ff9800" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="hagoromo-scene">
          {/* Main billowing Hagoromo sash on the right */}
          <g className="hagoromo-ribbon-right">
            {/* Billowing cloud lobes */}
            <path
              d="M 940,160 
                 C 910,90 980,40 1060,55 
                 C 1120,25 1210,50 1240,120 
                 C 1310,130 1370,190 1350,260 
                 C 1400,320 1380,410 1320,450 
                 C 1350,510 1310,590 1230,610 
                 C 1200,670 1110,690 1040,650 
                 C 980,690 890,660 860,590 
                 C 800,570 780,490 820,430 
                 C 770,370 790,290 850,260 
                 C 830,190 880,140 940,160 Z"
              fill="url(#cloud-fill)"
              stroke="url(#cloud-stroke)"
              strokeWidth="3.5"
            />
            {/* Inner cloud contours for authentic anime volume */}
            <path d="M 980,150 C 1020,120 1080,130 1100,170" stroke="#f0c070" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65" />
            <path d="M 1150,115 C 1200,105 1250,135 1250,185" stroke="#f0c070" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65" />
            <path d="M 1260,250 C 1310,265 1330,325 1290,370" stroke="#f0c070" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65" />
            <path d="M 1240,430 C 1280,455 1280,520 1230,555" stroke="#f0c070" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M 1140,590 C 1170,640 1110,675 1060,650" stroke="#f0c070" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M 970,620 C 930,640 880,610 880,560" stroke="#f0c070" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M 850,440 C 820,390 850,330 900,330" stroke="#f0c070" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />

            {/* Signature Gear 5 Nika Spiral Curl at Ribbon Tip */}
            <path
              d="M 880,195 
                 C 840,165 795,190 795,235 
                 C 795,275 835,300 870,285 
                 C 895,270 900,235 875,220 
                 C 855,210 835,225 842,242"
              stroke="url(#cloud-stroke)"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Lower Loop / Floating Cloud Sash */}
          <g className="hagoromo-ribbon-bottom">
            <path
              d="M 640,730 
                 C 610,680 670,630 740,645 
                 C 790,615 860,635 885,690 
                 C 940,695 980,750 960,810 
                 C 980,860 930,920 860,915 
                 C 800,940 730,920 700,865 
                 C 640,865 600,815 620,760 
                 C 590,720 620,680 640,730 Z"
              fill="url(#cloud-fill)"
              stroke="url(#cloud-stroke)"
              strokeWidth="3"
            />
            <path d="M 670,720 C 700,680 760,690 780,730" stroke="#f0c070" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M 820,680 C 860,670 900,705 900,750" stroke="#f0c070" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M 860,800 C 900,830 890,880 840,880" stroke="#f0c070" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.6" />
          </g>

          {/* Top-Left Celestial Header Wisp (Safely above headline) */}
          <g className="hagoromo-ribbon-top">
            <path
              d="M 160,80 
                 C 140,30 220,5 285,25 
                 C 340,5 410,25 435,75 
                 C 480,85 505,135 470,180 
                 C 435,210 370,210 335,175 
                 C 290,205 225,185 205,135 
                 C 160,135 135,95 160,80 Z"
              fill="url(#cloud-fill)"
              stroke="url(#cloud-stroke)"
              strokeWidth="3"
            />
            <path d="M 220,70 C 255,45 310,55 325,90" stroke="#f0c070" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M 370,65 C 410,55 450,85 445,125" stroke="#f0c070" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />

            {/* Left Nika Spiral Curl */}
            <path
              d="M 460,150 
                 C 485,165 515,150 515,125 
                 C 515,102 495,90 475,100 
                 C 460,110 462,128 472,136 
                 C 482,142 494,134 490,124"
              stroke="url(#cloud-stroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Floating Joy / Nika Celestial Sparkles */}
          <g className="hagoromo-sparkles">
            <path d="M 760,150 L 764,165 L 779,169 L 764,173 L 760,188 L 756,173 L 741,169 L 756,165 Z" fill="url(#sun-sparkle)" />
            <path d="M 1320,520 L 1323,532 L 1335,535 L 1323,538 L 1320,550 L 1317,538 L 1305,535 L 1317,532 Z" fill="url(#sun-sparkle)" />
            <path d="M 680,600 L 683,612 L 695,615 L 683,618 L 680,630 L 677,618 L 665,615 L 677,612 Z" fill="url(#sun-sparkle)" />
            <path d="M 540,110 L 542,120 L 552,122 L 542,124 L 540,134 L 538,124 L 528,122 L 538,120 Z" fill="url(#sun-sparkle)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
