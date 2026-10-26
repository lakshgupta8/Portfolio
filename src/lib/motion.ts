// One shared animation loop and pointer store for every interactive effect on
// the page. Effects subscribe with onFrame() and read `pointer` directly, so
// nothing re-renders React on mouse move. The loop only runs while something
// is subscribed.

export type FrameCallback = (time: number, dt: number) => void;

const subscribers = new Set<FrameCallback>();
let rafId = 0;
let lastTime = -1;

function loop(time: number) {
  // The first frame of a run has no previous timestamp; treat it as dt = 0.
  const dt = lastTime < 0 ? 0 : Math.min(64, Math.max(0, time - lastTime));
  lastTime = time;
  subscribers.forEach((cb) => cb(time, dt));
  if (subscribers.size > 0) {
    rafId = requestAnimationFrame(loop);
  } else {
    rafId = 0;
    lastTime = -1;
  }
}

export function onFrame(cb: FrameCallback): () => void {
  subscribers.add(cb);
  if (!rafId) rafId = requestAnimationFrame(loop);
  return () => {
    subscribers.delete(cb);
  };
}

/**
 * Like onFrame, but only subscribed while `el` is on screen, so offscreen
 * effects cost nothing. Returns a cleanup function.
 */
export function onFrameWhileVisible(el: Element, cb: FrameCallback): () => void {
  let stop: (() => void) | null = null;
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !stop) stop = onFrame(cb);
    else if (!entry.isIntersecting && stop) {
      stop();
      stop = null;
    }
  });
  io.observe(el);
  return () => {
    io.disconnect();
    stop?.();
  };
}

export const pointer = {
  x: 0,
  y: 0,
  /** performance.now() of the last real mouse movement, or -Infinity if none yet */
  movedAt: -Infinity,
  /** whether the mouse is over the page, or a finger is on the screen */
  inside: false,
  /** what last moved the pointer */
  kind: 'none' as 'none' | 'mouse' | 'touch',
};

/**
 * True when a mouse has moved and is still over the page, or a finger is
 * currently on the screen (including while it scrolls the page).
 */
export const pointerActive = () => pointer.inside && pointer.movedAt > 0;

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.movedAt = performance.now();
      pointer.inside = true;
      pointer.kind = 'mouse';
    },
    { passive: true },
  );

  // Touch: follow the finger, including while it scrolls the page (pointer
  // events stop once the browser takes over scrolling; touch events don't).
  const onTouch = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    pointer.x = touch.clientX;
    pointer.y = touch.clientY;
    pointer.movedAt = performance.now();
    pointer.inside = true;
    pointer.kind = 'touch';
  };
  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length === 0) pointer.inside = false;
  };
  window.addEventListener('touchstart', onTouch, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => {
    pointer.inside = false;
  });
  window.addEventListener('blur', () => {
    pointer.inside = false;
  });
}

/**
 * Where the custom cursor is being led, if anywhere. A page can't move the
 * real mouse, but it hides it behind the custom cursor, so gliding that onto
 * an element reads as the cursor moving there. It lets go when the mouse moves.
 */
export const guide = { target: null as HTMLElement | null, fromX: 0, fromY: 0 };

export function guideCursor(target: HTMLElement) {
  guide.target = target;
  guide.fromX = pointer.x;
  guide.fromY = pointer.y;
  window.dispatchEvent(new Event('cursorguide'));
}

/** Current scroll position, kept up to date by a passive scroll listener. */
export const scroll = { y: 0 };

if (typeof window !== 'undefined') {
  scroll.y = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      scroll.y = window.scrollY;
    },
    { passive: true },
  );
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
