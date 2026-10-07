// All copy for the site lives here. Project facts, stacks and dates were taken
// from github.com/lakshgupta8 (repo READMEs, manifests and repo creation dates)
// on 2026-10-08. Update STATS when the profile moves on.

export const NAME = 'Lakshya Gupta';
export const EMAIL = 'lakshya1176@gmail.com';
export const GITHUB_URL = 'https://github.com/lakshgupta8';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/lakshgupta8';

export const NAV_LINKS: { href: string; label: string }[] = [
  { href: '#work', label: 'Work' },
  { href: '#stack', label: 'Stack' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export const HERO = {
  kicker: 'Software Engineer',
  lines: ['I build it,', 'I test it,'],
  lastLine: '',
  lastLineAccent: 'I ship it.',
  lede:
    "I'm Lakshya, a software engineer who learns by finishing things: a Next.js guide to where any film or series is streaming, a Godot roguelite with a Windows installer, a Unity metroidvania with CI behind it, and a Flutter habit tracker for Android. I'm looking for a team where I can own a feature from design to release.",
  caption: 'Lakshya Gupta — software engineer',
};

export const MARQUEE = [
  'TypeScript',
  'React 19',
  'Next.js',
  'Node.js',
  'Express 5',
  'C#',
  'Unity 6',
  'GDScript',
  'Godot 4',
  'Dart',
  'Flutter',
  'Firebase',
  'Appwrite',
  'Electron',
  'Capacitor',
  'PostgreSQL',
  'Redux Saga',
  'Vitest',
  'GitHub Actions',
  'Tailwind CSS',
];

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: '41', label: 'Public repositories' },
  { value: '31', label: 'Repositories with a live link' },
  { value: '3', label: 'Platforms: web, Windows, Android' },
  { value: '2024', label: 'On GitHub since December' },
];

export interface Project {
  num: string;
  title: string;
  kind: string;
  year: string;
  desc: string;
  stack: string;
  live?: string;
  source: string;
}

export interface FeaturedProject extends Project {
  highlights: string[];
}

export const FEATURED: FeaturedProject[] = [
  {
    num: 'P·01',
    title: 'MediaFlow',
    kind: 'Web · Next.js',
    year: '2026',
    desc: 'Every streaming service, one place. Find where to stream, rent or buy any movie, series or anime in your region, and keep one watchlist across all of them. MediaFlow hosts nothing: every Stream on button goes to the official service.',
    stack: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · TanStack Query · Redux Toolkit · Appwrite · TMDB · Bun · GitHub Actions',
    live: 'https://mediaflow-app.vercel.app/',
    source: `${GITHUB_URL}/mediaflow`,
    highlights: [
      'Streaming, free, rental and purchase options for any region TMDB covers',
      'Star the services you pay for and they rank first everywhere',
      'Filter by service, availability and genre, with every filter kept in the URL',
      'Anime hub with this season’s simulcasts and a filterable catalogue',
      'Watchlist, favorites and watched log synced across devices on Appwrite',
      'Accounts with password reset, profile photo cropping and full account deletion',
    ],
  },
  {
    num: 'P·02',
    title: 'EBB',
    kind: 'Game · Godot 4',
    year: '2026',
    desc: 'A top-down pixel-art action roguelite for Windows. The tide is the clock: water rises through every level as you play, and when it catches you the night ends. Distributed as a one-click installer that needs neither Godot nor admin rights.',
    stack: 'Godot 4.7 · GDScript · GDShader · Inno Setup · PowerShell build scripts · Headless test suite',
    source: `${GITHUB_URL}/EBB`,
    highlights: [
      'Four biomes and four bosses, six weapons with two aspects each',
      '72 run-time upgrades in five families, offered at altars',
      'Every night records its inputs: replays and ghost races on a seed',
      'A daily seeded night with a board, plus four other modes',
      'Full remapping, three assist modes, colourblind and high-contrast water',
      'The installer updates in place; saves survive updates and uninstalls',
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    num: 'P·03',
    title: 'HorizonHue',
    kind: 'Web · Full-stack',
    year: '2026',
    desc: 'A weather platform with its own API. The React front end talks to an Express 5 service that keeps OpenWeather calls cheap: responses are cached in memory and in Netlify Blobs, rate-limited, and shared across function cold starts.',
    stack: 'React 19 · TypeScript · Express 5 · Netlify Functions · Netlify Blobs · Tailwind CSS v4 · Vitest · GitHub Actions',
    live: 'https://horizonhue.netlify.app/',
    source: `${GITHUB_URL}/Weather-app`,
  },
  {
    num: 'P·04',
    title: 'The Last Cartographer',
    kind: 'Game · Unity 6 · In development',
    year: '2026',
    desc: 'A hand-inked 2.5D metroidvania in the spirit of Silksong. Wren’s map forgets every place she leaves undrawn. A vertical slice and a greybox of the full map exist, with a story bible, headless play-mode tests, and CI on every push that builds for Windows and runs a performance probe.',
    stack: 'Unity 6 · C# · Headless Blender art · GameCI on GitHub Actions · Git LFS',
    source: `${GITHUB_URL}/LastCartographer`,
  },
  {
    num: 'P·05',
    title: 'Habitual Offender',
    kind: 'Mobile · Flutter',
    year: '2026',
    desc: 'An Android habit tracker that assumes you will slip. Check-ins earn tokens, tokens buy back missed days. Streaks are recomputed from raw records on every change, and reminders are exact on-device alarms with a Mark done button. The APK is on GitHub Releases.',
    stack: 'Flutter · Dart · Firebase Auth · Cloud Firestore · Local notifications · 27 unit tests · GitHub Actions',
    source: `${GITHUB_URL}/habit-tracker`,
  },
  {
    num: 'P·06',
    title: 'Money Tabs',
    kind: 'Desktop & Mobile · React',
    year: '2026',
    desc: 'A finance tracker for discrete pots of money, packaged twice from one React codebase: a Windows app on Electron and an Android APK on Capacitor, both reading one hosted Turso database. Drag tabs together to merge totals; every change leaves a ledger entry that can be reversed.',
    stack: 'React · TypeScript · Tailwind CSS · Recharts · Electron · Capacitor · Turso (libSQL)',
    source: `${GITHUB_URL}/finance-tracker`,
  },
  {
    num: 'P·07',
    title: 'Repair Shop',
    kind: 'Web · Next.js',
    year: '2026',
    desc: 'A management system for a computer repair shop: customers, tickets and technician workflows behind Kinde auth. Built on the Next.js App Router with Drizzle ORM on Neon Postgres, Zod-validated forms and Sentry error monitoring.',
    stack: 'Next.js · React 19 · Drizzle ORM · Neon Postgres · Kinde Auth · shadcn/ui · Zod · Sentry',
    source: `${GITHUB_URL}/repairshopnextjs`,
  },
  {
    num: 'P·08',
    title: 'TV Show Search',
    kind: 'Web · Redux',
    year: '2026',
    desc: 'A TV discovery app on the TVmaze API: search shows and people, browse by genre and status, a daily schedule, and show, episode and person pages. Every request flows through one Redux slice and a saga that caches, debounces and retries around the API’s rate limit.',
    stack: 'React 18 · TypeScript · Redux Toolkit · Redux Saga · React Router · Tailwind CSS v4 · TVmaze API',
    live: 'https://tvshows-search.netlify.app/',
    source: `${GITHUB_URL}/TV-Show-Search`,
  },
];

export const MORE_PROJECTS: { title: string; href: string }[] = [
  { title: 'AwesomeBuy storefront', href: 'https://awesomebuy-commerce.netlify.app/' },
  { title: 'Recipe Finder', href: 'https://a-recipe-finder.netlify.app/' },
  { title: 'BastionPass', href: 'https://bastionpass.netlify.app/' },
  { title: 'ScribNotes', href: 'https://scribnote.netlify.app/' },
  { title: 'EQUANO graphing calculator', href: `${GITHUB_URL}/EQUANO` },
  { title: 'Next.js dashboard', href: 'https://next-js-dashboard-seven-flax.vercel.app' },
];

export interface StackGroup {
  num: string;
  phase: string;
  title: string;
  desc: string;
  tools: string[];
}

export const STACK: StackGroup[] = [
  {
    num: '01',
    phase: 'Browser',
    title: 'Web frontend',
    desc: 'Typed components and utility-first styling. Redux Toolkit with sagas or TanStack Query, depending on how much state the app owns.',
    tools: ['React 19', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS v4', 'Redux Toolkit', 'Redux Saga', 'TanStack Query', 'React Router', 'Storybook'],
  },
  {
    num: '02',
    phase: 'Server',
    title: 'Backend & data',
    desc: 'An Express API with caching and rate limiting, Postgres through Drizzle, and managed backends such as Appwrite, Firebase and Turso when the client owns the data.',
    tools: ['Node.js', 'Express 5', 'Netlify Functions', 'PostgreSQL', 'Drizzle ORM', 'SQLite', 'Turso', 'Appwrite', 'Firebase'],
  },
  {
    num: '03',
    phase: 'Engines',
    title: 'Games',
    desc: 'Two engines, two genres: a Godot roguelite released with a Windows installer, and a Unity metroidvania with play-mode tests, CI and a performance probe.',
    tools: ['Unity 6', 'C#', 'Godot 4', 'GDScript', 'GDShader', 'Blender', 'Inno Setup', 'GameCI'],
  },
  {
    num: '04',
    phase: 'Devices',
    title: 'Mobile & desktop',
    desc: 'Flutter on Android with exact on-device alarms and a unit-tested streak engine. One React codebase packaged as an Electron app and a Capacitor APK.',
    tools: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Capacitor', 'Electron', 'Android'],
  },
  {
    num: '05',
    phase: 'Quality',
    title: 'Testing & delivery',
    desc: 'Unit, component and headless game tests; GitHub Actions on every push; installers and APKs so a build is something a person can run.',
    tools: ['Vitest', 'Testing Library', 'Playwright', 'GitHub Actions', 'Sentry', 'ESLint', 'Prettier', 'PowerShell'],
  },
  {
    num: '06',
    phase: 'Beyond',
    title: 'Languages',
    desc: 'The language follows the target: the browser, two game engines and the phone each pull in a different one.',
    tools: ['TypeScript', 'JavaScript', 'C#', 'GDScript', 'Dart', 'HTML', 'CSS'],
  },
];

export interface Milestone {
  when: string;
  title: string;
  detail: string;
}

export const PATH: Milestone[] = [
  {
    when: 'Jul 2025',
    title: 'A first project',
    detail: 'EQUANO, a Next.js graphing calculator with canvas rendering and an expression parser, generated with V0 and refined by hand.',
  },
  {
    when: 'Sep 2025',
    title: 'Foundations, properly',
    detail: 'HTML, atomic CSS and Tailwind, then array methods in JavaScript. Every CodeYogi assignment deployed to its own site.',
  },
  {
    when: 'Oct 2025',
    title: 'First React',
    detail: 'State and the useState hook, then React Router. A product listing grows a detail page.',
  },
  {
    when: 'Nov 2025',
    title: 'Real app patterns',
    detail: 'Context, higher-order components, REST integration, Formik and Yup, JWT login and a checkout page.',
  },
  {
    when: 'Dec 2025',
    title: 'TypeScript by default',
    detail: 'Everything new is typed. A TypeScript todo app, then custom hooks and dark-mode theming with Tailwind v4.',
  },
  {
    when: 'Feb 2026',
    title: 'First full-stack builds',
    detail: 'HorizonHue: a React front end on an Express API with caching and CI. A Next.js dashboard with auth and Postgres. MediaFlow takes its first commit.',
  },
  {
    when: 'Mar 2026',
    title: 'Serious state',
    detail: 'Redux and Redux Saga across AwesomeBuy, Recipe Finder, TV Show Search and a mood tracker. Storybook for components.',
  },
  {
    when: 'May 2026',
    title: 'Small apps, many hooks',
    detail: 'A music player on useRef, ScribNotes on localStorage and cookies, BastionPass for form handling, and the first Money Tabs.',
  },
  {
    when: 'Jul 2026',
    title: 'Next.js in production shape',
    detail: 'Repair Shop on the App Router with Drizzle, Neon Postgres, Kinde Auth and Sentry.',
  },
  {
    when: 'Sep 2026',
    title: 'Into game engines',
    detail: 'The Last Cartographer in Unity 6: a 2.5D metroidvania with a story bible, play-mode tests and CI that builds for Windows.',
  },
  {
    when: 'Oct 2026',
    title: 'Two more platforms',
    detail: 'EBB, a Godot 4 roguelite with a Windows installer, and Habitual Offender, a Flutter habit tracker on Firebase. MediaFlow ships live on Vercel.',
  },
];

export const ABOUT = {
  copy: "I'm a self-driven engineer who learns by building in public: 41 repositories since December 2024, from a click counter to a Windows game with its own installer. The language follows the target, so it's TypeScript in the browser, C# and GDScript in the engines, Dart on the phone. The larger builds use AI coding tools (Claude Code, V0, Gemini) and their READMEs say so; I direct the work, playtest it and decide what ships. Tests, CI and installers go in where they earn their keep.",
  facts: [
    { label: 'Status', value: 'Open to full-time roles' },
    { label: 'Focus', value: 'Web · Games · Mobile' },
    { label: 'Languages', value: 'TypeScript · C# · GDScript · Dart · JavaScript' },
    { label: 'On GitHub', value: 'Since December 2024' },
  ] as { label: string; value: string }[],
};
