import { ArrowUpRight } from 'lucide-react';
import { FEATURED, GITHUB_URL, PROJECTS, type Project } from '../data/portfolio';

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

export default function Work() {
  return (
    <section id="work" className="section">
      <div className="container">
        <div className="section-head" data-reveal="">
          <h2 className="eyebrow">01 — Selected work</h2>
          <p className="section-title">
            Seven apps, each deployed and open-source. One of them has its own backend worth a
            closer look.
          </p>
        </div>

        <div className="cell-grid projects-grid">
          <article className="cell featured" data-reveal="">
            <div className="featured-main">
              <div className="project-meta">
                <span className="project-num">{FEATURED.num}</span>
                <span className="project-year">Featured · {FEATURED.year}</span>
              </div>
              <h3 className="featured-title">{FEATURED.title}</h3>
              <p className="featured-desc">{FEATURED.desc}</p>
              <p className="project-stack">{FEATURED.stack}</p>
              <Links project={FEATURED} />
            </div>
            <div className="featured-side">
              <p className="featured-side-label">What's inside</p>
              <ul className="featured-list">
                {FEATURED.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>

          {PROJECTS.map((project) => (
            <article key={project.num} className="cell project" data-reveal="">
              <div className="project-meta">
                <span className="project-num">{project.num}</span>
                <span className="project-year">{project.year}</span>
              </div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.desc}</p>
              <p className="project-stack">{project.stack}</p>
              <Links project={project} />
            </article>
          ))}
        </div>

        <p className="projects-note" data-reveal="">
          Thirty more repositories, from a click counter to a Next.js dashboard, on{' '}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            github.com/lakshgupta8
          </a>
          .
        </p>
      </div>
    </section>
  );
}
