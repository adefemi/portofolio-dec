import { memo } from "react";
import { ISO_COLORS } from "./colors";

function WorkshopSceneImpl() {
  const C = ISO_COLORS;
  return (
    <svg
      viewBox="0 0 600 520"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      aria-hidden
    >
      <polygon points="300,100 560,230 300,360 40,230" fill={C.paper2} />
      <polygon
        points="300,100 560,230 300,360 40,230"
        fill="none"
        stroke={C.ink}
        strokeWidth="1.5"
      />

      <polygon points="150,200 450,350 450,380 150,230" fill={C.woodDark} />
      <polygon points="150,200 450,350 430,360 130,210" fill={C.wood} />

      <g transform="translate(170,215)">
        <polygon points="0,0 90,45 80,55 -10,10" fill={C.cyan} opacity="0.85" />
        <polygon
          points="0,0 90,45 80,55 -10,10"
          fill="none"
          stroke={C.ink}
          strokeWidth="1"
        />
        <line x1="10" y1="10" x2="70" y2="40" stroke={C.paper} strokeWidth="0.6" />
        <line x1="5" y1="18" x2="65" y2="48" stroke={C.paper} strokeWidth="0.6" />
        <circle cx="50" cy="30" r="6" fill="none" stroke={C.paper} strokeWidth="0.8" />
      </g>

      <g transform="translate(260, 190)">
        <polygon points="0,0 140,70 140,80 0,10" fill={C.wood} />
        <polygon points="10,0 40,15 40,-20 10,-35" fill={C.amber} />
        <polygon points="10,0 40,15 30,20 0,5" fill={C.amberDeep} />
        <polygon points="55,28 85,43 85,8 55,-7" fill={C.rust} />
        <polygon points="55,28 85,43 75,48 45,33" fill="#a8462d" />
        <ellipse cx="115" cy="45" rx="12" ry="4" fill={C.moss} />
        <path
          d="M 103 45 L 103 20 Q 103 16 115 16 Q 127 16 127 20 L 127 45"
          fill={C.moss}
        />
        <ellipse cx="115" cy="20" rx="12" ry="4" fill="#5f9b70" />
      </g>

      <g>
        <line x1="380" y1="50" x2="380" y2="140" stroke={C.ink} strokeWidth="1" />
        <polygon points="360,140 400,140 395,160 365,160" fill={C.ink} />
        <ellipse cx="380" cy="162" rx="18" ry="4" fill={C.amber} opacity="0.8" />
        <ellipse cx="380" cy="162" rx="40" ry="10" fill={C.amber} opacity="0.15" />
      </g>

      <g transform="translate(70, 140)">
        <polygon points="0,0 140,70 140,130 0,60" fill={C.ink} />
        <polygon points="0,0 140,70 135,73 -5,3" fill={C.inkSoft} />
        <circle cx="8" cy="8" r="2" fill={C.rust} />
        <circle cx="14" cy="11" r="2" fill={C.amber} />
        <circle cx="20" cy="14" r="2" fill={C.moss} />
        <line x1="10" y1="22" x2="70" y2="52" stroke={C.cyan} strokeWidth="1" />
        <line x1="10" y1="30" x2="90" y2="70" stroke={C.paper} strokeWidth="0.8" />
        <line x1="10" y1="38" x2="60" y2="63" stroke={C.paper} strokeWidth="0.8" />
        <line x1="10" y1="46" x2="110" y2="96" stroke={C.amber} strokeWidth="1" />
        <line x1="10" y1="54" x2="80" y2="89" stroke={C.paper} strokeWidth="0.8" />
      </g>

      <g transform="translate(430, 250)">
        <polygon points="0,0 60,30 60,60 0,30" fill={C.wood} />
        <polygon points="0,0 60,30 50,35 -10,5" fill={C.woodDark} />
        <polygon points="0,-28 60,2 60,0 0,-30" fill="#8a5a30" />
        <line x1="15" y1="10" x2="15" y2="38" stroke={C.ink} strokeWidth="0.6" />
        <line x1="30" y1="18" x2="30" y2="46" stroke={C.ink} strokeWidth="0.6" />
        <line x1="45" y1="25" x2="45" y2="53" stroke={C.ink} strokeWidth="0.6" />
      </g>
    </svg>
  );
}

export const WorkshopScene = memo(WorkshopSceneImpl);
