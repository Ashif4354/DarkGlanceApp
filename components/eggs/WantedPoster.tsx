"use client";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, Share2, X } from "lucide-react";
import type { EggViewProps } from "./registry-components";

export function WantedPoster({
  close,
  stars = 122,
  progress = 6,
}: EggViewProps) {
  const [bounty, setBounty] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const pct = Math.min((now - start) / 1300, 1);
      setBounty(Math.round(stars * 1_000_000 * (1 - Math.pow(1 - pct, 3))));
      if (pct < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [stars]);
  const download = async () => {
    const node = document.getElementById("wanted-poster");
    if (!node) return;
    const { toPng } = await import("html-to-image");
    const data = await toPng(node, { cacheBust: true });
    const link = document.createElement("a");
    link.download = "darkglance-wanted.png";
    link.href = data;
    link.click();
  };
  const share = async () => {
    if (navigator.share)
      await navigator.share({
        title: "DarkGlance Wanted Poster",
        url: location.href,
      });
    else await navigator.clipboard.writeText(location.href);
  };
  return (
    <Dialog.Root open onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="egg-backdrop" />
        <Dialog.Content className="egg-dialog wanted-dialog">
          <Dialog.Title className="sr-only">
            Wanted Poster for DarkGlance
          </Dialog.Title>
          <Dialog.Close className="egg-close" aria-label="Close">
            <X />
          </Dialog.Close>
          <div className="wanted-paper" id="wanted-poster">
            <p className="wanted-overline">WANTED</p>
            <div className="wanted-silhouette">
              <span>DG</span>
            </div>
            <h2 id="wanted-title">DarkGlance</h2>
            <p className="wanted-tag">FOR CRIMES AGAINST BAD CODE</p>
            <div className="bounty">฿ {bounty.toLocaleString("en-IN")}</div>
            <small>bounty formula: stars × 1M · {progress} repos</small>
          </div>
          <div className="egg-actions">
            <button className="button button-small" onClick={download}>
              <Download size={15} /> Download poster
            </button>
            <button className="button button-small" onClick={share}>
              <Share2 size={15} /> Share
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
