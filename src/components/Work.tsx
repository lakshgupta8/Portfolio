import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FEATURED, GITHUB_URL, MORE_PROJECTS, PROJECTS, slugify, type Project } from '../data/portfolio';
import { hasFinePointer, onFrame, pointer, smoothing } from '../lib/motion';

const STIFFNESS = 0.16;
const DAMPING = 0.6;

/**
 * One dark panel sits behind the project cards and springs from card to card
 * as the pointer moves, carrying a soft glow that trails the cursor. Cards
 * invert their text while hovered; the panel supplies the background.
 */
function useGlidingHover(
  gridRef: React.RefObject<HTMLDivElement | null>,
  panelRef: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const grid = gridRef.current;
    const panel = panelRef.current;
    if (!grid || !panel || !hasFinePointer()) return;

    grid.classList.add('is-gliding');
    let active: HTMLElement | null = null;
    const box = { x: 0, y: 0, w: 0, h: 0 };
    const vel = { x: 0, y: 0, w: 0, h: 0 };
    let opacity = 0;
    let placed = false;
    const spot = { x: 0, y: 0 };

    const onOver = (event: PointerEvent) => {
      const card = (event.target as Element).closest<HTMLElement>('.project, .featured');
      if (card) active = card;
    };
    const onLeave = () => {
      active = null;
    };
    grid.addEventListener('pointerover', onOver);
    grid.addEventListener('pointerleave', onLeave);

    const stop = onFrame((_time, dt) => {
      const step = dt / 16.67;
      opacity += ((active ? 1 : 0) - opacity) * smoothing(active ? 0.25 : 0.12, dt);
      if (!active && opacity < 0.01) {
        if (placed) {
          panel.style.opacity = '0';
          placed = false;
        }
        return;
      }

      if (active) {
        const target = {
          x: active.offsetLeft,
          y: active.offsetTop,
          w: active.offsetWidth,
          h: active.offsetHeight,
        };
        if (!placed) {
          // First card: appear in place rather than flying in from the corner.
          Object.assign(box, target);
          vel.x = vel.y = vel.w = vel.h = 0;
          placed = true;
        }
        (['x', 'y', 'w', 'h'] as const).forEach((key) => {
          vel[key] = (vel[key] + (target[key] - box[key]) * STIFFNESS * step) * Math.pow(DAMPING, step);
          box[key] += vel[key] * step;
        });
      }

      const rect = grid.getBoundingClientRect();
      const k = smoothing(0.18, dt);
      spot.x += (pointer.x - rect.left - box.x - spot.x) * k;
      spot.y += (pointer.y - rect.top - box.y - spot.y) * k;

      panel.style.opacity = opacity.toFixed(3);
      panel.style.transform = `translate3d(${box.x.toFixed(1)}px, ${box.y.toFixed(1)}px, 0)`;
      panel.style.width = `${box.w.toFixed(1)}px`;
      panel.style.height = `${box.h.toFixed(1)}px`;
      panel.style.setProperty('--spot-x', `${spot.x.toFixed(1)}px`);
      panel.style.setProperty('--spot-y', `${spot.y.toFixed(1)}px`);
    });

    return () => {
      stop();
      grid.classList.remove('is-gliding');
      grid.removeEventListener('pointerover', onOver);
      grid.removeEventListener('pointerleave', onLeave);
    };
  }, [gridRef, panelRef]);
}

function Links({ project }: { project: Project }) {
  return (
    <div className="project-links">
      {project.live && (
        <a href={project.live} target="_blank" rel="noopener noreferrer">
          Live
          <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
        </a>
      )}
      <a href={project.source} target="_blank" rel="noopener noreferrer">
        Source
        <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
      </a>
    </div>
  );
}

function Meta({ project }: { project: Project }) {
  return (
    <div className="project-meta">
      <span className="project-num">{project.num}</span>
      <span className="project-kind">
        {project.kind} · {project.year}
      </span>
    </div>
  );
}

export default function Work() {
  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useGlidingHover(gridRef, panelRef);

  return (
    <section id="work" className="section">
      <div className="container">
        <div className="section-head" data-reveal="">
          <h2 className="eyebrow">01 — Selected work</h2>
          <p className="section-title">
            Eight builds across the browser, two game engines and Android. Two of them get a closer
            look.
          </p>
        </div>

        <div ref={gridRef} className="cell-grid projects-grid">
          <div ref={panelRef} className="work-glide" aria-hidden="true" />
          {FEATURED.map((project) => (
            <article key={project.num} id={slugify(project.title)} className="cell featured" data-reveal="">
              <Meta project={project} />
              <h3 className="featured-title">{project.title}</h3>
              <p className="featured-desc">{project.desc}</p>
              <p className="project-stack">{project.stack}</p>
              <ul className="featured-list">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Links project={project} />
            </article>
          ))}

          {PROJECTS.map((project) => (
            <article key={project.num} id={slugify(project.title)} className="cell project" data-reveal="">
              <Meta project={project} />
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.desc}</p>
              <p className="project-stack">{project.stack}</p>
              <Links project={project} />
            </article>
          ))}
        </div>

        <p className="projects-note" data-reveal="">
          Also built:{' '}
          {MORE_PROJECTS.map((item, index) => (
            <span key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
              {index < MORE_PROJECTS.length - 1 ? ', ' : ''}
            </span>
          ))}
          , and the rest on{' '}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            github.com/lakshgupta8
          </a>
          .
        </p>
      </div>
    </section>
  );
}
