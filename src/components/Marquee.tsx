import { useEffect, useRef } from 'react';
import { MARQUEE } from '../data/portfolio';
import { clamp, onFrame, prefersReducedMotion, scroll } from '../lib/motion';

const BASE_SPEED = 0.06; // px per ms

function Group() {
  return (
    <div className="marquee-group">
      {MARQUEE.map((item) => (
        <span key={item}>
          {item}
          <span aria-hidden="true"> ·</span>
        </span>
      ))}
    </div>
  );
}

/** A tech ticker that speeds up, skews and reverses with the scroll. */
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    // Reduced motion: no JS drive, and the CSS animation is switched off too.
    if (!track || prefersReducedMotion()) return;

    track.classList.add('is-driven');
    let offset = 0;
    let direction = -1;
    let velocity = 0;
    let lastY = scroll.y;

    const tick = (_time: number, dt: number) => {
      velocity += (scroll.y - lastY - velocity) * 0.2;
      lastY = scroll.y;
      if (Math.abs(velocity) > 0.5) direction = velocity > 0 ? -1 : 1;
      const boost = Math.min(Math.abs(velocity) * 0.04, 1.6);
      offset += direction * (BASE_SPEED + boost) * dt;
      const half = track.scrollWidth / 2;
      if (half > 0) offset = ((offset % half) - half) % half;
      const skew = clamp(-velocity * 0.12, -8, 8);
      track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    };

    // Only animate while the ticker is on screen.
    let stop: (() => void) | null = null;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !stop) {
        lastY = scroll.y;
        stop = onFrame(tick);
      } else if (!entry.isIntersecting && stop) {
        stop();
        stop = null;
      }
    });
    io.observe(track);

    return () => {
      io.disconnect();
      stop?.();
      track.classList.remove('is-driven');
    };
  }, []);

  return (
    <div className="marquee" aria-hidden="true">
      <div ref={trackRef} className="marquee-track">
        <Group />
        <Group />
      </div>
    </div>
  );
}
