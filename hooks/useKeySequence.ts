"use client";
import { useEffect } from "react";

export function useKeySequence(
  sequence: string[],
  onMatch: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    let position = 0;
    const keydown = (event: KeyboardEvent) => {
      if (event.key.length > 1 && !event.key.startsWith("Arrow")) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === sequence[position]) position += 1;
      else position = key === sequence[0] ? 1 : 0;
      if (position === sequence.length) {
        position = 0;
        onMatch();
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [enabled, onMatch, sequence]);
}
