import { memo } from "react";
import { ISO_COLORS } from "./colors";

const ENTRIES = [
  {
    y: 80,
    label: "2024",
    role: "Senior Software Eng.",
    org: "Bleacher Report",
    side: "L" as const,
  },
  {
    y: 160,
    label: "2022",
    role: "Founder",
    org: "Djuix.io",
    side: "R" as const,
  },
  {
    y: 240,
    label: "2021",
    role: "Backend Engineer",
    org: "RETINA-AI Health",
    side: "L" as const,
  },
  {
    y: 320,
    label: "2019",
    role: "Senior Frontend",
    org: "Kodobe",
    side: "R" as const,
  },
  {
    y: 400,
    label: "2017",
    role: "Web Developer",
    org: "Achievers Univ.",
    side: "L" as const,
  },
];

const CARD_W = 200;
const CARD_H = 52;
const TIMELINE_X = 360;

function TimelineTowerSceneImpl() {
  const C = ISO_COLORS;
  return (
    <svg
      viewBox="0 0 720 580"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      aria-hidden
    >
      <polygon
        points="360,490 660,540 360,560 60,540"
        fill={C.paper2}
        opacity="0.35"
      />
      <polygon
        points="360,490 660,540 660,544 360,564"
        fill={C.paper3}
        opacity="0.3"
      />

      <line
        x1={TIMELINE_X}
        y1="50"
        x2={TIMELINE_X}
        y2="490"
        stroke={C.amber}
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {ENTRIES.map((e, i) => {
        const isLeft = e.side === "L";
        const cardX = isLeft ? 60 : 460;
        const cardY = e.y - CARD_H / 2;
        const connectorStart = isLeft ? cardX + CARD_W : cardX;
        return (
          <g key={i}>
            <line
              x1={TIMELINE_X}
              y1={e.y}
              x2={connectorStart}
              y2={e.y}
              stroke={C.amber}
              strokeWidth="0.8"
              opacity="0.55"
            />

            <polygon
              points={`${cardX + 8},${cardY + CARD_H} ${cardX + CARD_W + 8},${cardY + CARD_H} ${cardX + CARD_W},${cardY + CARD_H + 7} ${cardX},${cardY + CARD_H + 7}`}
              fill={C.ink}
              opacity="0.4"
            />

            <rect
              x={cardX}
              y={cardY}
              width={CARD_W}
              height={CARD_H}
              fill={C.paper}
              stroke={C.paper3}
              strokeWidth="0.6"
              rx="1"
            />

            <line
              x1={cardX}
              y1={cardY + 18}
              x2={cardX + CARD_W}
              y2={cardY + 18}
              stroke={C.paper3}
              strokeWidth="0.5"
              opacity="0.7"
            />

            <text
              x={cardX + 12}
              y={cardY + 13}
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill={C.amberDeep}
              letterSpacing="0.2em"
            >
              {e.label}
            </text>

            <text
              x={cardX + 12}
              y={cardY + 32}
              fontFamily="var(--font-sans)"
              fontSize="12"
              fontWeight="600"
              fill={C.ink}
            >
              {e.role}
            </text>

            <text
              x={cardX + 12}
              y={cardY + 46}
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill={C.inkSoft}
              opacity="0.75"
            >
              {e.org}
            </text>

            <circle cx={TIMELINE_X} cy={e.y} r="4.5" fill={C.amber} />
            <circle cx={TIMELINE_X} cy={e.y} r="2" fill={C.paper} />
          </g>
        );
      })}

      <circle cx={TIMELINE_X} cy="50" r="6" fill={C.amber} />
      <text
        x={TIMELINE_X + 14}
        y="54"
        fontFamily="var(--font-mono)"
        fontSize="10"
        fill={C.amber}
        letterSpacing="0.2em"
      >
        NOW
      </text>

      <circle cx={TIMELINE_X} cy="490" r="4" fill={C.amber} opacity="0.4" />
    </svg>
  );
}

export const TimelineTowerScene = memo(TimelineTowerSceneImpl);
