import { memo } from "react";
import { ISO_COLORS } from "./colors";

function TransmissionSceneImpl() {
  const C = ISO_COLORS;
  return (
    <svg
      viewBox="0 0 600 520"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      aria-hidden
    >
      <polygon points="300,350 560,450 300,500 40,450" fill={C.paper2} opacity="0.4" />

      <polygon points="260,320 340,360 340,440 260,400" fill={C.ink} />
      <polygon points="260,320 340,360 330,365 250,325" fill={C.inkSoft} />

      <line x1="300" y1="340" x2="300" y2="100" stroke={C.amber} strokeWidth="2" />
      <line x1="300" y1="200" x2="260" y2="180" stroke={C.amber} strokeWidth="1.2" />
      <line x1="300" y1="200" x2="340" y2="180" stroke={C.amber} strokeWidth="1.2" />
      <line x1="300" y1="160" x2="270" y2="145" stroke={C.amber} strokeWidth="1.2" />
      <line x1="300" y1="160" x2="330" y2="145" stroke={C.amber} strokeWidth="1.2" />
      <line x1="300" y1="120" x2="280" y2="110" stroke={C.amber} strokeWidth="1.2" />
      <line x1="300" y1="120" x2="320" y2="110" stroke={C.amber} strokeWidth="1.2" />

      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx="300"
          cy="100"
          r="20"
          fill="none"
          stroke={C.cyan}
          strokeWidth="1.5"
        >
          <animate
            attributeName="r"
            values="20;120;20"
            dur="3s"
            begin={`${i * 1}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0;0.8"
            dur="3s"
            begin={`${i * 1}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <circle cx="300" cy="100" r="6" fill={C.amber} />
      <circle cx="300" cy="100" r="3" fill={C.paper} />

      <g transform="translate(400, 240)">
        <polygon points="0,0 70,30 70,60 0,30" fill={C.paper} />
        <polygon points="0,0 35,30 70,0" fill="none" stroke={C.ink} strokeWidth="1.2" />
        <polygon
          points="0,0 70,30 70,60 0,30"
          fill="none"
          stroke={C.ink}
          strokeWidth="1.2"
        />
        <path
          d="M -20 20 Q -30 15 -40 25"
          stroke={C.amber}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
      </g>
    </svg>
  );
}

export const TransmissionScene = memo(TransmissionSceneImpl);
