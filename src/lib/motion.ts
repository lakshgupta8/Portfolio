// One shared animation loop and pointer store for every interactive effect on
// the page. Effects subscribe with onFrame() and read `pointer` directly, so
// nothing re-renders React on mouse move.

export type FrameCallback = (time: number, dt: number) => void;

const subscribers = new Set<FrameCallback>();
let rafId = 0;
let lastTime = 0;

function loop(time: number) {
  const dt = Math.min(64, time - lastTime);
  lastTime = time;
  subscribers.forEach((cb) => cb(time, dt));
  rafId = subscribers.size > 0 ? requestAnimationFrame(loop) : 0;
}

export function onFrame(cb: FrameCallback): () => void {
  subscribers.add(cb);
  if (!rafId) {
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }
  return () => {
    subscribers.delete(cb);
  };
}

export const pointer = {
  x: typeof window === 'undefined' ? 0 : window.innerWidth / 2,
  y: typeof window === 'undefined' ? 0 : window.innerHeight / 2,
  /** performance.now() of the last real pointer movement */
  movedAt: -Infinity,
};

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.movedAt = performance.now();
    },
    { passive: true },
  );
}

export const scroll = { y: 0, velocity: 0 };

if (typeof window !== 'undefined') {
  let previous = window.scrollY;
  scroll.y = previous;
  onFrame(() => {
    const y = window.scrollY;
    scroll.velocity += (y - previous - scroll.velocity) * 0.2;
    scroll.y = y;
    previous = y;
  });
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasFinePointer(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Frame-rate independent smoothing factor for a per-60fps-frame amount. */
export const smoothing = (amount: number, dt: number) => 1 - Math.pow(1 - amount, dt / 16.67);
