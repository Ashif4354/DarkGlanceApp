"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Toaster, toast } from "sonner";
import { useKeySequence } from "@/hooks/useKeySequence";
import { eggRegistry } from "@/lib/eggs";
import type { EggViewProps } from "./registry-components";
import { WantedPoster } from "./WantedPoster";
import { TreasureDialog } from "./TreasureDialog";
type EggContextValue = {
  pirate: boolean;
  setPirate: (v: boolean) => void;
  openEgg: (id: string) => void;
  egg: string | null;
  closeEgg: () => void;
  fragments: number;
  collectGlyph: (index: number) => void;
  observation: boolean;
  toggleObservation: () => void;
  joy: boolean;
  toggleJoy: () => void;
  rubber: boolean;
  toggleRubber: () => void;
  stars: number;
  setStarTotal: (v: number) => void;
  announce: (msg: string) => void;
};
const Context = createContext<EggContextValue | null>(null);
const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
export function useEggs() {
  const value = useContext(Context);
  if (!value) throw new Error("useEggs must be inside EggProvider");
  return value;
}
const storage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
};
export function EggProvider({ children }: { children: React.ReactNode }) {
  const [pirate, setPirateState] = useState(true),
    [egg, setEgg] = useState<string | null>(null),
    [fragments, setFragments] = useState(0),
    [observation, setObservation] = useState(false),
    [joy, setJoy] = useState(false),
    [rubber, setRubber] = useState(false),
    [stars, setStars] = useState(0),
    [confetti, setConfetti] = useState(false);
  useEffect(() => {
    setPirateState(storage.get("dg-pirate") !== "off");
    try {
      setFragments(Number(storage.get("dg-glyphs") || 0));
    } catch {}
  }, []);
  const setStarTotal = useCallback((count: number) => setStars(count), []);
  const announce = useCallback((message: string) => toast(message), []);
  const setPirate = useCallback((v: boolean) => {
    setPirateState(v);
    storage.set("dg-pirate", v ? "on" : "off");
    if (!v) {
      setEgg(null);
      setObservation(false);
      setJoy(false);
      setRubber(false);
    } else toast("Pirate mode: on");
  }, []);
  const openEgg = useCallback(
    (id: string) => {
      if (pirate) setEgg(id);
    },
    [pirate],
  );
  const openWanted = useCallback(() => {
    if (pirate) {
      storage.set("dg-seen-wanted", "true");
      setEgg("wanted");
    }
  }, [pirate]);
  useKeySequence(KONAMI_SEQUENCE, openWanted, pirate);
  const closeEgg = useCallback(() => {
    setEgg(null);
    setConfetti(false);
  }, []);
  const collectGlyph = useCallback(
    (index: number) => {
      if (!pirate) return;
      setFragments((prev) => {
        if (prev & (1 << index)) return prev;
        const next = prev | (1 << index);
        storage.set("dg-glyphs", String(next));
        const count = next.toString(2).replace(/0/g, "").length;
        toast(`Poneglyph fragment ${count}/3`);
        if (count === 3) {
          setConfetti(true);
          setTimeout(() => setEgg("treasure"), 450);
        }
        return next;
      });
    },
    [pirate],
  );
  const toggleObservation = useCallback(() => setObservation((v) => !v), []),
    toggleJoy = useCallback(() => setJoy((v) => !v), []),
    toggleRubber = useCallback(() => setRubber((v) => !v), []);
  useEffect(() => {
    if (!pirate) return;
    let typed = "";
    let space: number | undefined;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA"].includes(target.tagName))
      )
        return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") return;
      if (e.key === "Escape") {
        setEgg(null);
        setObservation(false);
        setConfetti(false);
        return;
      }
      if (e.key.toLowerCase() === "h" && !e.ctrlKey && !e.metaKey) {
        setObservation((v) => !v);
        return;
      }
      if (e.code === "Space" && !space) {
        space = window.setTimeout(() => {
          if (
            location.hash === "" ||
            location.hash === "#home" ||
            window.scrollY < window.innerHeight
          ) {
            setEgg("haki");
            space = undefined;
          }
        }, 1000);
      }
      if (e.key.length === 1) {
        typed = (typed + e.key.toLowerCase()).slice(-16);
        if (typed.endsWith("luffy") || typed.endsWith("one piece"))
          openWanted();
        if (typed.endsWith("gomu")) {
          setRubber((v) => !v);
          toast("Gomu Gomu no... Portfolio!");
        }
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && space) {
        clearTimeout(space);
        space = undefined;
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", keyUp);
      if (space) clearTimeout(space);
    };
  }, [pirate, openWanted]);
  useEffect(() => {
    if (!pirate || !rubber) return;
    const pop = () => {
      const root = document.querySelector<HTMLElement>("[data-site-root]");
      if (!root) return;
      root.classList.add("rubber-pop");
      window.setTimeout(() => root.classList.remove("rubber-pop"), 320);
    };
    document.addEventListener("click", pop);
    return () => document.removeEventListener("click", pop);
  }, [pirate, rubber]);
  useEffect(() => {
    if (!joy) return;
    document.title = "Joy mode · DarkGlance";
    const timer = setTimeout(() => setJoy(false), 15000);
    return () => {
      document.title = "DarkGlance — FullStack Developer";
      clearTimeout(timer);
    };
  }, [joy]);
  const value = useMemo(
    () => ({
      pirate,
      setPirate,
      openEgg,
      egg,
      closeEgg,
      fragments,
      collectGlyph,
      observation,
      toggleObservation,
      joy,
      toggleJoy,
      rubber,
      toggleRubber,
      stars,
      setStarTotal,
      announce,
    }),
    [
      pirate,
      setPirate,
      openEgg,
      egg,
      closeEgg,
      fragments,
      collectGlyph,
      observation,
      toggleObservation,
      joy,
      toggleJoy,
      rubber,
      toggleRubber,
      stars,
      setStarTotal,
      announce,
    ],
  );
  void eggRegistry;
  const posterProps: EggViewProps = { close: closeEgg, stars, progress: 6 };
  return (
    <Context.Provider value={value}>
      <div
        className={`${observation ? "observation-mode" : ""} ${joy ? "joy-mode" : ""} ${rubber ? "rubber-mode" : ""}`}
        data-site-root
      >
        {children}
      </div>
      <Toaster theme="dark" position="bottom-right" richColors />
      <div className="pirate-switch">
        <button
          onClick={() => setPirate(!pirate)}
          aria-pressed={pirate}
          title="Pirate mode"
        >
          ⚓ <span>Pirate {pirate ? "on" : "off"}</span>
        </button>
      </div>
      {confetti && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 34 }, (_, i) => (
            <i key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      )}
      {egg === "wanted" && <WantedPoster {...posterProps} />}
      {egg === "treasure" && <TreasureDialog close={closeEgg} />}
      {egg === "haki" && (
        <div className="haki-flash" role="status" aria-label="Conqueror’s Haki">
          <button onClick={closeEgg}>
            Haki! <span>·</span> click or Esc to dismiss
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
