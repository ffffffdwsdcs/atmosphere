'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Wine, ChefHat, Calendar, Clock, Ticket, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { BRAND, EXPERIENCES } from '@/lib/atmosphereData';
import SectionLabel from '@/components/atmosphere/SectionLabel';

const STATIC_FALLBACK_EVENTS = [
  {
    id: 'acoustic-sessions',
    name: 'Acoustic Sessions',
    day: 'Every Wednesday',
    time: '8:00 PM, 11:00 PM',
    price: 'No cover · Tasting menu ₹ 1,800',
    img: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_564651954_122177035604446255_8896991281199984757_n.jpg',
    blurb: 'Unplugged sets by Mysuru&apos;s favourite singer-songwriters. Slow service, candle hour, a single-malt flight.',
    icon: 'Music',
  },
  {
    id: 'live-band-night',
    name: 'Live Band Night',
    day: 'Every Friday',
    time: '9:00 PM, 12:30 AM',
    price: 'Couple cover ₹ 1,000 fully redeemable',
    img: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704731983_122201749286446255_7832553486323798210_n.jpg',
    blurb: 'In-house quartet weaving Bollywood, jazz & soul. Crafted cocktails, late-night bar menu, no shortage of dancefloor.',
    icon: 'Music',
  },
  {
    id: 'resident-dj',
    name: 'Resident DJ Saturdays',
    day: 'Every Saturday',
    time: '10:00 PM, 12:30 AM',
    price: 'Couple cover ₹ 1,500 fully redeemable',
    img: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704507251_122201668016446255_657162141135626679_n.jpg',
    blurb: 'Deep house, retro nu-disco, and a special guest set the third weekend of every month.',
    icon: 'Music',
  },
  {
    id: 'chefs-table',
    name: 'Chef’s Table Tasting',
    day: 'Wed, Sun (by reservation)',
    time: '7:30 PM, 10:30 PM',
    price: '₹ 3,200 per guest · 7 courses',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90',
    blurb: 'Seven plates by Chef Aravind, from fire to ferment to dessert. Optional wine & cocktail pairing.',
    icon: 'ChefHat',
  },
  {
    id: 'whisky-flight',
    name: 'Whisky Flight Nights',
    day: 'First Thursday of the month',
    time: '8:00 PM onwards',
    price: 'Flight from ₹ 1,400',
    img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1400&q=90',
    blurb: 'Three-pour curated flight across Highland, Speyside & Islay. Hosted by our resident bar lead.',
    icon: 'Wine',
  },
  {
    id: 'sunday-brunch',
    name: 'Slow Sunday Brunch',
    day: 'Every Sunday',
    time: '12:00 PM, 4:00 PM',
    price: '₹ 1,650 · Bottomless mimosas + ₹ 600',
    img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1400&q=90',
    blurb: 'Live counters, eggs your way, biryani station, dessert tower and a jazz trio in the corner.',
    icon: 'ChefHat',
  },
];

const ICON_MAP = {
  Music,
  Wine,
  ChefHat,
  Calendar,
  Clock,
  Ticket,
};

const getEventDate = (dayName) => {
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const cleanDay = String(dayName || '').toLowerCase();
  const targetDay = daysOfWeek.findIndex(d => cleanDay.includes(d));
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

const getDayInitials = (dayName) => {
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const cleanDay = String(dayName || '').toLowerCase();
  const match = daysOfWeek.find(d => cleanDay.includes(d));
  if (match) return match.slice(0, 3).toUpperCase();
  return 'EVT';
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    event_date: '',
    guests: '',
    special_requests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/admin/events-manager');
        if (!res.ok) throw new Error('Failed to load experiences');
        const data = await res.json();
        const activeEvents = (data.items || []).filter((item) => item.active !== false);
        if (activeEvents.length > 0) {
          setEvents(activeEvents);
          setSelectedEvent(activeEvents[0].name);
        } else {
          setEvents(STATIC_FALLBACK_EVENTS);
          setSelectedEvent(STATIC_FALLBACK_EVENTS[0].name);
        }
      } catch (err) {
        setEvents(STATIC_FALLBACK_EVENTS);
        setSelectedEvent(STATIC_FALLBACK_EVENTS[0].name);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/event-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, event_name: selectedEvent }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Submission failed');
      setResult({
        ok: true,
        message: `Reserved! Our team will confirm your spot at ${selectedEvent}.`,
      });
      setForm({ name: '', phone: '', email: '', event_date: '', guests: '', special_requests: '' });
    } catch (err) {
      setResult({ ok: false, message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const pickEvent = (name) => {
    setSelectedEvent(name);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('book-event');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a05] flex flex-col items-center justify-center gap-3 text-gold">
        <RefreshCw className="h-8 w-8 animate-spin text-flame" />
        <span className="text-xs uppercase tracking-widest font-mono font-semibold">Tuning experiences...</span>
      </div>
    );
  }

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
          className="max-w-3xl"
        >
          <div className="lux-divider text-flame text-[10px] uppercase tracking-[0.5em]">
            Atmosphere · Live experiences
          </div>
          <h1 className="mt-6 font-albertus font-bold text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.98] text-ivory">
            Nights that <span className="italic text-flame">linger.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-ivory/70 text-[15px] leading-relaxed">
            Live bands, chef&apos;s tables, whisky flights, slow Sundays, our calendar is a curated rotation of the things that make a great night out in Mysuru.
          </p>
        </motion.div>
      </section>

      {/* WEEKLY EXPERIENCES STRIP */}
      <section className="container mt-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gold/15 border border-gold/20">
          {EXPERIENCES.map((e) => (
            <div key={e.day} className="bg-espresso-mid/90 p-7">
              <div className="text-[10px] uppercase tracking-[0.36em] text-flame">{e.day}</div>
              <h3 className="mt-3 font-display text-2xl text-ivory">{e.title}</h3>
              <p className="mt-2 text-[12.5px] text-ivory/60 leading-relaxed">{e.note}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold/80">
                <Clock className="h-3 w-3" /> {e.time}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNATURE EVENTS GRID */}
      <section className="container mt-28">
        <SectionLabel
          eyebrow="The Calendar"
          title={<>Signature <span className="italic text-flame">experiences</span></>}
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((ev, i) => {
            const EvIcon = ICON_MAP[ev.icon] || Calendar;
            return (
              <motion.article
                key={ev.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col border border-gold/15 bg-espresso-mid/60 hover:border-flame/60 transition-colors duration-300 overflow-hidden"
              >
                <div className="relative h-[300px] md:h-[384px] w-full overflow-hidden shrink-0">
                  {/* Bookmark day tag */}
                  <div className="absolute top-0 right-4 z-10 bg-flame text-ivory px-3 py-2.5 flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] rounded-b-[4px]">
                    <span className="font-sans font-extrabold text-[15px] text-ivory leading-none">
                      {getEventDate(ev.day)}
                    </span>
                    <span className="font-sans font-bold text-[8px] uppercase tracking-wider leading-none mt-1 text-gold">
                      {getDayInitials(ev.day)}
                    </span>
                  </div>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ev.img}
                    alt={ev.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-flame/90 text-espresso text-[10px] uppercase tracking-[0.32em] font-semibold z-10">
                    <EvIcon className="h-3 w-3" />
                    {ev.day.split(' ')[1] || ev.day}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-cormorant font-light text-[32px] text-ivory leading-tight">{ev.name}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-sans font-normal text-gold">
                    <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {ev.day}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> {ev.time}</span>
                  </div>
                  <p className="mt-4 font-sans font-light text-[14px] text-ivory/65 leading-relaxed" dangerouslySetInnerHTML={{ __html: ev.blurb }} />
                  <div className="mt-5 pt-5 border-t border-gold/10 flex items-center justify-between gap-3">
                    <span className="text-[12px] text-ivory/75">{ev.price}</span>
                    <button
                      onClick={() => pickEvent(ev.name)}
                      className="inline-flex items-center gap-1.5 text-flame text-[10px] uppercase tracking-[0.36em] hover:gap-2.5 transition-all"
                    >
                      Reserve <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <span className="absolute bottom-0 left-0 h-[2px] bg-flame w-0 group-hover:w-full transition-all duration-500" />
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* BOOK FORM */}
      <section id="book-event" className="container mt-28 scroll-mt-32">
        <div className="relative border border-gold/20 bg-espresso-mid/70 overflow-hidden">
          <div className="absolute inset-0 diagonal-pattern opacity-15 pointer-events-none" />
          <div className="absolute -top-24 -left-24 h-[420px] w-[420px] bg-flame/[0.12] blur-[120px] rounded-full pointer-events-none" />

          <div className="relative grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 p-8 md:p-14">
            <div>
              <SectionLabel
                eyebrow="Reserve your spot"
                title={<>Save a seat for <span className="italic text-flame">{selectedEvent}</span></>}
                center={false}
              />
              <p className="mt-5 text-ivory/65 text-[14px] leading-relaxed max-w-md">
                Select an event below or call us, we&apos;ll confirm your reservation, dietary preferences and any pairing add-ons within an hour.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {events.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEvent(ev.name)}
                    className={`px-3.5 h-9 text-[10px] uppercase tracking-[0.3em] border transition ${
                      selectedEvent === ev.name
                        ? 'border-flame text-flame bg-flame/10'
                        : 'border-gold/25 text-ivory/65 hover:border-flame/60'
                    }`}
                  >
                    {ev.name}
                  </button>
                ))}
              </div>


              <div className="mt-10 inline-flex items-center gap-3 text-ivory/75 text-[12.5px]">
                <Ticket className="h-4 w-4 text-flame" />
                Call <a className="underline-offset-4 hover:underline text-flame" href={`tel:${BRAND.phoneRaw}`}>{BRAND.phone}</a> for group bookings (8+).
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
                <FormField label="Preferred date">
                  <input type="date" value={form.event_date} onChange={update('event_date')} className="atm-input" />
                </FormField>
                <FormField label="Number of guests">
                  <input type="number" min="1" max="40" placeholder="2" value={form.guests} onChange={update('guests')} className="atm-input" />
                </FormField>
              </div>
              <FormField label="Special requests">
                <textarea rows={4} value={form.special_requests} onChange={update('special_requests')} placeholder="Birthday, anniversary, dietary preferences..." className="atm-input resize-none" />
              </FormField>

              <button
                type="submit"
                disabled={submitting}
                className="btn-flame w-full py-4 text-[11px] uppercase tracking-[0.36em] inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? 'Reserving…' : (<>Confirm Booking <Sparkles className="h-3.5 w-3.5" /></>)}
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
      <span className="block text-[10px] uppercase tracking-[0.36em] text-gold/80 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
