import { EMAIL, GITHUB_URL, LINKEDIN_URL, NAME } from '../data/portfolio';

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="contact">
      <div className="container">
        <p className="contact-eyebrow" data-reveal="">
          05 — Contact
        </p>
        <a className="contact-link" href={`mailto:${EMAIL}`} data-reveal="">
          Let's build something → {EMAIL}
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
