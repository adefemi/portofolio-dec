"use client";

import {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import { Earth } from "./Earth";
import { Stars } from "./Stars";
import {
  IntroHero,
  ProgressRail,
  ScrollHint,
  TopNav,
  ZoomHUD,
  type ZoomHUDRefs,
} from "./Hud";
import {
  LANDMARK_COUNT,
  LANDMARK_OFFSETS,
  LANDMARK_TOTAL_VH,
  LANDMARK_VH,
  SECTION_VH,
  TOTAL_VH,
  type Phase,
} from "./types";

const AboutLandmark = dynamic(
  () => import("./landmarks/AboutLandmark").then((m) => m.AboutLandmark),
  { ssr: false },
);
const ProjectsLandmark = dynamic(
  () => import("./landmarks/ProjectsLandmark").then((m) => m.ProjectsLandmark),
  { ssr: false },
);
const ExperienceLandmark = dynamic(
  () =>
    import("./landmarks/ExperienceLandmark").then((m) => m.ExperienceLandmark),
  { ssr: false },
);
const SkillsLandmark = dynamic(
  () => import("./landmarks/SkillsLandmark").then((m) => m.SkillsLandmark),
  { ssr: false },
);
const ContactLandmark = dynamic(
  () => import("./landmarks/ContactLandmark").then((m) => m.ContactLandmark),
  { ssr: false },
);

const ACCENT = "#f0b840";

interface ScrollSnapshot {
  phase: Phase;
  phaseProgress: number;
  activeLandmark: number;
  landmarkProgress: number;
}

interface DiscreteState {
  phase: Phase;
  activeLandmark: number;
  globeActiveLandmark: number;
  landmarkProgress: number;
  vw: number;
  vh: number;
}

const INITIAL_DISCRETE: DiscreteState = {
  phase: "intro",
  activeLandmark: -1,
  globeActiveLandmark: 0,
  landmarkProgress: 0,
  vw: 1280,
  vh: 800,
};

function computeProgress(scrollY: number, vh: number): ScrollSnapshot {
  const introEnd = (vh * SECTION_VH.intro) / 100;
  const zoomEnd = introEnd + (vh * SECTION_VH.zoom) / 100;

  if (scrollY < introEnd) {
    return {
      phase: "intro",
      phaseProgress: introEnd === 0 ? 0 : scrollY / introEnd,
      activeLandmark: -1,
      landmarkProgress: 0,
    };
  }
  if (scrollY < zoomEnd) {
    const span = zoomEnd - introEnd;
    return {
      phase: "zoom",
      phaseProgress: span === 0 ? 0 : (scrollY - introEnd) / span,
      activeLandmark: -1,
      landmarkProgress: 0,
    };
  }

  const relVh = ((scrollY - zoomEnd) / vh) * 100;
  let activeLandmark = LANDMARK_COUNT - 1;
  for (let i = 0; i < LANDMARK_COUNT; i++) {
    const start = LANDMARK_OFFSETS[i];
    const end = start + LANDMARK_VH[i];
    if (relVh < end) {
      activeLandmark = i;
      break;
    }
  }
  const lmStart = LANDMARK_OFFSETS[activeLandmark];
  const lmSize = LANDMARK_VH[activeLandmark];
  const landmarkProgress = lmSize === 0 ? 0 : (relVh - lmStart) / lmSize;

  return {
    phase: "landmark",
    phaseProgress: relVh / LANDMARK_TOTAL_VH,
    activeLandmark,
    landmarkProgress: Math.max(0, Math.min(1, landmarkProgress)),
  };
}

function discreteFromSnapshot(
  snap: ScrollSnapshot,
  vw: number,
  vh: number,
): DiscreteState {
  const globeActiveLandmark =
    snap.phase === "intro"
      ? Math.min(
          LANDMARK_COUNT - 1,
          Math.floor(snap.phaseProgress * LANDMARK_COUNT),
        )
      : snap.phase === "zoom"
        ? 0
        : -1;
  return {
    phase: snap.phase,
    activeLandmark: snap.activeLandmark,
    globeActiveLandmark,
    landmarkProgress: snap.phase === "landmark" ? snap.landmarkProgress : 0,
    vw,
    vh,
  };
}

function discreteEqual(a: DiscreteState, b: DiscreteState): boolean {
  if (
    a.phase !== b.phase ||
    a.activeLandmark !== b.activeLandmark ||
    a.globeActiveLandmark !== b.globeActiveLandmark ||
    a.vw !== b.vw ||
    a.vh !== b.vh
  ) {
    return false;
  }
  if (a.phase === "landmark") {
    return Math.abs(a.landmarkProgress - b.landmarkProgress) < 0.01;
  }
  return true;
}

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServer = () => false;

export default function Portfolio() {
  const [discrete, setDiscrete] = useState<DiscreteState>(INITIAL_DISCRETE);
  const discreteRef = useRef<DiscreteState>(INITIAL_DISCRETE);
  const rafRef = useRef<number | null>(null);
  const dirtyRef = useRef(false);
  const [rotation, setRotation] = useState(0);

  const bgZoomRef = useRef<HTMLDivElement | null>(null);
  const globeOuterRef = useRef<HTMLDivElement | null>(null);
  const globeInnerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const zoomLayerRef = useRef<HTMLDivElement | null>(null);
  const landmarkLayerRef = useRef<HTMLDivElement | null>(null);

  const zoomReticleRef = useRef<HTMLDivElement | null>(null);
  const zoomAltRef = useRef<HTMLDivElement | null>(null);
  const zoomLatRef = useRef<HTMLDivElement | null>(null);
  const zoomLonRef = useRef<HTMLDivElement | null>(null);
  const zoomPctRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  const zoomRefs = useRef<ZoomHUDRefs>({
    reticle: zoomReticleRef,
    alt: zoomAltRef,
    lat: zoomLatRef,
    lon: zoomLonRef,
    pct: zoomPctRef,
  }).current;

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );

  const applyContinuous = useCallback((snap: ScrollSnapshot) => {
    const { phase, phaseProgress, landmarkProgress } = snap;

    // Globe transform/opacity. NO blur filter (it's the most expensive
    // operation when applied to a heavily-scaled SVG layer). Scale is
    // capped at ~6x because going beyond that just allocates huge GPU
    // textures the user never sees (opacity is ~0 by then anyway).
    const globeScale =
      phase === "intro"
        ? 0.85 + phaseProgress * 0.1
        : phase === "zoom"
          ? 0.95 + Math.pow(phaseProgress, 1.6) * 5.5
          : 6.5;
    const globeOpacity =
      phase === "intro"
        ? 1
        : phase === "zoom"
          ? Math.max(0, 1 - Math.pow(phaseProgress, 1.6) * 1.2)
          : 0;

    if (globeOuterRef.current) {
      const outer = globeOuterRef.current;
      // Once the globe is essentially invisible, take it out of the
      // compositor entirely. Otherwise the GPU keeps re-rasterising a
      // 22x-scaled SVG on every paint.
      if (globeOpacity < 0.04) {
        outer.style.opacity = "0";
        outer.style.visibility = "hidden";
      } else {
        outer.style.opacity = globeOpacity.toFixed(3);
        outer.style.visibility = "visible";
      }
    }
    if (globeInnerRef.current) {
      globeInnerRef.current.style.transform = `translate3d(0,0,0) scale(${globeScale.toFixed(3)})`;
    }

    if (heroRef.current) {
      const heroOpacity = phase === "intro" ? 1 - phaseProgress * 0.85 : 0;
      const heroY = phase === "intro" ? -phaseProgress * 40 : -40;
      heroRef.current.style.opacity = heroOpacity.toFixed(3);
      heroRef.current.style.transform = `translate3d(0,${heroY.toFixed(1)}px,0)`;
    }

    if (zoomLayerRef.current) {
      const zoomOpacity =
        phase === "zoom" ? Math.max(0, 1 - Math.pow(phaseProgress, 2)) : 0;
      zoomLayerRef.current.style.opacity = zoomOpacity.toFixed(3);
    }

    if (phase === "zoom") {
      if (zoomReticleRef.current) {
        zoomReticleRef.current.style.transform = `translate3d(-50%,-50%,0) scale(${(1 + phaseProgress * 0.4).toFixed(3)})`;
      }
      if (zoomAltRef.current) {
        const alt = Math.round(400 - phaseProgress * 399);
        zoomAltRef.current.textContent = `ALT ${String(alt).padStart(3, "0")} KM`;
      }
      if (zoomLatRef.current) {
        zoomLatRef.current.textContent = `LAT ${(6.45 - phaseProgress * 0.05).toFixed(4)}° N`;
      }
      if (zoomLonRef.current) {
        zoomLonRef.current.textContent = `LON ${(3.4 + phaseProgress * 0.02).toFixed(4)}° E`;
      }
      if (zoomPctRef.current) {
        zoomPctRef.current.textContent = `ATMOSPHERIC ENTRY · ${Math.round(phaseProgress * 100)}%`;
      }
    }

    // Background tint: crossfade a pre-rendered "warm" gradient over the
    // base "cool" gradient via opacity (GPU-only). Avoids re-painting a
    // viewport-sized radial-gradient on every frame.
    if (bgZoomRef.current) {
      const t =
        phase === "intro"
          ? 0
          : phase === "zoom"
            ? Math.min(1, phaseProgress * 1.2)
            : 1;
      bgZoomRef.current.style.opacity = t.toFixed(3);
    }

    if (scrollHintRef.current) {
      const hintOpacity =
        phase === "intro" ? Math.max(0, 1 - phaseProgress / 0.3) : 0;
      scrollHintRef.current.style.opacity = hintOpacity.toFixed(3);
    }

    if (landmarkLayerRef.current) {
      let fade = 0;
      if (phase === "landmark") {
        // Use a fade band that scales with landmark size: ~8vh of fade
        // for any panel, capped at 40% so the smallest static panels
        // still get a smooth, continuous transition (rather than a
        // snap-in / dead-scroll / snap-out feel).
        const lmSizeVh = LANDMARK_VH[snap.activeLandmark];
        const fadeFrac = Math.min(0.4, 8 / lmSizeVh);
        if (landmarkProgress < fadeFrac) {
          fade = landmarkProgress / fadeFrac;
        } else if (landmarkProgress > 1 - fadeFrac) {
          fade = Math.max(0, (1 - landmarkProgress) / fadeFrac);
        } else {
          fade = 1;
        }
      }
      landmarkLayerRef.current.style.opacity = fade.toFixed(3);
    }
  }, []);

  const flush = useCallback(() => {
    rafRef.current = null;
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const snap = computeProgress(window.scrollY, vh);
    applyContinuous(snap);
    const next = discreteFromSnapshot(snap, vw, vh);
    if (!discreteEqual(discreteRef.current, next)) {
      discreteRef.current = next;
      setDiscrete(next);
    }
  }, [applyContinuous]);

  const schedule = useCallback(() => {
    dirtyRef.current = true;
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flush);
    }
  }, [flush]);

  useEffect(() => {
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [schedule]);

  // Globe rotation: only animates during intro. Throttled to ~30fps to
  // halve the Earth re-render cost (rotation is gentle so 30fps is plenty).
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (discreteRef.current.phase === "intro" && now - last >= 33) {
        const dt = now - last;
        last = now;
        setRotation((r) => (r + dt * 0.0036) % 360);
      } else if (discreteRef.current.phase !== "intro") {
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const {
    phase,
    activeLandmark,
    globeActiveLandmark,
    landmarkProgress,
    vw,
    vh,
  } = discrete;

  const earthSize = Math.min(vw, vh) * 0.7;

  const scrollTo = useCallback(
    (idx: number) => {
      const start =
        (vh * (SECTION_VH.intro + SECTION_VH.zoom)) / 100 +
        (vh * LANDMARK_OFFSETS[idx]) / 100;
      const lmPx = (vh * LANDMARK_VH[idx]) / 100;
      // Land on the centre of the panel so it's fully visible regardless
      // of how short or long the section is.
      const y = start + lmPx * 0.5;
      window.scrollTo({ top: y, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [vh, reducedMotion],
  );

  const renderLandmark = () => {
    if (phase !== "landmark") return null;
    switch (activeLandmark) {
      case 0:
        return <AboutLandmark accentColor={ACCENT} />;
      case 1:
        return (
          <ProjectsLandmark progress={landmarkProgress} accentColor={ACCENT} />
        );
      case 2:
        return (
          <ExperienceLandmark
            progress={landmarkProgress}
            accentColor={ACCENT}
          />
        );
      case 3:
        return <SkillsLandmark accentColor={ACCENT} />;
      case 4:
        return <ContactLandmark accentColor={ACCENT} />;
      default:
        return null;
    }
  };

  const bgBaseStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    background:
      "radial-gradient(ellipse at 50% 30%, #0b1230 0%, rgb(3,6,17) 55%, #020409 100%)",
    contain: "strict",
  };

  const bgZoomStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    background:
      "radial-gradient(ellipse at 50% 30%, #1a1640 0%, rgb(11,16,47) 55%, #060a1c 100%)",
    contain: "strict",
    opacity: 0,
    willChange: "opacity",
    pointerEvents: "none",
  };

  // Stars + nebula glows sit in their own layer ABOVE the two gradient
  // layers so they remain visible regardless of the bgZoom crossfade.
  const decorLayerStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    contain: "strict",
  };

  return (
    <>
      <div style={{ height: `${TOTAL_VH}vh`, width: 1 }} aria-hidden />

      <div style={bgBaseStyle} aria-hidden />
      <div ref={bgZoomRef} style={bgZoomStyle} aria-hidden />

      <div style={decorLayerStyle} aria-hidden>
        <Stars count={140} />
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "8%",
            width: "40%",
            height: "40%",
            background:
              "radial-gradient(ellipse, rgba(120, 80, 200, 0.18), transparent 60%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "5%",
            width: "35%",
            height: "35%",
            background:
              "radial-gradient(ellipse, rgba(200, 120, 80, 0.1), transparent 60%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div
        ref={globeOuterRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1,
          pointerEvents: "none",
          willChange: "opacity",
          contain: "layout paint",
        }}
      >
        <div
          ref={globeInnerRef}
          style={{
            transform: "translate3d(0,0,0) scale(0.85)",
            transformOrigin: "center center",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <Earth
            size={earthSize}
            rotation={rotation}
            tilt={-12}
            activeLandmark={globeActiveLandmark}
            pulse={phase === "intro"}
          />
        </div>
      </div>

      <div
        ref={heroRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 1,
          transform: "translate3d(0,0,0)",
          willChange: "opacity, transform",
          contain: "layout paint",
        }}
      >
        <IntroHero accent={ACCENT} />
      </div>

      <div
        ref={zoomLayerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0,
          willChange: "opacity",
          contain: "layout paint",
        }}
      >
        <ZoomHUD accent={ACCENT} refs={zoomRefs} />
      </div>

      <div
        ref={landmarkLayerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 3,
          pointerEvents: phase === "landmark" ? "auto" : "none",
          opacity: 0,
          willChange: "opacity",
        }}
      >
        {renderLandmark()}
      </div>

      <TopNav
        accent={ACCENT}
        phase={phase}
        activeLandmark={activeLandmark}
        onJump={scrollTo}
      />
      <ScrollHint hintRef={scrollHintRef} />
      <ProgressRail
        activeLandmark={activeLandmark}
        phase={phase}
        accent={ACCENT}
        onJump={scrollTo}
      />
    </>
  );
}
