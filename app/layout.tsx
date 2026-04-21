import type { Metadata, Viewport } from "next";
import { spaceGrotesk, ibmPlexMono, instrumentSerif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://adefemi.dev"),
  title: {
    default: "Adefemi Oseni — Senior Software Engineer",
    template: "%s · Adefemi Oseni",
  },
  description:
    "Senior software engineer · full-stack explorer · shipping from Lagos, Nigeria. A decade of building backends, frontends, platforms — and one startup of his own.",
  keywords: [
    "Adefemi Oseni",
    "Senior Software Engineer",
    "Full-stack Engineer",
    "Go",
    "Python",
    "Next.js",
    "Django",
    "GraphQL",
    "Lagos",
    "Nigeria",
    "Djuix.io",
  ],
  authors: [{ name: "Adefemi Oseni" }],
  creator: "Adefemi Oseni",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://adefemi.dev",
    title: "Adefemi Oseni — Senior Software Engineer",
    description:
      "Senior software engineer · full-stack explorer · shipping from Lagos, Nigeria.",
    siteName: "Adefemi Oseni",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adefemi Oseni — Senior Software Engineer",
    description:
      "Senior software engineer · full-stack explorer · shipping from Lagos, Nigeria.",
    creator: "@GreatAdefemi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030611",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
