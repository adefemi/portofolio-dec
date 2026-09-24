"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CylinderGeometry,
  Group,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
  BoxGeometry,
} from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { journey, smooth } from "../store";
import { SIGNS, SignDef } from "./signs";
import { SWAP_AT, WORLD_KEYS } from "./cameraPath";
import { terrainHeight } from "./terrainHeight";

// Materials shared by all sign structures.
const FACE_BACK = new MeshStandardMaterial({ color: "#4b2d1b", roughness: 0.7, metalness: 0.1 });
const FRAME = new MeshStandardMaterial({ color: "#2a211b", roughness: 0.55, metalness: 0.55 });
const WOOD = new MeshStandardMaterial({ color: "#5a3d27", roughness: 0.95 });
const STEEL = new MeshStandardMaterial({ color: "#6d6a66", roughness: 0.45, metalness: 0.8 });
const BALLOON = new MeshStandardMaterial({ color: "#f1ede4", roughness: 0.35, metalness: 0.05, emissive: "#9a948a" });
const CABLE = new MeshStandardMaterial({ color: "#1b1b1d", roughness: 0.6 });
const CHAIN = new MeshStandardMaterial({ color: "#3a2a20", roughness: 0.5, metalness: 0.7, emissive: "#2a0c02" });

const UNIT_BOX = new BoxGeometry(1, 1, 1);
const UNIT_CYL = new CylinderGeometry(0.5, 0.5, 1, 10);
const UNIT_SPHERE = new SphereGeometry(1, 32, 24);

interface Placed {
  def: SignDef;
  el: HTMLElement;
  parent: HTMLElement | null;
  next: Node | null;
  obj: CSS3DObject;
  wPx: number;
  hPx: number;
}

const camPos = new Vector3();

/** World units per CSS pixel so the board fills a comfortable share of the screen when parked. */
function fitScale(def: SignDef, wPx: number, hPx: number, fovDeg: number, aspect: number) {
  const key = WORLD_KEYS.find((k) => k.t === def.stop)!;
  camPos.set(...key.pos);
  const d = camPos.distanceTo(new Vector3(...def.centre));
  const tan = Math.tan(((fovDeg / 2) * Math.PI) / 180);
  const hv = 2 * d * tan;
  const wv = hv * aspect;
  return Math.min((0.74 * hv) / hPx, (0.6 * wv) / (wPx * Math.cos(def.yaw)));
}

/** The physical structure a board is mounted on, in board-local units. */
function Mount({ def, w, h, centre }: { def: SignDef; w: number; h: number; centre: Vector3 }) {
  const parts: React.ReactNode[] = [];
  const bottom = -h / 2;
  if (def.kind === "balloon") {
    const r = w * 0.26;
    const by = h / 2 + w * 0.42;
    parts.push(<mesh key="b" geometry={UNIT_SPHERE} material={BALLOON} position={[0, by, -1]} scale={[r, r * 1.12, r]} />);
    for (const sx of [-1, 1]) {
      const x0 = sx * w * 0.44;
      const len = Math.hypot(x0, by - r * 0.9 - h / 2);
      const ang = Math.atan2(x0, by - r * 0.9 - h / 2);
      parts.push(
        <mesh key={`c${sx}`} geometry={UNIT_CYL} material={CABLE} position={[x0 / 2, (h / 2 + by - r * 0.9) / 2, -1]} rotation={[0, 0, ang]} scale={[0.18, len, 0.18]} />,
      );
    }
  } else if (def.kind === "stilts" || def.kind === "trail" || def.kind === "station") {
    const mat = def.kind === "station" ? STEEL : WOOD;
    const thick = def.kind === "trail" ? w * 0.045 : w * 0.03;
    for (const sx of [-1, 1]) {
      const px = sx * w * 0.36;
      // ground (or seabed) under this post, in board-local y
      const wx = centre.x + px;
      const ground = def.kind === "stilts" ? -12 : terrainHeight(wx, centre.z) - 2;
      const top = def.kind === "trail" ? h / 2 + 3 : bottom;
      const len = Math.max(2, centre.y + top - ground);
      parts.push(
        <mesh key={`p${sx}`} geometry={UNIT_CYL} material={mat} position={[px, top - len / 2, -1.6]} scale={[thick, len, thick]} />,
      );
      if (def.kind === "trail") {
        parts.push(<mesh key={`cap${sx}`} geometry={UNIT_BOX} material={WOOD} position={[px, top + thick * 0.4, -1.6]} scale={[thick * 1.4, thick * 0.6, thick * 1.4]} />);
      }
    }
    if (def.kind === "stilts") {
      parts.push(<mesh key="deck" geometry={UNIT_BOX} material={WOOD} position={[0, bottom - 1.2, -1.6]} scale={[w * 0.9, 1, 6]} />);
    }
    if (def.kind === "station") {
      const g = terrainHeight(centre.x, centre.z) - centre.y;
      parts.push(<mesh key="base" geometry={UNIT_BOX} material={FRAME} position={[0, g + 1, -1.6]} scale={[w * 0.9, 3, 8]} />);
    }
  } else if (def.kind === "chains") {
    const up = 260;
    for (const sx of [-1, 1]) {
      parts.push(
        <mesh key={`ch${sx}`} geometry={UNIT_CYL} material={CHAIN} position={[sx * w * 0.4, h / 2 + up / 2, -1]} scale={[0.5, up, 0.5]} />,
      );
    }
  }
  return <>{parts}</>;
}

function Board({ p, scale }: { p: Placed; scale: number }) {
  const group = useRef<Group>(null);
  const centre = useMemo(() => new Vector3(...p.def.centre), [p.def.centre]);
  const w = p.wPx * scale;
  const h = p.hPx * scale;

  useLayoutEffect(() => {
    const g = group.current;
    if (!g) return;
    const key = WORLD_KEYS.find((k) => k.t === p.def.stop)!;
    g.position.copy(centre);
    g.lookAt(key.pos[0], centre.y, key.pos[2]);
    g.rotateY(p.def.yaw);
    p.obj.scale.setScalar(scale);
    p.obj.position.set(0, 0, 0.9);
    g.add(p.obj);
    return () => {
      g.remove(p.obj);
    };
  }, [p, scale, centre]);

  useFrame(({ clock }) => {
    const t = journey.current;
    const i = p.def.stop;
    const a = smooth(i - 0.7, i - 0.42, t) * (1 - smooth(i + 0.08, i + 0.22, t));
    p.obj.visible = a > 0.002;
    p.el.style.opacity = a.toFixed(3);
    p.el.style.pointerEvents = a > 0.6 ? "auto" : "none";
    if (group.current) {
      group.current.visible = t > SWAP_AT && (i === 5 ? t > 4.15 : t < 4.8);
    }
    if (p.def.kind === "balloon" || p.def.kind === "chains") {
      const g = group.current;
      if (g) g.position.y = centre.y + Math.sin(clock.elapsedTime * 0.6) * 0.6;
    }
  });

  const pad = Math.max(0.8, w * 0.012);
  return (
    <group ref={group}>
      {/* backing plate + steel frame so the board has real thickness */}
      <mesh geometry={UNIT_BOX} material={FACE_BACK} position={[0, 0, 0]} scale={[w, h, 1.4]} />
      <mesh geometry={UNIT_BOX} material={FRAME} position={[0, 0, -0.6]} scale={[w + pad * 2, h + pad * 2, 1.2]} />
      <Mount def={p.def} w={w} h={h} centre={centre} />
    </group>
  );
}

/**
 * Lifts each section's sign out of the page and stands it in the world,
 * rendered with CSS3D so the text stays real, crisp, selectable HTML.
 */
export function Signs() {
  const { camera, gl, scene, size } = useThree();
  const [placed, setPlaced] = useState<Placed[]>([]);
  const css = useMemo(() => new CSS3DRenderer(), []);

  useEffect(() => {
    const host = css.domElement;
    host.className = "sign-layer";
    document.body.appendChild(host);
    document.documentElement.classList.add("signs-3d");
    const list: Placed[] = [];
    for (const def of SIGNS) {
      const el = document.querySelector<HTMLElement>(`[data-sign="${def.stop}"]`);
      if (!el) continue;
      const parent = el.parentElement;
      const next = el.nextSibling;
      const obj = new CSS3DObject(el);
      el.style.userSelect = "text";
      list.push({ def, el, parent, next, obj, wPx: 0, hPx: 0 });
    }
    // measure after the signs-3d class has applied board widths
    for (const p of list) {
      p.wPx = p.el.offsetWidth;
      p.hPx = p.el.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM adoption happens once on mount
    setPlaced(list);
    return () => {
      for (const p of list) {
        p.obj.removeFromParent();
        for (const k of ["opacity", "pointer-events", "transform", "position", "user-select", "display"]) {
          p.el.style.removeProperty(k);
        }
        if (p.parent) p.parent.insertBefore(p.el, p.next);
      }
      document.documentElement.classList.remove("signs-3d");
      host.remove();
    };
  }, [css]);

  useEffect(() => {
    css.setSize(size.width, size.height);
  }, [css, size.width, size.height]);

  // Render WebGL, then the CSS3D layer, from the same camera each frame.
  useFrame(() => {
    gl.render(scene, camera);
    css.render(scene, camera);
  }, 1);

  const aspect = size.width / Math.max(1, size.height);
  return (
    <>
      {placed.map((p) => (
        <Board key={p.def.stop} p={p} scale={fitScale(p.def, p.wPx, p.hPx, 50, aspect)} />
      ))}
    </>
  );
}
