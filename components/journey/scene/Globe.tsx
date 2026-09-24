"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  ShaderMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from "three";
import { journey, smooth } from "../store";

export const GLOBE_R = 100;
export const SUN_DIR = new Vector3(-0.55, 0.3, 0.78).normalize();

const LAGOS = { lat: 6.45, lon: 3.39 };

/** Direction of a lat/lon on three's SphereGeometry UV layout. */
function latLonDir(lat: number, lon: number) {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return new Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo));
}

// Yaw that brings Lagos to face +z (towards the camera).
const LAGOS_DIR = latLonDir(LAGOS.lat, LAGOS.lon);
export const ALIGN_YAW = -Math.atan2(LAGOS_DIR.x, LAGOS_DIR.z);
/** Lagos on the aligned globe, in world units. */
export const LAGOS_POINT = new Vector3(
  0,
  Math.sin((LAGOS.lat * Math.PI) / 180),
  Math.cos((LAGOS.lat * Math.PI) / 180),
).multiplyScalar(GLOBE_R);

const earthVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main(){
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position,1.0);
  vPosW = wp.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const earthFrag = /* glsl */ `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uWater;
uniform sampler2D uClouds;
uniform vec3 uSun;
uniform float uCloudShift;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main(){
  vec3 n = normalize(vNormalW);
  vec3 v = normalize(cameraPosition - vPosW);
  float ndl = dot(n, uSun);
  float day = smoothstep(-0.12, 0.25, ndl);
  vec3 dayCol = texture2D(uDay, vUv).rgb;
  vec3 nightCol = texture2D(uNight, vUv).rgb;
  float water = texture2D(uWater, vUv).r;
  // cloud shadows
  float cs = texture2D(uClouds, vUv + vec2(uCloudShift - 0.002, 0.001)).r;
  vec3 lit = dayCol * (0.08 + 1.05 * max(ndl, 0.0)) * (1.0 - cs * 0.35);
  // ocean specular
  vec3 h = normalize(uSun + v);
  float spec = pow(max(dot(n, h), 0.0), 140.0) * water * 0.45;
  lit += vec3(1.0, 0.92, 0.78) * spec * day;
  // city lights on the night side
  vec3 lights = pow(nightCol, vec3(1.6)) * vec3(1.0, 0.78, 0.45) * 1.6;
  vec3 col = mix(lights, lit, day);
  // atmospheric rim
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  col += vec3(0.35, 0.6, 1.0) * fres * (0.25 + 0.75 * smoothstep(-0.3, 0.6, ndl));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const cloudFrag = /* glsl */ `
uniform sampler2D uClouds;
uniform vec3 uSun;
uniform float uShift;
uniform float uOpacity;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main(){
  vec3 n = normalize(vNormalW);
  float a = texture2D(uClouds, vUv + vec2(uShift, 0.0)).r;
  float ndl = dot(n, uSun);
  float light = 0.06 + 0.94 * smoothstep(-0.15, 0.35, ndl);
  gl_FragColor = vec4(vec3(light), a * 0.92 * uOpacity);
}`;

const atmoVert = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;
void main(){
  vec4 wp = modelMatrix * vec4(position,1.0);
  vPosW = wp.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const atmoFrag = /* glsl */ `
uniform vec3 uSun;
uniform float uStrength;
varying vec3 vNormalW;
varying vec3 vPosW;
void main(){
  vec3 n = normalize(vNormalW);
  vec3 v = normalize(cameraPosition - vPosW);
  // Back faces: 0 at the shell's silhouette, rising towards the planet limb.
  float rim = pow(clamp(-dot(n, v), 0.0, 1.0), 2.2) * 1.4;
  float sunSide = smoothstep(-0.35, 0.6, dot(n, uSun));
  vec3 col = mix(vec3(0.15, 0.35, 0.9), vec3(0.45, 0.75, 1.0), sunSide);
  gl_FragColor = vec4(col, rim * (0.25 + 0.9 * sunSide) * uStrength);
}`;

function useEarthTextures(lowPower: boolean) {
  const [day, night, water, clouds] = useLoader(TextureLoader, [
    lowPower ? "/textures/earth-day-2k.jpg" : "/textures/earth-day-4k.jpg",
    "/textures/earth-night.jpg",
    "/textures/earth-water.jpg",
    "/textures/earth-clouds.jpg",
  ]);
  day.colorSpace = SRGBColorSpace;
  night.colorSpace = SRGBColorSpace;
  day.anisotropy = 8;
  // The cloud map scrolls east over time: it must wrap around the globe,
  // or the edge column gets smeared into horizontal streaks.
  clouds.wrapS = RepeatWrapping;
  clouds.needsUpdate = true;
  return { day, night, water, clouds };
}

function Starfield({ count }: { count: number }) {
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const pos: number[] = [];
    const col: number[] = [];
    let s = 1337;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      const u = rnd() * 2 - 1;
      const th = rnd() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      const d = 3000;
      pos.push(r * Math.cos(th) * d, u * d, r * Math.sin(th) * d);
      const b = 0.45 + rnd() * 0.55;
      const warm = rnd();
      col.push(b, b * (0.92 + warm * 0.08), b * (0.85 + (1 - warm) * 0.15));
    }
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new Float32BufferAttribute(col, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial size={2.2} sizeAttenuation={false} vertexColors transparent depthWrite={false} />
    </points>
  );
}

export function Globe() {
  const tex = useEarthTextures(journey.lowPower);
  const spin = useRef<Group>(null);
  const cloudMesh = useRef<Mesh>(null);
  const atmo = useRef<ShaderMaterial>(null);
  const idle = useRef(0);

  const earthMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: earthVert,
        fragmentShader: earthFrag,
        uniforms: {
          uDay: { value: tex.day },
          uNight: { value: tex.night },
          uWater: { value: tex.water },
          uClouds: { value: tex.clouds },
          uSun: { value: SUN_DIR },
          uCloudShift: { value: 0 },
        },
      }),
    [tex],
  );
  const cloudMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: earthVert,
        fragmentShader: cloudFrag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uClouds: { value: tex.clouds },
          uSun: { value: SUN_DIR },
          uShift: { value: 0 },
          uOpacity: { value: 1 },
        },
      }),
    [tex],
  );

  useFrame((_, dt) => {
    const t = journey.current;
    if (!journey.reducedMotion && t < 0.02) idle.current += dt * 0.045;
    // Wrap to [-π, π] so the return to Lagos takes the short way round.
    const w = Math.atan2(Math.sin(idle.current), Math.cos(idle.current));
    const settle = 1 - smooth(0.02, 0.6, t);
    if (spin.current) spin.current.rotation.y = ALIGN_YAW + w * settle;
    const shift = (idle.current * 0.02) % 1;
    earthMat.uniforms.uCloudShift.value = shift;
    cloudMat.uniforms.uShift.value = shift;
    // Fade the cloud shell as we sink into it so it never pops.
    cloudMat.uniforms.uOpacity.value = 1 - smooth(0.72, 0.86, t) * 0.6;
    if (atmo.current) atmo.current.uniforms.uStrength.value = 1 - smooth(0.6, 0.85, t) * 0.7;
  });

  return (
    <group>
      <Starfield count={journey.lowPower ? 1500 : 3500} />
      <group ref={spin}>
        <mesh material={earthMat}>
          <sphereGeometry args={[GLOBE_R, 128, 96]} />
        </mesh>
        <mesh ref={cloudMesh} material={cloudMat} scale={1.012}>
          <sphereGeometry args={[GLOBE_R, 96, 72]} />
        </mesh>
      </group>
      <mesh scale={1.14}>
        <sphereGeometry args={[GLOBE_R, 64, 48]} />
        <shaderMaterial
          ref={atmo}
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          side={BackSide}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          uniforms={{ uSun: { value: SUN_DIR }, uStrength: { value: 1 } }}
        />
      </mesh>
    </group>
  );
}
