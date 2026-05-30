'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, Loader2, Calendar, Clock, Users, Sparkles, ChevronLeft, ChevronRight, MapPin, Phone, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const OCCASIONS = ['Birthday', 'Anniversary', 'Date Night', 'Business', 'Family', 'Other'];
const DIETARY = ['No preference', 'Vegetarian', 'Vegan', 'Jain', 'Gluten-free'];
const TIMES = [
  '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM',
];

const CONFETTI_COLORS = ['#f56d0a', '#c9a882', '#faebe2', '#ffffff'];

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const initialForm = {
  name: '',
  phone: '',
  email: '',
  date: todayISO(),
  time: '8:00 PM',
  guests: 2,
  occasion: '',
  dietary: 'No preference',
  special_requests: '',
};

function fireConfetti() {
  const fire = (opts) =>
    confetti({
      origin: { x: 0.5, y: 0 },
      angle: 270,
      spread: 110,
      startVelocity: 55,
      gravity: 1.4,
      ticks: 220,
      decay: 0.92,
      scalar: 1.05,
      colors: CONFETTI_COLORS,
      ...opts,
    });

  fire({ particleCount: 80 });
  setTimeout(() => fire({ particleCount: 60, spread: 140, startVelocity: 45 }), 150);
  setTimeout(() => fire({ particleCount: 40, spread: 90, startVelocity: 35 }), 320);
}

export default function ReservationModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const firedRef = useRef(false);

  // Reliable cross-browser scroll lock hook
  useEffect(() => {
    if (open) {
      setStep(1);
      setForm((f) => ({ ...f, date: todayISO() }));
      setSuccess(null);
      firedRef.current = false;
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
  }, [open]);

  useEffect(() => {
    if (success && !firedRef.current) {
      firedRef.current = true;
      setTimeout(fireConfetti, 180);
    }
  }, [success]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validateStep1 = () => {
    if (!form.date || !form.time || !form.guests) {
      toast.error('Please choose a date, time and guests.');
      return false;
    }
    return true;
  };
  const validateStep2 = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone are required.');
      return false;
    }
    return true;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(3, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    if (!validateStep2()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to confirm reservation');
      }
      setSuccess(data.reservation);
      setStep(3);
      toast.success('Table reserved, see you soon!');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="res-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-espresso-mid border border-gold/25 shadow-2xl shadow-black/60 overflow-hidden rounded-lg grid md:grid-cols-[35fr_65fr] shrink-0"
            style={{
              width: 'min(900px, 94vw)',
              height: 'min(620px, 92vh)',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full border border-gold/30 bg-espresso/60 backdrop-blur text-ivory/80 hover:text-flame hover:border-flame transition flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* LEFT 35% — visual panel */}
            <div className="relative hidden md:flex flex-col justify-between p-6 overflow-hidden h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=90"
                alt="Atmosphere candle-lit dinner"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-espresso/55 via-espresso/65 to-espresso/95" />
              <div className="absolute inset-0 diagonal-pattern opacity-30 pointer-events-none" />

              <div className="relative">
                <div className="text-flame text-[10px] uppercase tracking-[0.5em] flex items-center gap-2">
                  <Sparkles className="h-3 w-3" /> Atmosphere
                </div>
                <h3 className="mt-3 font-cormorant font-light text-[36px] text-ivory leading-tight">
                  An evening, <span className="italic text-flame">reserved</span>.
                </h3>
                <p className="mt-2 text-ivory/70 text-[12px] leading-relaxed">
                  We will hold your candle-lit table for 15 minutes past your slot.
                </p>
              </div>

              <div className="relative space-y-3 text-ivory/85 text-[11px]">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-flame mt-0.5 shrink-0" />
                  <span className="leading-relaxed">BEML Layout, Mysuru</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-3.5 w-3.5 text-flame mt-0.5 shrink-0" />
                  <span>+91 91102 52593</span>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-3.5 w-3.5 text-flame mt-0.5 shrink-0" />
                  <span>4.4 ★, 1,175+ reviews</span>
                </div>
              </div>

              <div>
                <div className="relative flex items-center gap-2 pt-4">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 h-[2px] overflow-hidden bg-ivory/15">
                      <motion.div
                        className="h-full bg-flame"
                        initial={false}
                        animate={{ width: step >= s ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  ))}
                </div>
                <div className="relative text-[9px] uppercase tracking-[0.4em] text-gold mt-2">
                  Step {step} of 3
                </div>
              </div>
            </div>

            {/* RIGHT 65% — form pane */}
            <div className="relative h-full flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 diagonal-pattern opacity-25 pointer-events-none" />

              {/* Mobile step pips */}
              <div className="md:hidden flex items-center gap-2 px-5 pt-5 shrink-0">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 h-[2px] bg-ivory/15 overflow-hidden">
                    <motion.div
                      className="h-full bg-flame"
                      initial={false}
                      animate={{ width: step >= s ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                ))}
              </div>

              {/* Steps Container */}
              <div className="relative flex-1 overflow-hidden w-full">
                <AnimatePresence mode="popLayout">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: '100%' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: '-100%' }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 p-5 md:p-8 flex flex-col overflow-y-auto no-scrollbar text-left"
                    >
                      <div className="text-flame text-[10px] uppercase tracking-[0.5em] flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> When
                      </div>
                      <h3 className="mt-2 font-cormorant font-light text-[36px] text-ivory leading-tight">
                        Pick your <span className="italic text-flame">evening</span>
                      </h3>

                      {/* DATE */}
                      <div className="mt-5">
                        <div className="font-sans font-medium text-[12px] uppercase tracking-[0.15em] text-gold/85 mb-2">Date *</div>
                        <input
                          type="date"
                          required
                          min={todayISO()}
                          value={form.date}
                          onChange={(e) => set('date', e.target.value)}
                          className="atm-input"
                          style={{ height: 40 }}
                        />
                      </div>

                      {/* TIME */}
                      <div className="mt-4">
                        <div className="font-sans font-medium text-[12px] uppercase tracking-[0.15em] text-gold/85 mb-2">Time *</div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {TIMES.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => set('time', t)}
                              className={`font-sans font-normal text-[13px] border transition cursor-pointer ${
                                form.time === t
                                  ? 'border-flame text-flame bg-flame/10'
                                  : 'border-gold/25 text-ivory/75 hover:border-flame/60'
                              }`}
                              style={{ height: 36 }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* GUESTS */}
                      <div className="mt-4">
                        <div className="font-sans font-medium text-[12px] uppercase tracking-[0.15em] text-gold/85 mb-2">Guests *</div>
                        <div className="flex flex-wrap gap-1.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => set('guests', n)}
                              className={`font-sans font-normal text-[13px] border transition cursor-pointer ${
                                Number(form.guests) === n
                                  ? 'border-flame text-flame bg-flame/10'
                                  : 'border-gold/25 text-ivory/75 hover:border-flame/60'
                              }`}
                              style={{ height: 36, width: 36 }}
                            >
                              {n}
                            </button>
                          ))}
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={form.guests}
                            onChange={(e) => set('guests', Number(e.target.value))}
                            className="atm-input text-center"
                            aria-label="Custom guest count"
                            style={{ height: 36, width: 64 }}
                          />
                        </div>
                      </div>

                      {/* OCCASION */}
                      <div className="mt-4 pb-4">
                        <div className="font-sans font-medium text-[12px] uppercase tracking-[0.15em] text-gold/85 mb-2">
                          Occasion (optional)
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {OCCASIONS.map((o) => (
                            <button
                              key={o}
                              type="button"
                              onClick={() => set('occasion', form.occasion === o ? '' : o)}
                              className={`px-2.5 font-sans font-normal text-[13px] border transition cursor-pointer ${
                                form.occasion === o
                                  ? 'border-flame text-flame bg-flame/10'
                                  : 'border-gold/25 text-ivory/75 hover:border-flame/60'
                              }`}
                              style={{ height: 30 }}
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: '100%' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: '-100%' }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 p-5 md:p-8 flex flex-col overflow-y-auto no-scrollbar text-left"
                    >
                      <div className="text-flame text-[10px] uppercase tracking-[0.5em] flex items-center gap-2">
                        <Users className="h-3 w-3" /> Your details
                      </div>
                      <h3 className="mt-2 font-cormorant font-light text-[36px] text-ivory leading-tight">
                        How shall we <span className="italic text-flame">greet you?</span>
                      </h3>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                        <Field label="Full name *">
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            className="atm-input"
                            placeholder="Your name"
                          />
                        </Field>
                        <Field label="Phone *">
                          <input
                            type="tel"
                            required
                            value={form.phone}
                            onChange={(e) => set('phone', e.target.value)}
                            className="atm-input"
                            placeholder="+91 ..."
                          />
                        </Field>
                        <Field label="Email" className="sm:col-span-2">
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                            className="atm-input"
                            placeholder="name@email.com"
                          />
                        </Field>
                        <Field label="Dietary preference" className="sm:col-span-2">
                          <div className="flex flex-wrap gap-1.5">
                            {DIETARY.map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => set('dietary', d)}
                                className={`px-2.5 py-1.5 text-[10px] uppercase tracking-[0.22em] border transition cursor-pointer ${
                                  form.dietary === d
                                    ? 'border-flame text-flame bg-flame/10'
                                    : 'border-gold/25 text-ivory/75 hover:border-flame/60'
                                }`}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </Field>
                        <Field label="Special requests" className="sm:col-span-2">
                          <textarea
                            rows={2}
                            value={form.special_requests}
                            onChange={(e) => set('special_requests', e.target.value)}
                            className="atm-input resize-none"
                            placeholder="Allergies, seating preference, surprise..."
                          />
                        </Field>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && success && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: '100%' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: '-100%' }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 p-5 md:p-8 flex flex-col justify-center items-center overflow-y-auto no-scrollbar text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mx-auto h-16 w-16 rounded-full bg-flame/15 border border-flame flex items-center justify-center"
                      >
                        <Check className="h-7 w-7 text-flame" />
                      </motion.div>
                      <h3 className="mt-5 font-albertus font-bold text-[42px] text-ivory leading-tight">
                        You&apos;re confirmed!
                      </h3>
                      <p className="mt-2 text-ivory/70 max-w-md mx-auto text-sm">
                        We have saved your candle-lit table at Atmosphere.
                      </p>

                      <div className="mt-5 inline-flex flex-col gap-1 px-6 py-3 border border-gold/30 bg-espresso/50">
                        <span className="font-sans font-medium text-[12px] uppercase tracking-[0.15em] text-gold">Reference</span>
                        <span className="font-albertus font-normal text-[22px] text-flame">{success.reference}</span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-4 justify-center text-sm">
                        <div className="flex items-center gap-2 text-ivory/85">
                          <Calendar className="h-4 w-4 text-flame" /> {success.date}
                        </div>
                        <div className="flex items-center gap-2 text-ivory/85">
                          <Clock className="h-4 w-4 text-flame" /> {success.time}
                        </div>
                        <div className="flex items-center gap-2 text-ivory/85">
                          <Users className="h-4 w-4 text-flame" /> {success.guests} guests
                        </div>
                      </div>

                      <button
                        onClick={onClose}
                        className="btn-flame mt-6 px-7 py-3 text-[11px] uppercase tracking-[0.36em] cursor-pointer"
                      >
                        Close
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Buttons Row */}
              {step !== 3 && (
                <div className="relative px-5 md:px-8 py-4 border-t border-gold/15 flex items-center justify-between gap-3 shrink-0 bg-[#24170c] z-10">
                  <button
                    type="button"
                    onClick={prev}
                    disabled={step === 1}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[0.3em] border border-gold/30 text-ivory/80 hover:border-flame hover:text-flame transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Back
                  </button>

                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={next}
                      className="btn-flame inline-flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-[0.3em] cursor-pointer"
                    >
                      Continue <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="btn-flame inline-flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-[0.3em] disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Reserving...
                        </>
                      ) : (
                        <>Confirm Reservation</>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[12px] font-sans font-medium uppercase tracking-[0.15em] text-gold/85">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
