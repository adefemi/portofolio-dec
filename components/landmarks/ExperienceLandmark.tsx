import { memo } from "react";
import { LandmarkFrame } from "./LandmarkFrame";
import { TimelineTowerScene } from "../scenes/TimelineTowerScene";

const ROLES = [
  {
    year: "2024 →",
    role: "Senior Software Engineer",
    org: "Bleacher Report",
    note: "GraphQL Federation, caching service, security hardening.",
  },
  {
    year: "2022",
    role: "Founder",
    org: "Djuix.io",
    note: "Streamlining Django project setup end-to-end.",
  },
  {
    year: "2021",
    role: "Backend Software Engineer",
    org: "RETINA-AI Health",
    note: "Cloud-based AI platform in healthcare.",
  },
  {
    year: "2019",
    role: "Senior Frontend Developer",
    org: "Kodobe",
    note: "Micro-frontend architecture, reusable Node.js packages.",
  },
  {
    year: "2017",
    role: "Web Developer",
    org: "Achievers University",
    note: "Where it started. First shipped things.",
  },
] as const;

interface ExperienceLandmarkProps {
  progress: number;
  accentColor: string;
}

function ExperienceLandmarkImpl({
  progress,
  accentColor,
}: ExperienceLandmarkProps) {
  return (
    <LandmarkFrame
      label="EXPERIENCE"
      coords={["29.76° N", "095.37° W"]}
      index={2}
      total={5}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "min(100%, 620px)" }}>
          <TimelineTowerScene />
        </div>
      </div>
      <div style={{ maxWidth: 520 }}>
        <div className="eyebrow" style={{ color: accentColor }}>
          THE TOWER · A DECADE IN ROLES
        </div>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "clamp(32px, 3.2vw, 48px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            margin: "16px 0 28px",
          }}
        >
          Each floor is a{" "}
          <span className="serif" style={{ color: accentColor }}>
            layer of context
          </span>
          .
        </h2>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div
            style={{
              position: "absolute",
              left: 6,
              top: 8,
              bottom: 8,
              width: 1,
              background: "rgba(240,184,64,0.3)",
            }}
          />
          {ROLES.map((r, i) => {
            // Distribute roles evenly across the full progress range so
            // the LAST role peaks at progress = 1, leaving no dead scroll
            // tail after the timeline finishes.
            const pivot = i / (ROLES.length - 1);
            const active = Math.abs(progress - pivot) < 0.14;
            return (
              <div
                key={r.year + r.org}
                style={{
                  position: "relative",
                  marginBottom: 22,
                  opacity: active ? 1 : 0.55,
                  transition: "opacity 0.2s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -24,
                    top: 6,
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: active ? accentColor : "transparent",
                    border: `2px solid ${accentColor}`,
                    boxShadow: active ? `0 0 12px ${accentColor}` : "none",
                  }}
                />
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: accentColor,
                  }}
                >
                  {r.year}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 19,
                    fontWeight: 500,
                    color: "#efe9dc",
                    marginTop: 2,
                  }}
                >
                  {r.role}{" "}
                  <span
                    style={{ color: "rgba(239,233,220,0.5)", fontWeight: 400 }}
                  >
                    · {r.org}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(239,233,220,0.6)",
                    marginTop: 4,
                  }}
                >
                  {r.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </LandmarkFrame>
  );
}

export const ExperienceLandmark = memo(ExperienceLandmarkImpl);
