import { Fragment, useEffect, useRef } from 'react';
import { clamp, hasFinePointer, onFrame, pointer, prefersReducedMotion, smoothing } from '../lib/motion';

interface Props {
  text: string;
  /** Distance in px at which a letter starts to react to the cursor. */
  radius?: number;
  className?: string;
}

/**
 * Text whose letters swell in weight and width as the cursor nears them,
 * using Archivo's variable `wght` and `wdth` axes. The full string stays in the
 * DOM for readers and agents; the per-letter spans are presentational.
 */
export default function ProximityText({ text, radius = 180, className }: Props) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || !hasFinePointer()) return;

    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>('.px-letter'));
    const strength = letters.map(() => 0);
    let visible = false;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(root);

    const stop = onFrame((_time, dt) => {
      if (!visible) return;
      const rects = letters.map((letter) => letter.getBoundingClientRect());
      const k = smoothing(0.18, dt);
      letters.forEach((letter, i) => {
        const rect = rects[i];
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const target = clamp(1 - Math.hypot(dx, dy) / radius, 0, 1);
        if (target === 0 && strength[i] === 0) return;
        const next = strength[i] + (target * target - strength[i]) * k;
        strength[i] = next < 0.002 && target === 0 ? 0 : next;
        letter.style.setProperty('--px', strength[i].toFixed(3));
      });
    });

    return () => {
      stop();
      io.disconnect();
    };
  }, [radius]);

  return (
    <span ref={rootRef} className={`px-text ${className ?? ''}`.trim()}>
      {text.split(' ').map((word, w, words) => (
        <Fragment key={`${word}-${w}`}>
          <span className="px-word">
            {Array.from(word).map((char, c) => (
              <span key={c} className="px-letter">
                {char}
              </span>
            ))}
          </span>
          {w < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}
