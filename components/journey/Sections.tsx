import type { ReactNode } from "react";
import {
  ABOUT,
  CHANNELS,
  CONTACT_INTRO,
  EXPERIENCE_INTRO,
  HERO,
  PLATES,
  PROJECTS,
  PROJECTS_INTRO,
  ROLES,
  SKILLS_INTRO,
  SKILL_BUCKETS,
} from "./content";

type PlateKey = keyof typeof PLATES;

function Title({ parts, id }: { parts: readonly string[]; id: string }) {
  const [pre, em, post] = parts;
  const tight = post.startsWith(",") || post.startsWith(".");
  return (
    <h2 id={id} className="sign-title">
      {pre} <em>{em}</em>
      {tight ? post : ` ${post}`}
    </h2>
  );
}

/**
 * A landmark signboard. Server-rendered in the page flow (readable without
 * JavaScript or WebGL); on capable screens the 3D scene lifts it into the
 * world and stands it on its mount.
 */
function Sign({
  stop,
  plate,
  variant,
  children,
}: {
  stop: number;
  plate: PlateKey;
  variant: string;
  children: ReactNode;
}) {
  const p = PLATES[plate];
  return (
    <article className={`sign sign--${variant}`} data-sign={stop} aria-labelledby={`${plate}-title`}>
      <div className="sign-plate">
        <span className="sign-no">
          <span aria-hidden>▲</span> Landmark {p.n}
        </span>
        <span className="sign-name">{p.name}</span>
        <span className="sign-reading">{p.reading}</span>
      </div>
      <div className="sign-face">{children}</div>
      <span className="sign-bolt sign-bolt--tl" aria-hidden />
      <span className="sign-bolt sign-bolt--tr" aria-hidden />
      <span className="sign-bolt sign-bolt--bl" aria-hidden />
      <span className="sign-bolt sign-bolt--br" aria-hidden />
    </article>
  );
}

function Transit({ vh }: { vh: number }) {
  return <div className="transit" style={{ height: `${vh}svh` }} aria-hidden />;
}

export function Sections() {
  return (
    <>
      <section id="top" className="stop stop--hero">
        <div className="hero">
          <p className="eyebrow">◉ {HERO.eyebrow}</p>
          <h1 className="hero-name">
            {HERO.first} <em>{HERO.last}</em>
          </h1>
          <p className="hero-tag">
            {HERO.tagline} <span className="accent">{HERO.location}</span>
          </p>
          <p className="hero-hint">Scroll to descend ▾</p>
        </div>
      </section>

      <Transit vh={160} />

      <section id="about" className="stop stop--l">
        <Sign stop={1} plate="about" variant="about">
          <Title parts={[ABOUT.title[0], ABOUT.title[1], ABOUT.title[2]]} id="about-title" />
          <p className="sign-body">{ABOUT.body}</p>
          <dl className="stats">
            {ABOUT.stats.map((s) => (
              <div key={s.v}>
                <dt>{s.v}</dt>
                <dd>{s.k}</dd>
              </div>
            ))}
          </dl>
        </Sign>
      </section>

      <Transit vh={140} />

      <section id="projects" className="stop stop--r">
        <Sign stop={2} plate="projects" variant="projects">
          <Title parts={PROJECTS_INTRO.title} id="projects-title" />
          <ul className="projects">
            {PROJECTS.map((p) => (
              <li key={p.name} className="project" style={{ ["--p-accent" as string]: p.accent }}>
                <p className="project-tag">{p.tag}</p>
                <h3>{p.name}</h3>
                <p className="project-summary">{p.summary}</p>
                <ul className="chips" aria-label="Stack">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Sign>
      </section>

      <Transit vh={130} />

      <section id="experience" className="stop stop--l">
        <Sign stop={3} plate="experience" variant="experience">
          <Title parts={EXPERIENCE_INTRO.title} id="experience-title" />
          <ol className="timeline">
            {ROLES.map((r) => (
              <li key={r.year + r.org}>
                <span className="timeline-year">{r.year}</span>
                <span className="timeline-role">
                  {r.role} <span>· {r.org}</span>
                </span>
                <span className="timeline-note">{r.note}</span>
              </li>
            ))}
          </ol>
        </Sign>
      </section>

      <Transit vh={130} />

      <section id="skills" className="stop stop--r">
        <Sign stop={4} plate="skills" variant="skills">
          <Title parts={SKILLS_INTRO.title} id="skills-title" />
          <div className="skills">
            {SKILL_BUCKETS.map((b) => (
              <div key={b.label}>
                <h3>{b.label}</h3>
                <ul>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Sign>
      </section>

      <Transit vh={180} />

      <section id="contact" className="stop stop--l stop--last">
        <Sign stop={5} plate="contact" variant="contact">
          <Title parts={CONTACT_INTRO.title} id="contact-title" />
          <p className="sign-body">{CONTACT_INTRO.body}</p>
          <ul className="channels">
            {CHANNELS.map((c) => (
              <li key={c.k}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer noopener" : undefined}
                >
                  <span className="channel-k">{c.k}</span>
                  <span className="channel-v">{c.v}</span>
                  <span className="channel-arrow" aria-hidden>
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Sign>
      </section>
    </>
  );
}
