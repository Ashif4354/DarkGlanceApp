"use client";
import { useCallback, useRef } from "react";

export function useLongPress(
  onLongPress: () => void,
  duration = 1000,
  enabled = true,
) {
  const timer = useRef<number | null>(null);
  const clear = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);
  const onTouchStart = useCallback(() => {
    if (enabled) timer.current = window.setTimeout(onLongPress, duration);
  }, [duration, enabled, onLongPress]);
  return {
    onTouchStart,
    onTouchEnd: clear,
    onTouchCancel: clear,
    onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
  };
}
