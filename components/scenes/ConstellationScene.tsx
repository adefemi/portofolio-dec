import { memo } from "react";
import { ISO_COLORS } from "./colors";

type Cat = "lang" | "fw" | "data" | "cloud";

interface Star {
  x: number;
  y: number;
  label: string;
  size: number;
  cat: Cat;
}

const STARS: ReadonlyArray<Star> = [
  { x: 180, y: 120, label: "Go", size: 1.3, cat: "lang" },
  { x: 280, y: 90, label: "Python", size: 1.5, cat: "lang" },
  { x: 380, y: 130, label: "TypeScript", size: 1.5, cat: "lang" },
  { x: 450, y: 200, label: "Java", size: 1.1, cat: "lang" },
  { x: 140, y: 220, label: "Django", size: 1.3, cat: "fw" },
  { x: 240, y: 180, label: "Next.js", size: 1.4, cat: "fw" },
  { x: 340, y: 230, label: "React", size: 1.5, cat: "fw" },
  { x: 420, y: 300, label: "Node.js", size: 1.2, cat: "fw" },
  { x: 170, y: 320, label: "PostgreSQL", size: 1.2, cat: "data" },
  { x: 280, y: 350, label: "GraphQL", size: 1.4, cat: "data" },
  { x: 390, y: 380, label: "Redis", size: 1.1, cat: "data" },
  { x: 250, y: 420, label: "AWS", size: 1.2, cat: "cloud" },
  { x: 360, y: 440, label: "Docker", size: 1.1, cat: "cloud" },
];

const CONNECTIONS: ReadonlyArray<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 7], [4, 5], [5, 6], [6, 7],
  [8, 9], [9, 10], [11, 12], [1, 5], [2, 6], [9, 6], [9, 11], [10, 12],
];

const CAT_COLOR: Record<Cat, string> = {
  lang: ISO_COLORS.amber,
  fw: ISO_COLORS.cyan,
  data: "#ff9bb3",
  cloud: "#b4a0ff",
};

function ConstellationSceneImpl() {
  const C = ISO_COLORS;
  return (
    <svg
      viewBox="0 0 600 520"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      aria-hidden
    >
      {CONNECTIONS.map(([a, b], i) => (
        <line
          key={i}
          x1={STARS[a].x}
          y1={STARS[a].y}
          x2={STARS[b].x}
          y2={STARS[b].y}
          stroke="rgba(240,184,64,0.25)"
          strokeWidth="0.8"
        />
      ))}
      {STARS.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={10 * s.size} fill={CAT_COLOR[s.cat]} opacity="0.1" />
          <circle cx={s.x} cy={s.y} r={4 * s.size} fill={CAT_COLOR[s.cat]}>
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur={`${2 + i * 0.2}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle cx={s.x} cy={s.y} r={1.5} fill="#fff" />
          <text
            x={s.x + 8 * s.size}
            y={s.y + 4}
            fontFamily="var(--font-mono)"
            fontSize="10"
            fill={C.paper}
            letterSpacing="0.05em"
          >
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export const ConstellationScene = memo(ConstellationSceneImpl);
