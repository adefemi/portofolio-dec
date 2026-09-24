"use client";

import { Suspense, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, FogExp2, Group, PerspectiveCamera, Vector3 } from "three";
import { journey, pulse, smooth, JOURNEY_END } from "../store";
import { Globe, LAGOS_POINT, GLOBE_R } from "./Globe";
import { Sky } from "./Sky";
import { Clouds, CLOUD_BASE, CLOUD_TOP } from "./Clouds";
import { Ocean } from "./Ocean";
import { Terrain } from "./Terrain";
import { Beacons } from "./Beacons";
import { Core } from "./Core";
import { Signs } from "./Signs";
import { WORLD_KEYS, SWAP_AT, sampleKeys, gaugeAt } from "./cameraPath";
import { SURFACE_SUN, horizonAt } from "./env";

// ---------- orbit camera (globe scene) ----------
const LAGOS_N = LAGOS_POINT.clone().normalize();
// Tangent pointing "north" along the surface at Lagos.
const NORTH = new Vector3(0, 1, 0).sub(LAGOS_N.clone().multiplyScalar(LAGOS_N.y)).normalize();

const orbitPos = new Vector3();
const orbitLook = new Vector3();
const a = new Vector3();
const b = new Vector3();

function sampleOrbit(t: number, up: Vector3, aspect: number) {
  // Three phases: pull in, line up over Lagos, skim the limb.
  // On portrait screens back off so the whole globe fits the width, and
  // lift it above the hero text.
  const tanH = Math.tan((25 * Math.PI) / 180) * aspect;
  const far = Math.max(400, 128 / tanH);
  const portrait = smooth(1.1, 0.6, aspect);
  const p0 = a.set(0, 22, far);
  const p1 = b.set(0, 30, Math.max(250, far * 0.62));
  const k1 = smooth(0, 0.45, t);
  orbitPos.copy(p0).lerp(p1, k1);
  orbitLook.set(0, -38 * portrait * (1 - k1), 0);

  const k2 = smooth(0.35, 0.72, t);
  const near = LAGOS_N.clone().multiplyScalar(GLOBE_R * 1.45).addScaledVector(NORTH, -8);
  orbitPos.lerp(near, k2);
  orbitLook.lerp(LAGOS_POINT, k2);

  const k3 = smooth(0.62, SWAP_AT, t);
  const skim = LAGOS_N.clone().multiplyScalar(GLOBE_R * 1.035);
  const horizonLook = skim.clone().addScaledVector(NORTH, 60).addScaledVector(LAGOS_N, -2);
  orbitPos.lerp(skim, k3);
  orbitLook.lerp(horizonLook, k3);

  up.set(0, 1, 0).lerp(LAGOS_N, smooth(0.55, 0.85, t)).normalize();
}

// ---------- rig ----------
const pos = new Vector3();
const look = new Vector3();
const up = new Vector3();
const dir = new Vector3();
const DOWN_UP = new Vector3(0, 0, -1);
const fogColor = new Color();
const UNDERGROUND_BG = new Color("#0a0503");
const VEIL_HAZE = "188,214,240";
const VEIL_CLOUD = "238,243,248";
const VEIL_DARK = "20,10,6";

function Rig({ orbit, surface, below }: { orbit: React.RefObject<Group | null>; surface: React.RefObject<Group | null>; below: React.RefObject<Group | null> }) {
  const { camera, scene } = useThree();
  const fog = useRef(new FogExp2("#b9cfe4", 0.00028));
  const lastGauge = useRef("");

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    // Smooth toward the scroll target. Reduced motion: jump between stops.
    if (journey.reducedMotion) {
      journey.current = Math.round(journey.target);
    } else {
      const k = 1 - Math.exp(-dt * 3.2);
      journey.current += (journey.target - journey.current) * k;
      if (Math.abs(journey.target - journey.current) < 1e-4) journey.current = journey.target;
    }
    const t = Math.min(JOURNEY_END, Math.max(0, journey.current));
    const cam = camera as PerspectiveCamera;

    const inOrbit = t < SWAP_AT;
    if (orbit.current) orbit.current.visible = inOrbit;
    if (surface.current) surface.current.visible = !inOrbit && t < 4.8;
    if (below.current) below.current.visible = t > 4.15;

    if (inOrbit) {
      sampleOrbit(t, up, cam.aspect);
      pos.copy(orbitPos);
      look.copy(orbitLook);
      scene.fog = null;
      scene.background = null;
      cam.near = 0.5;
      cam.far = 6000;
    } else {
      sampleKeys(WORLD_KEYS, t, pos, look);
      dir.copy(look).sub(pos).normalize();
      // Looking straight down the shaft: swap the up vector to avoid a flip.
      up.set(0, 1, 0).lerp(DOWN_UP, smooth(0.75, 0.97, Math.abs(dir.y))).normalize();
      const y = pos.y;
      if (y > -40) {
        horizonAt(y, fogColor);
        fog.current.color.copy(fogColor);
        fog.current.density = 0.00026 + 0.00016 * smooth(200, 1100, y);
      } else {
        fog.current.color.set("#120804");
        fog.current.density = 0.0009 * (1 - smooth(-1200, -1450, y)) + 0.0002;
      }
      scene.fog = fog.current;
      scene.background = y < -60 ? UNDERGROUND_BG : null;
      cam.near = 1;
      cam.far = 20000;
    }
    cam.up.copy(up);
    cam.position.copy(pos);
    cam.lookAt(look);
    // Slightly wider lens as we go underground for a sense of enclosure.
    const fov = 50 + 8 * smooth(4.3, 4.8, t);
    if (Math.abs(cam.fov - fov) > 0.01) cam.fov = fov;
    cam.updateProjectionMatrix();

    // ---- veil (screen-space transitions) ----
    const haze = pulse(SWAP_AT, 0.075, t);
    const cloudY = inOrbit ? 0 : pulse((CLOUD_BASE + CLOUD_TOP) / 2, (CLOUD_TOP - CLOUD_BASE) * 0.75, pos.y) * 0.9;
    const crust = pulse(4.47, 0.05, t) * 0.75;
    let veilA = haze;
    let veilC = VEIL_HAZE;
    if (cloudY > veilA) {
      veilA = cloudY;
      veilC = VEIL_CLOUD;
    }
    if (crust > veilA) {
      veilA = crust;
      veilC = VEIL_DARK;
    }
    if (journey.veil) {
      journey.veil.style.backgroundColor = `rgba(${veilC},${veilA.toFixed(3)})`;
    }

    // ---- depth gauge ----
    const g = gaugeAt(t);
    const key = g.text + g.label;
    if (key !== lastGauge.current) {
      lastGauge.current = key;
      if (journey.gaugeValue) journey.gaugeValue.textContent = g.text;
      if (journey.gaugeLabel) journey.gaugeLabel.textContent = g.label;
    }
    if (journey.gaugeDot) journey.gaugeDot.style.top = `${((t / JOURNEY_END) * 100).toFixed(2)}%`;
  });
  return null;
}

export function World() {
  const { size } = useThree();
  const signs3d = size.width >= 900 && size.height >= 560;
  const orbit = useRef<Group>(null);
  const surface = useRef<Group>(null);
  const below = useRef<Group>(null);
  const low = journey.lowPower;
  return (
    <>
      <Rig orbit={orbit} surface={surface} below={below} />
      <group ref={orbit}>
        <Suspense fallback={null}>
          <Globe />
        </Suspense>
        <directionalLight position={[-300, 150, 400]} intensity={1} />
      </group>
      <group ref={surface} visible={false}>
        <Sky />
        <hemisphereLight args={["#cfe3ff", "#4a4032", 0.9]} />
        <directionalLight position={SURFACE_SUN.clone().multiplyScalar(1000).toArray()} intensity={2.2} color="#fff1dc" />
        <Ocean />
        <Terrain lowPower={low} />
        <Beacons />
        <Clouds layers={low ? 3 : 6} />
      </group>
      <group ref={below} visible={false}>
        <Core />
      </group>
      {signs3d && <Signs />}
    </>
  );
}
