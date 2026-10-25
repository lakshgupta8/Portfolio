import { useEffect, useRef } from 'react';
import { NAME, NAV_LINKS } from '../data/portfolio';
import { onFrame, scroll } from '../lib/motion';

export default function Nav() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let last = -1;
    return onFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? scroll.y / max : 0;
      if (Math.abs(progress - last) < 0.0005) return;
      last = progress;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    });
  }, []);

  return (
    <nav className="nav" aria-label="Primary">
      <a href="#top" className="nav-brand">
        {NAME}
      </a>
      <div className="nav-links">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <span ref={barRef} className="nav-progress" aria-hidden="true" />
    </nav>
  );
}
