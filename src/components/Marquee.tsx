import { MARQUEE } from '../data/portfolio';

function Group() {
  return (
    <div className="marquee-group">
      {MARQUEE.map((item) => (
        <span key={item}>
          {item}
          <span aria-hidden="true"> ·</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Group />
        <Group />
      </div>
    </div>
  );
}
