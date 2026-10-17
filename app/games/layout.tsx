import Link from "next/link";
import "./games.css";

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="arcade">
      <header className="topbar topbar--static">
        <Link href="/" className="brand">
          <span className="brand-dot" aria-hidden />
          Adefemi Oseni
        </Link>
        <nav aria-label="Site" className="topnav">
          <Link href="/">Home</Link>
          <Link href="/games" aria-current="true">
            Games
          </Link>
          <a href="https://www.youtube.com/@AdefemiGreat" target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
        </nav>
      </header>
      {children}
    </div>
  );
}
