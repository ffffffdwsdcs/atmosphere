'use client';

import { useEffect, useState } from 'react';
import { MARQUEE_WORDS } from '@/lib/atmosphereData';

export default function Marquee() {
  const [words, setWords] = useState(MARQUEE_WORDS);

  useEffect(() => {
    async function loadMarqueeWords() {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.config && data.config.marquee_words && data.config.marquee_words.length > 0) {
            setWords(data.config.marquee_words);
          }
        }
      } catch (err) {
        // use default fallback
      }
    }
    loadMarqueeWords();
  }, []);

  const items = [...words, ...words];
  return (
    <div className="relative bg-espresso border-y border-gold/15 overflow-hidden">
      <div className="marquee-track py-5">
        {items.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-8 px-8 font-cormorant font-normal italic text-[28px] text-gold tracking-[0.08em] whitespace-nowrap"
          >
            {w}
            <span className="text-gold/60">✦</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-espresso to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-espresso to-transparent" />
    </div>
  );
}
