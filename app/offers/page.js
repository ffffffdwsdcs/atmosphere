'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Clock, Gift, Crown, Wine, Calendar, BadgePercent, Star, ArrowRight, Tag, RefreshCw } from 'lucide-react';
import { BANK_OFFERS, BRAND } from '@/lib/atmosphereData';
import SectionLabel from '@/components/atmosphere/SectionLabel';

const SEASONAL = [
  {
    id: 'date-night',
    badge: 'Couples',
    title: 'Date Night Prix Fixe',
    desc: '4-course tasting menu for two with a complimentary cocktail flight. Available Tue to Thu, 7 PM onwards.',
    price: '₹ 2,800',
    strike: '₹ 3,600',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90',
    Icon: Wine,
    cta: 'Reserve a table',
  },
  {
    id: 'sunday-brunch',
    badge: 'Family',
    title: 'Slow Sunday Brunch',
    desc: 'Bottomless mimosas, live counters, dessert tower and a jazz trio. Kids under 8 dine complimentary.',
    price: '₹ 1,650',
    strike: null,
    img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1400&q=90',
    Icon: Sparkles,
    cta: 'Book your seat',
  },
  {
    id: 'corporate',
    badge: 'Business',
    title: 'Corporate Lunch Package',
    desc: 'Set lunch for teams of 8+. Private mezzanine, dedicated server, projector & welcome mocktail.',
    price: '₹ 950',
    strike: '₹ 1,200',
    img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&q=90',
    Icon: Crown,
    cta: 'Plan your meet',
  },
];

const HAPPY_HOURS = [
  { day: 'Mon – Thu', window: '5:00 PM – 8:00 PM', perk: '1 + 1 on all cocktails, beer pints & house pours' },
  { day: 'Friday', window: '5:00 PM – 7:30 PM', perk: '30% off premium spirits & signature cocktails' },
  { day: 'Sat – Sun', window: '12:00 PM – 3:00 PM', perk: 'Free dessert with any brunch entrée' },
];

const MEMBERSHIP_PERKS = [
  { Icon: Crown, title: 'Priority Reservations', desc: 'Guaranteed table on Friday & Saturday nights with 4-hour notice.' },
  { Icon: Gift, title: 'Birthday Cake on the House', desc: 'A custom cake for any guest celebrating with us — plus a complimentary glass of bubbly.' },
  { Icon: BadgePercent, title: '10% Off, Always', desc: 'Member discount stacks with happy hours and seasonal offers (excludes festive nights).' },
  { Icon: Star, title: 'First Access to Events', desc: 'Pre-sale invitations to chef’s tables, whisky flights & private nights.' },
];

function Logo({ bank }) {
  // Branded card-chip style avatar. We render initials inside a chip, feels like a real credit card.
  const initials = (bank || '')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="relative h-9 w-12 rounded-[4px] bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-500 shadow-inner overflow-hidden flex items-center justify-center">
      <span className="text-[10px] font-bold tracking-wider text-black/80 drop-shadow-sm">{initials}</span>
      <div className="absolute inset-0 ring-1 ring-inset ring-white/30 rounded-[4px]" />
    </div>
  );
}

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState(null);
  const [offers, setOffers] = useState(BANK_OFFERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch('/api/admin/offers');
        if (res.ok) {
          const data = await res.json();
          const activeOffers = (data.items || []).filter((item) => item.active !== false);
          if (activeOffers.length > 0) {
            setOffers(activeOffers);
          }
        }
      } catch (err) {
        // Fallback to static BANK_OFFERS
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1800);
    } catch (_e) {
      // ignore
    }
  };

  return (
    <div className="relative min-h-screen pb-24 pt-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-flame/[0.07] blur-[140px] rounded-full" />
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
          <div className="lux-divider justify-center font-sans font-medium text-[11px] uppercase tracking-[0.3em] text-flame">
            <Tag className="h-3 w-3" /> Offers & Privileges
          </div>
          <h1 className="mt-6 font-albertus font-bold text-[clamp(48px,8vw,96px)] leading-[0.98] text-ivory">
            Reasons to <span className="italic text-flame">linger longer.</span>
          </h1>
          <p className="mt-6 font-sans font-light text-ivory/65 leading-relaxed text-[15px] max-w-2xl mx-auto">
            Curated savings, bank privileges, happy hours and members-only perks. Refreshed every season, redeemable in-restaurant only.
          </p>
        </motion.div>
      </section>

      {/* SEASONAL OFFERS */}
      <section className="container mt-20">
        <SectionLabel
          eyebrow="This Season"
          title={<>Limited-time <span className="italic text-flame">menus</span></>}
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {SEASONAL.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col border border-gold/15 bg-espresso-mid/60 hover:border-flame/60 transition-colors duration-300 overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-flame/90 text-espresso text-[10px] uppercase tracking-[0.32em] font-semibold">
                  <s.Icon className="h-3 w-3" />
                  {s.badge}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 font-sans font-light">
                <h3 className="font-cormorant font-normal text-2xl text-ivory leading-tight">{s.title}</h3>
                <p className="mt-3 text-[13.5px] text-ivory/65 leading-relaxed">{s.desc}</p>
                <div className="mt-5 pt-5 border-t border-gold/10 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-albertus font-bold text-2xl text-flame">{s.price}</span>
                    {s.strike && <span className="text-[12px] font-sans font-normal text-ivory/40 line-through">{s.strike}</span>}
                  </div>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-flame font-sans font-medium text-[11px] uppercase tracking-[0.12em] hover:gap-2.5 transition-all"
                  >
                    {s.cta} <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <span className="absolute bottom-0 left-0 h-[2px] bg-flame w-0 group-hover:w-full transition-all duration-500" />
            </motion.article>
          ))}
        </div>
      </section>

      {/* BANK OFFERS */}
      <section className="container mt-28">
        <SectionLabel
          eyebrow="Card Privileges"
          title={<>Bank & credit <span className="italic text-flame">offers</span></>}
        />
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gold">
            <RefreshCw className="h-6 w-6 animate-spin text-flame" />
            <span className="text-[10px] uppercase tracking-widest font-mono font-semibold">Tuning privileges...</span>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offers.map((o, i) => (
              <motion.div
                key={o.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden p-6 border border-gold/20 group hover:border-flame/60 transition-colors duration-300"
                style={{ backgroundImage: o.gradient }}
              >
                <div className="absolute inset-0 bg-espresso/30 group-hover:bg-espresso/15 transition" />
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <Logo bank={o.bank} />
                    <span className="font-sans font-medium text-[13px] text-white/80 uppercase tracking-[0.3em]">{o.bank}</span>
                  </div>
                  <div className="mt-8">
                    <div className="font-albertus font-bold text-3xl md:text-4xl text-white leading-none">{o.title}</div>
                    <p className="mt-2 font-sans font-light text-[13px] text-white/80">{o.sub}</p>
                  </div>
                  <div className="mt-7 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copy(o.code)}
                      className="inline-flex items-center gap-2 h-9 px-3 border border-dashed border-ivory/40 hover:border-ivory text-ivory font-sans font-normal text-[11px] uppercase tracking-[0.3em] transition bg-espresso/40 backdrop-blur"
                    >
                      {copiedCode === o.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedCode === o.code ? 'Copied' : o.code}
                    </button>
                    <span className="font-sans font-light text-[12px] text-white/60 uppercase tracking-[0.25em]">{o.valid}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* HAPPY HOURS */}
      <section className="container mt-28">
        <SectionLabel
          eyebrow="Happy Hours"
          title={<>The <span className="italic text-flame">in-between</span> hours</>}
        />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-px bg-gold/15 border border-gold/20">
          {HAPPY_HOURS.map((h) => (
            <motion.div
              key={h.day}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="bg-espresso-mid/95 p-7"
            >
              <div className="font-sans font-medium text-[11px] uppercase tracking-[0.3em] text-flame">{h.day}</div>
              <div className="mt-3 inline-flex items-center gap-2 text-ivory/85 font-cormorant font-normal text-xl">
                <Clock className="h-4 w-4 text-gold" /> {h.window}
              </div>
              <p className="mt-3 font-sans font-light text-[13px] text-ivory/65 leading-relaxed">{h.perk}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MEMBERSHIP / ATMOSPHERE CLUB */}
      <section className="container mt-28">
        <div className="relative border border-gold/20 bg-espresso-mid/70 overflow-hidden">
          <div className="absolute inset-0 diagonal-pattern opacity-15 pointer-events-none" />
          <div className="absolute -top-32 -left-24 h-[420px] w-[420px] bg-flame/[0.12] blur-[120px] rounded-full pointer-events-none" />
          <div className="relative grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 p-8 md:p-14">
            <div>
              <div className="lux-divider text-flame font-sans font-medium text-[11px] uppercase tracking-[0.3em]">
                The Atmosphere Club
              </div>
              <h2 className="mt-5 font-cormorant font-light text-4xl md:text-5xl text-ivory leading-[1.05]">
                Privileges, on <span className="italic text-flame">repeat.</span>
              </h2>
              <p className="mt-5 font-sans font-light text-ivory/65 text-[14px] leading-relaxed max-w-md">
                A complimentary membership for our regulars. Walk in once, fill in a card at the host stand, and enjoy quietly-perfect perks every visit thereafter.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="/contact"
                  className="btn-flame px-7 py-3.5 font-sans font-medium text-[13px] uppercase tracking-[0.18em] inline-flex items-center gap-2"
                >
                  Join the Club <Sparkles className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="px-7 py-3.5 font-sans font-medium text-[13px] uppercase tracking-[0.18em] border border-gold/40 text-ivory/85 hover:border-flame hover:text-flame transition"
                >
                  Call {BRAND.phone}
                </a>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-px bg-gold/15 border border-gold/20">
              {MEMBERSHIP_PERKS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-espresso-mid/95 p-6"
                >
                  <div className="h-10 w-10 border border-flame/40 flex items-center justify-center text-flame">
                    <p.Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 font-cormorant font-normal text-xl text-ivory leading-tight">{p.title}</h3>
                  <p className="mt-2 font-sans font-light text-[13px] text-ivory/65 leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TERMS */}
      <section className="container mt-20">
        <div className="border-t border-gold/15 pt-8 text-[11.5px] text-ivory/45 leading-relaxed">
          <div className="inline-flex items-center gap-2 text-gold/70 uppercase tracking-[0.32em] text-[10px]">
            <Calendar className="h-3 w-3" /> Fine print
          </div>
          <p className="mt-3 max-w-4xl">
            Offers are valid in-restaurant only and cannot be clubbed unless explicitly stated. Bank offers require payment with the corresponding card; codes must be presented before billing. Atmosphere reserves the right to modify or discontinue any offer without prior notice. GST and statutory levies apply on the net bill after discount.
          </p>
        </div>
      </section>
    </div>
  );
}
