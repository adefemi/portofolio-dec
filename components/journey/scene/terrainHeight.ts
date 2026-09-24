import { fbm2, ridged2 } from "./noise";
import { CRATER_R, CRATER_Z } from "./cameraPath";

const sm = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const PLATEAU_Y = 12;
export const CRATER_FLOOR = -24;
/** Terrain quads inside this radius are removed; the crater throat mesh fills the gap. */
export const HOLE_R = 46 + 30;

/**
 * Height field for the surface world: open sea → Lagos-style coastline →
 * a mountain ridge with a low pass the camera flies over → a sheltered
 * valley plateau holding the crater that leads down to the core.
 */
export function terrainHeight(x: number, z: number): number {
  const coastZ = -760 + fbm2(x / 700, 3.1, 4) * 160;
  const inland = sm(coastZ, coastZ - 260, z);

  const base = 6 + fbm2(x / 520, z / 520, 5) * 26;

  const band = Math.exp(-(((z + 1330) / 240) ** 2));
  const pass = 1 - 0.78 * Math.exp(-((x / 300) ** 2));
  const flanks = sm(420, 950, Math.abs(x)) * sm(-1050, -1450, z);
  const mask = Math.max(band * pass, flanks);

  const r = ridged2(x / 430 + 5.2, z / 430 - 1.7, 6);
  const mountains = mask * (150 + r * 520);

  const dx = x;
  const dz = z - CRATER_Z;
  const dv = Math.sqrt(dx * dx + dz * dz);
  const valley = Math.exp(-(dv * dv) / (2 * 290 * 290));

  let land = base + mountains;
  const plateau = PLATEAU_Y + fbm2(x / 180, z / 180, 3) * 4;
  land = land + (plateau - land) * Math.min(1, valley * 1.35);

  // keep inland ground above the waterline (no stray puddles of sea)
  land = Math.max(land, 3 + Math.max(0, base - 6) * 0.2);

  // crater: a raised lip around the opening (the throat itself is a mesh)
  if (dv < CRATER_R + 70) {
    land += Math.exp(-(((dv - CRATER_R - 26) / 14) ** 2)) * 8;
  }

  // The land is a broad headland: sink it back into the sea near the edges
  // of the modelled area so the far horizon never shows a cut-off.
  const edge = sm(2300, 2900, Math.abs(x)) + sm(-3000, -3650, z);
  land = land - Math.min(1, edge) * (land + 90);

  const seabed = -70 + fbm2(x / 400, z / 400, 3) * 12;
  return seabed + (land - seabed) * inland;
}
