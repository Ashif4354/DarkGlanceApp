import { useState, useEffect } from "react";
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
export function useAudioBell() {
  const [muted, setMuted] = useState(true);
  const play = () => {
    if (muted) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(740, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.055, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.36);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {}
  };
  return { muted, setMuted, play };
}
