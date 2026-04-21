import { memo } from "react";
import { ISO_COLORS } from "./colors";

function DeskSceneImpl() {
  const C = ISO_COLORS;
  return (
    <svg
      viewBox="0 0 600 520"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <pattern
          id="grid-floor"
          x="0"
          y="0"
          width="40"
          height="23"
          patternUnits="userSpaceOnUse"
          patternTransform="matrix(1 0.5 -1 0.5 0 0)"
        >
          <path
            d="M 0 0 L 40 0 M 0 0 L 0 23"
            stroke="rgba(240,184,64,0.12)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      <polygon points="300,120 560,250 300,380 40,250" fill={C.paper2} />
      <polygon points="300,120 560,250 300,380 40,250" fill="url(#grid-floor)" />
      <polyline
        points="40,250 300,380 560,250"
        fill="none"
        stroke={C.ink}
        strokeWidth="2"
      />

      <polygon points="300,200 480,290 300,380 120,290" fill={C.rust} opacity="0.9" />
      <polygon
        points="300,210 470,295 300,380 130,295"
        fill="none"
        stroke={C.amber}
        strokeWidth="1"
        opacity="0.6"
      />

      <polygon points="200,220 400,320 320,360 120,260" fill={C.wood} />
      <polygon points="120,260 320,360 320,400 120,300" fill={C.woodDark} />
      <polygon points="320,360 400,320 400,360 320,400" fill="#8a5a30" />
      <polygon
        points="200,220 400,320 320,360 120,260"
        fill="none"
        stroke={C.ink}
        strokeWidth="1.5"
      />

      <polygon points="230,200 330,250 325,255 225,205" fill={C.ink} />
      <polygon points="225,205 325,255 325,210 225,160" fill={C.ink} />
      <polygon points="230,165 320,210 320,248 230,203" fill={C.cyan} opacity="0.85" />
      <g opacity="0.7">
        <line x1="240" y1="178" x2="290" y2="203" stroke={C.paper} strokeWidth="1.2" />
        <line x1="240" y1="185" x2="305" y2="217" stroke={C.paper} strokeWidth="1.2" />
        <line x1="250" y1="195" x2="295" y2="218" stroke={C.amber} strokeWidth="1.2" />
        <line x1="240" y1="205" x2="285" y2="227" stroke={C.paper} strokeWidth="1.2" />
        <line x1="240" y1="213" x2="310" y2="248" stroke={C.paper} strokeWidth="1.2" />
      </g>
      <polygon points="270,250 280,255 280,265 270,260" fill={C.ink} />

      <polygon points="190,260 300,315 295,322 185,267" fill={C.paper} />
      <polygon points="190,260 300,315 300,318 190,263" fill={C.paper3} />

      <g>
        <ellipse cx="340" cy="286" rx="12" ry="5" fill={C.amber} />
        <path
          d="M 328 286 L 328 298 Q 328 308 340 310 Q 352 308 352 298 L 352 286"
          fill={C.amberDeep}
        />
        <ellipse cx="340" cy="286" rx="12" ry="5" fill={C.paper} opacity="0.3" />
        <path
          d="M 352 290 Q 360 290 360 296 Q 360 302 352 302"
          fill="none"
          stroke={C.amberDeep}
          strokeWidth="2"
        />
        <path
          d="M 336 278 Q 338 270 336 264 Q 334 258 338 252"
          stroke={C.paper}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 342 278 Q 344 270 342 264"
          stroke={C.paper}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        >
          <animate
            attributeName="opacity"
            values="0.5;0.2;0.5"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      <polygon points="370,265 420,290 415,295 365,270" fill={C.paper} />
      <polygon points="370,265 420,290 420,293 370,268" fill={C.paper3} />
      <line x1="378" y1="272" x2="405" y2="286" stroke={C.ink} strokeWidth="0.5" />
      <line x1="378" y1="276" x2="400" y2="287" stroke={C.ink} strokeWidth="0.5" />

      <g>
        <polygon points="230,380 310,420 310,470 230,430" fill={C.ink} />
        <polygon points="230,380 310,420 300,425 220,385" fill={C.inkSoft} />
        <polygon points="260,350 290,365 290,405 260,390" fill={C.ink} />
      </g>

      <g>
        <line x1="440" y1="290" x2="440" y2="230" stroke={C.ink} strokeWidth="2" />
        <line x1="440" y1="230" x2="470" y2="210" stroke={C.ink} strokeWidth="2" />
        <polygon points="470,210 490,220 482,232 462,222" fill={C.amber} />
        <polygon points="470,210 490,220 486,225 466,215" fill={C.amberDeep} />
        <circle cx="476" cy="224" r="3" fill={C.paper} />
        <ellipse cx="445" cy="305" rx="18" ry="6" fill={C.ink} opacity="0.2" />
      </g>

      <g>
        <polygon points="100,280 130,295 125,320 95,305" fill={C.woodDark} />
        <ellipse cx="115" cy="278" rx="15" ry="5" fill={C.moss} />
        <path d="M 108 278 Q 104 255 118 245 Q 128 255 122 278" fill={C.moss} />
        <path
          d="M 115 278 Q 115 258 128 252"
          stroke={C.green}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 112 278 Q 108 262 102 260"
          stroke={C.green}
          strokeWidth="2"
          fill="none"
        />
      </g>

      <g transform="translate(420, 150)">
        <rect
          x="0"
          y="0"
          width="110"
          height="40"
          rx="6"
          fill={C.paper}
          stroke={C.ink}
          strokeWidth="1.5"
        />
        <polygon
          points="20,40 30,52 35,40"
          fill={C.paper}
          stroke={C.ink}
          strokeWidth="1.5"
        />
        <text
          x="10"
          y="18"
          fontFamily="var(--font-mono)"
          fontSize="9"
          fill={C.ink}
          letterSpacing="0.1em"
        >
          {"// LAGOS, NG"}
        </text>
        <text
          x="10"
          y="32"
          fontFamily="var(--font-sans)"
          fontSize="13"
          fontWeight="600"
          fill={C.ink}
        >
          Hello, world.
        </text>
      </g>
    </svg>
  );
}

export const DeskScene = memo(DeskSceneImpl);
