import { PATH } from '../data/portfolio';

export default function Path() {
  return (
    <section id="path" className="section">
      <div className="container">
        <div className="section-head" data-reveal="">
          <h2 className="eyebrow">03 — The road so far</h2>
          <p className="section-title">
            Twelve months from a first Tailwind page to a Next.js app with migrations and error
            tracking.
          </p>
        </div>
        <ol className="path">
          {PATH.map((step) => (
            <li key={step.when} className="path-row" data-reveal="">
              <span className="path-when">{step.when}</span>
              <span className="path-title">{step.title}</span>
              <span className="path-detail">{step.detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
