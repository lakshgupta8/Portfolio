import { Fragment, useEffect, useRef, useSyncExternalStore } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { EMAIL, HERO, HERO_TAGS, NAME } from '../data/portfolio';
import { clamp, hasFinePointer, onFrameWhileVisible, pointer, pointerActive, prefersReducedMotion, smoothing } from '../lib/motion';
import AsciiPortrait from './AsciiPortrait';
import HeroField from './HeroField';
import ProximityText from './ProximityText';
import { useHeroReveal } from './useHeroReveal';

const LAYER_TRAVEL = 34;

/**
 * Moves every `[data-depth]` element in the hero with the cursor (both layers,
 * so they stay aligned) and tilts the portrait. Cursor-driven motion runs for
 * everyone; the idle drift without a cursor is skipped for reduced-motion users.
 */
function useHeroMotion(heroRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
      el,
      depth: Number(el.dataset.depth),
    }));
    const fine = hasFinePointer();
    const ambient = !prefersReducedMotion();


    let mx = 0;
    let my = 0;

    const stop = onFrameWhileVisible(hero, (time, dt) => {
      const k = smoothing(0.08, dt);
      const heroRect = hero.getBoundingClientRect();

      const inHero =
        pointerActive() &&
        pointer.x >= heroRect.left &&
        pointer.x <= heroRect.right &&
        pointer.y >= heroRect.top &&
        pointer.y <= heroRect.bottom;
      const live = fine && inHero;

      let tx = 0;
      let ty = 0;
      if (live) {
        tx = clamp(((pointer.x - heroRect.left) / heroRect.width) * 2 - 1, -1, 1);
        ty = clamp(((pointer.y - heroRect.top) / heroRect.height) * 2 - 1, -1, 1);
      } else if (ambient) {
        tx = Math.sin(time * 0.00042) * 0.55;
        ty = Math.sin(time * 0.00057 + 1.3) * 0.45;
      }
      mx += (tx - mx) * k;
      my += (ty - my) * k;

      const progress = clamp(-heroRect.top / heroRect.height, 0, 1);

      layers.forEach(({ el, depth }) => {
        const x = mx * depth * LAYER_TRAVEL;
        const y = my * depth * LAYER_TRAVEL - progress * depth * 90;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
      hero.style.setProperty('--hero-progress', progress.toFixed(3));
      hero.style.setProperty('--tilt-x', `${(-my * 7).toFixed(2)}deg`);
      hero.style.setProperty('--tilt-y', `${(mx * 9).toFixed(2)}deg`);
    });

    return () => {
      stop();
    };
  }, [heroRef]);
}

// One clock for the "Now shipping" line, shared by both hero layers so they
// stay in step; only the two lists re-render when it ticks.
const nowClock = {
  index: 0,
  listeners: new Set<() => void>(),
  timer: 0,
  subscribe(listener: () => void) {
    nowClock.listeners.add(listener);
    if (!nowClock.timer) {
      nowClock.timer = window.setInterval(() => {
        nowClock.index = (nowClock.index + 1) % HERO.now.length;
        nowClock.listeners.forEach((l) => l());
      }, 2600);
    }
    return () => {
      nowClock.listeners.delete(listener);
      if (nowClock.listeners.size === 0) {
        window.clearInterval(nowClock.timer);
        nowClock.timer = 0;
      }
    };
  },
  get: () => nowClock.index,
};

function NowShipping() {
  const index = useSyncExternalStore(nowClock.subscribe, nowClock.get, nowClock.get);
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

/**
 * The hero's content. Rendered twice: once normally, and once as the
 * alternate layer (`alt`), which has the same layout so the two line up
 * exactly, but is drawn as a dark negative with the portrait in ASCII.
 */
function HeroContent({ alt = false }: { alt?: boolean }) {
  return (
    <div className="hero-inner">
      <div className="hero-copy" data-depth="0.12">
        <p className="hero-kicker">{HERO.kicker}</p>
        {alt ? (
          <p className="hero-title" role="presentation">
            <HeroName />
          </p>
        ) : (
          <h1 className="hero-title">
            <HeroName />
          </h1>
        )}
        <p className="hero-lede">{HERO.lede}</p>
        <NowShipping />
        <div className="hero-actions">
          <a className="btn btn-primary" href="#work" tabIndex={alt ? -1 : undefined}>
            See the work
            <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
          </a>
          <a
            className="btn btn-secondary"
            href={`mailto:${EMAIL}`}
            tabIndex={alt ? -1 : undefined}
          >
            Email me
          </a>
        </div>
      </div>

      <div className="hero-stage">
        <div className="hero-figure-wrap" data-depth="0.35">
          <figure className="hero-figure" data-cursor={alt ? undefined : 'Look'}>
            <div className="hero-photo-frame">
              <img
                className="hero-photo"
                src="/lakshya.png"
                alt={alt ? '' : NAME}
                width={1024}
                height={1536}
              />
              {alt && <AsciiPortrait />}
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
            tabIndex={alt ? -1 : undefined}
          >
            <span className="hero-tag-kind">{tag.kind}</span>
            {tag.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * The reveal layer sits on top of the real hero, so its copies of the buttons
 * and tags would hide the real ones' :hover styles. Mirror the hover state
 * onto the copies (as `.is-hover`) so the feedback shows in both layers.
 */
function useMirroredHover(
  heroRef: React.RefObject<HTMLElement | null>,
  altRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const hero = heroRef.current;
    const alt = altRef.current;
    if (!hero || !alt) return;
    const selector = '.btn, .hero-tag';
    const real = Array.from(hero.querySelectorAll<HTMLElement>(`:scope > .hero-inner :is(${selector})`));
    const copies = Array.from(alt.querySelectorAll<HTMLElement>(selector));
    const cleanups = real.map((el, i) => {
      const copy = copies[i];
      if (!copy) return () => {};
      const on = () => copy.classList.add('is-hover');
      const off = () => copy.classList.remove('is-hover');
      el.addEventListener('pointerenter', on);
      el.addEventListener('pointerleave', off);
      return () => {
        el.removeEventListener('pointerenter', on);
        el.removeEventListener('pointerleave', off);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [heroRef, altRef]);
}

function HeroName() {
  return HERO.name.map((part, i) => (
    <Fragment key={part}>
      {i > 0 && ' '}
      <span className="hero-line">
        <span>
          <ProximityText text={part} radius={220} />
        </span>
      </span>
    </Fragment>
  ));
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const altRef = useRef<HTMLDivElement>(null);
  useHeroMotion(heroRef);
  useHeroReveal(heroRef, altRef);
  useMirroredHover(heroRef, altRef);

  return (
    <header id="top" className="hero" ref={heroRef}>
      <HeroField />
      <div className="hero-grid" data-depth="-0.25" aria-hidden="true">
        <div className="hero-grid-lit" />
      </div>

      <HeroContent />

      <div ref={altRef} className="hero-alt" aria-hidden="true" inert>
        <div className="hero-grid" data-depth="-0.25" />
        <HeroContent alt />
      </div>

      <a className="hero-scroll" href="#work" aria-label="Scroll to work">
        <span className="hero-scroll-line" aria-hidden="true" />
        Scroll
      </a>
    </header>
  );
}
