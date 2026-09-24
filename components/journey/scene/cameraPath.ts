import { Vector3 } from "three";

// Journey position t: 0 hero (orbit) · 1 about (stratosphere) · 2 projects
// (sea level) · 3 experience (highlands) · 4 skills (ground) · 5 contact (core).
// Between 0 and ORBIT_END the camera flies the globe scene; after
// SWAP_AT the local "surface" world takes over, hidden behind the haze veil.

export const ORBIT_END = 0.9;
export const SWAP_AT = 0.86;

export interface Key {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
}

// Surface world. y is altitude (sea level = 0), −z is "inland".
// Crater / shaft is at (0, *, CRATER_Z); the core cavern sits beneath it.
export const CRATER_Z = -1880;
export const CRATER_R = 46;
export const CORE_Y = -1650;
export const SHAFT_BOTTOM = -1420;

export const WORLD_KEYS: Key[] = [
  { t: 0.86, pos: [0, 1250, 900], look: [0, 1180, -600] },
  { t: 1.0, pos: [0, 1050, 700], look: [0, 1010, 520] },
  { t: 1.3, pos: [0, 820, 350], look: [0, 600, -600] },
  { t: 1.55, pos: [0, 620, 60], look: [0, 380, -700] },
  { t: 1.78, pos: [0, 300, -150], look: [0, 120, -850] },
  { t: 2.0, pos: [0, 34, -330], look: [0, 33, -450] },
  { t: 2.35, pos: [0, 80, -700], look: [0, 110, -1250] },
  { t: 2.7, pos: [-40, 160, -1010], look: [0, 120, -1300] },
  { t: 3.0, pos: [-30, 132, -1212], look: [-15, 128, -1345] },
  { t: 3.35, pos: [0, 140, -1470], look: [0, 40, -1800] },
  { t: 3.7, pos: [0, 60, -1630], look: [0, 30, -1900] },
  { t: 4.0, pos: [0, 36, -1690], look: [0, 34, -1810] },
  { t: 4.3, pos: [0, 70, -1800], look: [0, -30, CRATER_Z] },
  { t: 4.5, pos: [0, 0, CRATER_Z + 0.5], look: [0, -300, CRATER_Z] },
  { t: 4.75, pos: [0, -600, CRATER_Z + 0.5], look: [0, -1400, CRATER_Z] },
  { t: 4.9, pos: [0, -1300, CRATER_Z + 2], look: [0, CORE_Y, CRATER_Z] },
  { t: 5.0, pos: [90, -1560, CRATER_Z + 230], look: [30, -1600, CRATER_Z + 110] },
];

const cr = (p0: number, p1: number, p2: number, p3: number, u: number) => {
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
  );
};

/** Catmull-Rom through keyframes, parameterised by each key's t. */
export function sampleKeys(
  keys: Key[],
  t: number,
  outPos: Vector3,
  outLook: Vector3,
) {
  const n = keys.length;
  if (t <= keys[0].t) {
    outPos.set(...keys[0].pos);
    outLook.set(...keys[0].look);
    return;
  }
  if (t >= keys[n - 1].t) {
    outPos.set(...keys[n - 1].pos);
    outLook.set(...keys[n - 1].look);
    return;
  }
  let i = 0;
  while (i < n - 2 && t > keys[i + 1].t) i++;
  const a = keys[Math.max(0, i - 1)];
  const b = keys[i];
  const c = keys[i + 1];
  const d = keys[Math.min(n - 1, i + 2)];
  const u = (t - b.t) / (c.t - b.t);
  for (let k = 0; k < 3; k++) {
    const p = cr(a.pos[k], b.pos[k], c.pos[k], d.pos[k], u);
    const l = cr(a.look[k], b.look[k], c.look[k], d.look[k], u);
    if (k === 0) {
      outPos.x = p;
      outLook.x = l;
    } else if (k === 1) {
      outPos.y = p;
      outLook.y = l;
    } else {
      outPos.z = p;
      outLook.z = l;
    }
  }
}

// ---- Depth gauge: real-world altitude for each stretch of the journey ----

interface GaugeStop {
  t: number;
  metres: number;
  label: string;
}

const GAUGE: GaugeStop[] = [
  { t: 0, metres: 400_000, label: "Low Earth orbit" },
  { t: 0.7, metres: 100_000, label: "Kármán line" },
  { t: 1.0, metres: 12_000, label: "Stratosphere" },
  { t: 1.55, metres: 2_000, label: "Cloud deck" },
  { t: 2.0, metres: 30, label: "Sea level" },
  { t: 3.0, metres: 2_400, label: "Highlands" },
  { t: 4.0, metres: 180, label: "Ground" },
  { t: 4.45, metres: 0, label: "Crust" },
  { t: 4.7, metres: -35_000, label: "Mantle" },
  { t: 4.88, metres: -2_900_000, label: "Outer core" },
  { t: 5.0, metres: -5_150_000, label: "Inner core" },
];

export function gaugeAt(t: number): { text: string; label: string } {
  let i = 0;
  while (i < GAUGE.length - 2 && t > GAUGE[i + 1].t) i++;
  const a = GAUGE[i];
  const b = GAUGE[i + 1];
  const u = Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
  // interpolate in log-ish space so the big numbers fall smoothly
  const sa = Math.sign(a.metres) * Math.log10(1 + Math.abs(a.metres));
  const sb = Math.sign(b.metres) * Math.log10(1 + Math.abs(b.metres));
  const s = sa + (sb - sa) * u;
  const m = Math.sign(s) * (Math.pow(10, Math.abs(s)) - 1);
  const label = u < 0.5 ? a.label : b.label;
  const abs = Math.abs(m);
  const num =
    abs >= 10_000
      ? `${Math.round(abs / 1000).toLocaleString("en-US")} km`
      : `${Math.round(abs).toLocaleString("en-US")} m`;
  const text = m < -0.5 ? `−${num}` : num;
  return { text, label };
}
