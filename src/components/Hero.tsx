import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { EMAIL, HERO, HERO_TAGS, NAME } from '../data/portfolio';
import { clamp, hasFinePointer, onFrame, pointer, prefersReducedMotion, smoothing } from '../lib/motion';
import HeroField from './HeroField';
import PortraitReveal from './PortraitReveal';
import ProximityText from './ProximityText';

const IDLE_AFTER_MS = 2200;
const LAYER_TRAVEL = 34;

function useHeroMotion(heroRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion()) return;

    const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
      el,
      depth: Number(el.dataset.depth),
    }));
    const figure = hero.querySelector<HTMLElement>('.hero-figure');
    const fine = hasFinePointer();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(hero);

    let mx = 0;
    let my = 0;

    const stop = onFrame((time, dt) => {
      if (!visible) return;
      const k = smoothing(0.08, dt);
      const heroRect = hero.getBoundingClientRect();

      const inHero =
        pointer.x >= heroRect.left &&
        pointer.x <= heroRect.right &&
        pointer.y >= heroRect.top &&
        pointer.y <= heroRect.bottom;
      const live = fine && inHero && time - pointer.movedAt < IDLE_AFTER_MS;

      // Cursor drives the scene; without one, the scene drifts on its own.
      const tx = live
        ? clamp(((pointer.x - heroRect.left) / heroRect.width) * 2 - 1, -1, 1)
        : Math.sin(time * 0.00042) * 0.55;
      const ty = live
        ? clamp(((pointer.y - heroRect.top) / heroRect.height) * 2 - 1, -1, 1)
        : Math.sin(time * 0.00057 + 1.3) * 0.45;
      mx += (tx - mx) * k;
      my += (ty - my) * k;

      const progress = clamp(-heroRect.top / heroRect.height, 0, 1);

      layers.forEach(({ el, depth }) => {
        const x = mx * depth * LAYER_TRAVEL;
        const y = my * depth * LAYER_TRAVEL - progress * depth * 90;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
      hero.style.setProperty('--hero-progress', progress.toFixed(3));

      if (!figure) return;
      figure.style.setProperty('--tilt-x', `${(-my * 7).toFixed(2)}deg`);
      figure.style.setProperty('--tilt-y', `${(mx * 9).toFixed(2)}deg`);
    });

    return () => {
      stop();
      io.disconnect();
    };
  }, [heroRef]);
}

function NowShipping() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % HERO.now.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="hero-now">
      <span className="hero-now-label">
        <span className="hero-now-dot" aria-hidden="true" />
        Now shipping
      </span>
      <ul className="hero-now-list" aria-live="off">
        {HERO.now.map((item, i) => (
          <li key={item} className={i === index ? 'is-active' : undefined}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  useHeroMotion(heroRef);

  return (
    <header id="top" className="hero" ref={heroRef}>
      <HeroField />
      <div className="hero-grid" data-depth="-0.25" aria-hidden="true">
        <div className="hero-grid-lit" />
      </div>

      <div className="hero-inner">
        <div className="hero-copy" data-depth="0.12">
          <p className="hero-kicker">{HERO.kicker}</p>
          <h1 className="hero-title">
            {HERO.name.map((part, i) => (
              <Fragment key={part}>
                {i > 0 && ' '}
                <span className="hero-line">
                  <span>
                    <ProximityText text={part} radius={220} />
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>
          <p className="hero-lede">{HERO.lede}</p>
          <NowShipping />
          <div className="hero-actions">
            <a className="btn btn-primary" href="#work" data-magnetic="">
              See the work
              <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </a>
            <a className="btn btn-secondary" href={`mailto:${EMAIL}`} data-magnetic="">
              Email me
            </a>
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-figure-wrap" data-depth="0.35">
            <figure className="hero-figure" data-cursor="Look">
              <div className="hero-photo-frame">
                <img className="hero-photo" src="/lakshya.png" alt={NAME} width={1024} height={1536} />
                <PortraitReveal />
              </div>
              <figcaption>{HERO.caption}</figcaption>
            </figure>
          </div>
          {HERO_TAGS.map((tag) => (
            <a
              key={tag.label}
              className={`hero-tag hero-tag-${tag.slot}`}
              href={tag.href}
              data-depth={tag.depth}
            >
              <span className="hero-tag-kind">{tag.kind}</span>
              {tag.label}
            </a>
          ))}
        </div>
      </div>

      <a className="hero-scroll" href="#work" aria-label="Scroll to work">
        <span className="hero-scroll-line" aria-hidden="true" />
        Scroll
      </a>
    </header>
  );
}
