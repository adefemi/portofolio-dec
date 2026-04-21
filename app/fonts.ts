import { Space_Grotesk, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
  preload: true,
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
  preload: false,
});
