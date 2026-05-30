'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Quote, Sparkles, MapPin, Phone, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import HeroCarousel from '@/components/atmosphere/HeroCarousel';
import Marquee from '@/components/atmosphere/Marquee';
import Particles from '@/components/atmosphere/Particles';
import SectionLabel from '@/components/atmosphere/SectionLabel';
import AnimatedCounter from '@/components/atmosphere/AnimatedCounter';
import ReelsCarousel from '@/components/atmosphere/ReelsCarousel';
import BankOffers from '@/components/atmosphere/BankOffers';
import LiveImagesStrip from '@/components/atmosphere/LiveImagesStrip';
import TestimonialsCarousel from '@/components/atmosphere/TestimonialsCarousel';
import { useReservation } from '@/components/atmosphere/ReservationContext';

// Helper to split a stat label like "1,175+" into numeric value + suffix.
const parseStat = (v) => {
  const m = String(v).match(/^([\d,]+)(.*)$/);
  if (!m) return { num: 0, suffix: String(v) };
  return { num: parseInt(m[1].replace(/,/g, ''), 10), suffix: m[2] || '' };
};
import {
  BRAND,
  SIGNATURE_DISHES,
  SPACES,
  EXPERIENCES,
  TESTIMONIALS,
  STATS,
  CUISINES,
  GALLERY_PREVIEW,
} from '@/lib/atmosphereData';

const FadeUp = ({ children, delay = 0, y = 28, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
  const { openModal } = useReservation();
  const [homeStats, setHomeStats] = useState(STATS);
  const [showPlatesNav, setShowPlatesNav] = useState(false);
  const platesSectionRef = useRef(null);

  const [showDishesLeftShadow, setShowDishesLeftShadow] = useState(false);
  const [showDishesRightShadow, setShowDishesRightShadow] = useState(true);
  const dishesScrollerRef = useRef(null);

  const handleDishesScroll = () => {
    const el = dishesScrollerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setShowDishesLeftShadow(scrollLeft > 10);
    setShowDishesRightShadow(scrollLeft < maxScrollLeft - 10);
  };

  useEffect(() => {
    const el = platesSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowPlatesNav(entry.isIntersecting);
      },
      {
        rootMargin: '-10% 0px -15% 0px',
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.config && data.config.stats && data.config.stats.length > 0) {
            setHomeStats(data.config.stats);
          }
        }
      } catch (err) {
        // Fallback to static STATS
      }
    }
    loadStats();
  }, []);

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <HeroCarousel />
        <Particles count={26} />
        <div className="absolute inset-0 grain" />

        {/* Content */}
        <div className="relative z-10 container h-full flex flex-col items-center justify-center text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="lux-divider justify-center font-sans font-medium text-[11px] uppercase tracking-[0.3em] text-flame"
          >
            Mysuru · Est. 2013
          </motion.div>

          <h1 className="mt-7 font-albertus font-bold text-[clamp(52px,9vw,104px)] tracking-[-0.02em] leading-[1.0] text-ivory">
            <span className="block text-[clamp(42px,6vw,72px)]">
              {'Where every'.split(' ').map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block mr-3"
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block text-[clamp(48px,7.5vw,88px)] italic">
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.25, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block text-shimmer"
              >
                meal becomes
              </motion.span>
            </span>
            <span className="block text-[clamp(42px,6vw,72px)]">
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.55, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                a memory
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="mt-7 max-w-xl font-playfair font-normal italic text-[clamp(16px,2vw,22px)] text-gold tracking-[0.02em] leading-relaxed"
          >
            Multi-cuisine restobar &amp; luxury banquet, set in the heart of Mysuru. Candle-lit
            evenings, live music, and a kitchen that travels the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.8 }}
            className="mt-9 flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={openModal}
              className="btn-flame font-sans font-medium text-[13px] uppercase tracking-[0.18em] px-8 py-4"
            >
              Reserve a Table
            </button>
            <Link
              href="/menu"
              className="btn-outline-ivory font-sans font-medium text-[13px] uppercase tracking-[0.18em] px-8 py-4 inline-flex items-center gap-3"
            >
              Explore Menu <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* WELCOME / STORY */}
      <section className="relative bg-espresso py-20 md:py-36 overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-60" />
        <div className="radial-glow" />
        <div className="container relative grid gap-14 lg:grid-cols-2 items-center">
          <FadeUp>
            <div className="relative overflow-hidden h-[280px] md:h-[420px] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=90"
                alt="Warm dining ambience at Atmosphere"
                className="absolute inset-0 h-full w-full object-cover kenburns"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-espresso/70 via-transparent to-transparent" />
              <div className="absolute -bottom-6 -right-6 h-40 w-40 border border-gold/40" />
              <div className="absolute top-6 left-6 px-4 py-2 bg-espresso/70 backdrop-blur border border-gold/30 text-[10px] uppercase tracking-[0.4em] text-gold">
                Since 2013
              </div>
            </div>
          </FadeUp>

          <div>
            <FadeUp>
              <div className="lux-divider text-flame font-sans font-medium text-[11px] uppercase tracking-[0.3em]">
                The Atmosphere story
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="mt-5 font-cormorant font-light text-[clamp(36px,5vw,64px)] leading-[1.1] tracking-[0.01em] text-ivory">
                A decade of flavours,
                <span className="italic text-flame"> firelight</span> &amp; festivities.
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mt-6 text-ivory/70 font-sans font-light text-[16px] leading-[1.75] tracking-[0.01em]">
                Born in 2013 in the cultural heart of Mysuru, Atmosphere is a love-letter to the
                slow dinner, the kind that begins with a smoked cocktail, drifts through five
                cuisines, and ends with a story you will retell for years.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <p className="mt-4 text-ivory/70 font-sans font-light text-[16px] leading-[1.75] tracking-[0.01em]">
                Today we are a restobar, a private dining cellar, and Atmosphere Luxe, a
                350-seater banquet that has hosted some of the city&apos;s most loved weddings,
                galas and milestones.
              </p>
            </FadeUp>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl">
              {homeStats.map((s, i) => {
                const { num, suffix } = parseStat(s.value);
                const getDuration = (val) => {
                  if (val === 12) return 1500;
                  if (val === 1175) return 2500;
                  if (val === 5) return 1000;
                  if (val === 350) return 2000;
                  return 2200;
                };
                return (
                  <FadeUp key={s.label} delay={0.35 + i * 0.05}>
                    <div className="border-l border-gold/40 pl-4">
                      <div className="font-albertus font-bold text-[clamp(28px,4.5vw,48px)] text-flame tabular-nums">
                        <AnimatedCounter to={num} suffix={suffix} duration={getDuration(num)} />
                      </div>
                      <div className="font-sans font-light text-[13px] text-gold tracking-[0.05em] mt-2">
                        {s.label}
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>

            <FadeUp delay={0.55}>
              <Link
                href="/luxe"
                className="mt-10 btn-outline-gold inline-flex items-center gap-3 px-7 py-3.5 font-sans font-medium text-[13px] uppercase tracking-[0.18em]"
              >
                Discover Atmosphere Luxe <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CUISINES SHOWCASE */}
      <section className="relative bg-espresso py-20 md:py-36 overflow-hidden">
        <div className="radial-glow opacity-60" />
        <div className="container relative">
          <FadeUp>
            <SectionLabel
              eyebrow="Five flags, one kitchen"
              title={<>A passport on <span className="italic text-flame">every plate</span></>}
            />
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-5 max-w-2xl mx-auto text-center text-ivory/65 leading-relaxed font-sans font-light text-[16px] tracking-[0.01em]">
              From the tandoor of the North to the wok of the East, five cuisines, one ovation.
            </p>
          </FadeUp>

          <div className="relative mt-16 overflow-hidden md:overflow-visible -mx-[2rem] px-[2rem] md:mx-0 md:px-0 pt-4 pb-4 -my-4">
            <div className="flex overflow-x-auto md:grid gap-3.5 md:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 no-scrollbar snap-x snap-mandatory">
              {CUISINES.map((c, i) => (
                <FadeUp key={c.name} delay={i * 0.07} className="min-w-[260px] md:min-w-0 snap-start shrink-0 md:shrink w-[260px] md:w-auto">
                  <Link href="/menu" className="group block lift-card relative overflow-hidden border border-gold/15 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.65)]">
                    <div className="zoom-wrap relative h-[380px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.img}
                        alt={c.name}
                        className="zoom-img absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-5">
                        <div className="font-sans font-medium text-[11px] uppercase tracking-[0.12em] text-gold">
                          Cuisine 0{i + 1}
                        </div>
                        <h3 className="mt-2 font-cormorant font-light text-[22px] text-ivory leading-tight">
                          {c.name}
                        </h3>
                        <p className="mt-1 font-sans font-light text-[13px] text-ivory/60 leading-relaxed">
                          {c.note}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 text-flame font-sans font-medium text-[11px] uppercase tracking-[0.12em] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                          Explore <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* SIGNATURE DISHES */}
      <section ref={platesSectionRef} className="relative bg-espresso-mid py-20 md:py-36 overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-50" />
        <div className="container relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <FadeUp>
              <SectionLabel
                eyebrow="Chef's selection"
                title={<>Plates worth <span className="italic text-flame">remembering</span></>}
                center={false}
              />
            </FadeUp>
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous dishes"
                className="h-11 w-11 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:bg-flame hover:border-flame transition cursor-pointer"
                onClick={() => {
                  const scroller = document.querySelector('.dish-scroller');
                  if (scroller) scroller.scrollBy({ left: -300, behavior: 'smooth' });
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next dishes"
                className="h-11 w-11 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:bg-flame hover:border-flame transition cursor-pointer"
                onClick={() => {
                  const scroller = document.querySelector('.dish-scroller');
                  if (scroller) scroller.scrollBy({ left: 300, behavior: 'smooth' });
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <FadeUp delay={0.1}>
            <p className="mt-5 max-w-2xl text-ivory/65 leading-relaxed font-sans font-light text-[16px] tracking-[0.01em]">
              A handful of dishes our regulars order on every visit, thoughtfully composed,
              quietly indulgent.
            </p>
          </FadeUp>

          <div className="relative mt-12 -mx-[2rem] px-[2rem] overflow-hidden md:overflow-visible pt-4 pb-4 -my-4">
            {/* Smooth fading left & right shadows for mobile scroller */}
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 w-14 z-10 bg-gradient-to-r from-[#2d1f10] via-[#2d1f10]/75 to-transparent transition-opacity duration-300 md:hidden ${
                showDishesLeftShadow ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 w-14 z-10 bg-gradient-to-l from-[#2d1f10] via-[#2d1f10]/75 to-transparent transition-opacity duration-300 md:hidden ${
                showDishesRightShadow ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              ref={dishesScrollerRef}
              onScroll={handleDishesScroll}
              className="flex overflow-x-auto gap-3 md:gap-7 pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory dish-scroller pl-[2rem] pr-0 md:px-0"
            >
              {SIGNATURE_DISHES.map((d, i) => (
                <div key={d.name} data-dish-card className="min-w-[260px] w-[260px] md:min-w-[270px] lg:w-[calc((100%-3*28px)/4)] snap-start flex-shrink-0">
                  {/* MOBILE LUXURY BACKDROP CARD DESIGN */}
                  <div className="md:hidden group block relative w-[260px] h-[380px] overflow-hidden border border-gold/15 bg-espresso/70 rounded-lg shrink-0 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.65)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.img}
                      alt={d.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Black gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-transparent" />
                    
                    {/* Cuisine tag */}
                    <div className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-flame/90 font-sans font-medium text-[10px] uppercase tracking-[0.12em] text-ivory rounded-sm">
                      {d.cuisine}
                    </div>
                    
                    {/* Bottom overlay text content */}
                    <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-left">
                      <div className="font-sans font-medium text-[11px] uppercase tracking-[0.12em] text-gold">
                        Signature · {d.price}
                      </div>
                      <h3 className="mt-2 font-cormorant font-light text-[22px] text-ivory leading-tight">
                        {d.name}
                      </h3>
                      {d.desc && (
                        <p className="mt-1.5 font-sans font-light text-[13px] text-ivory/60 leading-relaxed line-clamp-2">
                          {d.desc}
                        </p>
                      )}
                      <div className="mt-4 inline-flex items-center gap-2 text-flame font-sans font-medium text-[11px] uppercase tracking-[0.12em]">
                        Explore <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP SPLIT CARD DESIGN */}
                  <div className="hidden md:flex group lift-card border border-gold/15 bg-espresso/70 backdrop-blur p-0 overflow-hidden flex-col h-full">
                    <div className="zoom-wrap relative aspect-[4/3] overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={d.img}
                        alt={d.name}
                        className="zoom-img h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-flame/90 font-sans font-medium text-[11px] uppercase tracking-[0.12em] text-ivory">
                        {d.cuisine}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-cormorant font-normal text-[22px] text-ivory leading-tight">{d.name}</h3>
                          <div className="font-albertus font-bold text-[24px] text-flame shrink-0">{d.price}</div>
                        </div>
                        <p className="mt-2 font-sans font-light text-[13px] text-ivory/55 leading-[1.6]">{d.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* end card with "See full menu" button */}
              <div className="min-w-[260px] w-[260px] md:min-w-[270px] lg:w-[calc((100%-3*28px)/4)] snap-start flex-shrink-0 flex flex-col items-center justify-center border border-dashed border-gold/30 bg-espresso/30 backdrop-blur p-4 md:p-8 text-center rounded-lg h-[380px] md:h-full md:min-h-[360px]">
                <h4 className="font-cormorant font-light text-sm md:text-2xl text-ivory">Craving More?</h4>
                <p className="mt-1.5 font-sans font-light text-[10px] md:text-[13px] text-ivory/60 mb-3 md:mb-6 hidden xs:block">
                  Explore our complete selection of curated masterpieces.
                </p>
                <Link
                  href="/menu"
                  className="btn-outline-gold px-3 py-2 md:px-6 md:py-3 font-sans font-medium text-[9px] md:text-[12px] uppercase tracking-[0.15em] md:tracking-[0.18em] inline-flex items-center gap-1.5 md:gap-2"
                >
                  Full Menu <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <FadeUp delay={0.3}>
            <div className="mt-14 flex justify-center">
              <Link
                href="/menu"
                className="btn-outline-ivory px-8 py-3.5 font-sans font-medium text-[13px] uppercase tracking-[0.18em] inline-flex items-center gap-3"
              >
                See full menu <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </FadeUp>

          {/* Floating Sticky Bottom Navigation Arrows for Mobile */}
          <AnimatePresence>
            {showPlatesNav && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 50, x: '-50%' }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="fixed bottom-6 left-1/2 z-50 flex items-center gap-4 bg-espresso/95 border border-gold/30 px-5 py-3 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md md:hidden"
              >
                <span className="font-sans font-medium text-[10px] uppercase tracking-[0.25em] text-gold">Swipe</span>
                <div className="h-3.5 w-px bg-gold/30" />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const scroller = document.querySelector('.dish-scroller');
                      if (scroller) {
                        const card = scroller.querySelector('[data-dish-card]');
                        const cardWidth = card ? card.clientWidth : 170;
                        scroller.scrollBy({ left: -(cardWidth + 12), behavior: 'smooth' });
                      }
                    }}
                    className="h-8 w-8 rounded-full border border-gold/40 flex items-center justify-center text-ivory active:bg-flame active:border-flame transition"
                    aria-label="Previous dishes"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const scroller = document.querySelector('.dish-scroller');
                      if (scroller) {
                        const card = scroller.querySelector('[data-dish-card]');
                        const cardWidth = card ? card.clientWidth : 170;
                        scroller.scrollBy({ left: (cardWidth + 12), behavior: 'smooth' });
                      }
                    }}
                    className="h-8 w-8 rounded-full border border-gold/40 flex items-center justify-center text-ivory active:bg-flame active:border-flame transition"
                    aria-label="Next dishes"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* REELS & MOMENTS */}
      <ReelsCarousel />

      {/* THE SPACES */}
      <section className="relative bg-espresso py-20 md:py-36 overflow-hidden">
        <div className="container relative">
          <FadeUp>
            <SectionLabel
              eyebrow="Three rooms, one Atmosphere"
              title={<>Choose your <span className="italic text-flame">setting</span></>}
            />
          </FadeUp>

          <div className="mt-16 grid gap-7 md:grid-cols-3">
            {SPACES.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.08}>
                <div className="group lift-card relative border border-gold/15 overflow-hidden h-full">
                  <div className="zoom-wrap relative aspect-[4/5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.img}
                      alt={s.title}
                      className="zoom-img absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/65 to-espresso/15" />
                    <div className="absolute inset-0 flex flex-col justify-end p-7">
                      <div className="font-sans font-medium text-[11px] uppercase tracking-[0.12em] text-gold">
                        {s.sub}
                      </div>
                      <h3 className="mt-3 font-cormorant font-light text-3xl text-ivory leading-tight">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-ivory/65 font-sans font-light text-[13px] leading-relaxed">{s.desc}</p>
                      {s.action === 'luxe' ? (
                        <Link
                          href="/luxe"
                          className="mt-5 inline-flex items-center gap-2 text-flame font-sans font-medium text-[12px] uppercase tracking-[0.15em] group/cta"
                        >
                          {s.cta}
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover/cta:translate-x-1" />
                        </Link>
                      ) : (
                        <button
                          onClick={openModal}
                          className="mt-5 inline-flex items-center gap-2 text-flame font-sans font-medium text-[12px] uppercase tracking-[0.15em] group/cta"
                        >
                          {s.cta}
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover/cta:translate-x-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE EXPERIENCES */}
      <section className="relative bg-espresso-mid py-20 md:py-36 overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-50" />
        <div className="container relative">
          <FadeUp>
            <SectionLabel
              eyebrow="Live at Atmosphere"
              title={<>An evening, <span className="italic text-flame">orchestrated</span></>}
            />
          </FadeUp>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {EXPERIENCES.map((e, i) => {
              const getExpImage = (title) => {
                if (title.includes('Acoustic')) return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_564651954_122177035604446255_8896991281199984757_n.jpg';
                if (title.includes('Live Band')) return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704731983_122201749286446255_7832553486323798210_n.jpg';
                if (title.toLowerCase().includes('dj')) return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704507251_122201668016446255_657162141135626679_n.jpg';
                return '';
              };
              const getExpDate = (dayName) => {
                const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                const targetDay = daysOfWeek.findIndex(d => dayName.toLowerCase().includes(d));
                if (targetDay === -1) return '01';
                
                const today = new Date();
                const todayDay = today.getDay();
                let daysUntil = targetDay - todayDay;
                if (daysUntil < 0) {
                  daysUntil += 7;
                }
                
                const nextDate = new Date(today);
                nextDate.setDate(today.getDate() + daysUntil);
                return String(nextDate.getDate()).padStart(2, '0');
              };
              return (
                <FadeUp key={e.title} delay={i * 0.08} className="h-full">
                  <div className="lift-card relative border border-gold/20 bg-espresso/70 backdrop-blur rounded-[12px] h-full flex flex-col overflow-hidden">
                    {/* Mobile vertical bookmark day tag */}
                    <div className="absolute top-0 right-4 z-10 bg-flame text-ivory px-3 py-2.5 flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] rounded-b-[4px] md:hidden">
                      <span className="font-sans font-extrabold text-[15px] text-ivory leading-none">
                        {getExpDate(e.day)}
                      </span>
                      <span className="font-sans font-bold text-[8px] uppercase tracking-wider leading-none mt-1 text-gold">
                        {e.day.slice(0, 3).toUpperCase()}
                      </span>
                    </div>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getExpImage(e.title)}
                      alt={e.title}
                      className="w-full h-[384px] object-cover rounded-t-[12px] shrink-0"
                      loading="lazy"
                    />
                    <div className="p-7 flex flex-col flex-grow justify-between">
                      <div>
                        {/* Hidden on mobile, shown on desktop */}
                        <div className="hidden md:flex items-center gap-2 text-flame font-sans font-medium text-[11px] uppercase tracking-[0.3em]">
                          <Sparkles className="h-3 w-3" /> {e.day}
                        </div>
                        <h3 className="mt-4 font-cormorant font-light text-[32px] text-ivory leading-tight">{e.title}</h3>
                        <p className="mt-3 text-ivory/65 font-sans font-light text-[14px] leading-relaxed">{e.note}</p>
                      </div>
                      <div className="mt-7 pt-5 border-t border-gold/15 flex items-center justify-between gap-3">
                        <div className="font-sans font-normal text-[13px] text-gold">
                          {e.time}
                        </div>
                        <button
                          onClick={openModal}
                          className="btn-flame px-4 py-2 font-sans font-medium text-[12px] uppercase tracking-[0.18em]"
                        >
                          Book Seat
                        </button>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>

          <FadeUp delay={0.3}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/events"
                className="btn-outline-gold inline-flex items-center gap-3 px-7 py-3.5 font-sans font-medium text-[13px] uppercase tracking-[0.18em]"
              >
                View Events Calendar <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </FadeUp>

          {/* Live staggered images */}
          <LiveImagesStrip />
        </div>
      </section>

      {/* BANK OFFERS */}
      <BankOffers />

      {/* GALLERY PREVIEW */}
      <section className="relative bg-espresso py-20 md:py-36 overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-50" />
        <div className="container relative">
          <FadeUp>
            <SectionLabel
              eyebrow="Through our lens"
              title={<>Moments, <span className="italic text-flame">candle-lit</span></>}
            />
          </FadeUp>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3">
            {GALLERY_PREVIEW.map((g, i) => {
              const spanClass =
                g.span === 'tall'
                  ? 'row-span-2'
                  : g.span === 'wide'
                  ? 'col-span-2'
                  : '';
              return (
                <FadeUp key={i} delay={i * 0.06} className={spanClass}>
                  <Link
                    href="/gallery"
                    className="group block relative h-full w-full overflow-hidden border border-gold/15 lift-card"
                  >
                    <div className="zoom-wrap relative h-full w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.src}
                        alt={g.alt}
                        className="zoom-img absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/15 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <div className="text-[10px] uppercase tracking-[0.4em] text-gold">
                          0{i + 1}
                        </div>
                        <div className="mt-1 text-ivory text-sm font-normal">{g.alt}</div>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>

          <FadeUp delay={0.3}>
            <div className="mt-14 flex justify-center">
              <Link
                href="/gallery"
                className="btn-outline-ivory px-8 py-3.5 text-[11px] uppercase tracking-[0.36em] inline-flex items-center gap-3"
              >
                View Full Gallery <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="relative bg-espresso py-20 md:py-36 overflow-hidden">
        <div className="radial-glow" />
        <div className="container relative">
          <FadeUp>
            <SectionLabel
              eyebrow="Word of mouth"
              title={<>Whispered between <span className="italic text-flame">tables</span></>}
            />
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-5 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-ivory/70 text-sm font-normal text-center">
              <div className="flex justify-center mb-1 md:mb-0">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-flame text-flame" />
                ))}
              </div>
              <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 font-sans font-light text-[13px] md:text-sm tracking-wide">
                <span>4.4 · 1,175+ reviews on</span>
                <span className="text-gold font-medium md:text-ivory/70 md:font-light">Google &amp; Zomato</span>
              </div>
            </div>
          </FadeUp>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* VISIT US / LOCATION */}
      <section className="relative bg-espresso-mid py-20 md:py-36 overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-40" />
        <div className="container relative grid gap-14 lg:grid-cols-5 items-stretch">
          <div className="lg:col-span-2">
            <FadeUp>
              <div className="lux-divider text-flame font-sans font-medium text-[11px] uppercase tracking-[0.3em]">
                Find us
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="mt-5 font-cormorant font-light text-[clamp(36px,5vw,64px)] leading-[1.1] tracking-[0.01em] text-ivory">
                A short drive,
                <span className="font-playfair font-normal italic text-[clamp(24px,3vw,40px)] text-gold block tracking-[0.02em] mt-2">a long night.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mt-6 font-sans font-light text-[16px] text-ivory/65 leading-[1.85] tracking-[0.01em]">
                Tucked into the leafy boulevards of Rajarajeshwari Nagar, five minutes from
                Mysuru&apos;s Palace, an evening away from the everyday.
              </p>
            </FadeUp>

            <div className="mt-10 space-y-6">
              <FadeUp delay={0.3}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-9 w-9 border border-gold/40 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-flame" />
                  </div>
                  <div>
                    <div className="font-sans font-medium text-[12px] uppercase tracking-[0.18em] text-gold">Address</div>
                    <div className="mt-1 font-sans font-light text-[13px] text-ivory leading-relaxed">
                      {BRAND.address}
                      <br />
                      {BRAND.city}
                    </div>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.35}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-9 w-9 border border-gold/40 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-flame" />
                  </div>
                  <div>
                    <div className="font-sans font-medium text-[12px] uppercase tracking-[0.18em] text-gold">Hours</div>
                    <div className="mt-1 space-y-0.5 font-sans font-light text-[13px] text-ivory">
                      {BRAND.hours.map((h) => (
                        <div key={h.day} className="flex gap-3">
                          <span className="text-ivory/55 w-20">{h.day}</span>
                          <span>{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.4}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-9 w-9 border border-gold/40 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-flame" />
                  </div>
                  <div>
                    <div className="font-sans font-medium text-[12px] uppercase tracking-[0.18em] text-gold">Reservations</div>
                    <a
                      href={`tel:${BRAND.phoneRaw}`}
                      className="mt-1 block font-sans font-light text-[13px] text-ivory hover:text-flame transition text-gold"
                    >
                      {BRAND.phone}
                    </a>
                  </div>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.5}>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={openModal}
                  className="btn-flame px-7 py-3.5 font-sans font-medium text-[13px] uppercase tracking-[0.18em]"
                >
                  Reserve a Table
                </button>
                <a
                  href="https://maps.google.com/?q=Atmosphere+Mysore+BEML+Layout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold inline-flex items-center gap-3 px-7 py-3.5 font-sans font-medium text-[13px] uppercase tracking-[0.18em]"
                >
                  Get Directions <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.2} className="lg:col-span-3">
            <div className="relative h-full min-h-[420px] overflow-hidden border border-gold/20">
              <iframe
                title="Atmosphere Mysuru location"
                src="https://www.google.com/maps?q=BEML+Layout+2nd+Stage+Rajarajeshwari+Nagar+Mysuru&output=embed"
                className="absolute inset-0 h-full w-full"
                style={{ filter: 'invert(0.92) hue-rotate(180deg) saturate(0.6) brightness(0.85)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/20" />
              <div className="pointer-events-none absolute top-5 left-5 px-3 py-1.5 bg-espresso/80 backdrop-blur border border-gold/30 font-sans font-medium text-[12px] uppercase tracking-[0.18em] text-gold">
                Mysuru · India
              </div>
            </div>
          </FadeUp>
        </div>
      </section>


      {/* FINAL CTA BANNER */}
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90"
          alt="Candle-lit dining"
          className="absolute inset-0 h-full w-full object-cover kenburns"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(26,16,8,0.55) 0%, rgba(26,16,8,0.78) 50%, rgba(26,16,8,0.95) 100%)',
          }}
        />
        <div className="absolute inset-0 grain" />

        <div className="container relative z-10 h-full flex flex-col items-center justify-center text-center">
          <FadeUp>
            <div className="lux-divider justify-center text-flame font-sans font-medium text-[11px] uppercase tracking-[0.3em]">
              The table is set
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-7 font-albertus font-bold text-[32px] md:text-[80px] leading-[1.15] tracking-[-0.02em] text-ivory">
              Make tonight a{' '}
              <span className="block xs:inline font-playfair font-normal italic text-[36px] md:text-[80px] text-gold tracking-[0.02em] mt-2 xs:mt-0">
                memory
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-7 max-w-xl font-playfair font-normal italic text-[clamp(16px,2vw,22px)] text-gold tracking-[0.02em] leading-relaxed">
              We hold a few candle-lit tables every night for those who decide last minute. Yours
              could be one of them.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={openModal}
                className="btn-flame px-9 py-4 font-sans font-medium text-[13px] uppercase tracking-[0.18em]"
              >
                Reserve a Table
              </button>
              <a
                href={`tel:${BRAND.phoneRaw}`}
                className="btn-outline-ivory px-9 py-4 font-sans font-medium text-[13px] uppercase tracking-[0.18em] inline-flex items-center gap-3"
              >
                <Phone className="h-3.5 w-3.5" /> Call {BRAND.phone}
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-3 justify-center font-sans font-light text-[13px] uppercase tracking-[0.18em] text-ivory/70">
              <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-flame" /> {BRAND.city}</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-flame" /> Open till 12:30 AM</span>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
