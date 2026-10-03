import { ArrowUpRight } from 'lucide-react';
import { EMAIL, HERO, NAME } from '../data/portfolio';

export default function Hero() {
  return (
    <header id="top" className="hero">
      <div>
        <p className="hero-kicker">{HERO.kicker}</p>
        <h1 className="hero-title">
          {HERO.lines.map((line) => (
            <span key={line} className="hero-line">
              <span>{line}</span>
            </span>
          ))}
          <span className="hero-line">
            <span>
              {HERO.lastLine}
              <span className="hero-accent">{HERO.lastLineAccent}</span>
            </span>
          </span>
        </h1>
        <p className="hero-lede">{HERO.lede}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#work">
            See the work
            <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
          </a>
          <a className="btn btn-secondary" href={`mailto:${EMAIL}`}>
            Email me
          </a>
        </div>
      </div>
      <figure className="hero-figure grayscale">
        <img src="/lakshya.png" alt={NAME} width={1024} height={1536} />
        <figcaption>{HERO.caption}</figcaption>
      </figure>
    </header>
  );
}
