import { STACK } from '../data/portfolio';

export default function Stack() {
  return (
    <section id="stack" className="section">
      <div className="container">
        <div className="section-head" data-reveal="">
          <h2 className="eyebrow">02 — Stack</h2>
          <p className="section-title">
            Everything here has shipped in at least one of the projects above. Nothing is
            aspirational.
          </p>
        </div>
        <div className="cell-grid tiles-grid">
          {STACK.map((group) => (
            <div key={group.num} className="cell tile" data-reveal="">
              <div className="tile-meta">
                <span className="tile-num">{group.num}</span>
                <span className="tile-phase">{group.phase}</span>
              </div>
              <h3 className="tile-title">{group.title}</h3>
              <p className="tile-desc">{group.desc}</p>
              <div className="tile-tools">
                {group.tools.map((tool) => (
                  <span key={tool} className="tool">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
