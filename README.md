# Adefemi Oseni — Portfolio (Next.js)

A scroll-driven, single-page portfolio replicating the original `Adefemi Portfolio.html`
prototype as a fully typed Next.js 16 (App Router) project.

The site is one continuous narrative: an intro hero with a rotating SVG globe, a
"descend into Lagos" zoom, then five landmark scenes (About / Projects / Experience /
Skills / Contact) — each pairing a hand-drawn isometric SVG illustration with
accompanying copy.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production bundle
npm start        # serve production build
npm run lint     # eslint
```

Node 18.18+ required.

## Project structure

```
app/
  fonts.ts         next/font Google Fonts (Space Grotesk, IBM Plex Mono, Instrument Serif)
  globals.css      design tokens + reduced-motion support
  layout.tsx      <html> + SEO metadata + viewport
  page.tsx         server-rendered shell that mounts <Portfolio/>
components/
  Portfolio.tsx    main client component (scroll loop, dynamic landmark imports)
  Earth.tsx        SVG globe with continents, atmosphere, terminator shading
  Stars.tsx        deterministic starfield
  Hud.tsx          IntroHero, ZoomHUD, TopNav, ProgressRail, ScrollHint
  scenes/          5 isometric SVG scenes (Desk, Workshop, Tower, Constellation, Tower)
  landmarks/       5 content panels (About, Projects, Experience, Skills, Contact)
  types.ts         shared scroll-state types and section sizing constants
.reference/        the original HTML/JSX prototype, kept for reference
```

## Performance optimizations

- **Single requestAnimationFrame loop** coalesces scroll + resize events; state only
  updates when the computed phase actually changes.
- **`useSyncExternalStore`** for `prefers-reduced-motion` (no setState-in-effect).
- **`next/dynamic` + `ssr: false`** for the five landmark panels — only the active
  landmark is loaded and parsed in the browser.
- **`next/font`** self-hosts and preloads Space Grotesk / IBM Plex Mono with
  `font-display: swap`. Instrument Serif is loaded but not preloaded since it appears
  below the fold.
- **`React.memo`** on every leaf component (Earth, Stars, scenes, landmarks, HUD).
- **Deterministic floating-point projections** (rounded to 2 decimal places) eliminate
  server/client hydration mismatches in the landmark pin coordinates.
- **CSS `contain: strict`** + `will-change` on the heavy fixed layers (background,
  globe, hero, HUD, landmark panel) so the compositor can promote them without
  invalidating the rest of the document.
- **`translate3d`** for the parallax cards forces GPU compositing.
- **Reduced-motion aware**: rotation animation is skipped when the user prefers
  reduced motion; smooth-scroll falls back to instant.
- **Production console removal** (except `error`) via the SWC compiler config.

## Accessibility

- Keyboard-focusable nav and progress-rail buttons.
- `aria-label` / `aria-current` on navigation.
- Decorative SVGs marked `aria-hidden`.
- All animations respect `prefers-reduced-motion`.

## SEO

OpenGraph + Twitter cards, canonical metadata, robots config and theme color are all
declared in `app/layout.tsx`.
