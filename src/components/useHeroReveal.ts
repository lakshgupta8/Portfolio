import { useEffect } from 'react';
import { contourPath } from '../lib/contours';
import { hasFinePointer, onFrameWhileVisible, pointer, pointerActive, prefersReducedMotion } from '../lib/motion';

const STEP = 14; // grid spacing in px for the reveal outline
const LIFE_MS = 650; // how long a trail blob takes to melt away
const MAX_BLOBS = 90;
const SPACING = 12; // px between blobs laid along the cursor path
const HOVER_RADIUS = 24; // the blob that sits under a resting cursor
const INTRO_DELAY_MS = 1100; // touch screens: when the one-off sweep starts
const INTRO_MS = 1600; // and how long it takes

interface Blob {
  x: number;
  y: number;
  r: number;
  life: number;
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

/**
 * The hero has two layers: the normal one, and an alternate dark one stacked
 * on top. The cursor leaves a trail of blobs that melt away over time; their
 * summed field, wobbled with noise, is traced into a smooth outline and used
 * as the alternate layer's clip-path, so it pours through wherever you move.
 */
export function useHeroReveal(
  heroRef: React.RefObject<HTMLElement | null>,
  altRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const hero = heroRef.current;
    const alt = altRef.current;
    if (!hero || !alt) return;

    const fine = hasFinePointer();
    const ambient = !prefersReducedMotion();
    const blobs: Blob[] = [];
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let last: { x: number; y: number } | null = null;
    let lastTime = 0;
    let empty = true;
    const introStart = performance.now() + INTRO_DELAY_MS;

    const resize = () => {
      cols = Math.ceil(hero.clientWidth / STEP) + 1;
      rows = Math.ceil(hero.clientHeight / STEP) + 1;
      field = new Float32Array(cols * rows);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);


    const lay = (x: number, y: number, time: number) => {
      if (!last) {
        last = { x, y };
        lastTime = time;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < SPACING) return;
      const speed = dist / Math.max(time - lastTime, 1);
      const r = 16 + Math.min(speed * 8, 14);
      const steps = Math.ceil(dist / SPACING);
      for (let i = 1; i <= steps; i++) {
        blobs.push({ x: last.x + (dx * i) / steps, y: last.y + (dy * i) / steps, r, life: 1 });
      }
      if (blobs.length > MAX_BLOBS) blobs.splice(0, blobs.length - MAX_BLOBS);
      last = { x, y };
      lastTime = time;
    };

    const stop = onFrameWhileVisible(hero, (time, dt) => {
      if (cols === 0) return;

      const rect = hero.getBoundingClientRect();
      const inside =
        pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
      // A mouse or a finger paints the trail as it moves (see lay). A resting
      // mouse keeps a small blob under it; a lifted finger leaves nothing.
      const live = inside && pointerActive();
      let hover: { x: number; y: number } | null = null;
      const introAt = time - introStart;

      if (live) {
        const x = pointer.x - rect.left;
        const y = pointer.y - rect.top;
        lay(x, y, time);
        if (pointer.kind === 'mouse') hover = { x, y };
      } else if (!fine && ambient && introAt > 0 && introAt < INTRO_MS) {
        // Touch screens: one sweep across the name on load, to show the hero
        // reacts to a finger.
        const title = hero.querySelector('.hero > .hero-inner .hero-title')?.getBoundingClientRect();
        if (title) {
          const u = introAt / INTRO_MS;
          const x = title.left - rect.left + u * title.width;
          const y = title.top - rect.top + title.height * (0.5 + 0.3 * Math.sin(u * Math.PI * 2));
          lay(x, y, time);
        }
      } else {
        last = null;
      }

      const decay = dt / LIFE_MS;
      for (let i = blobs.length - 1; i >= 0; i--) {
        blobs[i].life -= decay;
        if (blobs[i].life <= 0) blobs.splice(i, 1);
      }

      if (blobs.length === 0 && !hover) {
        if (!empty) {
          alt.style.clipPath = 'inset(50% 50% 50% 50%)';
          alt.style.visibility = 'hidden';
          empty = true;
        }
        return;
      }

      // Metaball field: each blob adds r^2 / d^2, scaled by how much life it has left.
      const t = time / 1000;
      field.fill(0);
      const all = hover ? [...blobs, { x: hover.x, y: hover.y, r: HOVER_RADIUS, life: 1 }] : blobs;
      for (const blob of all) {
        const life = blob.life * blob.life * (3 - 2 * blob.life);
        const r = blob.r * (0.35 + 0.65 * life);
        const reach = r * 2.6;
        const i0 = Math.max(0, Math.floor((blob.x - reach) / STEP));
        const i1 = Math.min(cols - 1, Math.ceil((blob.x + reach) / STEP));
        const j0 = Math.max(0, Math.floor((blob.y - reach) / STEP));
        const j1 = Math.min(rows - 1, Math.ceil((blob.y + reach) / STEP));
        const r2 = r * r * life;
        for (let j = j0; j <= j1; j++) {
          const dy = j * STEP - blob.y;
          for (let i = i0; i <= i1; i++) {
            const dx = i * STEP - blob.x;
            field[j * cols + i] += r2 / (dx * dx + dy * dy + 1);
          }
        }
      }
      // Wobble the edge so the outline moves like liquid.
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          if (field[k] < 0.25) continue;
          const n = noise(i * 0.16 + t * 0.6, j * 0.16 - t * 0.45);
          field[k] *= 0.72 + n * 0.56;
        }
      }

      const path = contourPath(field, cols, rows, STEP, 1);
      alt.style.clipPath = path ? `path(evenodd, '${path}')` : 'inset(50% 50% 50% 50%)';
      if (empty) {
        alt.style.visibility = 'visible';
        empty = false;
      }
    });

    return () => {
      stop();
      ro.disconnect();
    };
  }, [heroRef, altRef]);
}
