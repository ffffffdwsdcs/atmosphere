'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Instagram, Facebook, Phone, MapPin, Clock, Mail } from 'lucide-react';
import { BRAND, NAV } from '@/lib/atmosphereData';
import { useReservation } from '@/components/atmosphere/ReservationContext';

export default function Footer() {
  const pathname = usePathname();
  const { openModal } = useReservation();
  const [brandDetails, setBrandDetails] = useState(BRAND);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    async function loadBrand() {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.config && data.config.brand) {
            setBrandDetails(data.config.brand);
          }
        }
      } catch (err) {
        // use default fallback
      }
    }
    loadBrand();
  }, []);

  const instagramUrl = brandDetails.social?.instagram || BRAND.social.instagram;
  const facebookUrl = brandDetails.social?.facebook || BRAND.social.facebook;

  return (
    <footer className="relative bg-espresso text-ivory border-t border-gold/15 overflow-hidden">
      <div className="absolute inset-0 diagonal-pattern opacity-60 pointer-events-none" />
      <div className="container relative py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 h-12 w-12 overflow-hidden flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/atmosphere_logo.webp"
                alt="Atmosphere logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="font-albertus font-bold text-[18px] tracking-[0.25em] text-ivory">{(brandDetails.name || 'ATMOSPHERE').toUpperCase()}</div>
            <div className="text-[10px] font-sans font-light uppercase tracking-[0.5em] text-gold/80 mt-2">
              Mysuru • Est. 2013
            </div>
            <p className="text-ivory/65 leading-relaxed mt-5 max-w-xs font-sans font-light text-[13px]">
              {brandDetails.shortDesc}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-full border border-gold/40 flex items-center justify-center hover:bg-flame hover:border-flame transition"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-full border border-gold/40 flex items-center justify-center hover:bg-flame hover:border-flame transition"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="font-sans font-medium text-[12px] uppercase tracking-[0.18em] text-gold mb-5">Explore</div>
            <ul className="space-y-3 text-ivory/80">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="nav-link font-sans font-light text-[14px] text-gold hover:text-flame transition">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-sans font-medium text-[12px] uppercase tracking-[0.18em] text-gold mb-5">Visit Us</div>
            <ul className="space-y-4 text-ivory/80 font-sans font-light text-[13px]">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-flame shrink-0" />
                <span>
                  {brandDetails.address}
                  <br />
                  {brandDetails.city}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-flame shrink-0" />
                <a href={`tel:${brandDetails.phoneRaw}`} className="hover:text-flame transition text-gold">
                  {brandDetails.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-flame shrink-0" />
                <a href={`mailto:${brandDetails.email}`} className="hover:text-flame transition text-gold">
                  {brandDetails.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-sans font-medium text-[12px] uppercase tracking-[0.18em] text-gold mb-5">Hours</div>
            <ul className="space-y-3 text-ivory/80 font-sans font-light text-[13px]">
              {brandDetails.hours && brandDetails.hours.map((h) => (
                <li key={h.day} className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-0.5 text-flame shrink-0" />
                  <span>
                    <span className="block text-ivory">{h.day}</span>
                    <span className="text-ivory/65">{h.time}</span>
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={openModal}
              className="btn-flame mt-7 px-5 py-3 font-sans font-medium text-[12px] uppercase tracking-[0.18em]"
            >
              Reserve a Table
            </button>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gold/15 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-ivory/55">
          <div>© {new Date().getFullYear()} {brandDetails.name || 'Atmosphere'} Mysuru. All rights reserved.</div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase">
            <span className="h-px w-8 bg-gold/40" />
            crafted with fire & care
            <span className="h-px w-8 bg-gold/40" />
          </div>
        </div>

        <div className="mt-16 pt-5 border-t border-gold/10 flex flex-col items-center gap-2 font-sans font-light text-[11px] uppercase tracking-[0.42em] text-ivory/45">
          <span>
            Powered by{' '}
            <a
              href="https://www.instagram.com/bringabove/"
              target="_blank"
              rel="noreferrer"
              className="text-gold hover:text-flame transition"
            >
              @bringabove
            </a>
          </span>
          <a
            href="https://www.instagram.com/bringabove/"
            target="_blank"
            rel="noreferrer"
            className="mt-1 text-gold/60 hover:text-flame transition text-[10px] tracking-[0.2em] lowercase font-sans font-light"
          >
            designed with ❤️ by hibro revankar
          </a>
        </div>
      </div>
    </footer>
  );
}
