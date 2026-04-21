import { memo } from "react";
import { LandmarkFrame } from "./LandmarkFrame";
import { DeskScene } from "../scenes/DeskScene";

interface AboutLandmarkProps {
  accentColor: string;
}

const STATS = [
  { k: "10+", v: "Years shipping" },
  { k: "1st Class", v: "Computer Science" },
  { k: "1", v: "Founder at Djuix.io" },
] as const;

function AboutLandmarkImpl({ accentColor }: AboutLandmarkProps) {
  return (
    <LandmarkFrame label="ABOUT" coords={["06.45° N", "003.40° E"]} index={0} total={5}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "min(100%, 560px)" }}>
          <DeskScene />
        </div>
      </div>
      <div style={{ maxWidth: 520 }}>
        <div className="eyebrow" style={{ color: accentColor }}>
          TOUCHDOWN · LAGOS, NIGERIA
        </div>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "clamp(40px, 4.4vw, 68px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            margin: "18px 0 24px",
          }}
        >
          I build software that{" "}
          <span className="serif" style={{ color: accentColor }}>
            actually works
          </span>
          , and works fast.
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: "rgba(239,233,220,0.75)",
            margin: "0 0 24px",
            maxWidth: 460,
          }}
        >
          I&apos;m <strong style={{ color: "#efe9dc" }}>Adefemi Oseni</strong> — a senior software
          engineer who has spent a decade exploring the full-stack scope of this atmosphere.
          Backend, frontend, platforms, a startup of my own. I believe in doing a little
          thing that works (and works fine) over a large thing that doesn&apos;t.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginTop: 40,
          }}
        >
          {STATS.map((s) => (
            <div key={s.k}>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 28,
                  fontWeight: 500,
                  color: accentColor,
                }}
              >
                {s.k}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "rgba(239,233,220,0.5)",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LandmarkFrame>
  );
}

export const AboutLandmark = memo(AboutLandmarkImpl);
