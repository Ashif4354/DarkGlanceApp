"use client";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { EggViewProps } from "./registry-components";
export function TreasureDialog({ close }: EggViewProps) {
  return (
    <Dialog.Root open onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="egg-backdrop" />
        <Dialog.Content className="egg-dialog treasure-dialog">
          <Dialog.Title className="sr-only">
            You found the One Piece
          </Dialog.Title>
          <Dialog.Close className="egg-close" aria-label="Close">
            <X />
          </Dialog.Close>
          <span className="treasure-glyph">◈</span>
          <span className="eyebrow">QUEST COMPLETE</span>
          <h2>
            You found the
            <br />
            <em>One Piece.</em>
          </h2>
          <p>The real treasure was the commits we made along the way.</p>
          <a
            className="button button-primary"
            href="mailto:darkglance.developer@gmail.com?subject=I%20found%20the%20One%20Piece"
          >
            Claim your reward ↗
          </a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
