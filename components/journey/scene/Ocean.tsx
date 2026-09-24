"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderMaterial, Vector2 } from "three";
import { CRATER_R, CRATER_Z } from "./cameraPath";
import { SURFACE_SUN, HORIZON, ZENITH_LOW } from "./env";

const vert = /* glsl */ `
varying vec3 vPos;
void main(){
  vec4 wp = modelMatrix * vec4(position,1.0);
  vPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

// Sum of directional waves; gradient computed analytically so the surface
// stays a single flat quad (cheap) while shading like moving water.
const frag = /* glsl */ `
uniform float uTime;
uniform vec3 uSun;
uniform vec3 uHorizon;
uniform vec3 uZenith;
uniform vec2 uHole;
uniform float uHoleR;
varying vec3 vPos;

vec2 waveGrad(vec2 p, float t, float fade){
  vec2 g = vec2(0.0);
  vec2 dirs[6];
  dirs[0]=normalize(vec2(1.0,0.35)); dirs[1]=normalize(vec2(-0.6,1.0));
  dirs[2]=normalize(vec2(0.2,-1.0)); dirs[3]=normalize(vec2(0.9,0.8));
  dirs[4]=normalize(vec2(-1.0,-0.2)); dirs[5]=normalize(vec2(0.4,0.9));
  float amp = 0.55; float freq = 0.045;
  for(int i=0;i<6;i++){
    float ph = dot(dirs[i], p) * freq + t * (0.9 + float(i) * 0.23);
    g += dirs[i] * cos(ph) * amp * freq * 6.0;
    amp *= 0.62 * fade + 0.2 * (1.0 - fade); freq *= 1.85;
  }
  return g;
}

void main(){
  if (length(vPos.xz - uHole) < uHoleR) discard; // the crater sits below sea level
  vec3 v = cameraPosition - vPos;
  float dist = length(v);
  v /= dist;
  float fade = 1.0 - smoothstep(200.0, 2500.0, dist);
  vec2 g = waveGrad(vPos.xz, uTime, fade) * mix(0.25, 1.0, fade);
  vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
  float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
  vec3 r = reflect(-v, n);
  vec3 sky = mix(uHorizon, uZenith, pow(clamp(r.y, 0.0, 1.0), 0.5));
  vec3 deep = vec3(0.015, 0.09, 0.14);
  vec3 scatter = vec3(0.04, 0.2, 0.22) * (0.4 + 0.6 * max(dot(n, uSun), 0.0));
  vec3 col = mix(deep + scatter, sky, fres);
  vec3 h = normalize(uSun + v);
  col += vec3(1.0, 0.88, 0.66) * pow(max(dot(n, h), 0.0), 220.0) * 3.0;
  col += vec3(1.0, 0.9, 0.7) * pow(max(dot(n, h), 0.0), 18.0) * 0.08;
  col = mix(col, uHorizon, smoothstep(1200.0, 7000.0, dist));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export function Ocean() {
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uTime: { value: 0 },
          uSun: { value: SURFACE_SUN },
          uHorizon: { value: HORIZON },
          uZenith: { value: ZENITH_LOW },
          uHole: { value: new Vector2(0, CRATER_Z) },
          uHoleR: { value: CRATER_R + 40 },
        },
      }),
    [],
  );
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1500]}>
      <planeGeometry args={[18000, 18000, 1, 1]} />
    </mesh>
  );
}
