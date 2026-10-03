import { NAV_LINKS } from '../data/portfolio';

export default function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <a href="#top" className="nav-brand">
        LG<span className="nav-brand-full"> — Lakshya Gupta</span>
      </a>
      <div className="nav-links">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
