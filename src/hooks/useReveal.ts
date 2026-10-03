import { useEffect } from 'react';

/**
 * Adds the `pf-in` class to every `[data-reveal]` element the first time it
 * scrolls into view. Respects reduced-motion users by revealing everything
 * immediately.
 */
export function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (elements.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('pf-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('pf-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
