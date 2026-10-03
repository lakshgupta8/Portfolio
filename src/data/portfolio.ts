// All copy for the site lives here. Project facts, stacks and dates were taken
// from github.com/lakshgupta8 (repo READMEs, package.json files and repo
// creation dates) in October 2026. Update the STATS when the profile moves on.

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
  kicker: 'Full-stack developer — React · TypeScript · Node · Next.js',
  lines: ['I build the', 'whole thing,'],
  lastLine: 'then ',
  lastLineAccent: 'ship it.',
  lede:
    "I'm Lakshya. I learn by shipping — a weather platform with its own cached API, a storefront with a full auth flow, a finance tracker on a Flask backend — and I'm looking for a team where I can own features end-to-end.",
  caption: 'Lakshya Gupta — full-stack developer',
};

export const MARQUEE = [
  'React 19',
  'TypeScript',
  'Next.js',
  'Node.js',
  'Express 5',
  'Tailwind CSS',
  'Redux Saga',
  'Vite',
  'Bun',
  'PostgreSQL',
  'Drizzle ORM',
  'Flask',
  'Vitest',
  'Playwright',
  'Storybook',
  'GitHub Actions',
  'Netlify',
  'Vercel',
];

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: '34', label: 'Public repositories' },
  { value: '30', label: 'Live deployments' },
  { value: '9', label: 'Apps built end-to-end' },
  { value: '2024', label: 'First commit' },
];

export interface Project {
  num: string;
  title: string;
  year: string;
  desc: string;
  stack: string;
  live?: string;
  source: string;
}

export const FEATURED: Project & { highlights: string[] } = {
  num: 'P·01',
  title: 'HorizonHue',
  year: '2026',
  desc: 'A full-stack weather platform. The React front end talks to an Express 5 API I wrote to keep OpenWeather calls cheap: responses are cached in memory and in Netlify Blobs, rate-limited, and shared across function cold starts.',
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
};

export const PROJECTS: Project[] = [
  {
    num: 'P·02',
    title: 'AwesomeBuy',
    year: '2026',
    desc: 'An e-commerce storefront with search, filters and pagination, a cart, and a complete auth flow with protected routes. Migrated from JavaScript to TypeScript along the way.',
    stack: 'React 19 · TypeScript · Redux Toolkit · Redux Saga · React Router · Formik + Yup · Storybook',
    live: 'https://codeyogi-ecommerce.netlify.app/',
    source: `${GITHUB_URL}/CodeYogi-E-commerce-Application`,
  },
  {
    num: 'P·03',
    title: 'Money Tabs',
    year: '2026',
    desc: 'A finance tracker for discrete pots of money. Drag tabs together to merge totals, with every adjustment written to an immutable ledger behind a Flask REST API on SQLite.',
    stack: 'React · TypeScript · Recharts · Python · Flask · SQLite',
    source: `${GITHUB_URL}/finance-tracker`,
  },
  {
    num: 'P·04',
    title: 'Repair Shop',
    year: '2026',
    desc: 'A management system for a computer repair shop: customers, tickets and technician workflows. Built on the Next.js App Router with a Postgres schema and migrations.',
    stack: 'Next.js · Drizzle ORM · Neon Postgres · Kinde Auth · shadcn/ui · Sentry',
    source: `${GITHUB_URL}/repairshopnextjs`,
  },
  {
    num: 'P·05',
    title: 'Recipe Finder',
    year: '2026',
    desc: 'Discover recipes by name, letter, cuisine or category. API responses are normalized into a Redux store and side effects run through sagas; components are documented in Storybook.',
    stack: 'React 19 · Redux Saga · Normalizr · Reselect · Framer Motion · Vitest · Playwright',
    live: 'https://a-recipe-finder.netlify.app/',
    source: `${GITHUB_URL}/Recipe-Finder`,
  },
  {
    num: 'P·06',
    title: 'TV Shows',
    year: '2026',
    desc: 'A show discovery app on the TVMaze API with cast avatar stacks and popovers. Built to practise serious state management: Redux, sagas and memoized selectors.',
    stack: 'React · TypeScript · Redux · Redux Saga · Reselect · Tailwind CSS v4',
    live: 'https://tvshows-codeyogi.netlify.app/',
    source: `${GITHUB_URL}/CodeYogi-TV-Shows-Application`,
  },
  {
    num: 'P·07',
    title: 'BastionPass',
    year: '2026',
    desc: 'A password generator and manager. A small app built to get randomization, form validation and cookie persistence right.',
    stack: 'React · TypeScript · React Hook Form · js-cookie · Tailwind CSS',
    live: 'https://bastionpass.netlify.app/',
    source: `${GITHUB_URL}/bastionpass`,
  },
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
    phase: 'Interface',
    title: 'Frontend',
    desc: 'Typed components, utility-first styling and token-driven design systems. Every app ships responsive and with a dark mode.',
    tools: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'React Router', 'Framer Motion'],
  },
  {
    num: '02',
    phase: 'Data flow',
    title: 'State',
    desc: 'Sagas for side effects, normalized stores and memoized selectors when an app outgrows Context.',
    tools: ['Redux Toolkit', 'Redux Saga', 'Reselect', 'Immer', 'Normalizr', 'Context API', 'Axios'],
  },
  {
    num: '03',
    phase: 'Server',
    title: 'Backend',
    desc: 'REST APIs with caching, rate limiting and audit tables. Serverless on Netlify or a long-running Express process.',
    tools: ['Node.js', 'Express 5', 'Bun', 'Netlify Functions', 'Python', 'Flask', 'PostgreSQL', 'SQLite', 'Drizzle ORM'],
  },
  {
    num: '04',
    phase: 'Full-stack',
    title: 'Next.js',
    desc: 'App Router, route groups, server components and a typed Postgres schema with migrations.',
    tools: ['Next.js', 'NextAuth', 'Kinde Auth', 'Zod', 'Neon', 'shadcn/ui'],
  },
  {
    num: '05',
    phase: 'Quality',
    title: 'Testing & tooling',
    desc: 'Unit and component tests, end-to-end flows, isolated component docs, and CI that blocks the merge.',
    tools: ['Vitest', 'Testing Library', 'Playwright', 'Storybook', 'ESLint', 'Prettier', 'GitHub Actions', 'Sentry'],
  },
  {
    num: '06',
    phase: 'Beyond',
    title: 'Other languages',
    desc: 'Languages from university and side quests. Currently learning the Unity engine on the side.',
    tools: ['C++', 'Python', 'Java', 'TensorFlow', 'MySQL', 'Unity'],
  },
];

export interface Milestone {
  when: string;
  title: string;
  detail: string;
}

export const PATH: Milestone[] = [
  {
    when: 'Sep 2025',
    title: 'Foundations',
    detail: 'HTML, atomic CSS and Tailwind. Array methods in JavaScript.',
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
    detail: 'Redux and Redux Saga across AwesomeBuy, Recipe Finder, TV Shows and a mood tracker. Storybook for components.',
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
];

export const ABOUT = {
  copy: "I'm a self-driven developer who learned by building: thirty-plus repos, each one a step up from the last, from a click counter to a weather platform with its own cached API. I write TypeScript by default, add tests and CI where they earn their keep, and deploy everything so it can be judged on what it does rather than what it claims.",
  facts: [
    { label: 'Status', value: 'Open to full-time roles' },
    { label: 'Focus', value: 'React · TypeScript · Node' },
    { label: 'Also', value: 'Next.js · Python · C++ · Java' },
    { label: 'Learning', value: 'Unity · AI/ML' },
    { label: 'Location', value: 'India · Remote-friendly' },
  ] as { label: string; value: string }[],
};
