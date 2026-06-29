import { useEffect, useState } from 'react';

/**
 * Returns a 0→1 fraction of how far the page is scrolled within the first
 * `range` pixels from the top. A small scroll fills the fraction quickly —
 * used to scrub the hero's anxious→calm crossfade.
 *
 * rAF-throttled, passive listener.
 */
export function useScrollFraction(range = 180) {
  const [fraction, setFraction] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY || window.pageYOffset || 0;
      const v = Math.min(1, Math.max(0, y / range));
      setFraction(v);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [range]);

  return fraction;
}
