import { CSSProperties, ReactNode, memo } from "react";

interface LandmarkFrameProps {
  children: ReactNode;
  label: string;
  coords: [string, string];
  index: number;
  total: number;
}

const frameStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 40,
  padding: "80px 80px 120px",
  alignItems: "center",
};

const dotStyle: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "#f0b840",
  boxShadow: "0 0 12px #f0b840",
};

function LandmarkFrameImpl({ children, label, coords, index, total }: LandmarkFrameProps) {
  return (
    <div style={frameStyle}>
      {children}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 32,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div style={dotStyle} />
        <div
          className="mono"
          style={{ fontSize: 11, letterSpacing: "0.22em", color: "#f0b840" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {label}
        </div>
      </div>
      <div
        className="mono"
        style={{
          position: "absolute",
          top: 32,
          right: 32,
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "rgba(240,184,64,0.55)",
          textAlign: "right",
        }}
      >
        <div>LAT {coords[0]}</div>
        <div>LON {coords[1]}</div>
      </div>
    </div>
  );
}

export const LandmarkFrame = memo(LandmarkFrameImpl);
