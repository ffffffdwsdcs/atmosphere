'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Calendar, Music, Camera, ChefHat, Lightbulb, Mic2, Check, Phone, Mail, ArrowRight } from 'lucide-react';
import { BRAND } from '@/lib/atmosphereData';
import SectionLabel from '@/components/atmosphere/SectionLabel';

const EVENT_TYPES = [
  'Wedding Reception',
  'Sangeet / Cocktail',
  'Engagement',
  'Corporate Gala',
  'Birthday / Milestone',
  'Private Banquet',
];

const BUDGETS = [
  '₹ 2 to 5 Lakhs',
  '₹ 5 to 10 Lakhs',
  '₹ 10 to 20 Lakhs',
  '₹ 20 Lakhs +',
];

const LUXE_FEATURES = [
  {
    icon: Users,
    title: '350 Guest Capacity',
    desc: 'Floor configurations from 80 intimate to 350 grand. King-table layouts, round tables, theatre seating.',
  },
  {
    icon: Lightbulb,
    title: 'Programmable Lighting',
    desc: 'Architectural LED grid + intelligent moving heads. Pre-programmed scenes for ceremony, dinner & after-party.',
  },
  {
    icon: Mic2,
    title: 'Concert-grade AV',
    desc: 'Line-array sound, 4K stage screens, wireless lavaliers, professional DJ console & engineer on standby.',
  },
  {
    icon: ChefHat,
    title: 'Bespoke Multi-Cuisine Menus',
    desc: 'Live counters, plated fine dining, regional specials & dessert towers, designed with our executive chef.',
  },
  {
    icon: Camera,
    title: 'Photogenic by Design',
    desc: 'Stone columns, mirrored ceiling, cascading chandeliers, floral installations, every angle a frame.',
  },
  {
    icon: Music,
    title: 'Live Acts on Call',
    desc: 'Curated network of bands, dholis, sufi singers, classical ensembles & resident DJs across genres.',
  },
];

const INCLUSIONS = [
  'Dedicated event manager from enquiry to closing toast',
  'Floral & decor planning with in-house designer',
  'Valet parking for 200+ cars (covered & open)',
  'Bridal & guest holding suites with attendants',
  'Custom wedding & corporate menu tastings',
  'Photography & videography vendor network',
  'Cake, mehendi, DJ, anchor co-ordination',
  'In-suite bar, premium spirits, mocktails & shisha',
];

const LUXE_GALLERY = [
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1400&q=90',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=90',
  'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1400&q=90',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=90',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=90',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=90',
];

const JOURNEY = [
  { step: '01', title: 'Enquire', desc: 'Share your date, headcount & vision. We respond within 4 hours.' },
  { step: '02', title: 'Site Visit', desc: 'Walk through Luxe, taste-test menus, meet your event manager.' },
  { step: '03', title: 'Curate', desc: 'Decor mood-boards, menu sign-off, lighting & sound program.' },
  { step: '04', title: 'Celebrate', desc: 'Arrive a guest at your own event, we run everything.' },
];

export default function LuxePage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    event_type: EVENT_TYPES[0],
    event_date: '',
    guest_count: '',
    budget_range: BUDGETS[0],
    special_requirements: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { ok, message }

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/banquet-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'luxe-page' }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Submission failed');
      setResult({ ok: true, message: 'Enquiry received. Our event manager will call you within 4 hours.' });
      setForm({
        name: '',
        phone: '',
        email: '',
        event_type: EVENT_TYPES[0],
        event_date: '',
        guest_count: '',
        budget_range: BUDGETS[0],
        special_requirements: '',
      });
    } catch (err) {
      setResult({ ok: false, message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-24">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=2400&q=95"
          alt="Atmosphere Luxe banquet hall"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/40 via-espresso/55 to-espresso" />
        <div className="absolute inset-0 diagonal-pattern opacity-25" />

        <div className="relative container h-full flex flex-col justify-end pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="lux-divider text-flame font-sans font-medium text-[11px] uppercase tracking-[0.3em]">
              Atmosphere Luxe · Banquet & Events
            </div>
            <h1 className="mt-6 font-albertus font-bold text-[clamp(40px,7vw,76px)] leading-[0.98] text-ivory">
              A venue worthy of <span className="italic text-flame">the moment.</span>
            </h1>
            <p className="mt-6 max-w-2xl font-playfair font-normal italic text-[clamp(15px,1.8vw,20px)] text-gold tracking-[0.02em] leading-relaxed">
              Vaulted ceilings, cascading chandeliers, a grand stage and Mysuru&apos;s finest cuisine.
              From 80 to 350 guests, Luxe hosts celebrations that people remember for a lifetime.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#enquire"
                className="btn-flame px-8 py-4 font-sans font-medium text-[13px] uppercase tracking-[0.18em] inline-flex items-center gap-2"
              >
                Plan an Event <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={`tel:${BRAND.phoneRaw}`}
                className="px-8 py-4 font-sans font-medium text-[13px] uppercase tracking-[0.18em] border border-gold/40 text-ivory/85 hover:border-flame hover:text-flame transition"
              >
                Call {BRAND.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── KEY NUMBERS ──────────────────────────────────── */}
      <section className="container -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/15 border border-gold/20 backdrop-blur"
        >
          {[
            { v: '350', l: 'Max guests' },
            { v: '12,000', l: 'Sq ft hall' },
            { v: '200+', l: 'Car valet' },
            { v: '5★', l: 'Avg rating' },
          ].map((s) => (
            <div key={s.l} className="bg-espresso-mid/95 p-7 text-center">
              <div className="font-albertus font-bold text-[clamp(28px,4vw,48px)] text-flame">{s.v}</div>
              <div className="mt-2 font-sans font-light text-[13px] text-gold tracking-[0.05em]">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="container mt-28">
        <SectionLabel
          eyebrow="Why Luxe"
          title={<>Built for the <span className="italic text-flame">grand occasion</span></>}
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LUXE_FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative border border-gold/15 bg-espresso-mid/60 p-8 hover:border-flame/60 transition-colors"
            >
              <div className="h-12 w-12 border border-flame/40 flex items-center justify-center text-flame group-hover:bg-flame/10 transition">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-cormorant font-normal text-[20px] text-ivory leading-tight">{f.title}</h3>
              <p className="mt-3 font-sans font-light text-[13px] text-ivory/65 leading-relaxed">{f.desc}</p>
              <span className="absolute bottom-0 left-0 h-[2px] bg-flame w-0 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GALLERY STRIP ────────────────────────────────── */}
      <section className="container mt-28">
        <SectionLabel
          eyebrow="Through the lens"
          title={<>Moments at <span className="italic text-flame">Luxe</span></>}
        />
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {LUXE_GALLERY.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`relative overflow-hidden border border-gold/15 ${
                i === 0 || i === 4 ? 'md:row-span-2 aspect-[3/4] md:aspect-auto' : 'aspect-[4/3]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Luxe banquet"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INCLUSIONS ───────────────────────────────────── */}
      <section className="container mt-28">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] overflow-hidden border border-gold/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1400&q=90"
              alt="Wedding setup at Luxe"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="font-sans font-medium text-[11px] uppercase tracking-[0.3em] text-flame">From the suite</div>
              <p className="mt-3 font-playfair font-normal italic text-[clamp(16px,1.8vw,22px)] text-gold tracking-[0.02em] leading-tight">
                Every Luxe booking comes with an event manager, in-house designer & culinary lead.
              </p>
            </div>
          </div>

          <div>
            <div className="lux-divider text-flame font-sans font-medium text-[11px] uppercase tracking-[0.3em]">
              Included
            </div>
            <h2 className="mt-5 font-cormorant font-light text-4xl md:text-5xl text-ivory leading-[1.05]">
              You bring the guests.<br />
              <span className="italic text-flame">We bring everything else.</span>
            </h2>
            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
              {INCLUSIONS.map((item) => (
                <li key={item} className="flex items-start gap-3 font-sans font-light text-[14px] text-ivory/80">
                  <span className="mt-[6px] h-5 w-5 shrink-0 border border-flame/50 flex items-center justify-center text-flame">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── JOURNEY ──────────────────────────────────────── */}
      <section className="container mt-28">
        <SectionLabel
          eyebrow="The Process"
          title={<>From enquiry to <span className="italic text-flame">curtain call</span></>}
        />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gold/15 border border-gold/20">
          {JOURNEY.map((j, i) => (
            <motion.div
              key={j.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-espresso-mid/95 p-8"
            >
              <div className="font-albertus font-bold text-flame/40 text-6xl leading-none">{j.step}</div>
              <h3 className="mt-4 font-cormorant font-normal text-2xl text-ivory">{j.title}</h3>
              <p className="mt-3 font-sans font-light text-[13px] text-ivory/65 leading-relaxed">{j.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ENQUIRY FORM ─────────────────────────────────── */}
      <section id="enquire" className="container mt-28 scroll-mt-32">
        <div className="relative border border-gold/20 bg-espresso-mid/70 overflow-hidden">
          <div className="absolute inset-0 diagonal-pattern opacity-15 pointer-events-none" />
          <div className="absolute -top-32 -right-24 h-[420px] w-[420px] bg-flame/[0.12] blur-[120px] rounded-full pointer-events-none" />

          <div className="relative grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 p-8 md:p-14">
            <div>
              <SectionLabel
                eyebrow="Plan your event"
                title={<>Let&apos;s craft your <span className="italic text-flame">moment</span></>}
                center={false}
              />
              <p className="mt-5 text-ivory/65 text-[14px] leading-relaxed max-w-md">
                Tell us about your date, guest count and vision. Our event manager will respond within 4 hours with a curated proposal and site-visit slots.
              </p>

              <div className="mt-10 space-y-5">
                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="flex items-center gap-4 text-ivory/80 hover:text-flame transition group"
                >
                  <span className="h-10 w-10 border border-gold/30 flex items-center justify-center group-hover:border-flame group-hover:text-flame transition">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-sans font-medium text-[11px] uppercase tracking-[0.15em] text-gold/70">Banquet desk</div>
                    <div className="font-albertus font-bold text-xl">{BRAND.phone}</div>
                  </div>
                </a>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center gap-4 text-ivory/80 hover:text-flame transition group"
                >
                  <span className="h-10 w-10 border border-gold/30 flex items-center justify-center group-hover:border-flame group-hover:text-flame transition">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-sans font-medium text-[11px] uppercase tracking-[0.15em] text-gold/70">Email enquiries</div>
                    <div className="font-albertus font-bold text-lg break-all">{BRAND.email}</div>
                  </div>
                </a>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Your name *">
                  <input required type="text" value={form.name} onChange={update('name')} className="atm-input" />
                </FormField>
                <FormField label="Phone *">
                  <input required type="tel" value={form.phone} onChange={update('phone')} className="atm-input" />
                </FormField>
              </div>
              <FormField label="Email *">
                <input required type="email" value={form.email} onChange={update('email')} className="atm-input" />
              </FormField>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Event type *">
                  <select value={form.event_type} onChange={update('event_type')} className="atm-input">
                    {EVENT_TYPES.map((t) => (<option key={t}>{t}</option>))}
                  </select>
                </FormField>
                <FormField label="Event date">
                  <input type="date" value={form.event_date} onChange={update('event_date')} className="atm-input" />
                </FormField>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Guest count">
                  <input type="number" min="40" max="400" placeholder="80 to 350" value={form.guest_count} onChange={update('guest_count')} className="atm-input" />
                </FormField>
                <FormField label="Budget">
                  <select value={form.budget_range} onChange={update('budget_range')} className="atm-input">
                    {BUDGETS.map((b) => (<option key={b}>{b}</option>))}
                  </select>
                </FormField>
              </div>
              <FormField label="Tell us more">
                <textarea rows={4} value={form.special_requirements} onChange={update('special_requirements')} placeholder="Theme, cuisine preferences, key requirements..." className="atm-input resize-none" />
              </FormField>

              <button
                type="submit"
                disabled={submitting}
                className="btn-flame w-full py-4 font-sans font-medium text-[13px] uppercase tracking-[0.18em] inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? 'Sending…' : (<>Submit Enquiry <Sparkles className="h-3.5 w-3.5" /></>)}
              </button>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[12.5px] px-4 py-3 border ${
                    result.ok
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-red-500/40 bg-red-500/10 text-red-200'
                  }`}
                >
                  {result.message}
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="block font-sans font-medium text-[11px] uppercase tracking-[0.15em] text-gold/80 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
