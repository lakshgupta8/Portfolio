import { useEffect, useRef } from 'react';
import { hasFinePointer, onFrame, pointer, prefersReducedMotion } from '../lib/motion';

const STEP = 12; // px between field samples
const LEVEL_GAP = 0.075; // field distance between neighbouring lines
const MAJOR_EVERY = 5; // every fifth line is drawn a little darker
const HILL_RADIUS = 150; // how wide the cursor's hill is
const HILL_HEIGHT = 0.55;
const FRAME_MS = 1000 / 40; // the lines move slowly, so 40fps is plenty

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
 * Topographic contour lines across the hero. The terrain is slow-moving noise;
 * the cursor raises a hill in it, so the lines ring and bend around it. The
 * same drawing is copied into the alternate (dark) layer, where CSS inverts it.
 */
export default function HeroContours() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>('.hero');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !hero || !ctx) return;

    const mirror = hero.querySelector<HTMLCanvasElement>('.hero-contours-mirror');
    const mctx = mirror?.getContext('2d') ?? null;
    const alt = hero.querySelector<HTMLElement>('.hero-alt');
    const fine = hasFinePointer();
    const ambient = !prefersReducedMotion();

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = hero.clientWidth;
      height = hero.clientHeight;
      for (const c of [canvas, mirror]) {
        if (!c) continue;
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
      }
      cols = Math.ceil(width / STEP) + 2;
      rows = Math.ceil(height / STEP) + 2;
      field = new Float32Array(cols * rows);
      lastDraw = -Infinity;
    };

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(hero);

    const hill = { x: 0, y: 0, h: 0 };
    let clock = 0;
    let lastDraw = -Infinity;
    let mirrored = false;
    const copyToMirror = () => {
      if (!mirror || !mctx || alt?.style.visibility !== 'visible') return;
      mctx.clearRect(0, 0, mirror.width, mirror.height);
      mctx.drawImage(canvas, 0, 0);
      mirrored = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    const stop = onFrame((time, dt) => {
      if (!visible || width === 0) return;
      if (ambient) clock += dt / 1000;

      const rect = hero.getBoundingClientRect();
      const inside =
        fine &&
        pointer.movedAt > 0 &&
        pointer.x >= rect.left &&
        pointer.x <= rect.right &&
        pointer.y >= rect.top &&
        pointer.y <= rect.bottom;
      const k = 1 - Math.pow(1 - 0.12, dt / 16.67);
      if (inside) {
        const px = pointer.x - rect.left;
        const py = pointer.y - rect.top;
        if (hill.h < 0.01) {
          hill.x = px;
          hill.y = py;
        }
        hill.x += (px - hill.x) * k;
        hill.y += (py - hill.y) * k;
      }
      hill.h += ((inside ? HILL_HEIGHT : 0) - hill.h) * k * 0.5;

      if (!mirrored) copyToMirror();

      // Only redraw when something moved, and at most at FRAME_MS.
      const still = !ambient && hill.h < 0.002 && lastDraw > -Infinity;
      if (still || time - lastDraw < FRAME_MS) return;
      lastDraw = time;

      // The terrain: two layers of drifting noise, plus the cursor's hill.
      const t = clock * 0.06;
      const s = 1 / 260;
      const inv = 1 / (2 * HILL_RADIUS * HILL_RADIUS);
      for (let j = 0; j < rows; j++) {
        const y = (j - 1) * STEP;
        for (let i = 0; i < cols; i++) {
          const x = (i - 1) * STEP;
          let v = noise(x * s + t, y * s - t * 0.7) * 0.75 + noise(x * s * 2.3 - t * 1.3, y * s * 2.3 + t) * 0.3;
          if (hill.h > 0.002) {
            const dx = x - hill.x;
            const dy = y - hill.y;
            v += hill.h * Math.exp(-(dx * dx + dy * dy) * inv);
          }
          field[j * cols + i] = v;
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      // Marching squares, one pass per cell over every level that crosses it.
      const minor = new Path2D();
      const major = new Path2D();
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const a = field[j * cols + i];
          const b = field[j * cols + i + 1];
          const c = field[(j + 1) * cols + i + 1];
          const d = field[(j + 1) * cols + i];
          const lo = Math.min(a, b, c, d);
          const hi = Math.max(a, b, c, d);
          const first = Math.ceil(lo / LEVEL_GAP);
          const last = Math.floor(hi / LEVEL_GAP);
          if (first > last) continue;
          const x0 = (i - 1) * STEP;
          const y0 = (j - 1) * STEP;
          for (let n = first; n <= last; n++) {
            const level = n * LEVEL_GAP;
            const pts: number[] = [];
            const cross = (p: number, q: number, ax: number, ay: number, bx: number, by: number) => {
              if (p < level === q < level) return;
              const f = (level - p) / (q - p);
              pts.push(x0 + (ax + (bx - ax) * f) * STEP, y0 + (ay + (by - ay) * f) * STEP);
            };
            cross(a, b, 0, 0, 1, 0);
            cross(b, c, 1, 0, 1, 1);
            cross(d, c, 0, 1, 1, 1);
            cross(a, d, 0, 0, 0, 1);
            const path = n % MAJOR_EVERY === 0 ? major : minor;
            for (let p = 0; p + 3 < pts.length; p += 4) {
              path.moveTo(pts[p], pts[p + 1]);
              path.lineTo(pts[p + 2], pts[p + 3]);
            }
          }
        }
      }
      ctx.strokeStyle = 'rgba(32, 30, 29, 0.13)';
      ctx.stroke(minor);
      ctx.strokeStyle = 'rgba(32, 30, 29, 0.24)';
      ctx.stroke(major);

      mirrored = false;
      copyToMirror();
    });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-contours" aria-hidden="true" />;
}
