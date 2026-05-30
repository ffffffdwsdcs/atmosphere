'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import SectionLabel from '@/components/atmosphere/SectionLabel';
import { BANK_OFFERS } from '@/lib/atmosphereData';

const LOCAL_LOGOS = {
  'HDFC Bank': '/bank-logos/HDFC_Bank_Logo.svg',
  'ICICI Bank': '/bank-logos/ICICI_Bank_Logo.svg',
  'SBI Card': '/bank-logos/State_Bank_of_India_logo.svg',
  'Axis Bank': '/bank-logos/Axis_Bank_logo.svg',
  'Kotak Mahindra': '/bank-logos/Kotak_Mahindra_Group_logo.svg',
  'American Express': '/bank-logos/American_Express_logo_(2018).svg',
};

export default function BankOffers() {
  const scrollerRef = useRef(null);
  const [copied, setCopied] = useState(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

  const [hasScrolledHint, setHasScrolledHint] = useState(false);
  const [showSwipeGuide, setShowSwipeGuide] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasScrolledHint) {
          setHasScrolledHint(true);
          setShowSwipeGuide(true);
          
          // Wait 1 second before doing the bounce scroll
          setTimeout(() => {
            scroller.scrollTo({ left: 80, behavior: 'smooth' });
            
            setTimeout(() => {
              scroller.scrollTo({ left: 0, behavior: 'smooth' });
            }, 800);
          }, 1000);

          // Hide swipe guide after 4 seconds
          setTimeout(() => {
            setShowSwipeGuide(false);
          }, 4000);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasScrolledHint]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setShowLeftShadow(scrollLeft > 10);
    setShowRightShadow(scrollLeft < maxScrollLeft - 10);
  };

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amt = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === 'next' ? amt : -amt, behavior: 'smooth' });
    setTimeout(handleScroll, 400);
  };

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(code);
      toast.success(`Code ${code} copied`);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  return (
    <section ref={sectionRef} className="relative bg-espresso-mid py-20 md:py-36 overflow-hidden">
      <div className="absolute inset-0 diagonal-pattern opacity-50" />
      <div className="container relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionLabel
            eyebrow="Save more, dine more"
            title={<>Exclusive <span className="italic text-flame">bank offers</span></>}
          />
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll('prev')}
              aria-label="Previous offer"
              className="h-11 w-11 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:bg-flame hover:border-flame transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('next')}
              aria-label="Next offer"
              className="h-11 w-11 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:bg-flame hover:border-flame transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-ivory/65 leading-relaxed">
          Tap any card to copy its promo code. Show it to your server before billing.
        </p>

        <div className="relative mt-12 -mx-[2rem] px-[2rem] overflow-hidden md:overflow-visible pt-4 pb-4 -my-4">
          {/* Left & Right Fade Endings */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 z-10 bg-gradient-to-r from-[#2d1f10] via-[#2d1f10]/70 via-[#2d1f10]/20 to-transparent transition-opacity duration-300 ${
              showLeftShadow ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 z-10 bg-gradient-to-l from-[#2d1f10] via-[#2d1f10]/70 via-[#2d1f10]/20 to-transparent transition-opacity duration-300 ${
              showRightShadow ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="pt-6 pb-6 flex gap-6 overflow-x-auto overflow-y-hidden touch-pan-x hide-scrollbar snap-x snap-mandatory"
          >
            {BANK_OFFERS.map((o, i) => (
              <motion.div
                role="button"
                tabIndex={0}
                key={o.bank}
                onClick={() => copyCode(o.code)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="snap-start shrink-0 w-[290px] xs:w-[315px] md:w-[340px] aspect-[1.586/1] relative text-left overflow-visible cursor-pointer select-none outline-none transition-transform duration-500 md:hover:-translate-y-3"
                style={{
                  background: o.gradient,
                  borderRadius: 14,
                  boxShadow: '0 16px 36px -16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                {/* Subtle pattern overlay */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 16px)',
                  }}
                />
                <div className="absolute inset-0 p-2.5 xs:p-4 md:p-6 flex flex-col justify-between text-ivory">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5 xs:gap-3">
                      <div className="h-6 w-14 xs:h-9 xs:w-20 md:w-24 rounded bg-white p-1 xs:p-1.5 flex items-center justify-center shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={LOCAL_LOGOS[o.bank] || `https://logo.clearbit.com/${o.domain}`}
                          alt={o.bank}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                      <div>
                        <div className="font-sans font-medium text-[8px] xs:text-[10px] md:text-[13px] text-white/95 uppercase tracking-[0.15em] xs:tracking-[0.25em]">
                          {o.bank}
                        </div>
                        <div className="font-sans font-light text-[6px] xs:text-[8px] md:text-[10px] text-white/60 uppercase tracking-[0.15em] xs:tracking-[0.2em] mt-0.5">
                          {o.valid}
                        </div>
                      </div>
                    </div>
                    <CreditCard className="h-3.5 w-3.5 xs:h-5 xs:w-5 opacity-70 shrink-0" />
                  </div>
                  <div>
                    <div className="font-albertus font-bold text-[13px] xs:text-[18px] md:text-[30px] text-white leading-none">{o.title}</div>
                    <div className="mt-0.5 xs:mt-1 font-sans font-light text-[8px] xs:text-[10px] md:text-[12px] text-white/70 line-clamp-1 xs:line-clamp-none">{o.sub}</div>
                    <div className="mt-2.5 xs:mt-4 flex items-center justify-between gap-1.5 xs:gap-3">
                      <div className="px-1.5 py-0.5 xs:px-3 xs:py-1.5 border border-white/35 rounded bg-black/15 text-[8px] xs:text-[10px] md:text-[11px] uppercase tracking-[0.15em] xs:tracking-[0.25em] font-mono">
                        {o.code}
                      </div>
                      <div className="flex items-center gap-1.5 text-[8px] xs:text-[10px] md:text-[11px] uppercase tracking-[0.15em] xs:tracking-[0.2em] opacity-90 shrink-0">
                        {copied === o.code ? (
                          <><Check className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-emerald-400" /> Copied</>
                        ) : (
                          <><Copy className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" /> Tap</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Small finger swipe indicator under the cards section */}
        <div className="flex justify-center mt-5 md:hidden pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2d1f10]/60 border border-gold/15 rounded-full text-gold">
            <motion.div
              animate={{
                x: [-8, 8, -8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.0,
                ease: "easeInOut"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                <path d="M10 10.5V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v9" />
                <path d="M6 14a4 4 0 0 0-4-4v0" />
                <path d="M2 10v4a8 8 0 0 0 8 8h3a8 8 0 0 0 8-8v-3.5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2V11" />
              </svg>
            </motion.div>
            <span className="font-sans font-medium text-[9px] uppercase tracking-[0.18em] text-gold/80">Swipe to view</span>
          </div>
        </div>
      </div>
    </section>
  );
}
