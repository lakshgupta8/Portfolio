import { Fragment, useEffect, useRef } from 'react';
import { clamp, hasFinePointer, onFrame, pointer, pointerActive, scroll, smoothing } from '../lib/motion';

interface Props {
  text: string;
  /** Distance in px at which a letter starts to react to the cursor. */
  radius?: number;
  className?: string;
}

interface Instance {
  letters: HTMLSpanElement[];
  strength: number[];
  radius: number;
  visible: boolean;
}

// Every ProximityText on the page shares one loop. Each frame it first reads
// all letter positions, then writes all weights, so layout is computed once.
// It sleeps whenever the mouse, the scroll position and the letters are still.
const instances = new Set<Instance>();
let stopLoop: (() => void) | null = null;
let seen = { moved: -1, scrollY: -1, inside: false };
let settling = false;

function tick(_time: number, dt: number) {
  const changed =
    pointer.movedAt !== seen.moved || scroll.y !== seen.scrollY || pointer.inside !== seen.inside;
  if (!changed && !settling) {
    stopLoop?.();
    stopLoop = null;
    return;
  }
  seen = { moved: pointer.movedAt, scrollY: scroll.y, inside: pointer.inside };
  const active = pointerActive();

  const work: { inst: Instance; rects: DOMRect[] | null }[] = [];
  instances.forEach((inst) => {
    const reacting = active && inst.visible;
    // Offscreen or mouse gone: still ease any swollen letters back to normal.
    if (!reacting && inst.strength.every((v) => v === 0)) return;
    work.push({ inst, rects: reacting ? inst.letters.map((l) => l.getBoundingClientRect()) : null });
  });

  const k = smoothing(0.18, dt);
  settling = false;
  work.forEach(({ inst, rects }) => {
    inst.letters.forEach((letter, i) => {
      let target = 0;
      if (rects) {
        const rect = rects[i];
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const near = clamp(1 - Math.hypot(dx, dy) / inst.radius, 0, 1);
        target = near * near;
      }
      if (target === 0 && inst.strength[i] === 0) return;
      let next = inst.strength[i] + (target - inst.strength[i]) * k;
      if (Math.abs(next - target) < 0.002) next = target;
      else settling = true;
      inst.strength[i] = next;
      letter.style.setProperty('--px', next.toFixed(3));
    });
  });
}

function wake() {
  if (!stopLoop && instances.size > 0) stopLoop = onFrame(tick);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', wake, { passive: true });
  window.addEventListener('scroll', wake, { passive: true });
  document.documentElement.addEventListener('mouseleave', wake);
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
    if (!root || !hasFinePointer()) return;

    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>('.px-letter'));
    const inst: Instance = { letters, strength: letters.map(() => 0), radius, visible: false };
    instances.add(inst);

    const io = new IntersectionObserver(([entry]) => {
      inst.visible = entry.isIntersecting;
      if (inst.visible) wake();
    });
    io.observe(root);

    return () => {
      instances.delete(inst);
      io.disconnect();
      letters.forEach((letter) => letter.style.removeProperty('--px'));
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
