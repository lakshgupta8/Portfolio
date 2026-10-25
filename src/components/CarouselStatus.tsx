import { forwardRef } from 'react';

/** Counter, progress bar and swipe hint under a phone carousel (see useCarousel). */
const CarouselStatus = forwardRef<HTMLDivElement, { total: number }>(function CarouselStatus({ total }, ref) {
  return (
    <div ref={ref} className="carousel-status" aria-hidden="true">
      <span className="carousel-count">01 / {String(total).padStart(2, '0')}</span>
      <span className="carousel-bar">
        <span />
      </span>
      <span className="carousel-hint">Swipe</span>
    </div>
  );
});

export default CarouselStatus;
