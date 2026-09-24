"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { journey, JOURNEY_END, SECTION_IDS } from "./store";
import { NAV } from "./content";

const JourneyCanvas = dynamic(() => import("./JourneyCanvas"), { ssr: false });

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll range (px) during which each stop fills the screen. Inside a range
 * the camera stays parked at that stop; between ranges it travels.
 */
function measureStops(): Array<[number, number]> {
  const vh = window.innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - vh);
  return SECTION_IDS.map((id, i) => {
    if (i === 0) return [0, 0];
    const el = document.getElementById(id);
    if (!el) return [max, max];
    const top = el.getBoundingClientRect().top + window.scrollY;
    const h = el.offsetHeight;
    const dwell = Math.max(0, h - vh);
    const start = Math.min(max, top + Math.max(0, (h - vh - dwell) / 2));
    const end = Math.min(max, start + dwell);
    return [start, end];
  });
}

function journeyAt(y: number, stops: Array<[number, number]>): number {
  if (!stops.length) return 0;
  for (let i = 0; i < stops.length; i++) {
    const [s, e] = stops[i];
    if (y <= e) {
      if (y >= s || i === 0) return i;
      const prevEnd = stops[i - 1][1];
      return s === prevEnd ? i : i - 1 + (y - prevEnd) / (s - prevEnd);
    }
  }
  return JOURNEY_END;
}

export function JourneyChrome() {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const [active, setActive] = useState(0);
  const stops = useRef<Array<[number, number]>>([]);
  const veil = useRef<HTMLDivElement>(null);
  const gValue = useRef<HTMLSpanElement>(null);
  const gLabel = useRef<HTMLSpanElement>(null);
  const gDot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    journey.reducedMotion = reduced;
  }, [reduced]);

  useEffect(() => {
    journey.veil = veil.current;
    journey.gaugeValue = gValue.current;
    journey.gaugeLabel = gLabel.current;
    journey.gaugeDot = gDot.current;

    let raf = 0;
    let lastStop = -1;
    const update = () => {
      raf = 0;
      const t = journeyAt(window.scrollY, stops.current);
      journey.target = t;
      const stop = Math.round(t);
      if (stop !== lastStop) {
        lastStop = stop;
        setActive(stop);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const remeasure = () => {
      stops.current = measureStops();
      onScroll();
    };
    remeasure();
    // Start the camera where the page actually is (e.g. after a reload mid-page).
    journey.current = journey.target;
    // Tabbing into a sign that stands in the 3D layer: fly to its stop.
    const onFocus = (e: FocusEvent) => {
      const sign = (e.target as HTMLElement | null)?.closest?.("[data-sign]");
      if (!sign || !document.documentElement.classList.contains("signs-3d")) return;
      const idx = Number(sign.getAttribute("data-sign"));
      if (Math.round(journey.target) === idx) return;
      const r = stops.current[idx];
      if (r) window.scrollTo({ top: (r[0] + r[1]) / 2, behavior: "auto" });
    };
    document.addEventListener("focusin", onFocus);
    // Initial hash (e.g. /#contact): land on that stop.
    const hashIdx = SECTION_IDS.indexOf(window.location.hash.slice(1) as (typeof SECTION_IDS)[number]);
    if (hashIdx > 0) {
      const r = stops.current[hashIdx];
      if (r) window.scrollTo({ top: (r[0] + r[1]) / 2, behavior: "auto" });
    }
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      ro.disconnect();
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, idx: number) => {
    const r = stops.current[idx];
    if (!r) return;
    e.preventDefault();
    window.scrollTo({ top: (r[0] + r[1]) / 2, behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", `#${SECTION_IDS[idx]}`);
  };

  return (
    <>
      <JourneyCanvas />
      <div ref={veil} className="journey-veil" aria-hidden />

      <header className="topbar">
        <a href="#top" className="brand" onClick={(e) => jump(e, 0)}>
          <span className="brand-dot" aria-hidden />
          Adefemi Oseni
        </a>
        <nav aria-label="Sections" className="topnav">
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => jump(e, i + 1)}
              aria-current={active === i + 1 ? "true" : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="gauge" aria-hidden>
        <div className="gauge-rail">
          {SECTION_IDS.map((id, i) => (
            <span key={id} className="gauge-tick" style={{ top: `${(i / JOURNEY_END) * 100}%` }} />
          ))}
          <div ref={gDot} className="gauge-dot" />
        </div>
        <div className="gauge-read">
          <span ref={gValue} className="gauge-value">400 km</span>
          <span ref={gLabel} className="gauge-label">Low Earth orbit</span>
        </div>
      </div>
    </>
  );
}
