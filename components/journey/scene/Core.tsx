"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  DoubleSide,
  Vector2,
  Color,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
} from "three";
import { GLSL_NOISE } from "./noise";
import { CORE_Y, CRATER_R, CRATER_Z, SHAFT_BOTTOM } from "./cameraPath";
import { getGlowTexture } from "./Beacons";
import { CRATER_FLOOR, HOLE_R, PLATEAU_Y } from "./terrainHeight";

const CAVERN_R = 340;
const SHAFT_TOP = CRATER_FLOOR;
// Flared throat joining the shaft to the ground around the opening.
const THROAT_PROFILE = Array.from({ length: 14 }, (_, i) => {
  const u = i / 13;
  const r = CRATER_R + u * (HOLE_R + 18 - CRATER_R);
  const y = CRATER_FLOOR + (PLATEAU_Y + 2 - CRATER_FLOOR) * Math.pow(u, 0.7);
  return new Vector2(r, y);
});
const CORE_R = 95;

const vert = /* glsl */ `
varying vec3 vPos;
varying vec3 vN;
void main(){
  vec4 wp = modelMatrix * vec4(position,1.0);
  vPos = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

// Rock strata: topsoil → sediment → basalt → glowing mantle rock.
const shaftFrag = /* glsl */ `
${GLSL_NOISE}
uniform float uTime;
uniform vec3 uAxis;
varying vec3 vPos;
varying vec3 vN;
void main(){
  float depth = -vPos.y;                    // 0 at the surface
  vec2 rel = vPos.xz - uAxis.xz;
  float ang = atan(rel.y, rel.x);
  vec3 q = vec3(cos(ang) * 2.0, depth / 55.0, sin(ang) * 2.0);
  float warp = fbm(q * 0.8) * 0.9;
  float band = fract((depth + warp * 40.0) / 34.0);
  float grain = fbm(q * 3.5) * 0.5 + 0.5;

  vec3 soil = vec3(0.28, 0.19, 0.12);
  vec3 sedA = vec3(0.55, 0.45, 0.33);
  vec3 sedB = vec3(0.36, 0.3, 0.26);
  vec3 basalt = vec3(0.12, 0.11, 0.12);
  vec3 sed = mix(sedA, sedB, step(0.5, band));
  vec3 col = mix(soil, sed, smoothstep(60.0, 160.0, depth));
  col = mix(col, basalt, smoothstep(480.0, 760.0, depth));
  col *= 0.65 + 0.55 * grain;

  // light: daylight from the opening fading with depth + a camera "headlamp"
  vec3 v = normalize(cameraPosition - vPos);
  float headlamp = 0.25 + 0.75 * max(dot(normalize(vN), v), 0.0);
  float dCam = length(cameraPosition - vPos);
  float lamp = headlamp * exp(-dCam / 380.0);
  float sky = exp(-depth / 140.0);
  vec3 lit = col * (sky * 0.75 + lamp * 1.0);

  // heat: glowing veins below ~900 m of shaft
  float heat = smoothstep(750.0, 1400.0, depth);
  float veins = smoothstep(0.62, 0.72, fbm(vec3(q.x * 1.5, depth / 25.0 - uTime * 0.05, q.z * 1.5)) * 0.5 + 0.5);
  vec3 glow = mix(vec3(0.9, 0.25, 0.05), vec3(1.0, 0.65, 0.2), veins) * (heat * 0.25 + veins * heat * 1.6);
  gl_FragColor = vec4(lit + glow, 1.0);
  #include <colorspace_fragment>
}`;

const cavernFrag = /* glsl */ `
${GLSL_NOISE}
uniform float uTime;
uniform vec3 uCenter;
varying vec3 vPos;
varying vec3 vN;
void main(){
  vec3 p = (vPos - uCenter) / 90.0;
  float n = fbm(p + vec3(0.0, -uTime * 0.03, 0.0));
  float cracks = smoothstep(0.93, 0.99, 1.0 - abs(snoise(p * 1.3 + 7.0))) * smoothstep(0.1, -0.6, (vPos.y - uCenter.y) / 340.0);
  vec3 rock = vec3(0.055, 0.03, 0.022) * (0.7 + 0.6 * n);
  // lit by the core from the centre
  vec3 toCore = normalize(uCenter - vPos);
  float facing = max(dot(-normalize(vN), normalize(cameraPosition - vPos)), 0.0);
  float below = smoothstep(0.2, -0.9, (vPos.y - uCenter.y) / 340.0);
  vec3 col = rock * (0.6 + 1.4 * facing) + vec3(0.7, 0.16, 0.03) * (0.06 + 0.35 * below) * (0.5 + 0.5 * n);
  col += vec3(1.0, 0.45, 0.1) * cracks * 1.1;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const coreFrag = /* glsl */ `
${GLSL_NOISE}
uniform float uTime;
varying vec3 vPos;
varying vec3 vN;
uniform vec3 uCenter;
void main(){
  vec3 p = (vPos - uCenter) / 38.0;
  float n = fbm(p + vec3(uTime * 0.12, uTime * 0.07, -uTime * 0.09));
  float n2 = fbm(p * 2.3 - vec3(0.0, uTime * 0.2, 0.0));
  float heat = clamp(0.55 + 0.6 * n + 0.3 * n2, 0.0, 1.0);
  vec3 col = mix(vec3(0.75, 0.12, 0.02), vec3(1.0, 0.62, 0.15), heat);
  col = mix(col, vec3(1.0, 0.95, 0.8), smoothstep(0.8, 1.0, heat));
  vec3 v = normalize(cameraPosition - vPos);
  float rim = pow(1.0 - max(dot(normalize(vN), v), 0.0), 2.0);
  col += vec3(1.0, 0.5, 0.1) * rim * 0.8;
  gl_FragColor = vec4(col * 1.25, 1.0);
  #include <colorspace_fragment>
}`;

export function Core() {
  const center = useMemo(() => [0, CORE_Y, CRATER_Z] as [number, number, number], []);
  const shaftLen = SHAFT_TOP - SHAFT_BOTTOM + 30;
  const halo = useRef<Sprite>(null);

  const shaftMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vert,
        fragmentShader: shaftFrag,
        side: BackSide,
        uniforms: { uTime: { value: 0 }, uAxis: { value: { x: 0, y: 0, z: CRATER_Z } } },
      }),
    [],
  );
  const throatMat = useMemo(() => {
    const m = shaftMat.clone();
    m.side = DoubleSide;
    return m;
  }, [shaftMat]);
  const cavernMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vert,
        fragmentShader: cavernFrag,
        side: BackSide,
        uniforms: { uTime: { value: 0 }, uCenter: { value: { x: center[0], y: center[1], z: center[2] } } },
      }),
    [center],
  );
  const coreMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vert,
        fragmentShader: coreFrag,
        uniforms: { uTime: { value: 0 }, uCenter: { value: { x: center[0], y: center[1], z: center[2] } } },
      }),
    [center],
  );
  const haloMat = useMemo(
    () =>
      new SpriteMaterial({
        map: getGlowTexture(),
        color: new Color("#ff9a3d"),
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    shaftMat.uniforms.uTime.value = t;
    cavernMat.uniforms.uTime.value = t;
    coreMat.uniforms.uTime.value = t;
    if (halo.current) halo.current.scale.setScalar(CORE_R * 5.2 * (1 + 0.04 * Math.sin(t * 1.3)));
  });

  return (
    <group>
      <mesh material={shaftMat} position={[0, SHAFT_TOP - shaftLen / 2, CRATER_Z]}>
        <cylinderGeometry args={[CRATER_R, CRATER_R * 1.08, shaftLen, 64, 40, true]} />
      </mesh>
      <mesh material={throatMat} position={[0, 0, CRATER_Z]}>
        <latheGeometry args={[THROAT_PROFILE, 64]} />
      </mesh>
      <mesh material={cavernMat} position={center}>
        <sphereGeometry args={[CAVERN_R, 64, 48]} />
      </mesh>
      <mesh material={coreMat} position={center}>
        <sphereGeometry args={[CORE_R, 96, 64]} />
      </mesh>
      <sprite ref={halo} material={haloMat} position={center} />
    </group>
  );
}
