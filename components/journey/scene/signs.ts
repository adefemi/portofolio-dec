import { CORE_Y, CRATER_Z, WORLD_KEYS } from "./cameraPath";

export type SignKind = "balloon" | "stilts" | "trail" | "station" | "chains";

export interface SignDef {
  stop: number;
  kind: SignKind;
  /** Where the board stands in the world (centre of the face). */
  centre: [number, number, number];
  /** What the camera looks at while parked: the board, nudged toward this. */
  focus?: [number, number, number];
  /** Extra yaw (radians) so the board sits at an angle to the viewer. */
  yaw: number;
}

export const SIGNS: SignDef[] = [
  { stop: 1, kind: "balloon", centre: [-72, 1046, 606], yaw: 0.16 },
  { stop: 2, kind: "stilts", centre: [78, 40, -418], yaw: -0.16 },
  { stop: 3, kind: "trail", centre: [-112, 138, -1302], yaw: 0.14 },
  { stop: 4, kind: "station", centre: [72, 40, -1782], yaw: -0.15 },
  { stop: 5, kind: "chains", centre: [8, -1566, CRATER_Z + 132], focus: [0, CORE_Y, CRATER_Z], yaw: 0.12 },
];

// Point the parked camera at its sign (slightly toward the focus, if any).
for (const s of SIGNS) {
  const key = WORLD_KEYS.find((k) => k.t === s.stop);
  if (!key) continue;
  const f = s.focus ?? s.centre;
  key.look = [
    s.centre[0] + (f[0] - s.centre[0]) * 0.14,
    s.centre[1] + (f[1] - s.centre[1]) * 0.14,
    s.centre[2] + (f[2] - s.centre[2]) * 0.14,
  ];
}
