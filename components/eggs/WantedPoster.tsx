"use client";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, Share2, X } from "lucide-react";
import { site } from "@/data/site";
import type { EggViewProps } from "./registry-components";

const TEMPLATE_URL =
  "https://cdn.darkglance.in/portfolio/assets/poster-template.png";
const FALLBACK_TEMPLATE_URL = "/assets/poster-template.png";

const AVATAR_URL =
  site.identity.avatar || "https://cdn.darkglance.in/portfolio/assets/DG.png";
const FALLBACK_AVATAR_URL = "/assets/DG.png";

const BERRY_URL =
  "https://cdn.darkglance.in/portfolio/assets/berry-symbol.png";
const FALLBACK_BERRY_URL = "/assets/berry-symbol.png";

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

    const getPng = () => toPng(node, { pixelRatio: 2 });

    let data: string;
    try {
      data = await getPng();
    } catch {
      // Fallback to local public/assets if remote CDN has CORS restrictions
      const imgs = node.querySelectorAll<HTMLImageElement>("img");
      const originals = Array.from(imgs).map((img) => img.src);
      imgs.forEach((img) => {
        if (img.classList.contains("wanted-template-img")) {
          img.src = FALLBACK_TEMPLATE_URL;
        } else if (img.classList.contains("wanted-photo-subject")) {
          img.src = FALLBACK_AVATAR_URL;
        } else if (img.classList.contains("wanted-berry-img")) {
          img.src = FALLBACK_BERRY_URL;
        }
      });
      await new Promise((r) => setTimeout(r, 150));
      data = await getPng();
      imgs.forEach((img, idx) => {
        img.src = originals[idx];
      });
    }

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

          {/* Authentic One Piece Wanted Poster */}
          <div className="wanted-paper" id="wanted-poster">
            {/* Layer 1: Photo slot framed by template transparent cutout */}
            <div className="wanted-photo-slot">
              <div className="wanted-photo-canvas">
                <div className="wanted-photo-sky" />
                <div className="wanted-photo-rays" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={AVATAR_URL}
                  alt={site.identity.name}
                  className="wanted-photo-subject"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.src !== FALLBACK_AVATAR_URL) {
                      img.src = FALLBACK_AVATAR_URL;
                    }
                  }}
                />
                <div className="wanted-photo-vignette" />
              </div>
            </div>

            {/* Layer 2: Template Image (Aged parchment texture, double brown border, swirl flourishes) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TEMPLATE_URL}
              alt="One Piece Wanted Poster Template"
              className="wanted-template-img"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src !== FALLBACK_TEMPLATE_URL) {
                  img.src = FALLBACK_TEMPLATE_URL;
                }
              }}
            />

            {/* Layer 3: Typography & Inscriptions matching reference */}
            <div className="wanted-inscriptions">
              {/* WANTED Header */}
              <div className="wanted-header-title">WANTED</div>

              {/* DEAD OR ALIVE */}
              <div className="wanted-status-row">DEAD OR ALIVE</div>

              {/* Name: DARKGLANCE */}
              <div className="wanted-name-row">DARKGLANCE</div>

              {/* Bounty line with One Piece Berry Symbol */}
              <div className="wanted-bounty-row">
                <div className="wanted-berry-glyph">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={BERRY_URL}
                    alt="Berry symbol"
                    className="wanted-berry-img"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (img.src !== FALLBACK_BERRY_URL) {
                        img.src = FALLBACK_BERRY_URL;
                      }
                    }}
                  />
                </div>
                <div className="wanted-bounty-amount">
                  {bounty.toLocaleString("en-US")}
                  <span className="wanted-bounty-tail">&nbsp;-</span>
                </div>
              </div>

              {/* Bottom row: Japanese Disclaimer + MARINE */}
              <div className="wanted-bottom-row">
                <div className="wanted-marine-disclaimer">
                  <span>
                    KONO SAKUHIN HA FICTION DETHUNODE JITSUZAISURU JINBUTSU DANTAI
                  </span>
                  <span>
                    SONOTA NO SOSHIKI TO DOITSU NO MEISHOU GA GEKICHU NI TOUJYOU
                  </span>
                  <span>
                    SHITATOSHITEMO JITSUZAI NA MONOTOHA ISSAI MUKANKEIDETH
                  </span>
                </div>
                <div className="wanted-marine-stamp">MARINE</div>
              </div>
            </div>
          </div>

          <div className="wanted-subtext">
            <span>bounty formula: stars × 1M · {progress} repos</span>
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

export default WantedPoster;
