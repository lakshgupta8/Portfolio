import { EMAIL, GITHUB_URL, LINKEDIN_URL, NAME } from '../data/portfolio';
import ProximityText from './ProximityText';

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="contact">
      <div className="container">
        <p className="contact-eyebrow" data-reveal="">
          05 — Contact
        </p>
        <a className="contact-link" href={`mailto:${EMAIL}`} data-reveal="" data-cursor="Write">
          <ProximityText className="contact-big" text="Let's build something" radius={220} />
          <span className="contact-mail">→ {EMAIL}</span>
        </a>
        <p className="contact-sub" data-reveal="">
          Hiring a software engineer for web, games or mobile? Send a job description and a repo to look at.        </p>
        <div className="contact-footer" data-reveal="">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
          <span className="contact-copyright">
            © {year} {NAME}
          </span>
        </div>
      </div>
    </section>
  );
}
