// Playable Godot web builds. Each build lives in public/play/<slug>/ (index.html + .pck + .wasm).

export interface Game {
  slug: string;
  title: string;
  tag: string;
  summary: string;
  controls: string;
  /** "portrait" games are built for phones (9:16); "landscape" for desktop (16:9). */
  orientation: "portrait" | "landscape";
  videos: ReadonlyArray<{ id: string; title: string }>;
  stack: string[];
  accent: string;
}

export const GAMES_INTRO = {
  eyebrow: "The arcade · Play in your browser",
  title: ["Games from the channel,", "playable right here", "."],
  body:
    "Every game I build on YouTube ends up here. No install, no account: hit play. They're Godot builds running in your browser, so give them a few seconds to load.",
};

export const GAMES: ReadonlyArray<Game> = [
  {
    slug: "contra",
    title: "Contra 3D",
    tag: "Remake · Sep 2026",
    summary:
      "NES Contra rebuilt as a 2.5D shooter in Godot: run, jump, prone, swap weapons and take down the fortress gate boss.",
    controls: "Move: WASD / arrows · Jump: Space · Fire: J · Drop down: Shift + S · Phone: turn sideways, tap Open full screen, use the on-screen pad",
    orientation: "landscape",
    videos: [
      { id: "X9v_93xojXw", title: "I Spent 3 Weeks Remaking Contra. Was It Worth It?" },
      { id: "_kv8VtDv20M", title: "I Remade NES Contra in 2.5D (First Gameplay)" },
    ],
    stack: ["Godot 4", "GDScript", "Jolt"],
    accent: "#e07a5a",
  },
  {
    slug: "gate-runner",
    title: "Gate Runner",
    tag: "Fake ad made real · Sep 2026",
    summary:
      "The original one-level prototype: the math-gate crowd runner from the mobile ads, but real. Steer through the right gates and multiply your crowd.",
    controls: "Drag / swipe left and right to steer",
    orientation: "portrait",
    videos: [{ id: "mOfEJ3BbeCM", title: "I Made the Fake Mobile Game Ad REAL (and it's actually fun)" }],
    stack: ["Godot 4", "GDScript"],
    accent: "#5ad6ff",
  },
  {
    slug: "zombie-rush",
    title: "Zombie Rush",
    tag: "Gate Runner sequel · Full game · Sep 2026",
    summary:
      "The sequel to Gate Runner, grown into a full mobile game: 30 levels across city, desert and snow, zombie hordes, a boss at the end of every level, and army, firepower and income upgrades.",
    controls: "Drag / swipe to steer · tap the menus",
    orientation: "portrait",
    videos: [{ id: "mOfEJ3BbeCM", title: "I Made the Fake Mobile Game Ad REAL (and it's actually fun)" }],
    stack: ["Godot 4", "GDScript", "Mobile"],
    accent: "#6fae84",
  },
  {
    slug: "pin-rescue",
    title: "Pin Rescue",
    tag: "Fake ad made real · Oct 2026",
    summary:
      "The \"pull the pin\" puzzle from the fake ads, made real with glowing lava, water and gold physics. Pull the pins in the right order.",
    controls: "Click / tap a pin to pull it",
    orientation: "portrait",
    videos: [{ id: "EclGCjGV3Nk", title: "Fake \"Pull the Pin\" Mobile Ad Made Real in Godot: The Glow-Up" }],
    stack: ["Godot 4", "GDScript", "Jolt"],
    accent: "#f0b840",
  },
  {
    slug: "township",
    title: "Township Real",
    tag: "Fake ad made real · Oct 2026",
    summary:
      "The farm from Township's fake ads: mountains of real-physics eggs, egg towers, trucks, a market queue and apple trees that rain apples.",
    controls: "Drag anywhere to walk the farmer · tap the upgrade buttons",
    orientation: "portrait",
    videos: [{ id: "4WuaT3_mmwk", title: "Township Ads Lied... So I Made the Real Game" }],
    stack: ["Godot 4", "GDScript", "Jolt"],
    accent: "#c58cff",
  },
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);

export const youtubeUrl = (id: string) => `https://youtu.be/${id}`;

/** In-game screenshot shipped next to each build. */
export const gameCover = (slug: string) => `/play/${slug}/cover.jpg`;
