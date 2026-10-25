import { useEffect, useRef } from 'react';
import { NAME, NAV_LINKS } from '../data/portfolio';

export default function Nav() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
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
