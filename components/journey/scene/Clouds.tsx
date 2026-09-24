"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, ShaderMaterial } from "three";
import { GLSL_NOISE } from "./noise";
import { SURFACE_SUN, HORIZON } from "./env";

export const CLOUD_BASE = 560;
export const CLOUD_TOP = 740;

const vert = /* glsl */ `
varying vec3 vPos;
void main(){
  vec4 wp = modelMatrix * vec4(position,1.0);
  vPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const frag = /* glsl */ `
${GLSL_NOISE}
uniform float uTime;
uniform float uLayer;   // 0 bottom → 1 top
uniform vec3 uSun;
uniform vec3 uFog;
varying vec3 vPos;
void main(){
  vec2 p = vPos.xz / 1100.0 + vec2(uTime * 0.004, uTime * 0.0015);
  float n = fbm(vec3(p, uLayer * 0.45));
  n += 0.35 * snoise(vec3(p * 0.25, 3.0));
  // puffier in the middle layers, thinner at the edges of the deck
  float cover = mix(0.08, -0.12, sin(uLayer * 3.14159));
  float a = smoothstep(cover, cover + 0.32, n);
  float camDist = abs(cameraPosition.y - vPos.y);
  a *= smoothstep(6.0, 70.0, camDist);           // never slice through a hard plane
  float d = length(vPos.xz - cameraPosition.xz);
  a *= 1.0 - smoothstep(3500.0, 7500.0, d);      // melt into the horizon
  vec3 top = vec3(1.0, 0.985, 0.96);
  vec3 bottom = vec3(0.62, 0.68, 0.76);
  vec3 col = mix(bottom, top, uLayer * 0.8 + 0.2 * smoothstep(-0.2, 0.6, n));
  col += vec3(1.0, 0.85, 0.6) * 0.12 * uLayer;   // warm sun catch on the tops
  col = mix(col, uFog, smoothstep(1500.0, 7000.0, d) * 0.8);
  gl_FragColor = vec4(col, a * 0.82);
  #include <colorspace_fragment>
}`;

export function Clouds({ layers }: { layers: number }) {
  const mats = useMemo(
    () =>
      Array.from({ length: layers }, (_, i) => {
        const l = layers === 1 ? 0.5 : i / (layers - 1);
        return new ShaderMaterial({
          vertexShader: vert,
          fragmentShader: frag,
          transparent: true,
          depthWrite: false,
          side: DoubleSide,
          uniforms: {
            uTime: { value: 0 },
            uLayer: { value: l },
            uSun: { value: SURFACE_SUN },
            uFog: { value: HORIZON },
          },
        });
      }),
    [layers],
  );
  useFrame(({ clock }) => {
    for (const m of mats) m.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <group>
      {mats.map((m, i) => {
        const l = layers === 1 ? 0.5 : i / (layers - 1);
        const y = CLOUD_BASE + (CLOUD_TOP - CLOUD_BASE) * l;
        return (
          <mesh key={i} material={m} position={[0, y, -1500]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2 + i}>
            <planeGeometry args={[16000, 16000, 1, 1]} />
          </mesh>
        );
      })}
    </group>
  );
}
