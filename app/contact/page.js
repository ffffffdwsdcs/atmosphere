'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Sparkles, Navigation, Instagram, Facebook } from 'lucide-react';
import { BRAND } from '@/lib/atmosphereData';
import SectionLabel from '@/components/atmosphere/SectionLabel';

const SUBJECTS = [
  'Table Reservation',
  'Banquet & Events',
  'Private Dining',
  'Feedback / Compliment',
  'Press & Partnerships',
  'Careers',
  'Other',
];

const QUICK_ACTIONS = [
  {
    Icon: Phone,
    label: 'Call us',
    value: BRAND.phone,
    sub: 'Daily 11 AM \u2014 11 PM',
    href: `tel:${BRAND.phoneRaw}`,
  },
  {
    Icon: MessageSquare,
    label: 'WhatsApp',
    value: 'Chat now',
    sub: 'Avg. response 5 min',
    href: BRAND.whatsapp,
  },
  {
    Icon: Mail,
    label: 'Email',
    value: BRAND.email,
    sub: 'We reply within 4 hours',
    href: `mailto:${BRAND.email}`,
  },
];

const MAP_QUERY = encodeURIComponent(`${BRAND.address}, ${BRAND.city}`);
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: SUBJECTS[0],
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Submission failed');
      setResult({ ok: true, message: 'Thank you. Our team will respond shortly.' });
      setForm({ name: '', phone: '', email: '', subject: SUBJECTS[0], message: '' });
    } catch (err) {
      setResult({ ok: false, message: err.message });
    } finally {
      setSubmitting(false);
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
          <div className="lux-divider justify-center text-flame text-[10px] uppercase tracking-[0.5em]">
            Get in touch
          </div>
          <h1 className="mt-6 font-albertus font-bold text-[clamp(48px,8vw,96px)] leading-[0.98] text-ivory">
            We&apos;d love to <span className="italic text-flame">hear from you.</span>
          </h1>
          <p className="mt-6 text-ivory/65 leading-relaxed text-[15px] max-w-2xl mx-auto">
            Reservations, banquet enquiries, press, or just a question, reach out below and our team will respond personally.
          </p>
        </motion.div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="container mt-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gold/15 border border-gold/20">
          {QUICK_ACTIONS.map((q, i) => (
            <motion.a
              key={q.label}
              href={q.href}
              target={q.href.startsWith('http') ? '_blank' : undefined}
              rel={q.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-espresso-mid/95 p-7 flex items-start gap-5 hover:bg-espresso-mid transition"
            >
              <span className="h-12 w-12 border border-gold/30 flex items-center justify-center text-flame group-hover:border-flame group-hover:bg-flame/10 transition">
                <q.Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-gold/70">{q.label}</div>
                <div className="mt-1 font-sans font-light text-[15px] text-ivory truncate">{q.value}</div>
                <div className="mt-1 text-[12px] text-ivory/55 font-sans font-light">{q.sub}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="container mt-20">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14">
          {/* FORM */}
          <div className="relative border border-gold/20 bg-espresso-mid/70 overflow-hidden">
            <div className="absolute inset-0 diagonal-pattern opacity-15 pointer-events-none" />
            <div className="absolute -top-24 -right-24 h-[380px] w-[380px] bg-flame/[0.12] blur-[120px] rounded-full pointer-events-none" />
            <div className="relative p-8 md:p-10">
              <SectionLabel
                eyebrow="Drop us a line"
                title={<>Tell us how we <span className="italic text-flame">can help</span></>}
                center={false}
              />
              <p className="mt-5 text-ivory/65 text-[14px] leading-relaxed max-w-md">
                The fastest way to reach us is a call or WhatsApp, but if you&apos;d like a written reply, use the form below.
              </p>

              <form onSubmit={submit} className="mt-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Your name *">
                    <input required type="text" value={form.name} onChange={update('name')} className="atm-input" />
                  </FormField>
                  <FormField label="Phone">
                    <input type="tel" value={form.phone} onChange={update('phone')} className="atm-input" />
                  </FormField>
                </div>
                <FormField label="Email *">
                  <input required type="email" value={form.email} onChange={update('email')} className="atm-input" />
                </FormField>
                <FormField label="Subject *">
                  <select required value={form.subject} onChange={update('subject')} className="atm-input">
                    {SUBJECTS.map((s) => (<option key={s}>{s}</option>))}
                  </select>
                </FormField>
                <FormField label="Message *">
                  <textarea required rows={5} value={form.message} onChange={update('message')} placeholder="How can we help you?" className="atm-input resize-none" />
                </FormField>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-flame w-full py-4 text-[11px] uppercase tracking-[0.36em] inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? 'Sending\u2026' : (<>Send Message <Send className="h-3.5 w-3.5" /></>)}
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

          {/* DETAILS + MAP */}
          <div className="flex flex-col gap-6">
            {/* Address card */}
            <div className="border border-gold/20 bg-espresso-mid/70 p-7">
              <div className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-flame">Visit us</div>
              <div className="mt-4 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold mt-1 shrink-0" />
                <div>
                  <div className="font-cormorant font-light text-[24px] text-ivory leading-tight">{BRAND.name}</div>
                  <div className="mt-2 font-sans font-light text-[13px] text-ivory/70 leading-relaxed font-sans font-light">
                    {BRAND.address}<br />
                    {BRAND.city}
                  </div>
                  <a
                    href={MAP_DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-flame text-[10.5px] uppercase tracking-[0.36em] hover:gap-3 transition-all"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Get directions
                  </a>
                </div>
              </div>

              <div className="mt-7 pt-6 border-t border-gold/15">
                <div className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-flame">Hours</div>
                <ul className="mt-3 space-y-2">
                  {BRAND.hours.map((h) => (
                    <li key={h.day} className="flex items-center justify-between text-[13px] font-sans font-light">
                      <span className="inline-flex items-center gap-2 text-ivory/75">
                        <Clock className="h-3.5 w-3.5 text-gold" /> {h.day}
                      </span>
                      <span className="text-ivory/85 font-normal">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 pt-6 border-t border-gold/15 flex items-center gap-3">
                <a
                  href={BRAND.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-10 w-10 border border-gold/30 flex items-center justify-center text-ivory/75 hover:text-flame hover:border-flame transition"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={BRAND.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="h-10 w-10 border border-gold/30 flex items-center justify-center text-ivory/75 hover:text-flame hover:border-flame transition"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <span className="text-[11px] uppercase tracking-[0.3em] text-ivory/45 ml-2">Follow the moments</span>
              </div>
            </div>

            {/* Map */}
            <div className="relative border border-gold/20 overflow-hidden aspect-[4/3]">
              <iframe
                title="Atmosphere on Google Maps"
                src={MAP_EMBED}
                loading="lazy"
                className="absolute inset-0 h-full w-full grayscale-[40%] contrast-110"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-flame/10" />
            </div>
          </div>
        </div>
      </section>

      {/* RESERVATION CTA */}
      <section className="container mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden border border-gold/20 bg-gradient-to-br from-espresso-mid via-espresso to-espresso-mid p-10 md:p-14 text-center"
        >
          <div className="absolute inset-0 diagonal-pattern opacity-10" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[680px] bg-flame/[0.1] blur-[140px] rounded-full pointer-events-none" />
          <div className="relative">
            <div className="lux-divider justify-center text-flame text-[10px] uppercase tracking-[0.5em]">
              <Sparkles className="h-3 w-3" /> Looking to dine in?
            </div>
            <h2 className="mt-6 font-display text-3xl md:text-5xl text-ivory leading-[1.05]">
              Reserve a table in <span className="italic text-flame">seconds.</span>
            </h2>
            <p className="mt-5 text-ivory/65 text-[14.5px] max-w-xl mx-auto">
              Walk-ins welcome, but a quick call guarantees you the seat you want, window, bar, mezzanine, or private nook.
            </p>
            <div className="mt-8 inline-flex flex-wrap gap-3 justify-center">
              <a
                href={`tel:${BRAND.phoneRaw}`}
                className="btn-flame px-8 py-4 text-[11px] uppercase tracking-[0.36em] inline-flex items-center gap-2"
              >
                Call {BRAND.phone}
              </a>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-[11px] uppercase tracking-[0.36em] border border-gold/40 text-ivory/85 hover:border-flame hover:text-flame transition inline-flex items-center gap-2"
              >
                <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
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
