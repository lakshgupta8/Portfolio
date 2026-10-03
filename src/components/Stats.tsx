import { STATS } from '../data/portfolio';

export default function Stats() {
  return (
    <section className="stats" aria-label="At a glance">
      <div className="stats-grid">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat" data-reveal="">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
