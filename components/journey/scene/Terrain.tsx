"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  Color,
  ConeGeometry,
  Float32BufferAttribute,
  InstancedMesh,
  Object3D,
} from "three";
import { terrainHeight, HOLE_R } from "./terrainHeight";
import { fbm2 } from "./noise";
import { CRATER_R, CRATER_Z } from "./cameraPath";

const X0 = -3000;
const X1 = 3000;
const Z0 = -560;
const Z1 = -3800;

const SAND = new Color("#bfae84");
const WET = new Color("#6d6450");
const GRASS = new Color("#3e5a2a");
const DRY = new Color("#6f7440");
const ROCK = new Color("#5d564e");
const ROCK_DARK = new Color("#3f3a35");
const SNOW = new Color("#eef2f6");

function buildTerrain(step: number) {
  const nx = Math.round((X1 - X0) / step) + 1;
  const nz = Math.round((Z0 - Z1) / step) + 1;
  const pos = new Float32Array(nx * nz * 3);
  for (let j = 0; j < nz; j++) {
    const z = Z0 - j * step;
    for (let i = 0; i < nx; i++) {
      const x = X0 + i * step;
      const k = (j * nx + i) * 3;
      pos[k] = x;
      pos[k + 1] = terrainHeight(x, z);
      pos[k + 2] = z;
    }
  }
  const idx: number[] = [];
  const holeR2 = HOLE_R ** 2;
  for (let j = 0; j < nz - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i;
      const b = a + 1;
      const c = a + nx;
      const d = c + 1;
      const cx = pos[a * 3] + step / 2;
      const cz = pos[a * 3 + 2] - step / 2;
      if (cx * cx + (cz - CRATER_Z) ** 2 < holeR2) continue; // the shaft opening
      idx.push(a, b, c, b, d, c);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();

  const nrm = g.getAttribute("normal");
  const col = new Float32Array(nx * nz * 3);
  const c = new Color();
  for (let v = 0; v < nx * nz; v++) {
    const x = pos[v * 3];
    const y = pos[v * 3 + 1];
    const z = pos[v * 3 + 2];
    const slope = 1 - nrm.getY(v); // 0 flat → 1 cliff
    const n = fbm2(x / 90, z / 90, 3);
    if (y < 1.5) c.copy(WET).lerp(SAND, Math.min(1, Math.max(0, (y + 6) / 7)));
    else if (y < 7 + n * 3 && z > -1150) c.copy(SAND);
    else c.copy(GRASS).lerp(DRY, Math.min(1, Math.max(0, 0.5 + n * 1.2 + (y - 120) / 260)));
    const dc = Math.hypot(x, z - CRATER_Z);
    if (dc < CRATER_R + 30) c.lerp(ROCK_DARK, Math.min(1, (CRATER_R + 30 - dc) / 24));
    const rocky = Math.min(1, Math.max(0, (slope - 0.18) * 4 + (y - 260) / 160));
    if (rocky > 0) c.lerp(n > 0 ? ROCK : ROCK_DARK, rocky);
    const snowLine = 400 + n * 50;
    if (y > snowLine && slope < 0.5) c.lerp(SNOW, Math.min(1, (y - snowLine) / 45));
    col[v * 3] = c.r;
    col[v * 3 + 1] = c.g;
    col[v * 3 + 2] = c.b;
  }
  g.setAttribute("color", new Float32BufferAttribute(col, 3));
  g.computeBoundingSphere();
  return g;
}

function Trees({ count }: { count: number }) {
  const ref = useRef<InstancedMesh>(null);
  const geo = useMemo(() => {
    const g = new ConeGeometry(3.6, 15, 6, 1);
    g.translate(0, 7, 0);
    return g;
  }, []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new Object3D();
    const c = new Color();
    let s = 99;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    let placed = 0;
    for (let tries = 0; tries < count * 8 && placed < count; tries++) {
      const x = -1400 + rnd() * 2800;
      const z = -900 - rnd() * 1700;
      const y = terrainHeight(x, z);
      if (y < 8 || y > 230) continue;
      const dx = terrainHeight(x + 6, z) - y;
      const dz = terrainHeight(x, z + 6) - y;
      if (Math.abs(dx) + Math.abs(dz) > 6) continue;
      const dc = Math.hypot(x, z - CRATER_Z);
      if (dc < 150) continue;
      if (Math.abs(x) < 40 && z < -1650 && z > -1760) continue; // keep the landing clear
      if (fbm2(x / 160, z / 160, 3) < -0.05) continue; // clumps, not a carpet
      const sc = 0.7 + rnd() * 0.8;
      o.position.set(x, y - 1, z);
      o.scale.set(sc, sc * (0.8 + rnd() * 0.5), sc);
      o.rotation.y = rnd() * 6.28;
      o.updateMatrix();
      mesh.setMatrixAt(placed, o.matrix);
      c.setHSL(0.27 + rnd() * 0.06, 0.4, 0.13 + rnd() * 0.07);
      mesh.setColorAt(placed, c);
      placed++;
    }
    mesh.count = placed;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count]);
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial roughness={0.9} flatShading />
    </instancedMesh>
  );
}

export function Terrain({ lowPower }: { lowPower: boolean }) {
  const geo = useMemo(() => buildTerrain(lowPower ? 18 : 10), [lowPower]);
  return (
    <group>
      <mesh geometry={geo} receiveShadow={false}>
        <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
      </mesh>
      <Trees count={lowPower ? 900 : 2600} />
    </group>
  );
}
