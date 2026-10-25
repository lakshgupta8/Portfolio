import { useEffect, useRef } from 'react';
import { hasFinePointer, onFrame, pointer, prefersReducedMotion, smoothing } from '../lib/motion';

const SCALE = 0.5; // the canvas renders at half size; the blobs are soft anyway
const IDLE_AFTER_MS = 2200;

// Each blob trails the one before it, so the glow moves like smoke behind the
// cursor. `wobble` and the two frequencies give each one its own wander.
const BLOBS = [
  { radius: 300, alpha: 0.11, lag: 0.16, wobble: 18, f1: 0.0011, f2: 0.0017 },
  { radius: 240, alpha: 0.09, lag: 0.1, wobble: 46, f1: 0.0009, f2: 0.0013 },
  { radius: 210, alpha: 0.08, lag: 0.075, wobble: 64, f1: 0.0007, f2: 0.0019 },
  { radius: 260, alpha: 0.06, lag: 0.055, wobble: 82, f1: 0.0012, f2: 0.0006 },
  { radius: 180, alpha: 0.07, lag: 0.04, wobble: 96, f1: 0.0005, f2: 0.0015 },
];

/**
 * A soft ink glow that follows the cursor through the hero with a little
 * randomness in how it flows, and lights up a sharper grid underneath it.
 * When the mouse is still (or on touch) the glow wanders on its own, unless
 * the visitor prefers reduced motion.
 */
export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !hero || !ctx) return;

    const fine = hasFinePointer();
    const ambient = !prefersReducedMotion();
    let width = 0;
    let height = 0;
    const resize = () => {
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = Math.round(width * SCALE);
      canvas.height = Math.round(height * SCALE);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(hero);

    // A spring-driven leader, then the chain of blobs behind it.
    const lead = { x: width * 0.62, y: height * 0.45, vx: 0, vy: 0 };
    const trail = BLOBS.map(() => ({ x: lead.x, y: lead.y }));
    const phase = BLOBS.map(() => Math.random() * Math.PI * 2);

    const stop = onFrame((time, dt) => {
      if (!visible || width === 0) return;
      const rect = hero.getBoundingClientRect();
      const live =
        fine &&
        (time - pointer.movedAt < IDLE_AFTER_MS || !ambient) &&
        pointer.x >= rect.left &&
        pointer.x <= rect.right &&
        pointer.y >= rect.top &&
        pointer.y <= rect.bottom;

      let tx = lead.x;
      let ty = lead.y;
      if (live) {
        tx = pointer.x - rect.left;
        ty = pointer.y - rect.top;
      } else if (ambient) {
        tx = width * (0.55 + 0.3 * Math.sin(time * 0.00023) + 0.1 * Math.sin(time * 0.00061 + 2));
        ty = height * (0.48 + 0.26 * Math.sin(time * 0.00031 + 1) + 0.08 * Math.sin(time * 0.00073));
      }

      const step = dt / 16.67;
      lead.vx = (lead.vx + (tx - lead.x) * 0.045 * step) * Math.pow(0.84, step);
      lead.vy = (lead.vy + (ty - lead.y) * 0.045 * step) * Math.pow(0.84, step);
      lead.x += lead.vx * step;
      lead.y += lead.vy * step;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let px = lead.x;
      let py = lead.y;
      BLOBS.forEach((blob, i) => {
        const p = phase[i];
        const wx = blob.wobble * (Math.sin(time * blob.f1 + p) + 0.6 * Math.sin(time * blob.f2 + p * 1.7));
        const wy = blob.wobble * (Math.cos(time * blob.f2 + p) + 0.6 * Math.sin(time * blob.f1 + p * 2.3));
        const k = smoothing(blob.lag, dt);
        trail[i].x += (px + wx - trail[i].x) * k;
        trail[i].y += (py + wy - trail[i].y) * k;
        px = trail[i].x;
        py = trail[i].y;

        const cx = trail[i].x * SCALE;
        const cy = trail[i].y * SCALE;
        const r = blob.radius * SCALE;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `rgba(32, 30, 29, ${blob.alpha})`);
        gradient.addColorStop(0.55, `rgba(32, 30, 29, ${blob.alpha * 0.45})`);
        gradient.addColorStop(1, 'rgba(32, 30, 29, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      });

      // Lights up the sharper grid under the glow.
      hero.style.setProperty('--glow-x', `${trail[0].x.toFixed(1)}px`);
      hero.style.setProperty('--glow-y', `${trail[0].y.toFixed(1)}px`);
    });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-field" aria-hidden="true" />;
}
