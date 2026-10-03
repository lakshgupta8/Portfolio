// All copy for the site lives here. Project facts, stacks and dates were taken
// from github.com/lakshgupta8 (repo READMEs, manifests and repo creation dates)
// on 2026-10-03. Update STATS when the profile moves on.

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
  lines: ['Web apps,', 'games &'],
  lastLine: 'mobile — ',
  lastLineAccent: 'shipped.',
  lede:
    "I'm Lakshya, a software engineer who learns by finishing things: a React and Express weather platform, a Godot roguelite with a Windows installer, a Unity metroidvania with its own CI and performance gates, a Flutter habit tracker on Firebase. I'm looking for a team where I can own a feature from design to release.",
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
  'Python',
  'Flask',
  'PostgreSQL',
  'Redux Saga',
  'Vitest',
  'Playwright',
  'GitHub Actions',
  'Tailwind CSS',
];

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: '38', label: 'Public repositories' },
  { value: '30', label: 'Live deployments' },
  { value: '3', label: 'Platforms: web, Windows, Android' },
  { value: '2024', label: 'First commit' },
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
    title: 'HorizonHue',
    kind: 'Web · Full-stack',
    year: '2026',
    desc: 'A weather platform with its own API. The React front end talks to an Express 5 service I wrote to keep OpenWeather calls cheap: responses are cached in memory and in Netlify Blobs, rate-limited, and shared across function cold starts.',
    stack: 'React 19 · TypeScript · Express 5 · Netlify Functions · Netlify Blobs · Tailwind CSS v4 · Vitest · GitHub Actions',
    live: 'https://horizonhue.netlify.app/',
    source: `${GITHUB_URL}/Weather-app`,
    highlights: [
      'Debounced city autocomplete with worldwide geocoding',
      'Dual-layer cache: 10-minute weather TTL, 24-hour city TTL',
      'Geolocation on boot, metric and imperial units',
      'Hourly and 5-day charts drawn in plain SVG',
      'Shareable side-by-side city comparison in the URL',
      'Lint, typecheck, test and build on every push',
    ],
  },
  {
    num: 'P·02',
    title: 'EBB',
    kind: 'Game · Godot 4',
    year: '2026',
    desc: 'A top-down pixel-art action roguelite for Windows. The tide is the clock: water rises through every level as you play, and when it catches you the night ends. Shipped as a one-click installer at version 1.3.0.',
    stack: 'Godot 4.7 · GDScript · GDShader · Inno Setup · PowerShell build scripts · GDScript test scenes',
    source: `${GITHUB_URL}/EBB`,
    highlights: [
      'Four biomes and four bosses, six weapons with two aspects each',
      '72 run-time upgrades across five families, offered at altars',
      'Every night records its inputs: replays and ghost races on a seed',
      'Daily seeded nights with a board, plus four other modes',
      'Full remapping, three assist modes, colourblind and high-contrast water',
      'Installer updates in place; saves survive updates and uninstalls',
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    num: 'P·03',
    title: 'The Last Cartographer',
    kind: 'Game · Unity 6',
    year: '2026',
    desc: 'A 2.5D action metroidvania in the spirit of Silksong, in development. Beyond the greybox: a story bible, boss kits, a 60 fps performance budget with a probe and CI gate, a controller feel-test, and Steam build scripts.',
    stack: 'Unity 6 · C# · ShaderLab · Yarn · GameCI on GitHub Actions · PowerShell tooling',
    source: `${GITHUB_URL}/LastCartographer`,
  },
  {
    num: 'P·04',
    title: 'Habitual Offender',
    kind: 'Mobile · Flutter',
    year: '2026',
    desc: 'An Android habit tracker that assumes you will slip. Check-ins earn tokens, tokens buy back missed days. Streaks are recomputed from raw records on every change, and reminders fire as exact on-device alarms with a Mark done button.',
    stack: 'Flutter · Dart · Firebase Auth · Cloud Firestore · Local notifications · Streak engine tests · GitHub Actions',
    source: `${GITHUB_URL}/habit-tracker`,
  },
  {
    num: 'P·05',
    title: 'AwesomeBuy',
    kind: 'Web · Storefront',
    year: '2026',
    desc: 'An e-commerce storefront with search, filters and pagination, a cart, and a complete auth flow with protected routes. Migrated from JavaScript to TypeScript along the way.',
    stack: 'React 19 · TypeScript · Redux Toolkit · Redux Saga · React Router · Formik + Yup · Storybook',
    live: 'https://awesomebuy-commerce.netlify.app/',
    source: `${GITHUB_URL}/E-commerce-Application`,
  },
  {
    num: 'P·06',
    title: 'Money Tabs',
    kind: 'Web · Full-stack',
    year: '2026',
    desc: 'A finance tracker for discrete pots of money. Drag tabs together to merge totals, with every adjustment written to an immutable ledger behind a Flask REST API on SQLite.',
    stack: 'React · TypeScript · Recharts · Python · Flask · SQLite',
    source: `${GITHUB_URL}/finance-tracker`,
  },
  {
    num: 'P·07',
    title: 'Repair Shop',
    kind: 'Web · Next.js',
    year: '2026',
    desc: 'A management system for a computer repair shop: customers, tickets and technician workflows. Built on the Next.js App Router with a Postgres schema and migrations.',
    stack: 'Next.js · Drizzle ORM · Neon Postgres · Kinde Auth · shadcn/ui · Sentry',
    source: `${GITHUB_URL}/repairshopnextjs`,
  },
  {
    num: 'P·08',
    title: 'Recipe Finder',
    kind: 'Web · Redux',
    year: '2026',
    desc: 'Discover recipes by name, letter, cuisine or category. API responses are normalized into a Redux store and side effects run through sagas; components are documented in Storybook.',
    stack: 'React 19 · Redux Saga · Normalizr · Reselect · Framer Motion · Vitest · Playwright',
    live: 'https://a-recipe-finder.netlify.app/',
    source: `${GITHUB_URL}/Recipe-Finder`,
  },
];

export const MORE_PROJECTS: { title: string; href: string }[] = [
  { title: 'TV Show Search', href: 'https://tvshows-search.netlify.app/' },
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
    desc: 'Typed components, utility-first styling and token-driven design systems. Sagas and normalized stores when an app outgrows Context.',
    tools: ['React 19', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS v4', 'Redux Saga', 'React Router', 'Storybook'],
  },
  {
    num: '02',
    phase: 'Server',
    title: 'Backend & data',
    desc: 'REST APIs with caching, rate limiting and audit tables. Serverless on Netlify, a long-running Express process, or Firebase when the client owns the data.',
    tools: ['Node.js', 'Express 5', 'Netlify Functions', 'Python', 'Flask', 'PostgreSQL', 'SQLite', 'Drizzle ORM', 'Firebase'],
  },
  {
    num: '03',
    phase: 'Engines',
    title: 'Games',
    desc: 'Two engines, two genres: a Godot roguelite that has shipped, and a Unity metroidvania with a production plan, perf budgets and a build pipeline.',
    tools: ['Unity 6', 'C#', 'ShaderLab', 'Godot 4', 'GDScript', 'GDShader', 'Inno Setup', 'GameCI'],
  },
  {
    num: '04',
    phase: 'Devices',
    title: 'Mobile',
    desc: 'Offline-first Flutter on Android, with Firebase for auth and sync, exact local alarms, and the streak logic covered by unit tests.',
    tools: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Local notifications', 'Android'],
  },
  {
    num: '05',
    phase: 'Quality',
    title: 'Testing & delivery',
    desc: 'Unit, component and end-to-end tests; CI that blocks the merge; performance probes and installers so a build is something a person can run.',
    tools: ['Vitest', 'Testing Library', 'Playwright', 'GitHub Actions', 'Sentry', 'ESLint', 'Prettier', 'PowerShell'],
  },
  {
    num: '06',
    phase: 'Beyond',
    title: 'Languages',
    desc: 'The language follows the target. University brought C++ and Java; the side quests brought the rest.',
    tools: ['TypeScript', 'C#', 'GDScript', 'Dart', 'Python', 'C++', 'Java', 'SQL', 'TensorFlow'],
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
    title: 'A first product',
    detail: 'EQUANO, a Next.js graphing calculator with canvas rendering, an expression parser and 3D surfaces.',
  },
  {
    when: 'Sep 2025',
    title: 'Foundations, properly',
    detail: 'HTML, atomic CSS and Tailwind. Array methods in JavaScript. Every exercise deployed.',
  },
  {
    when: 'Oct 2025',
    title: 'First React',
    detail: 'State, lists and keys, then React Router. A product listing grows a detail page.',
  },
  {
    when: 'Nov 2025',
    title: 'Real app patterns',
    detail: 'Context, higher-order components, REST integration, Formik + Yup, JWT login and a checkout page.',
  },
  {
    when: 'Dec 2025',
    title: 'TypeScript by default',
    detail: 'Everything new is typed. Custom hooks, dark-mode theming and small focused apps.',
  },
  {
    when: 'Feb 2026',
    title: 'First full-stack build',
    detail: 'HorizonHue: a React front end on an Express API with caching, and a first CI pipeline. A Next.js dashboard with auth and Postgres.',
  },
  {
    when: 'Mar 2026',
    title: 'Serious state',
    detail: 'Redux and Redux Saga across AwesomeBuy, Recipe Finder, TV Show Search and a mood tracker. Storybook for components.',
  },
  {
    when: 'May 2026',
    title: 'A second backend language',
    detail: 'Money Tabs: a Flask + SQLite REST API with an audit ledger behind a React dashboard.',
  },
  {
    when: 'Jul 2026',
    title: 'Next.js in production shape',
    detail: 'Repair Shop on the App Router with Drizzle, Neon Postgres, Kinde Auth and Sentry.',
  },
  {
    when: 'Sep 2026',
    title: 'Into game engines',
    detail: 'The Last Cartographer in Unity 6: a 2.5D metroidvania with a story bible, a 60 fps budget, CI gates and Steam build scripts.',
  },
  {
    when: 'Oct 2026',
    title: 'Two more platforms',
    detail: 'EBB, a Godot 4 roguelite shipped as a Windows installer, and Habitual Offender, a Flutter habit tracker on Firebase.',
  },
];

export const ABOUT = {
  copy: "I'm a self-driven engineer who learned by building: close to forty repositories, each a step up from the last, from a click counter to a shipped game. The language follows the target, so it's TypeScript in the browser, C# and GDScript in the engines, Dart on the phone. I add tests, CI and installers where they earn their keep, and I put everything in public so it can be judged on what it does.",
  facts: [
    { label: 'Status', value: 'Open to full-time roles' },
    { label: 'Focus', value: 'Web · Games · Mobile' },
    { label: 'Languages', value: 'TypeScript · C# · GDScript · Dart · Python' },
    { label: 'Interests', value: 'Game development · AI/ML' },
    { label: 'Location', value: 'India · Remote-friendly' },
  ] as { label: string; value: string }[],
};
