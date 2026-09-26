import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp — animates a number from 0 to `target` when `shouldStart` becomes true.
 *
 * Respects prefers-reduced-motion: instantly shows the final value.
 *
 * @param {number}  target       — final value to count up to
 * @param {number}  duration     — animation duration in ms
 * @param {boolean} shouldStart  — trigger flag (typically from useInView)
 * @returns {number} current animated count value
 */
export function useCountUp(target, duration = 1500, shouldStart = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!shouldStart) return;

    // Respect reduced-motion preference
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setValue(target);
      return;
    }

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldStart, target, duration]);

  return value;
}
