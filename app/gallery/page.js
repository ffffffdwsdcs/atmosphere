'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera, RefreshCw } from 'lucide-react';
import SectionLabel from '@/components/atmosphere/SectionLabel';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'interiors', label: 'Interiors' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'banquet', label: 'Banquet' },
  { id: 'live', label: 'Live Nights' },
];

const STATIC_FALLBACK_PHOTOS = [
  // Interiors
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=90', cat: 'interiors', span: 'wide', alt: 'Moody bar interior' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=90', cat: 'interiors', span: 'tall', alt: 'Candlelit table setting' },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=90', cat: 'interiors', span: 'normal', alt: 'Restaurant bar' },
  { src: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1600&q=90', cat: 'interiors', span: 'normal', alt: 'Lounge ambience' },
  { src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1600&q=90', cat: 'interiors', span: 'wide', alt: 'Dining room' },
  // Food
  { src: 'https://images.pexels.com/photos/7491887/pexels-photo-7491887.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1800', cat: 'food', span: 'tall', alt: 'Truffle risotto' },
  { src: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=1600&q=90', cat: 'food', span: 'normal', alt: 'Slow-cooked mutton' },
  { src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1600&q=90', cat: 'food', span: 'normal', alt: 'Smoked old fashioned' },
  { src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1600&q=90', cat: 'food', span: 'normal', alt: 'Burnt basque cheesecake' },
  { src: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=1600&q=90', cat: 'food', span: 'wide', alt: 'Sichuan prawns' },
  { src: 'https://images.unsplash.com/photo-1586338211598-e2d64cf97e28?w=1600&q=90', cat: 'food', span: 'tall', alt: 'Cocktail with flame' },
  // Banquet
  { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600&q=90', cat: 'banquet', span: 'wide', alt: 'Luxe banquet hall' },
  { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=90', cat: 'banquet', span: 'tall', alt: 'Wedding stage decor' },
  { src: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1600&q=90', cat: 'banquet', span: 'normal', alt: 'Wedding table setup' },
  { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=90', cat: 'banquet', span: 'normal', alt: 'Floral arch' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=90', cat: 'banquet', span: 'normal', alt: 'Reception aisle' },
  { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=90', cat: 'banquet', span: 'wide', alt: 'Wedding hall lighting' },
  // Live nights
  { src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704731983_122201749286446255_7832553486323798210_n.jpg', cat: 'live', span: 'tall', alt: 'Live music night' },
  { src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704507251_122201668016446255_657162141135626679_n.jpg', cat: 'live', span: 'normal', alt: 'DJ set' },
  { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=90', cat: 'live', span: 'normal', alt: 'Club crowd' },
  { src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_564651954_122177035604446255_8896991281199984757_n.jpg', cat: 'live', span: 'wide', alt: 'Acoustic set' },
  { src: 'https://images.pexels.com/photos/4997894/pexels-photo-4997894.jpeg?w=1600&q=90', cat: 'interiors', span: 'tall', alt: 'Candle interior' },
  { src: 'https://images.pexels.com/photos/6728529/pexels-photo-6728529.jpeg?w=1600&q=90', cat: 'food', span: 'normal', alt: 'Plated dinner' },
  { src: 'https://images.pexels.com/photos/8775053/pexels-photo-8775053.jpeg?w=1600&q=90', cat: 'food', span: 'wide', alt: 'Wine dining setup' },
  { src: 'https://images.pexels.com/photos/14748605/pexels-photo-14748605.jpeg?w=900&q=90', cat: 'food', span: 'normal', alt: 'Cocktail drink' },
];

export default function GalleryPage() {
  const [active, setActive] = useState('all');
  const [openIdx, setOpenIdx] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reliable cross-browser scroll lock hook
  useEffect(() => {
    if (openIdx !== null) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [openIdx]);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const res = await fetch('/api/admin/gallery');
        if (res.ok) {
          const data = await res.json();
          const activePhotos = (data.items || []).filter((item) => item.active !== false);
          if (activePhotos.length > 0) {
            setPhotos(activePhotos);
          } else {
            setPhotos(STATIC_FALLBACK_PHOTOS);
          }
        } else {
          setPhotos(STATIC_FALLBACK_PHOTOS);
        }
      } catch (err) {
        setPhotos(STATIC_FALLBACK_PHOTOS);
      } finally {
        setLoading(false);
      }
    }
    loadPhotos();
  }, []);

  const filtered = active === 'all' ? photos : photos.filter((p) => p.cat === active);

  const spanClass = (span) => {
    if (span === 'tall') return 'row-span-2 aspect-[3/4]';
    if (span === 'wide') return 'col-span-2 aspect-[16/9]';
    return 'aspect-[4/3]';
  };

  const next = () => setOpenIdx((i) => (i === null ? null : (i + 1) % filtered.length));
  const prev = () => setOpenIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));

  return (
    <div className="relative min-h-screen pb-24 pt-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 diagonal-pattern opacity-20" />
      </div>

      {/* HEADER */}
      <section className="relative container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="lux-divider justify-center text-flame text-[10px] uppercase tracking-[0.5em]">
            <Camera className="h-3 w-3" /> The Lens
          </div>
          <h1 className="mt-6 font-albertus font-bold text-[clamp(64px,12vw,128px)] leading-[0.98] text-ivory">
            Gallery
          </h1>
          <p className="mt-6 text-ivory/65 leading-relaxed text-[15px] max-w-2xl mx-auto">
            Frames from a thousand evenings, the kitchen on full fire, the bar at midnight, the banquet hall at first light.
          </p>
        </motion.div>
      </section>

      {/* CATEGORY TABS */}
      <section className="container mt-12">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`px-4 h-10 text-[12px] font-sans font-medium uppercase tracking-[0.15em] border transition ${active === c.id
                  ? 'border-flame text-flame bg-flame/10'
                  : 'border-gold/25 text-ivory/70 hover:border-flame/60'
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* MASONRY GRID */}
      <section className="container mt-14">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gold">
            <RefreshCw className="h-7 w-7 animate-spin text-flame" />
            <span className="text-xs uppercase tracking-widest font-mono font-semibold">Curation in progress...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.button
                  key={p.src}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.55, delay: (i % 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setOpenIdx(i)}
                  className={`group relative overflow-hidden border border-gold/15 hover:border-flame/60 transition-colors ${spanClass(p.span)}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 text-left text-[11px] uppercase tracking-[0.3em] text-ivory/85 opacity-0 group-hover:opacity-100 transition">
                    {p.alt}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {openIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-espresso/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setOpenIdx(null)}
          >
            <button
              className="absolute top-5 right-5 h-11 w-11 border border-gold/30 text-ivory hover:border-flame hover:text-flame transition flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setOpenIdx(null); }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 h-12 w-12 border border-gold/25 text-ivory hover:border-flame hover:text-flame transition flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 h-12 w-12 border border-gold/25 text-ivory hover:border-flame hover:text-flame transition flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <motion.div
              key={filtered[openIdx].src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[88vh] max-w-[92vw] md:max-w-[78vw] border border-gold/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filtered[openIdx].src}
                alt={filtered[openIdx].alt}
                className="max-h-[88vh] max-w-[92vw] md:max-w-[78vw] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-espresso to-transparent">
                <div className="text-[10px] uppercase tracking-[0.36em] text-flame">
                  {CATEGORIES.find((c) => c.id === filtered[openIdx].cat)?.label}
                </div>
                <div className="mt-1 text-ivory/85 text-sm">{filtered[openIdx].alt}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
