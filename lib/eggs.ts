export type EggId =
  | "wanted-poster"
  | "log-pose"
  | "den-den-mushi"
  | "devil-fruits"
  | "conquerors-haki"
  | "observation-haki"
  | "gomu-gomu"
  | "gear-5"
  | "poneglyph-hunt"
  | "loading-ship-wheel"
  | "lost-in-grand-line"
  | "devtools-console"
  | "original-jolly-roger";
export type EggDefinition = {
  id: EggId;
  name: string;
  trigger: string;
  hint: string;
  component: () => Promise<unknown>;
};
const sharedEggComponents = () =>
  import("@/components/eggs/registry-components");
export const eggRegistry: EggDefinition[] = [
  {
    id: "wanted-poster",
    name: "Wanted Poster",
    trigger:
      "Konami code, type luffy / one piece, or tap footer mark five times",
    hint: "???",
    component: () => import("@/components/eggs/WantedPoster"),
  },
  {
    id: "log-pose",
    name: "Log Pose",
    trigger: "Visible at lower left on desktop; click to go to next section",
    hint: "Next stop",
    component: sharedEggComponents,
  },
  {
    id: "den-den-mushi",
    name: "Den Den Mushi",
    trigger: "Contact section: pick up the call",
    hint: "Incoming message",
    component: sharedEggComponents,
  },
  {
    id: "devil-fruits",
    name: "Devil Fruit skills",
    trigger: "Hover, focus, or tap a strong skill chip",
    hint: "Fruit power",
    component: sharedEggComponents,
  },
  {
    id: "conquerors-haki",
    name: "Conqueror’s Haki",
    trigger: "Hold Space on desktop or long-press the hero title on touch",
    hint: "A pulse of will",
    component: sharedEggComponents,
  },
  {
    id: "observation-haki",
    name: "Observation Haki",
    trigger: "Press H or choose it in Cmd/Ctrl+K",
    hint: "See everything",
    component: sharedEggComponents,
  },
  {
    id: "gomu-gomu",
    name: "Gomu Gomu cursor",
    trigger: "Type gomu on desktop",
    hint: "Rubber mode",
    component: sharedEggComponents,
  },
  {
    id: "gear-5",
    name: "Gear 5 / Joy mode",
    trigger: "Cmd/Ctrl+K → Gear 5",
    hint: "Gear 5",
    component: sharedEggComponents,
  },
  {
    id: "poneglyph-hunt",
    name: "Poneglyph hunt",
    trigger: "Collect the three hidden glyph fragments",
    hint: "Ancient inscription",
    component: sharedEggComponents,
  },
  {
    id: "loading-ship-wheel",
    name: "Ship wheel loader",
    trigger: "Initial page load",
    hint: "Setting sail",
    component: sharedEggComponents,
  },
  {
    id: "lost-in-grand-line",
    name: "Lost in the Grand Line",
    trigger: "Visit an unknown route",
    hint: "404",
    component: sharedEggComponents,
  },
  {
    id: "devtools-console",
    name: "Console message",
    trigger: "Open browser devtools after loading the page",
    hint: "Console message",
    component: sharedEggComponents,
  },
  {
    id: "original-jolly-roger",
    name: "DarkGlance Jolly Roger",
    trigger: "Hover the footer flag; click to open the poster",
    hint: "#OnePieceForever",
    component: sharedEggComponents,
  },
];
