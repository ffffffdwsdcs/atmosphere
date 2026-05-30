'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Phone, Instagram, Facebook, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV, BRAND } from '@/lib/atmosphereData';
import { useReservation } from '@/components/atmosphere/ReservationContext';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openModal } = useReservation();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-200 ${
          scrolled
            ? 'bg-espresso border-b border-gold/15 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container flex items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="Atmosphere home">
            <div className="relative h-14 w-14 overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/atmosphere_logo.webp"
                alt="Atmosphere logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-none">
              <div className="font-albertus font-bold text-[20px] tracking-[0.25em] text-ivory">
                ATMOSPHERE
              </div>
              <div className="text-[9px] font-sans font-normal uppercase tracking-[0.42em] text-gold/70 mt-1">
                Mysuru • Est. 2013
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link font-sans font-normal text-[12px] uppercase tracking-[0.15em] transition ${
                    active ? 'text-flame active' : 'text-ivory/85 hover:text-flame'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${BRAND.phoneRaw}`}
              className="hidden xl:flex items-center gap-2 font-sans font-normal text-[12px] uppercase tracking-[0.15em] text-ivory/75 hover:text-flame transition"
            >
              <Phone className="h-3.5 w-3.5" />
              {BRAND.phone}
            </a>
            <button
              onClick={openModal}
              className="btn-flame font-sans font-medium px-5 py-2.5 text-[12px] uppercase tracking-[0.18em]"
            >
              Reserve
            </button>
          </div>

          <button
            className="lg:hidden text-ivory"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 lg:hidden bg-espresso pt-28 pb-8 flex flex-col justify-between"
          >
            <div className="container flex flex-col gap-5 overflow-y-auto">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className="font-albertus font-bold text-[18px] uppercase tracking-[0.25em] text-ivory hover:text-flame transition"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                onClick={() => {
                  setOpen(false);
                  openModal();
                }}
                className="btn-flame px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] mt-2.5 w-fit"
              >
                Reserve a Table
              </motion.button>
            </div>

            {/* Rich bottom footer with contact & social icons to complete mobile side drawer */}
            <div className="container mt-auto border-t border-gold/15 pt-6 flex flex-col gap-5">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="space-y-2.5 text-left"
              >
                <div className="flex items-center gap-2.5 text-gold/80 text-[11px] uppercase tracking-[0.15em] font-sans font-normal">
                  <MapPin className="h-3.5 w-3.5 text-flame shrink-0" />
                  <span>RR Nagar, Mysuru</span>
                </div>
                <div className="flex items-center gap-2.5 text-gold/80 text-[11px] uppercase tracking-[0.15em] font-sans font-normal">
                  <Clock className="h-3.5 w-3.5 text-flame shrink-0" />
                  <span>12:00 PM - 11:30 PM</span>
                </div>
                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="flex items-center gap-2.5 text-gold/80 hover:text-flame text-[11px] uppercase tracking-[0.15em] font-sans font-normal transition"
                >
                  <Phone className="h-3.5 w-3.5 text-flame shrink-0" />
                  <span>{BRAND.phone}</span>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex items-center gap-3.5"
              >
                <a
                  href="https://instagram.com/atmosphere_mysuru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8.5 w-8.5 rounded-full border border-gold/25 flex items-center justify-center text-gold hover:text-flame hover:border-flame transition"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com/atmosphere_mysuru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8.5 w-8.5 rounded-full border border-gold/25 flex items-center justify-center text-gold hover:text-flame hover:border-flame transition"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
