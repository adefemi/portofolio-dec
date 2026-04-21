export const ISO_COLORS = {
  paper: "#efe9dc",
  paper2: "#e3dccb",
  paper3: "#cfc6b0",
  ink: "#0a1030",
  inkSoft: "#1a2150",
  amber: "#f0b840",
  amberDeep: "#c88823",
  cyan: "#5ad6ff",
  rust: "#c2573a",
  moss: "#4b7c5f",
  wood: "#a26e3e",
  woodDark: "#6b4522",
  green: "#6fa87a",
} as const;

export type IsoColor = keyof typeof ISO_COLORS;
