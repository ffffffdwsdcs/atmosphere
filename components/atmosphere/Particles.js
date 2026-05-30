'use client';

import { useMemo } from 'react';

export default function Particles({ count = 22 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        duration: 14 + Math.random() * 16,
        delay: -Math.random() * 24,
        gold: i % 3 === 0,
      })),
    [count]
  );
  return (
    <div className="particles-wrap">
      {items.map((p, i) => (
        <span
          key={i}
          className={`particle ${p.gold ? 'gold' : ''}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
