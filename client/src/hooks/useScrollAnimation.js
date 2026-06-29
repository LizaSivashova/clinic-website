import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll using IntersectionObserver (no external library).
 * Returns a ref to attach to the target element and a boolean `visible`.
 *
 *   const [ref, visible] = useScrollAnimation();
 *   <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
 */
export function useScrollAnimation({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, visible];
}
