# Adefemi Oseni — Portfolio (Next.js)

A scroll-driven 3D journey built with Three.js / React Three Fiber on Next.js 16.
Scrolling flies the camera from orbit down to Lagos and through the planet:

| Depth | Scene | Section |
|---|---|---|
| Low Earth orbit | Textured globe, night lights, atmosphere | Hero |
| Stratosphere | Above the cloud deck | About (sign hung from a balloon) |
| Sea level | Open water off the coast | Projects (sign on stilts) |
| Highlands | Mountain pass | Experience (trail marker) |
| Ground | Valley plateau | Skills (station board) |
| Crust → core | Rock strata shaft, molten core | Contact (plaque on chains) |

Each section is a landmark signboard. The signs are server-rendered HTML (crawlable,
readable without JS/WebGL); on screens ≥ 900×560 the scene lifts them into the 3D world
with CSS3D so the text stays real, selectable HTML in true perspective. Smaller screens
show the same signs in the page flow.

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
app/                    layout, globals.css (tokens + sign styles), page.tsx
components/journey/
  content.ts            all copy — edit this to update the site
  Sections.tsx          server-rendered hero + signboards
  Journey.tsx           nav, depth gauge, scroll → journey mapping
  JourneyCanvas.tsx     WebGL canvas (client only, with fallback)
  store.ts              shared scroll/camera state
  scene/                Globe, Sky, Clouds, Ocean, Terrain, Beacons, Core, Signs,
                        cameraPath (keyframes + gauge), signs (sign placement)
public/textures/        NASA Blue Marble–derived Earth textures (public domain)
```

Append `?quality=low` or `?quality=high` to the URL to force the render tier.

## Performance

- One camera path sampled per frame from smoothed scroll progress; React only re-renders
  when the active section changes.
- Low-power tier (phones, ≤ 4 cores): 2K globe texture, coarser terrain, fewer clouds and
  trees, lower pixel ratio.
- Scenes that are off-camera (orbit vs surface vs underground) are hidden, not rendered.
- The 3D bundle is code-split and loads after the page content.
- `prefers-reduced-motion`: the camera cuts between stops instead of flying.
