'use client';

import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/atmosphereData';

// We render three copies of the testimonials to ensure a seamless 100% infinite CSS loop.
const duplicated = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

export default function TestimonialsCarousel() {
  return (
    <div className="relative mt-16 overflow-hidden -mx-[2rem] md:mx-0 pt-6 pb-6 -my-6">
      {/* Dynamic Left & Right Fade Shadows */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-5 md:w-32 z-10 bg-gradient-to-r from-[#1a1008] via-[#1a1008]/60 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-5 md:w-32 z-10 bg-gradient-to-l from-[#1a1008] via-[#1a1008]/60 to-transparent" />

      <div className="testimonial-track flex gap-3.5 md:gap-6 px-4 md:px-0">
        {duplicated.map((t, i) => (
          <div
            key={i}
            className="shrink-0 w-[275px] xs:w-[305px] md:w-[320px]"
          >
            <figure className="lift-card relative border border-gold/20 p-4 md:p-8 bg-espresso-mid/70 backdrop-blur h-full min-h-[190px] md:min-h-[260px] flex flex-col justify-between overflow-visible">
              <Quote className="absolute -top-2 md:-top-3 left-4 md:left-6 h-4 w-4 md:h-6 md:w-6 text-flame bg-espresso px-0.5 md:px-1 shrink-0" />
              <div>
                <div className="flex gap-0.5 mb-3 md:mb-5">
                  {[...Array(t.rating)].map((_, k) => (
                    <Star key={k} className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 fill-flame text-flame" />
                  ))}
                </div>
                <blockquote className="font-cormorant font-normal italic text-[13px] md:text-[18px] leading-[1.4] md:leading-[1.5] text-ivory line-clamp-4 md:line-clamp-none">
                  “{t.quote}”
                </blockquote>
              </div>
              <figcaption className="mt-3 md:mt-6 pt-3 md:pt-5 border-t border-gold/15 flex items-center justify-between">
                <div>
                  <div className="font-sans font-medium text-[10px] md:text-[13px] text-flame tracking-[0.1em] uppercase">{t.name}</div>
                  <div className="font-sans font-light text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.32em] text-gold mt-0.5 md:mt-1">
                    {t.role}
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}
