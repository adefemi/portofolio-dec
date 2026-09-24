"use client";

import { useEffect, useRef, useState } from "react";
import type { LoadDetail } from "./store";

const RING_R = 70;
const RING_C = 2 * Math.PI * RING_R;

/**
 * Covers the first paint until the globe is textured and drawn, then fades
 * into it. Server-rendered so it is on screen before any JavaScript runs.
 */
export function Loader() {
  const [state, setState] = useState<{ p: number; label: string; done: boolean }>({
    p: 0.04,
    label: "Loading flight systems",
    done: false,
  });
  const [gone, setGone] = useState(false);
  const real = useRef(false);

  useEffect(() => {
    // Until the 3D code reports in, creep toward 18% so the bar never sits still.
    const creep = window.setInterval(() => {
      if (real.current) return;
      setState((s) => ({ ...s, p: s.p + (0.18 - s.p) * 0.08 }));
    }, 120);

    const onLoad = (e: Event) => {
      const d = (e as CustomEvent<LoadDetail>).detail;
      real.current = true;
      setState((s) => ({
        p: Math.max(s.p, d.progress),
        label: d.label || s.label,
        done: s.done || !!d.done,
      }));
    };
    window.addEventListener("journey:load", onLoad);

    // Never trap the page behind the loader (slow network, GPU hiccup…).
    const safety = window.setTimeout(() => setState((s) => ({ ...s, p: 1, done: true })), 20000);

    return () => {
      window.clearInterval(creep);
      window.clearTimeout(safety);
      window.removeEventListener("journey:load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (!state.done) return;
    const t = window.setTimeout(() => setGone(true), 1100);
    return () => window.clearTimeout(t);
  }, [state.done]);

  if (gone) return null;
  const pct = Math.round(state.p * 100);

  return (
    <div
      className={`loader${state.done ? " is-done" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={!state.done}
    >
      <div className="loader-stars" aria-hidden />
      <div className="loader-core">
        <svg className="loader-dial" viewBox="0 0 200 200" aria-hidden>
          {/* planet silhouette with a few meridians */}
          <circle cx="100" cy="100" r="44" className="loader-planet" />
          <ellipse cx="100" cy="100" rx="18" ry="44" className="loader-grid" />
          <ellipse cx="100" cy="100" rx="34" ry="44" className="loader-grid" />
          <line x1="56" y1="100" x2="144" y2="100" className="loader-grid" />
          <circle cx="106" cy="96" r="2.4" className="loader-pin" />
          {/* progress ring */}
          <circle cx="100" cy="100" r={RING_R} className="loader-track" />
          <circle
            cx="100"
            cy="100"
            r={RING_R}
            className="loader-progress"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - state.p)}
            transform="rotate(-90 100 100)"
          />
          {/* satellite on its orbit */}
          <g transform="rotate(-18 100 100)">
            <g transform="translate(100 100) scale(1 0.34) translate(-100 -100)">
              <circle cx="100" cy="100" r="88" className="loader-orbit-path" />
              <g className="loader-sat">
                <circle cx="188" cy="100" r="3.4" />
              </g>
            </g>
          </g>
        </svg>
        <p className="loader-pct">
          <span>{pct}</span>%
        </p>
        <p className="loader-label">{state.done ? "Entering orbit" : state.label}</p>
        <p className="loader-meta">Acquiring signal · Lagos 6.45° N 3.39° E</p>
      </div>
    </div>
  );
}
