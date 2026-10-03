# Lakshya Gupta — Portfolio

A black and white, single-page portfolio built on the **Modernist** design system: ink on a light ground, a visible modular grid, zero corner radius and strong 2px rules, set entirely in Archivo.

## Sections

1. **Hero** — headline, lede and a grayscale portrait.
2. **Marquee** — the toolset, scrolling.
3. **Stats** — repositories, live deployments, apps shipped.
4. **01 — Selected work** — HorizonHue and EBB as featured cases, then six more builds across web, Unity, Godot and Flutter with live and source links.
5. **02 — Stack** — six groups: web frontend, backend, games, mobile, testing and delivery, languages.
6. **03 — The road so far** — a timeline built from repository dates.
7. **04 — About** — a short bio plus status, focus and location.
8. **05 — Contact** — the ink poster with email, GitHub and LinkedIn.

All copy lives in `src/data/portfolio.ts`; project facts there were taken from github.com/lakshgupta8. The design tokens and every component style live in `src/index.css`.

## Tech stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite
- **Styling:** plain CSS on design tokens (no utility framework)
- **Icons:** Lucide React
- **Motion:** CSS keyframes and an IntersectionObserver reveal hook (respects `prefers-reduced-motion`)
- **Hosting:** Netlify (`netlify.toml`)


## Getting started

```bash
npm install
npm run dev
```

Build for production with `npm run build` and preview the output with `npm run preview`.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint
