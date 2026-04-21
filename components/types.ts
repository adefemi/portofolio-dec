export type Phase = "intro" | "zoom" | "landmark";

export interface ScrollState {
  phase: Phase;
  phaseProgress: number;
  activeLandmark: number;
  landmarkProgress: number;
  vw: number;
  vh: number;
}

export const LANDMARK_COUNT = 5;

export const SECTION_VH = { intro: 100, zoom: 80 } as const;

// Per-landmark scroll length in viewport heights. Static panels stay short
// (just long enough for the fade-in / read / fade-out window) so the user
// isn't forced to scroll past dead space; animated panels get the room
// they need for their parallax/timeline interactions, and *only* that room.
//                                  About  Projects  Experience  Skills  Contact
export const LANDMARK_VH: ReadonlyArray<number> = [30, 140, 140, 30, 30];

export const LANDMARK_OFFSETS: ReadonlyArray<number> = LANDMARK_VH.reduce<
  number[]
>((acc, v, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + LANDMARK_VH[i - 1]);
  return acc;
}, []);

export const LANDMARK_TOTAL_VH = LANDMARK_VH.reduce((a, b) => a + b, 0);

// Spacer height needs a 100vh buffer so the browser's scroll max
// (page height − viewport) can actually reach the END of the last
// landmark — otherwise the final panel(s) become unreachable.
export const TOTAL_VH =
  SECTION_VH.intro + SECTION_VH.zoom + LANDMARK_TOTAL_VH + 100;
