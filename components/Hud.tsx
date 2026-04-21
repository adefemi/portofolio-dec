"use client";

import { CSSProperties, RefObject, memo } from "react";
import type { Phase } from "./types";

interface IntroHeroProps {
  accent: string;
}

function IntroHeroImpl({ accent }: IntroHeroProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: "10vh",
        textAlign: "center",
      }}
    >
      <div className="eyebrow" style={{ color: accent, marginBottom: 24 }}>
        ◉ NOW ORBITING · PORTFOLIO v2026
      </div>
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
          fontSize: "clamp(52px, 7vw, 108px)",
          margin: 0,
          lineHeight: 0.98,
          letterSpacing: "-0.03em",
          color: "#efe9dc",
        }}
      >
        Adefemi{" "}
        <span className="serif" style={{ color: accent, fontWeight: 400 }}>
          Oseni
        </span>
      </h1>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(16px, 1.4vw, 20px)",
          color: "rgba(239,233,220,0.7)",
          marginTop: 18,
          maxWidth: 540,
          letterSpacing: "0.02em",
        }}
      >
        Senior software engineer · full-stack explorer · shipping from{" "}
        <span style={{ color: accent }}>Lagos, Nigeria</span>
      </div>
      <div
        className="mono"
        style={{
          marginTop: 40,
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "rgba(239,233,220,0.4)",
        }}
      >
        SCROLL TO DESCEND ▾
      </div>
    </div>
  );
}

export const IntroHero = memo(IntroHeroImpl);

export interface ZoomHUDRefs {
  reticle: RefObject<HTMLDivElement | null>;
  alt: RefObject<HTMLDivElement | null>;
  lat: RefObject<HTMLDivElement | null>;
  lon: RefObject<HTMLDivElement | null>;
  pct: RefObject<HTMLDivElement | null>;
}

interface ZoomHUDProps {
  accent: string;
  refs: ZoomHUDRefs;
}

function ZoomHUDImpl({ accent, refs }: ZoomHUDProps) {
  return (
    <>
      <div
        ref={refs.reticle}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 120,
          height: 120,
          transform: "translate3d(-50%, -50%, 0) scale(1)",
          opacity: 0.5,
          willChange: "transform",
        }}
      >
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke={accent}
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />
          <line x1="60" y1="10" x2="60" y2="40" stroke={accent} strokeWidth="1" />
          <line x1="60" y1="80" x2="60" y2="110" stroke={accent} strokeWidth="1" />
          <line x1="10" y1="60" x2="40" y2="60" stroke={accent} strokeWidth="1" />
          <line x1="80" y1="60" x2="110" y2="60" stroke={accent} strokeWidth="1" />
        </svg>
      </div>
      <div
        className="mono"
        style={{
          position: "absolute",
          top: 32,
          left: 32,
          fontSize: 11,
          color: accent,
          letterSpacing: "0.2em",
        }}
      >
        DESCENDING · LAGOS
      </div>
      <div
        className="mono"
        style={{
          position: "absolute",
          top: 32,
          right: 32,
          fontSize: 11,
          color: accent,
          letterSpacing: "0.2em",
          textAlign: "right",
        }}
      >
        <div ref={refs.alt}>ALT 400 KM</div>
        <div ref={refs.lat}>LAT 6.4500° N</div>
        <div ref={refs.lon}>LON 3.4000° E</div>
      </div>
      <div
        ref={refs.pct}
        className="mono"
        style={{
          position: "absolute",
          bottom: 32,
          left: 32,
          fontSize: 10,
          color: "rgba(240,184,64,0.6)",
          letterSpacing: "0.2em",
        }}
      >
        ATMOSPHERIC ENTRY · 0%
      </div>
      <div
        className="mono"
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          fontSize: 10,
          color: "rgba(240,184,64,0.6)",
          letterSpacing: "0.2em",
        }}
      >
        TARGET: ADEFEMI.OS
      </div>
    </>
  );
}

export const ZoomHUD = memo(ZoomHUDImpl);

const NAV_LABELS = ["ABOUT", "PROJECTS", "EXPERIENCE", "SKILLS", "CONTACT"] as const;

interface TopNavProps {
  accent: string;
  phase: Phase;
  activeLandmark: number;
  onJump: (idx: number) => void;
}

function TopNavImpl({ accent, phase, activeLandmark, onJump }: TopNavProps) {
  return (
    <nav
      aria-label="Section navigation"
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        display: "flex",
        gap: 4,
        padding: 6,
        background: "rgba(6, 10, 28, 0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(239,233,220,0.1)",
        borderRadius: 100,
        pointerEvents: "auto",
      }}
    >
      {NAV_LABELS.map((l, i) => {
        const active = phase === "landmark" && activeLandmark === i;
        const style: CSSProperties = {
          padding: "6px 14px",
          fontSize: 10,
          letterSpacing: "0.2em",
          background: active ? accent : "transparent",
          color: active ? "#030611" : "rgba(239,233,220,0.7)",
          border: "none",
          borderRadius: 100,
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          transition: "all 0.15s",
        };
        return (
          <button
            key={l}
            onClick={() => onJump(i)}
            className="mono"
            style={style}
            aria-current={active ? "page" : undefined}
          >
            {l}
          </button>
        );
      })}
    </nav>
  );
}

export const TopNav = memo(TopNavImpl);

interface ScrollHintProps {
  hintRef: RefObject<HTMLDivElement | null>;
}

function ScrollHintImpl({ hintRef }: ScrollHintProps) {
  return (
    <div
      ref={hintRef}
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        opacity: 1,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <svg width="18" height="28" viewBox="0 0 18 28">
        <rect
          x="1"
          y="1"
          width="16"
          height="26"
          rx="8"
          fill="none"
          stroke="rgba(239,233,220,0.4)"
          strokeWidth="1"
        />
        <circle cx="9" cy="8" r="2" fill="#f0b840">
          <animate attributeName="cy" values="8;18;8" dur="1.8s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="1;0;1"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

export const ScrollHint = memo(ScrollHintImpl);

const RAIL_LABELS = ["A", "P", "E", "S", "C"] as const;

interface ProgressRailProps {
  activeLandmark: number;
  phase: Phase;
  accent: string;
  onJump: (idx: number) => void;
}

function ProgressRailImpl({ activeLandmark, phase, accent, onJump }: ProgressRailProps) {
  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
        pointerEvents: "auto",
      }}
      aria-label="Progress rail"
    >
      {RAIL_LABELS.map((l, i) => {
        const active = phase === "landmark" && activeLandmark === i;
        return (
          <button
            key={l}
            onClick={() => onJump(i)}
            aria-label={`Jump to section ${i + 1}`}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: active ? accent : "transparent",
              color: active ? "#030611" : "rgba(239,233,220,0.55)",
              border: `1px solid ${active ? accent : "rgba(239,233,220,0.2)"}`,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              cursor: "pointer",
              padding: 0,
              transition: "all 0.15s",
            }}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

export const ProgressRail = memo(ProgressRailImpl);
