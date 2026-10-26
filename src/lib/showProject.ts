const GAP = 16; // px kept below the nav when a card is too tall to center
const CUE_MS = 5000; // how long the card keeps its hover look

/**
 * Scrolls a project card to the middle of the screen (below the sticky nav),
 * swipes a phone carousel to it, then hands focus to its Source link and
 * shows the card as if it were hovered.
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
  cue(card, source);
}

let clearCue = () => {};

// Gives the card its hover look, as if the pointer rested on its Source link,
// for a few seconds. The link keeps focus, so Enter opens it.
function cue(card: HTMLElement, source: HTMLElement) {
  clearCue();
  const cardRect = card.getBoundingClientRect();
  const linkRect = source.getBoundingClientRect();
  card.style.setProperty('--spot-x', `${linkRect.left + linkRect.width / 2 - cardRect.left}px`);
  card.style.setProperty('--spot-y', `${linkRect.top + linkRect.height / 2 - cardRect.top}px`);
  card.classList.add('is-cued');
  source.classList.add('is-cued');
  const timer = window.setTimeout(() => clearCue(), CUE_MS);
  clearCue = () => {
    window.clearTimeout(timer);
    card.classList.remove('is-cued');
    source.classList.remove('is-cued');
    clearCue = () => {};
  };
}
