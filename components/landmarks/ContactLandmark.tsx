"use client";

import { CSSProperties, memo, useCallback } from "react";
import { LandmarkFrame } from "./LandmarkFrame";
import { TransmissionScene } from "../scenes/TransmissionScene";

interface Channel {
  k: string;
  v: string;
  href: string;
}

const CHANNELS: ReadonlyArray<Channel> = [
  { k: "EMAIL", v: "oseni.adefemigreat@gmail.com", href: "mailto:oseni.adefemigreat@gmail.com" },
  { k: "GITHUB", v: "@adefemi", href: "https://github.com/adefemi" },
  { k: "YOUTUBE", v: "@AdefemiGreat", href: "https://www.youtube.com/@AdefemiGreat" },
  { k: "LINKEDIN", v: "Adefemi Oseni", href: "https://linkedin.com/in/adefemi-oseni" },
  { k: "X", v: "@GreatAdefemi", href: "https://x.com/GreatAdefemi" },
];

interface ContactLandmarkProps {
  accentColor: string;
}

function ContactLandmarkImpl({ accentColor }: ContactLandmarkProps) {
  const linkBase: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "96px 1fr auto",
    alignItems: "center",
    gap: 16,
    padding: "14px 18px",
    background: "rgba(239,233,220,0.04)",
    border: "1px solid rgba(239,233,220,0.12)",
    borderRadius: 4,
    textDecoration: "none",
    color: "#efe9dc",
    transition: "background 0.15s, border-color 0.15s",
  };

  const onEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.background = "rgba(240,184,64,0.08)";
      e.currentTarget.style.borderColor = accentColor;
    },
    [accentColor]
  );

  const onLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.background = "rgba(239,233,220,0.04)";
    e.currentTarget.style.borderColor = "rgba(239,233,220,0.12)";
  }, []);

  return (
    <LandmarkFrame label="CONTACT" coords={["51.50° N", "000.12° W"]} index={4} total={5}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "min(100%, 560px)" }}>
          <TransmissionScene />
        </div>
      </div>
      <div style={{ maxWidth: 520 }}>
        <div className="eyebrow" style={{ color: accentColor }}>
          OPEN FREQUENCY
        </div>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "clamp(36px, 3.6vw, 56px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            margin: "16px 0 24px",
          }}
        >
          Let&apos;s{" "}
          <span className="serif" style={{ color: accentColor }}>
            build something
          </span>{" "}
          that works.
        </h2>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.5,
            color: "rgba(239,233,220,0.7)",
            margin: "0 0 32px",
          }}
        >
          I&apos;m reachable by email, LinkedIn, or the usual channels. I reply to things
          that look like real conversations.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CHANNELS.map((c) => (
            <a
              key={c.k}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noreferrer noopener" : undefined}
              style={linkBase}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
            >
              <span
                className="mono"
                style={{ fontSize: 10, letterSpacing: "0.2em", color: accentColor }}
              >
                {c.k}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 15 }}>{c.v}</span>
              <span className="mono" style={{ fontSize: 14, color: accentColor }}>
                →
              </span>
            </a>
          ))}
        </div>
        <div
          className="mono"
          style={{
            marginTop: 40,
            fontSize: 10,
            letterSpacing: "0.22em",
            color: "rgba(239,233,220,0.35)",
            textAlign: "center",
          }}
        >
          END OF TRANSMISSION · THX FOR SCROLLING
        </div>
      </div>
    </LandmarkFrame>
  );
}

export const ContactLandmark = memo(ContactLandmarkImpl);
