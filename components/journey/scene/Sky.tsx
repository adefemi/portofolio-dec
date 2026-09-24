"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, Mesh, ShaderMaterial } from "three";
import { SURFACE_SUN, HORIZON, HORIZON_HIGH, ZENITH_LOW, ZENITH_HIGH, altitudeFactor } from "./env";

const vert = /* glsl */ `
varying vec3 vDir;
void main(){
  vec4 wp = modelMatrix * vec4(position,1.0);
  vDir = wp.xyz - cameraPosition;
  gl_Position = projectionMatrix * viewMatrix * wp;
  gl_Position.z = gl_Position.w; // pin to far plane
}`;

const frag = /* glsl */ `
uniform vec3 uSun;
uniform vec3 uHorizonLow; uniform vec3 uHorizonHigh;
uniform vec3 uZenithLow; uniform vec3 uZenithHigh;
uniform float uAlt;
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 horizon = mix(uHorizonLow, uHorizonHigh, uAlt);
  vec3 zenith = mix(uZenithLow, uZenithHigh, uAlt);
  float k = pow(clamp(h, 0.0, 1.0), mix(0.45, 0.3, uAlt));
  vec3 col = mix(horizon, zenith, k);
  // below the horizon: haze into the sea / cloud tops
  col = mix(col, horizon * 0.92, smoothstep(0.0, -0.08, h));
  float s = max(dot(d, uSun), 0.0);
  col += vec3(1.0, 0.86, 0.62) * (pow(s, 12.0) * 0.28 + pow(s, 180.0) * 0.6);
  col += vec3(1.0, 0.97, 0.9) * smoothstep(0.9993, 0.9997, s) * 2.0;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export function Sky() {
  const mesh = useRef<Mesh>(null);
  const mat = useRef<ShaderMaterial>(null);
  useFrame(({ camera }) => {
    if (mesh.current) mesh.current.position.copy(camera.position);
    if (mat.current) mat.current.uniforms.uAlt.value = altitudeFactor(camera.position.y);
  });
  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={-10}>
      <sphereGeometry args={[9000, 48, 24]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        side={BackSide}
        depthWrite={false}
        uniforms={{
          uSun: { value: SURFACE_SUN },
          uHorizonLow: { value: HORIZON },
          uHorizonHigh: { value: HORIZON_HIGH },
          uZenithLow: { value: ZENITH_LOW },
          uZenithHigh: { value: ZENITH_HIGH },
          uAlt: { value: 1 },
        }}
      />
    </mesh>
  );
}
