import { ArrowUpRight } from 'lucide-react';
import { FEATURED, GITHUB_URL, MORE_PROJECTS, PROJECTS, type Project } from '../data/portfolio';

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

        <div className="cell-grid projects-grid">
          {FEATURED.map((project) => (
            <article key={project.num} className="cell featured" data-reveal="">
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
            <article key={project.num} className="cell project" data-reveal="">
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
          , and thirty more on{' '}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            github.com/lakshgupta8
          </a>
          .
        </p>
      </div>
    </section>
  );
}
