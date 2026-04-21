import { memo } from "react";
import { LandmarkFrame } from "./LandmarkFrame";
import { ConstellationScene } from "../scenes/ConstellationScene";

const BUCKETS = [
  { label: "LANGUAGES", items: ["Go", "Python", "TypeScript", "Java", "JavaScript"] },
  { label: "FRAMEWORKS", items: ["Django", "Next.js", "React", "Node.js", "FastAPI"] },
  { label: "DATA", items: ["PostgreSQL", "GraphQL", "Redis", "MongoDB", "ElasticSearch"] },
  { label: "INFRA", items: ["AWS", "Docker", "Kubernetes", "Kafka"] },
] as const;

interface SkillsLandmarkProps {
  accentColor: string;
}

function SkillsLandmarkImpl({ accentColor }: SkillsLandmarkProps) {
  return (
    <LandmarkFrame label="SKILLS" coords={["35.68° N", "139.69° E"]} index={3} total={5}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "min(100%, 560px)" }}>
          <ConstellationScene />
        </div>
      </div>
      <div style={{ maxWidth: 520 }}>
        <div className="eyebrow" style={{ color: accentColor }}>
          THE CONSTELLATION · TOOLKIT
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
          Languages and tools that{" "}
          <span className="serif" style={{ color: accentColor }}>
            travel with me
          </span>
          .
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "22px 32px",
          }}
        >
          {BUCKETS.map((b) => (
            <div key={b.label}>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  color: accentColor,
                  marginBottom: 10,
                  paddingBottom: 8,
                  borderBottom: "1px solid rgba(240,184,64,0.2)",
                }}
              >
                {b.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {b.items.map((it) => (
                  <div
                    key={it}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      color: "rgba(239,233,220,0.85)",
                    }}
                  >
                    {it}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LandmarkFrame>
  );
}

export const SkillsLandmark = memo(SkillsLandmarkImpl);
