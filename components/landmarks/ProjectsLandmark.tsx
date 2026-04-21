import { memo } from "react";
import { LandmarkFrame } from "./LandmarkFrame";
import { WorkshopScene } from "../scenes/WorkshopScene";

interface Project {
  name: string;
  tag: string;
  summary: string;
  stack: string[];
  accent: string;
}

const PROJECTS: ReadonlyArray<Project> = [
  {
    name: "Djuix.io",
    tag: "FOUNDER · 2022 — PRESENT",
    summary:
      "A platform that streamlines Django project setup — spin up a production-ready backend in minutes, not days.",
    stack: ["Django", "Next.js", "Docker", "AWS"],
    accent: "#4b7c5f",
  },
  {
    name: "GraphQL Federation @ Bleacher Report",
    tag: "SENIOR · PLATFORM",
    summary:
      "Shipped federation upgrades that improved system reliability and dropped error rates. Built a caching service that meaningfully cut load times.",
    stack: ["Go", "GraphQL", "Redis", "Kubernetes"],
    accent: "#5ad6ff",
  },
  {
    name: "FinGreat",
    tag: "TUTORIAL SERIES",
    summary:
      "A real fintech app, built in public with GoLang + Next.js. Source on GitHub, episodes on YouTube.",
    stack: ["Go", "Next.js", "PostgreSQL"],
    accent: "#f0b840",
  },
  {
    name: "RETINA-AI Health",
    tag: "BACKEND ENGINEER",
    summary:
      "Backend for a cloud-based AI platform in healthcare. The kind of work where a 500 isn't just a metric.",
    stack: ["Python", "AWS", "FastAPI"],
    accent: "#c2573a",
  },
];

interface ProjectCardProps {
  p: Project;
  index: number;
  progress: number;
}

function ProjectCardImpl({ p, index, progress }: ProjectCardProps) {
  const slot = 1 / (PROJECTS.length + 1);
  const cardCenter = (index + 1) * slot;
  const delta = progress - cardCenter;
  const y = delta * -320;
  const opacity = Math.max(0.15, 1 - Math.abs(delta) * 3);
  const scale = 1 - Math.abs(delta) * 0.15;
  return (
    <div
      style={{
        transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
        opacity,
        willChange: "transform, opacity",
        transition: "transform 0.08s linear, opacity 0.08s linear",
        marginBottom: 24,
        padding: "28px 32px",
        background:
          "linear-gradient(180deg, rgba(239,233,220,0.06), rgba(239,233,220,0.02))",
        border: "1px solid rgba(239,233,220,0.12)",
        borderLeft: `3px solid ${p.accent}`,
        borderRadius: 4,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          color: p.accent,
          marginBottom: 10,
        }}
      >
        {p.tag}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 26,
          fontWeight: 500,
          margin: "0 0 10px",
          color: "#efe9dc",
          letterSpacing: "-0.01em",
        }}
      >
        {p.name}
      </h3>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: "rgba(239,233,220,0.7)",
          margin: "0 0 16px",
        }}
      >
        {p.summary}
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {p.stack.map((t) => (
          <span
            key={t}
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              padding: "4px 10px",
              border: "1px solid rgba(239,233,220,0.18)",
              borderRadius: 2,
              color: "rgba(239,233,220,0.65)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const ProjectCard = memo(ProjectCardImpl);

interface ProjectsLandmarkProps {
  progress: number;
  accentColor: string;
}

function ProjectsLandmarkImpl({ progress, accentColor }: ProjectsLandmarkProps) {
  return (
    <LandmarkFrame label="PROJECTS" coords={["40.71° N", "074.00° W"]} index={1} total={5}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "min(100%, 560px)" }}>
          <WorkshopScene />
        </div>
      </div>
      <div style={{ maxWidth: 520, display: "flex", flexDirection: "column" }}>
        <div className="eyebrow" style={{ color: accentColor }}>
          THE WORKSHOP · SELECTED WORK
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
          Things I&apos;ve built, shipped, or{" "}
          <span className="serif" style={{ color: accentColor }}>
            broken on purpose
          </span>
          .
        </h2>
        <div style={{ maxHeight: "60vh", overflow: "hidden", position: "relative" }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} p={p} index={i} progress={progress} />
          ))}
        </div>
      </div>
    </LandmarkFrame>
  );
}

export const ProjectsLandmark = memo(ProjectsLandmarkImpl);
