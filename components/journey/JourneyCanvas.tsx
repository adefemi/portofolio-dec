"use client";

import { Component, ReactNode, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, DefaultLoadingManager, SRGBColorSpace } from "three";
import { World } from "./scene/World";
import { journey, reportLoad, LoadDetail } from "./store";

class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error("3D scene unavailable, falling back to static background", err);
    reportLoad({ progress: 1, label: "", done: true });
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
    // The globe fades in once its textures are loaded and a frame is drawn.
    const onLoad = (e: Event) => {
      if ((e as CustomEvent<LoadDetail>).detail.done) setShown(true);
    };
    window.addEventListener("journey:load", onLoad);
    return () => window.removeEventListener("journey:load", onLoad);
  }, []);

  useEffect(() => {
    if (!hasWebGL()) {
      reportLoad({ progress: 1, label: "", done: true });
      return;
    }
    reportLoad({ progress: 0.2, label: "Powering up flight systems" });
    DefaultLoadingManager.onProgress = (_url, loaded, total) => {
      reportLoad({
        progress: 0.2 + 0.72 * (loaded / Math.max(1, total)),
        label: `Downloading Earth · map ${loaded} of ${total}`,
      });
    };
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
        >
          <World />
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}
