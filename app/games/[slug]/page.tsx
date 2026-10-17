import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GAMES, gameBySlug, gameCover, youtubeUrl } from "@/components/games/games";

export const dynamicParams = false;

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const game = gameBySlug((await params).slug);
  if (!game) return {};
  return {
    title: `Play ${game.title}`,
    description: game.summary,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: { images: [gameCover(game.slug)] },
  };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const game = gameBySlug((await params).slug);
  if (!game) notFound();
  const src = `/play/${game.slug}/index.html`;

  return (
    <main className="arcade-main">
      <p className="arcade-back">
        <Link href="/games">← All games</Link>
      </p>

      <div className={`game-stage game-stage--${game.orientation}`} style={{ ["--p-accent" as string]: game.accent }}>
        <iframe
          src={src}
          title={game.title}
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          loading="eager"
        />
      </div>

      <section className="game-meta" style={{ ["--p-accent" as string]: game.accent }}>
        <p className="project-tag">{game.tag}</p>
        <h1 className="arcade-title arcade-title--game">{game.title}</h1>
        <p className="arcade-body">{game.summary}</p>
        <p className="game-controls">
          <span>Controls</span> {game.controls}
        </p>
        <div className="game-actions">
          <a href={src} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
            Open full screen
          </a>
          {game.videos.map((v) => (
            <a key={v.id} href={youtubeUrl(v.id)} className="btn" target="_blank" rel="noopener noreferrer">
              ▶ {v.title}
            </a>
          ))}
        </div>
        <ul className="chips" aria-label="Built with">
          {game.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
