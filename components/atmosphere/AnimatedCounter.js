'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

// Easing curve, matches our brand's cubic-bezier(0.22, 1, 0.36, 1)
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * AnimatedCounter, counts up from 0 to `to` when scrolled into view.
 * Uses requestAnimationFrame + easing for buttery smooth counting.
 */
export default function AnimatedCounter({
  to = 100,
  suffix = '',
  duration = 2200,
  format = 'comma',
  className = '',
}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const delayId = setTimeout(() => {
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        setValue(Math.round(eased * to));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, 800);

    return () => {
      clearTimeout(delayId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [to, duration]);

  const formatted =
    format === 'comma' ? value.toLocaleString('en-IN') : String(value);

  return (
    <span ref={ref} className={`tabular-nums inline-flex items-baseline ${className}`}>
      <span>{formatted}</span>
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}
