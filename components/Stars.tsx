"use client";

import { memo, useMemo } from "react";

interface StarsProps {
  count?: number;
  seed?: number;
}

interface StarRecord {
  x: number;
  y: number;
  r: number;
  o: number;
}

function generateStars(count: number, seed: number): StarRecord[] {
  let s = seed;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const out: StarRecord[] = new Array(count);
  for (let i = 0; i < count; i++) {
    out[i] = {
      x: next() * 100,
      y: next() * 100,
      r: 0.3 + next() * 1.1,
      o: 0.3 + next() * 0.7,
    };
  }
  return out;
}

function StarsImpl({ count = 140, seed = 7 }: StarsProps) {
  const stars = useMemo(() => generateStars(count, seed), [count, seed]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r * 0.08}
          fill="#f4eed4"
          opacity={s.o}
        />
      ))}
    </svg>
  );
}

export const Stars = memo(StarsImpl);
