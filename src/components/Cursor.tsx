import { useEffect, useRef } from 'react';
import { hasFinePointer, onFrame, pointer, smoothing } from '../lib/motion';

/**
 * A dot that tracks the mouse exactly and a ring that trails it. The ring grows
 * over anything clickable and shows a label for `[data-cursor]` targets.
 * Mouse only.
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

    let ringX = pointer.x;
    let ringY = pointer.y;
    let shown = false;

    const onOver = (event: MouseEvent) => {
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

    document.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const stop = onFrame((_time, dt) => {
      if (pointer.movedAt > 0 && !shown) {
        shown = true;
        ringX = pointer.x;
        ringY = pointer.y;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      ringX += (pointer.x - ringX) * smoothing(0.2, dt);
      ringY += (pointer.y - ringY) * smoothing(0.2, dt);
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
    });

    return () => {
      stop();
      document.documentElement.classList.remove('has-cursor');
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
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
