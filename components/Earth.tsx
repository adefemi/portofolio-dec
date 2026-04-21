"use client";

import { memo, useMemo } from "react";

const CONTINENTS: ReadonlyArray<string> = [
  "M 212 184 Q 224 172 236 180 Q 246 192 248 212 Q 252 232 244 250 Q 236 264 226 268 Q 214 270 208 256 Q 200 240 202 220 Q 204 200 212 184 Z",
  "M 206 158 Q 220 152 234 156 Q 240 164 232 170 Q 218 176 208 170 Q 202 166 206 158 Z",
  "M 240 150 Q 270 142 298 152 Q 312 164 308 182 Q 294 196 272 194 Q 252 188 244 172 Q 238 160 240 150 Z",
  "M 104 140 Q 130 128 156 138 Q 172 152 168 176 Q 156 194 136 196 Q 116 190 104 174 Q 96 158 104 140 Z",
  "M 148 210 Q 166 204 178 220 Q 184 244 172 266 Q 158 278 146 268 Q 138 248 142 228 Q 144 214 148 210 Z",
  "M 300 230 Q 320 224 332 236 Q 332 248 318 252 Q 302 248 298 240 Q 296 232 300 230 Z",
  "M 180 116 Q 196 112 202 122 Q 200 132 188 134 Q 178 130 180 116 Z",
];

interface Landmark {
  id: number;
  label: string;
  lon: number;
  lat: number;
  city: string;
}

const LANDMARKS: ReadonlyArray<Landmark> = [
  { id: 0, label: "ABOUT", lon: 3.5, lat: 6.5, city: "LAGOS" },
  { id: 1, label: "PROJECTS", lon: -74, lat: 40.7, city: "NYC" },
  { id: 2, label: "EXPERIENCE", lon: -95, lat: 30, city: "HOUSTON" },
  { id: 3, label: "SKILLS", lon: 139, lat: 35.6, city: "TOKYO" },
  { id: 4, label: "CONTACT", lon: 0, lat: 51.5, city: "LONDON" },
];

interface EarthProps {
  size?: number;
  rotation?: number;
  tilt?: number;
  showLandmarks?: boolean;
  activeLandmark?: number;
  /**
   * When false, skip the SMIL pulse animations + drop-shadow filter.
   * The drop-shadow filter is brutally expensive when this layer is
   * scaled (e.g. during the zoom phase) so we disable it whenever the
   * globe isn't the focal element.
   */
  pulse?: boolean;
}

function EarthImpl({
  size = 560,
  rotation = 0,
  tilt = -14,
  showLandmarks = true,
  activeLandmark = -1,
  pulse = true,
}: EarthProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;

  const projected = useMemo(() => {
    const round = (n: number) => Math.round(n * 100) / 100;
    return LANDMARKS.map((lm) => {
      const lam = ((lm.lon + rotation) * Math.PI) / 180;
      const phi = (lm.lat * Math.PI) / 180;
      const x = Math.cos(phi) * Math.sin(lam);
      const y = -Math.sin(phi);
      const z = Math.cos(phi) * Math.cos(lam);
      return {
        ...lm,
        x: round(cx + x * r),
        y: round(cy + y * r),
        z: round(z),
        visible: z > -0.1,
      };
    });
  }, [rotation, cx, cy, r]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{
        display: "block",
        overflow: "visible",
        transform: `rotate(${tilt}deg)`,
        filter: pulse ? "drop-shadow(0 0 60px rgba(90, 180, 255, 0.15))" : "none",
      }}
      aria-hidden
    >
      <defs>
        <radialGradient id="ocean" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#3b7ec4" />
          <stop offset="35%" stopColor="#1f4d88" />
          <stop offset="70%" stopColor="#0e2a55" />
          <stop offset="100%" stopColor="#050d22" />
        </radialGradient>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a8a5f" />
          <stop offset="60%" stopColor="#2d6a4f" />
          <stop offset="100%" stopColor="#1a4533" />
        </linearGradient>
        <radialGradient id="atmo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="70%" stopColor="rgba(90, 180, 255, 0)" />
          <stop offset="85%" stopColor="rgba(90, 180, 255, 0.35)" />
          <stop offset="100%" stopColor="rgba(90, 180, 255, 0)" />
        </radialGradient>
        <radialGradient id="rim" cx="0.5" cy="0.5" r="0.5">
          <stop offset="92%" stopColor="rgba(255,255,255,0)" />
          <stop offset="98%" stopColor="rgba(180,220,255,0.5)" />
          <stop offset="100%" stopColor="rgba(180,220,255,0)" />
        </radialGradient>
        <radialGradient id="night" cx="0.75" cy="0.7" r="0.7">
          <stop offset="40%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <clipPath id="globeClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      <circle cx={cx} cy={cy} r={r * 1.25} fill="url(#atmo)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#ocean)" />

      <g clipPath="url(#globeClip)">
        <g
          style={{
            transform: `rotate(${rotation * 0.6}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
          }}
        >
          {CONTINENTS.map((d, i) => (
            <path key={i} d={d} fill="url(#land)" opacity="0.92" />
          ))}
          <circle cx={290} cy={210} r={4} fill="#2d6a4f" opacity="0.8" />
          <circle cx={185} cy={190} r={3} fill="#2d6a4f" opacity="0.7" />
          <ellipse cx={260} cy={260} rx={5} ry={2} fill="#2d6a4f" opacity="0.7" />
        </g>

        <g stroke="rgba(180, 220, 255, 0.12)" strokeWidth="0.6" fill="none">
          {[0, 30, 60, 90, 120, 150].map((a) => (
            <ellipse
              key={a}
              cx={cx}
              cy={cy}
              rx={r * Math.abs(Math.cos((a * Math.PI) / 180))}
              ry={r}
              transform={`rotate(${a} ${cx} ${cy})`}
            />
          ))}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const ry = r * Math.sin(Math.abs((lat * Math.PI) / 180));
            const y = cy - r * Math.sin((lat * Math.PI) / 180);
            return (
              <ellipse
                key={lat}
                cx={cx}
                cy={y}
                rx={r * Math.cos((lat * Math.PI) / 180)}
                ry={ry * 0.15}
              />
            );
          })}
        </g>

        <circle cx={cx} cy={cy} r={r} fill="url(#night)" />
      </g>

      <circle cx={cx} cy={cy} r={r} fill="url(#rim)" />

      {showLandmarks &&
        projected.map((lm, i) => {
          if (!lm.visible) return null;
          const isActive = activeLandmark === i;
          const opacity = Math.round(Math.max(0.2, lm.z + 0.1) * 100) / 100;
          return (
            <g key={lm.id} opacity={opacity}>
              <circle
                cx={lm.x}
                cy={lm.y}
                r={isActive ? 14 : 6}
                fill="none"
                stroke={isActive ? "#f0b840" : "#5ad6ff"}
                strokeWidth="1"
                opacity="0.6"
              >
                {pulse && (
                  <>
                    <animate
                      attributeName="r"
                      values={`${isActive ? 8 : 4};${isActive ? 18 : 10};${isActive ? 8 : 4}`}
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.7;0;0.7"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>
              <circle
                cx={lm.x}
                cy={lm.y}
                r={isActive ? 4.5 : 3}
                fill={isActive ? "#f0b840" : "#5ad6ff"}
              />
              <circle cx={lm.x} cy={lm.y} r={isActive ? 2 : 1.3} fill="#fff" />
              {isActive && (
                <g
                  style={{
                    transform: `rotate(${-tilt}deg)`,
                    transformOrigin: `${lm.x}px ${lm.y}px`,
                  }}
                >
                  <line
                    x1={lm.x}
                    y1={lm.y}
                    x2={lm.x + 40}
                    y2={lm.y - 40}
                    stroke="#f0b840"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={lm.x + 44}
                    y={lm.y - 42}
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fill="#f0b840"
                    letterSpacing="0.15em"
                  >
                    {lm.label}
                  </text>
                  <text
                    x={lm.x + 44}
                    y={lm.y - 30}
                    fontFamily="var(--font-mono)"
                    fontSize="7"
                    fill="rgba(240,184,64,0.6)"
                    letterSpacing="0.1em"
                  >
                    {lm.city}
                  </text>
                </g>
              )}
            </g>
          );
        })}
    </svg>
  );
}

export const Earth = memo(EarthImpl);
