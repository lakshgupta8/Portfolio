import { ABOUT } from '../data/portfolio';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about-grid">
          <h2 className="eyebrow" data-reveal="">
            04 — About
          </h2>
          <div data-reveal="">
            <p className="about-copy">{ABOUT.copy}</p>
          </div>
          <dl className="facts" data-reveal="">
            {ABOUT.facts.map((fact) => (
              <div key={fact.label} className="fact">
                <dt className="fact-label">{fact.label}</dt>
                <dd className="fact-value">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
