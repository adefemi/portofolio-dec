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
    slug: "black-clover",
    title: "Black Clover: Five Leaf Sky (fan game)",
    tag: "Unofficial fan game · Open world · Oct 2026",
    summary:
      "Play as Asta and Yuno, swap between them, fight the captains and close the crack in the sky. Deflect spells, dash with Black Divider, fly over the map as Yuno, and decide who becomes the next Wizard King. An unofficial fan game with an original story, free and never sold.",
    controls: "Move: WASD / arrows · Camera: mouse · Attack / deflect: left click or J · Jump: Space (twice as Yuno to fly) · Dodge: Shift or right click · Skills: E and Q · Swap hero: Tab · Talk / open: F · Best on desktop",
    orientation: "landscape",
    videos: [{ id: "pBdELqchu00", title: "Black Clover Open World Game in Godot | Play It Free" }],
    stack: ["Godot 4", "GDScript", "Blender", "TRELLIS.2"],
    accent: "#b04df0",
  },
  {
    slug: "mario-25d",
    title: "Super Plumber 2.5D",
    tag: "Remake · Oct 2026",
    summary:
      "Worlds 1-1 and 1-2 from the 1985 classic, rebuilt in 2.5D with my own hero, horned beetles, star blocks and chiptune music. Clear 1-1 and you drop into the underground: lifts, a blaster power-up, and the warp zone if you can find the way over the ceiling.",
    controls: "Move: arrows / A D · Jump: Space / Z (hold for higher) · Run: Shift / X · Fire the blaster: F / C / J · Pipes: S / Down · Phone: turn sideways and use the on-screen buttons",
    orientation: "landscape",
    videos: [{ id: "gNBqGY5pzV8", title: "Super Mario Bros World 1-1 Remade in 2.5D (Godot)" }],
    stack: ["Godot 4", "GDScript", "Blender"],
    accent: "#2bb5a8",
  },
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
    slug: "zombie-rush",
    title: "Gate Runner: Zombie Rush",
    tag: "Fake ad made real · Full game · Sep 2026",
    summary:
      "The math-gate crowd runner from the mobile ads, made real and grown into a full game: 30 levels across city, desert and snow, zombie hordes, a boss at the end of every level, and army, firepower and income upgrades.",
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

export const YOUTUBE_CHANNEL = "https://www.youtube.com/@AdefemiGreat";

/** A video's link; an empty id (video not uploaded yet) falls back to the channel. */
export const youtubeUrl = (id: string) => (id ? `https://youtu.be/${id}` : YOUTUBE_CHANNEL);

/** In-game screenshot shipped next to each build. */
export const gameCover = (slug: string) => `/play/${slug}/cover.jpg`;
