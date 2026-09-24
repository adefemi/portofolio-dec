"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  Sprite,
  SpriteMaterial,
} from "three";
import { journey, pulse } from "../store";
import { terrainHeight } from "./terrainHeight";

let glowTex: CanvasTexture | null = null;
export function getGlowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,255,255,0.75)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.18)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  glowTex = new CanvasTexture(c);
  return glowTex;
}

interface BeaconDef {
  pos: [number, number, number];
  color: string;
  /** Journey t at which this beacon is brightest. */
  peak: number;
  size: number;
  beam: number;
}

function peakOnRidge(x: number): [number, number, number] {
  let best = -1e9;
  let bz = -1330;
  for (let z = -1150; z >= -1550; z -= 5) {
    const h = terrainHeight(x, z);
    if (h > best) {
      best = h;
      bz = z;
    }
  }
  return [x, best + 4, bz];
}

function Beacon({ def }: { def: BeaconDef }) {
  const sprite = useRef<Sprite>(null);
  const beam = useRef<Mesh>(null);
  const spriteMat = useMemo(
    () =>
      new SpriteMaterial({
        map: getGlowTexture(),
        color: new Color(def.color),
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [def.color],
  );
  const beamMat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color(def.color),
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0.2,
      }),
    [def.color],
  );
  useFrame(({ clock }) => {
    const on = pulse(def.peak, 0.55, journey.current);
    const flicker = 0.9 + 0.1 * Math.sin(clock.elapsedTime * 2.4 + def.pos[0]);
    spriteMat.opacity = (0.25 + 0.75 * on) * flicker;
    beamMat.opacity = 0.05 + 0.25 * on;
    if (sprite.current) sprite.current.scale.setScalar(def.size * (0.7 + 0.5 * on));
    if (beam.current) beam.current.scale.y = 0.3 + 0.7 * on;
  });
  return (
    <group position={def.pos}>
      <sprite ref={sprite} material={spriteMat} />
      <mesh ref={beam} material={beamMat} position={[0, def.beam / 2, 0]}>
        <cylinderGeometry args={[0.6, 0.6, def.beam, 6, 1, true]} />
      </mesh>
    </group>
  );
}

export function Beacons() {
  const group = useRef<Group>(null);
  const defs = useMemo<BeaconDef[]>(() => {
    const out: BeaconDef[] = [];
    // Projects: lights riding the swell off the coast
    [
      [-150, -470],
      [170, -540],
      [-230, -650],
      [120, -700],
    ].forEach(([x, z], i) =>
      out.push({ pos: [x, 4, z], color: "#ffd27a", peak: 1.85 + i * 0.12, size: 26, beam: 60 }),
    );
    // Experience: one beacon per role along the ridge
    [-640, -380, -180, 330, 600].forEach((x, i) =>
      out.push({ pos: peakOnRidge(x), color: "#f0b840", peak: 2.75 + i * 0.12, size: 46, beam: 160 }),
    );
    // Skills: four markers ringing the landing ground
    [
      [-120, -1830],
      [120, -1830],
      [-170, -1940],
      [170, -1940],
    ].forEach(([x, z]) =>
      out.push({ pos: [x, terrainHeight(x, z) + 2, z], color: "#7fe0ff", peak: 4.0, size: 18, beam: 40 }),
    );
    return out;
  }, []);
  return (
    <group ref={group}>
      {defs.map((d, i) => (
        <Beacon key={i} def={d} />
      ))}
    </group>
  );
}
