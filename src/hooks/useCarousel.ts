import { useEffect } from 'react';

const PHONE = '(max-width: 640px)';

/**
 * On phones, CSS turns a grid of cards into a horizontal swipe carousel. This
 * marks the card nearest the middle as `.is-active` (the touch stand-in for
 * hover) and keeps a "01 / 08" counter and a progress bar in sync.
 */
export function useCarousel(
  trackRef: React.RefObject<HTMLElement | null>,
  statusRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const track = trackRef.current;
    const status = statusRef.current;
    if (!track) return;

    const media = window.matchMedia(PHONE);
    const count = status?.querySelector<HTMLElement>('.carousel-count');
    const bar = status?.querySelector<HTMLElement>('.carousel-bar span');
    const pad = (n: number) => String(n).padStart(2, '0');
    let cleanup = () => {};

    const setup = () => {
      cleanup();
      if (!media.matches) return;
      const items = Array.from(track.children).filter((el): el is HTMLElement => el.classList.contains('cell'));
      let frame = 0;

      const update = () => {
        frame = 0;
        const trackRect = track.getBoundingClientRect();
        const middle = trackRect.left + trackRect.width / 2;
        let best = 0;
        let bestDistance = Infinity;
        items.forEach((item, i) => {
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - middle);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        });
        items.forEach((item, i) => item.classList.toggle('is-active', i === best));
        if (count) count.textContent = `${pad(best + 1)} / ${pad(items.length)}`;
        const max = track.scrollWidth - track.clientWidth;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? (track.scrollLeft / max).toFixed(3) : 0})`;
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };

      track.addEventListener('scroll', onScroll, { passive: true });
      update();
      cleanup = () => {
        track.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(frame);
        items.forEach((item) => item.classList.remove('is-active'));
      };
    };

    setup();
    media.addEventListener('change', setup);
    return () => {
      cleanup();
      media.removeEventListener('change', setup);
    };
  }, [trackRef, statusRef]);
}
