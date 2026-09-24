"use client";

import { Component, ReactNode, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { World } from "./scene/World";
import { journey } from "./store";

class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error("3D scene unavailable, falling back to static background", err);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function JourneyCanvas() {
  const [ready, setReady] = useState<null | { low: boolean }>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!hasWebGL()) return;
    const narrow = window.matchMedia("(max-width: 820px)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    const q = new URLSearchParams(window.location.search).get("quality");
    const low = q === "high" ? false : q === "low" ? true : narrow || cores <= 4;
    journey.lowPower = low;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability probe
    setReady({ low });
  }, []);

  if (!ready) return null;
  return (
    <div className={`journey-canvas${shown ? " is-shown" : ""}`} aria-hidden>
      <WebGLBoundary>
        <Canvas
          dpr={ready.low ? [1, 1.25] : [1, 1.75]}
          gl={{
            antialias: !ready.low,
            powerPreference: "high-performance",
            toneMapping: ACESFilmicToneMapping,
            outputColorSpace: SRGBColorSpace,
          }}
          camera={{ fov: 50, near: 0.5, far: 6000, position: [0, 22, 400] }}
          onCreated={() => setShown(true)}
        >
          <World />
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}
