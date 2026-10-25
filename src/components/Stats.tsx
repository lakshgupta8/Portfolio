import { useEffect, useRef } from 'react';
import { STATS } from '../data/portfolio';
import { onFrame, prefersReducedMotion } from '../lib/motion';

const DURATION = 1400;

/** Counts a number up from a nearby start the first time it scrolls into view. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const target = Number(value);
    if (!el || !Number.isFinite(target) || prefersReducedMotion()) return;

    const start = target >= 1000 ? target - 30 : 0;
    let stop: (() => void) | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const began = performance.now();
        stop = onFrame((time) => {
          const t = Math.min(1, (time - began) / DURATION);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = String(Math.round(start + (target - start) * eased));
          if (t === 1) stop?.();
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      stop?.();
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className="stat-value">
      {value}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="stats" aria-label="At a glance">
      <div className="stats-grid">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat" data-reveal="">
            <CountUp value={stat.value} />
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
