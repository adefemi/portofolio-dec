import type { Metadata } from "next";
import Link from "next/link";
import { GAMES, GAMES_INTRO, gameCover, youtubeUrl } from "@/components/games/games";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Play the games from the AdefemiGreat YouTube channel in your browser: Contra 3D, Gate Runner, Pin Rescue, Township Real and more.",
  alternates: { canonical: "/games" },
};

export default function GamesPage() {
  const [pre, em, post] = GAMES_INTRO.title;
  return (
    <main className="arcade-main">
      <section className="arcade-intro">
        <p className="eyebrow">◉ {GAMES_INTRO.eyebrow}</p>
        <h1 className="arcade-title">
          {pre} <em>{em}</em>
          {post}
        </h1>
        <p className="arcade-body">{GAMES_INTRO.body}</p>
      </section>

      <ul className="game-grid">
        {GAMES.map((g) => (
          <li key={g.slug} className="game-card" style={{ ["--p-accent" as string]: g.accent }}>
            <Link href={`/games/${g.slug}`} className="game-thumb" aria-label={`Play ${g.title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot in public/ */}
              <img src={gameCover(g.slug)} alt="" loading="lazy" width={1280} height={720} />
              <span className="game-play-badge" aria-hidden>
                ▶ Play
              </span>
            </Link>
            <div className="game-info">
              <p className="project-tag">{g.tag}</p>
              <h2>{g.title}</h2>
              <p className="project-summary">{g.summary}</p>
              <div className="game-actions">
                <Link href={`/games/${g.slug}`} className="btn btn--primary">
                  Play
                </Link>
                <a href={youtubeUrl(g.videos[0].id)} className="btn" target="_blank" rel="noopener noreferrer">
                  Watch the video
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
