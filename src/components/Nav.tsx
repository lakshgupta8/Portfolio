import { useEffect, useRef, useState } from 'react';
import { EMAIL, NAME, NAV_LINKS } from '../data/portfolio';
import ProximityText from './ProximityText';

export default function Nav() {
  const barRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

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

  // The phone menu: lock the page behind it, close on Escape, and move focus
  // into it on open and back to the button on close.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add('menu-open');
    menuRef.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 640) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    const button = buttonRef.current;
    return () => {
      root.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      button?.focus();
    };
  }, [open]);

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
      <button
        ref={buttonRef}
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="nav-toggle-icon" aria-hidden="true" />
        {open ? 'Close' : 'Menu'}
      </button>
      <div
        id="nav-menu"
        ref={menuRef}
        className={`nav-menu${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        <ol className="nav-menu-links">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} style={{ '--i': i } as React.CSSProperties}>
              <a href={link.href} onClick={() => setOpen(false)}>
                <span className="nav-menu-num">{String(i + 1).padStart(2, '0')}</span>
                <ProximityText text={link.label} radius={140} />
              </a>
            </li>
          ))}
        </ol>
        <a className="nav-menu-mail" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </div>
      <span ref={barRef} className="nav-progress" aria-hidden="true" />
    </nav>
  );
}
