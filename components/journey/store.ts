// Mutable, non-React state shared between the scroll handler (DOM side)
// and the render loop (Three side). Reading it inside useFrame avoids
// re-rendering React on every scroll event.

export const SECTION_IDS = [
  "top",
  "about",
  "projects",
  "experience",
  "skills",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface JourneyStore {
  /** Scroll-derived journey position: 0 = orbit … 5 = core. */
  target: number;
  /** Smoothed position the camera actually renders. */
  current: number;
  reducedMotion: boolean;
  lowPower: boolean;
  /** DOM nodes the render loop writes into directly. */
  veil: HTMLDivElement | null;
  gaugeValue: HTMLSpanElement | null;
  gaugeLabel: HTMLSpanElement | null;
  gaugeDot: HTMLDivElement | null;
}

export const journey: JourneyStore = {
  target: 0,
  current: 0,
  reducedMotion: false,
  lowPower: false,
  veil: null,
  gaugeValue: null,
  gaugeLabel: null,
  gaugeDot: null,
};

export interface LoadDetail {
  progress: number; // 0 → 1
  label: string;
  done?: boolean;
}

/** Tell the loading screen how far the 3D scene has got. */
export function reportLoad(detail: LoadDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<LoadDetail>("journey:load", { detail }));
}

export const JOURNEY_END = SECTION_IDS.length - 1;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Triangle pulse centred on c with half-width w, eased. */
export const pulse = (c: number, w: number, v: number) => {
  const d = 1 - Math.abs(v - c) / w;
  return d <= 0 ? 0 : d * d * (3 - 2 * d);
};

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __journey: JourneyStore }).__journey = journey;
}
