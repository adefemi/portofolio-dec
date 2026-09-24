// All copy for the site lives here so it can be updated without touching
// the 3D code. Ported unchanged from the previous landmark components.

export const HERO = {
  eyebrow: "Now orbiting · Portfolio v2026",
  first: "Adefemi",
  last: "Oseni",
  tagline: "Senior software engineer · full-stack explorer · shipping from",
  location: "Lagos, Nigeria",
};

export const ABOUT = {
  eyebrow: "Touchdown · Lagos, Nigeria",
  title: ["I build software that", "actually works", ", and works fast."],
  body:
    "I'm Adefemi Oseni — a senior software engineer who has spent a decade exploring the full-stack scope of this atmosphere. Backend, frontend, platforms, a startup of my own. I believe in doing a little thing that works (and works fine) over a large thing that doesn't.",
  stats: [
    { k: "10+", v: "Years shipping" },
    { k: "1st Class", v: "Computer Science" },
    { k: "1", v: "Founder at Djuix.io" },
  ],
};

export interface Project {
  name: string;
  tag: string;
  summary: string;
  stack: string[];
  accent: string;
}

export const PROJECTS_INTRO = {
  eyebrow: "The workshop · Selected work",
  title: ["Things I've built, shipped, or", "broken on purpose", "."],
};

export const PROJECTS: ReadonlyArray<Project> = [
  {
    name: "Djuix.io",
    tag: "Founder · 2022 — present",
    summary:
      "A platform that streamlines Django project setup — spin up a production-ready backend in minutes, not days.",
    stack: ["Django", "Next.js", "Docker", "AWS"],
    accent: "#6fae84",
  },
  {
    name: "GraphQL Federation @ Bleacher Report",
    tag: "Senior · Platform",
    summary:
      "Shipped federation upgrades that improved system reliability and dropped error rates. Built a caching service that meaningfully cut load times.",
    stack: ["Go", "GraphQL", "Redis", "Kubernetes"],
    accent: "#5ad6ff",
  },
  {
    name: "FinGreat",
    tag: "Tutorial series",
    summary:
      "A real fintech app, built in public with GoLang + Next.js. Source on GitHub, episodes on YouTube.",
    stack: ["Go", "Next.js", "PostgreSQL"],
    accent: "#f0b840",
  },
  {
    name: "RETINA-AI Health",
    tag: "Backend engineer",
    summary:
      "Backend for a cloud-based AI platform in healthcare. The kind of work where a 500 isn't just a metric.",
    stack: ["Python", "AWS", "FastAPI"],
    accent: "#e07a5a",
  },
];

export const EXPERIENCE_INTRO = {
  eyebrow: "The ridge · A decade in roles",
  title: ["Each peak is a", "layer of context", "."],
};

export const ROLES = [
  {
    year: "2024 →",
    role: "Senior Software Engineer",
    org: "Bleacher Report",
    note: "GraphQL Federation, caching service, security hardening.",
  },
  {
    year: "2022",
    role: "Founder",
    org: "Djuix.io",
    note: "Streamlining Django project setup end-to-end.",
  },
  {
    year: "2021",
    role: "Backend Software Engineer",
    org: "RETINA-AI Health",
    note: "Cloud-based AI platform in healthcare.",
  },
  {
    year: "2019",
    role: "Senior Frontend Developer",
    org: "Kodobe",
    note: "Micro-frontend architecture, reusable Node.js packages.",
  },
  {
    year: "2017",
    role: "Web Developer",
    org: "Achievers University",
    note: "Where it started. First shipped things.",
  },
] as const;

export const SKILLS_INTRO = {
  eyebrow: "Ground level · Toolkit",
  title: ["Languages and tools that", "travel with me", "."],
};

export const SKILL_BUCKETS = [
  { label: "Languages", items: ["Go", "Python", "TypeScript", "Java", "JavaScript"] },
  { label: "Frameworks", items: ["Django", "Next.js", "React", "Node.js", "FastAPI"] },
  { label: "Data", items: ["PostgreSQL", "GraphQL", "Redis", "MongoDB", "ElasticSearch"] },
  { label: "Infra", items: ["AWS", "Docker", "Kubernetes", "Kafka"] },
] as const;

export const CONTACT_INTRO = {
  eyebrow: "Inner core · Open frequency",
  title: ["Let's", "build something", "that works."],
  body:
    "I'm reachable by email, LinkedIn, or the usual channels. I reply to things that look like real conversations.",
};

export const CHANNELS = [
  { k: "Email", v: "oseni.adefemigreat@gmail.com", href: "mailto:oseni.adefemigreat@gmail.com" },
  { k: "GitHub", v: "@adefemi", href: "https://github.com/adefemi" },
  { k: "YouTube", v: "@AdefemiGreat", href: "https://www.youtube.com/@AdefemiGreat" },
  { k: "LinkedIn", v: "Adefemi Oseni", href: "https://linkedin.com/in/adefemi-oseni" },
  { k: "X", v: "@GreatAdefemi", href: "https://x.com/GreatAdefemi" },
] as const;

/** Header plate for each landmark sign: name + real-world reading. */
export const PLATES = {
  about: { n: "01", name: "Stratosphere", reading: "Alt 12,000 m · 6.45° N 3.39° E" },
  projects: { n: "02", name: "The workshop", reading: "Sea level · Bight of Benin" },
  experience: { n: "03", name: "The ridge", reading: "Alt 2,400 m · Trail marker" },
  skills: { n: "04", name: "Ground station", reading: "Alt 180 m · Lagos hinterland" },
  contact: { n: "05", name: "Inner core", reading: "Depth 5,150 km · 5,400 °C" },
} as const;

export const NAV = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
