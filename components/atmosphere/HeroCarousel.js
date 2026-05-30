'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HERO_IMAGES } from '@/lib/atmosphereData';

const DURATION = 5000;
const FADE = 1.5;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [images, setImages] = useState(HERO_IMAGES);

  useEffect(() => {
    async function loadHeroImages() {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.config && data.config.hero_images && data.config.hero_images.length > 0) {
            setImages(data.config.hero_images);
          }
        }
      } catch (err) {
        // use default fallback
      }
    }
    loadHeroImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, DURATION);
    return () => clearInterval(id);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((img, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: i === active ? 1 : 0,
            scale: i === active ? 1.06 : 1.0,
          }}
          transition={{
            opacity: { duration: FADE, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: DURATION / 1000 + FADE, ease: 'linear' },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt}
            className="h-full w-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </motion.div>
      ))}

      {/* Brand gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(26,16,8,0.40) 0%, rgba(26,16,8,0.65) 50%, rgba(26,16,8,0.95) 100%)',
        }}
      />


      {/* Pill indicators, bottom-right */}
      <div
        className="hidden md:flex absolute z-20 items-center gap-2"
        style={{ bottom: 40, right: 48 }}
      >
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className="relative h-3 flex items-center"
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              style={{ height: 3, borderRadius: 2 }}
              animate={{
                width: i === active ? 48 : 24,
                backgroundColor: i === active ? '#f56d0a' : 'rgba(255,255,255,0.3)',
              }}
              className="block"
            />
          </button>
        ))}
      </div>

      {/* Mobile pills, bottom-center */}
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className="relative h-3 flex items-center"
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              style={{ height: 3, borderRadius: 2 }}
              animate={{
                width: i === active ? 40 : 20,
                backgroundColor: i === active ? '#f56d0a' : 'rgba(255,255,255,0.3)',
              }}
              className="block"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
