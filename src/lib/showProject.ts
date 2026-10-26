import { guideCursor } from './motion';

const GAP = 16; // px kept below the nav when a card is too tall to center

/**
 * Scrolls a project card to the middle of the screen (below the sticky nav),
 * swipes a phone carousel to it, then hands focus to its Source link and leads
 * the custom cursor there.
 */
export function showProject(card: HTMLElement) {
  // A card that hasn't revealed yet is still shifted down by its entrance
  // transform; measure where it will settle, not where it is mid-animation.
  const shift = new DOMMatrixReadOnly(getComputedStyle(card).transform).m42;
  const rect = card.getBoundingClientRect();
  const navBottom = Math.max(0, document.querySelector('.nav')?.getBoundingClientRect().bottom ?? 0);
  const room = window.innerHeight - navBottom;
  const top = rect.top - shift + window.scrollY;
  const offset = rect.height <= room ? navBottom + (room - rect.height) / 2 : navBottom + GAP;
  window.scrollTo({ top: Math.max(0, top - offset) });

  // On phones the cards sit in a horizontal swipe track.
  const track = card.parentElement;
  if (track && track.scrollWidth > track.clientWidth) {
    const trackRect = track.getBoundingClientRect();
    const left = track.scrollLeft + rect.left - trackRect.left - (track.clientWidth - rect.width) / 2;
    track.scrollTo({ left, behavior: 'smooth' });
  }

  const source = card.querySelector<HTMLElement>('.project-links a:last-child');
  if (!source) return;
  source.focus({ preventScroll: true });
  card.classList.add('is-cued');
  source.classList.add('is-cued');
  source.addEventListener(
    'blur',
    () => {
      card.classList.remove('is-cued');
      source.classList.remove('is-cued');
    },
    { once: true },
  );
  guideCursor(source);
}
