import { Color, Vector3 } from "three";
import { smooth } from "../store";

/** Late-afternoon sun over the Gulf of Guinea, slightly ahead of the camera. */
export const SURFACE_SUN = new Vector3(-0.72, 0.36, -0.6).normalize();

export const HORIZON = new Color("#b9cfe4");
export const HORIZON_HIGH = new Color("#8fb2dd");
export const ZENITH_LOW = new Color("#2f6fc0");
export const ZENITH_HIGH = new Color("#07122e");

/** 0 at sea level → 1 at the top of the stratosphere shot. */
export const altitudeFactor = (y: number) => smooth(250, 1200, y);

const tmp = new Color();
/** Fog/horizon colour for a given camera altitude. */
export function horizonAt(y: number, out: Color) {
  return out.copy(HORIZON).lerp(tmp.copy(HORIZON_HIGH), altitudeFactor(y));
}
