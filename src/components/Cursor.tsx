import { useEffect, useRef } from 'react';
import { guide, hasFinePointer, onFrame, pointer, pointerActive, smoothing } from '../lib/motion';

/**
 * A dot that tracks the mouse exactly and a ring that trails it. The ring grows
 * over anything clickable and shows a label for `[data-cursor]` targets.
 * Mouse only. While `guide.target` is set, both glide onto that element
 * instead (see guideCursor).
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label || !hasFinePointer()) return;

    document.documentElement.classList.add('has-cursor');

    let dotX = pointer.x;
    let dotY = pointer.y;
    let ringX = pointer.x;
    let ringY = pointer.y;
    let shown = false;

    const onOver = (event: MouseEvent) => {
      if (guide.target) return;
      const target = event.target as Element | null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      const clickable = target?.closest('a, button, [role="button"]');
      ring.classList.toggle('is-hover', Boolean(clickable || labelled));
      ring.classList.toggle('is-label', Boolean(labelled));
      label.textContent = labelled?.dataset.cursor ?? '';
    };
    const onLeave = () => {
      shown = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    // Scrolling by wheel or keys while led lets go, so the cursor doesn't
    // ride along with a link the reader has moved away from.
    const release = () => {
      if (!guide.target) return;
      guide.target = null;
      onMove();
    };

    document.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('keydown', release);

    // Runs only while the dot or ring is still moving, then stops.
    let stop: (() => void) | null = null;
    const tick = (_time: number, dt: number) => {
      if (!pointerActive() || pointer.kind !== 'mouse') return;
      // The real mouse moving takes the cursor back.
      if (guide.target && Math.hypot(pointer.x - guide.fromX, pointer.y - guide.fromY) > 3) {
        guide.target = null;
      }
      if (!shown) {
        shown = true;
        dotX = ringX = pointer.x;
        dotY = ringY = pointer.y;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      let goalX = pointer.x;
      let goalY = pointer.y;
      if (guide.target) {
        // Follow the element every frame: it moves while the page scrolls.
        const rect = guide.target.getBoundingClientRect();
        goalX = rect.left + rect.width / 2;
        goalY = rect.top + rect.height / 2;
        dotX += (goalX - dotX) * smoothing(0.14, dt);
        dotY += (goalY - dotY) * smoothing(0.14, dt);
      } else {
        dotX = goalX;
        dotY = goalY;
      }
      ringX += (dotX - ringX) * smoothing(0.2, dt);
      ringY += (dotY - ringY) * smoothing(0.2, dt);
      dot.style.transform = `translate3d(${dotX.toFixed(1)}px, ${dotY.toFixed(1)}px, 0)`;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
      const settled =
        Math.abs(goalX - dotX) < 0.1 &&
        Math.abs(goalY - dotY) < 0.1 &&
        Math.abs(dotX - ringX) < 0.1 &&
        Math.abs(dotY - ringY) < 0.1;
      if (settled) {
        stop?.();
        stop = null;
      }
    };
    function onMove() {
      if (!stop) stop = onFrame(tick);
    }
    const onGuide = () => {
      ring.classList.add('is-hover');
      ring.classList.remove('is-label');
      label.textContent = '';
      onMove();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onMove, { passive: true });
    window.addEventListener('cursorguide', onGuide);

    return () => {
      stop?.();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onMove);
      window.removeEventListener('cursorguide', onGuide);
      document.documentElement.classList.remove('has-cursor');
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('wheel', release);
      window.removeEventListener('keydown', release);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
