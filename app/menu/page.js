'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Leaf, Search, Sparkles, Star, ChevronDown } from 'lucide-react';
import { MENU, MENU_CATEGORIES, BRAND } from '@/lib/atmosphereData';
import { useReservation } from '@/components/atmosphere/ReservationContext';
import SectionLabel from '@/components/atmosphere/SectionLabel';
import toast from 'react-hot-toast';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'veg', label: 'Veg only' },
  { id: 'nonveg', label: 'Non-Veg' },
  { id: 'signature', label: 'Signature' },
];

const SpicyDots = ({ level = 0 }) => (
  <div className="flex items-center gap-0.5" aria-label={`Spice level ${level}`}>
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        className={`h-1.5 w-1.5 rounded-full ${i <= level ? 'bg-red-500' : 'bg-ivory/15'}`}
      />
    ))}
  </div>
);

const VegBadge = ({ veg }) => (
  <span
    className={`inline-flex items-center justify-center h-4 w-4 border ${
      veg ? 'border-emerald-500/70' : 'border-red-500/70'
    }`}
    aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${veg ? 'bg-emerald-500' : 'bg-red-500'}`}
    />
  </span>
);

function DishCard({ dish, idx }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (idx % 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border border-gold/15 bg-espresso-mid/60 hover:border-flame/50 transition-colors overflow-hidden flex flex-col h-full rounded-md"
    >
      <div className="relative aspect-square md:aspect-[16/10] overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dish.img}
          alt={dish.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out md:group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent opacity-90" />

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1.5">
          <VegBadge veg={dish.veg} />
          {dish.tags?.slice(0, 1).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 font-sans font-medium text-[8px] xs:text-[10px] md:text-[11px] uppercase tracking-[0.1em] bg-flame/90 text-espresso rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Bottom price */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 px-1.5 py-0.5 md:px-2.5 md:py-1 bg-espresso/85 border border-gold/30 backdrop-blur rounded-sm">
          <span className="font-albertus font-bold text-[13px] xs:text-[16px] md:text-[24px] text-flame leading-none">
            ₹{dish.price}
          </span>
        </div>
      </div>

      <div className="p-3 xs:p-4 md:p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-start justify-between gap-1.5 md:gap-3">
            <h3 className="font-cormorant font-normal text-[15px] xs:text-[18px] md:text-[22px] text-ivory leading-[1.2] md:leading-tight">
              {dish.name}
            </h3>
            <div className="shrink-0 mt-0.5">
              <SpicyDots level={dish.spicy} />
            </div>
          </div>
          <p className="mt-1.5 font-sans font-light text-[11px] xs:text-[12px] md:text-[13px] text-ivory/60 leading-[1.4] md:leading-[1.6] line-clamp-3 md:line-clamp-none">
            {dish.desc}
          </p>
        </div>
      </div>

      {/* Hover gold line */}
      <span className="absolute bottom-0 left-0 h-[2px] bg-flame transition-all duration-500 w-0 md:group-hover:w-full" />
    </motion.article>
  );
}

export default function MenuPage() {
  const { openModal } = useReservation();
  const [activeCat, setActiveCat] = useState('all');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [spiceFilter, setSpiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  // Custom Dish Request states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    dishName: '',
    category: 'North Indian',
    customCategory: '',
    notes: '',
  });
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const marker = document.getElementById('menu-end-marker');
      if (marker) {
        const rect = marker.getBoundingClientRect();
        // Fades out cleanly when the end of the menu grids scrolls up to the sticky bar
        setShowFilterBar(rect.top > 140);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setIsRequestSubmitting(true);
    
    // Simulate API request submission
    setTimeout(() => {
      setIsRequestSubmitting(false);
      setShowRequestModal(false);
      setRequestForm({
        name: '',
        email: '',
        dishName: '',
        category: 'North Indian',
        customCategory: '',
        notes: '',
      });
      toast.success("Your dish request has been shared with our Chef!");
    }, 1200);
  };

  const filtered = useMemo(() => {
    let result = MENU.filter((d) => {
      if (activeCat !== 'all' && d.cat !== activeCat) return false;
      if (filter === 'veg' && !d.veg) return false;
      if (filter === 'nonveg' && d.veg) return false;
      if (filter === 'signature' && !(d.tags || []).includes('Signature')) return false;
      if (spiceFilter !== 'all') {
        if (d.spicy !== parseInt(spiceFilter, 10)) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.desc.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeCat, filter, spiceFilter, sortBy, query]);

  const grouped = useMemo(() => {
    const map = {};
    MENU_CATEGORIES.forEach((c) => (map[c.id] = []));
    filtered.forEach((d) => {
      if (!map[d.cat]) map[d.cat] = [];
      map[d.cat].push(d);
    });
    return map;
  }, [filtered]);

  return (
    <div className="relative pt-32 pb-24 min-h-screen">
      {/* Decorative backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-flame/[0.07] blur-[140px] rounded-full" />
        <div className="absolute inset-0 diagonal-pattern opacity-20" />
      </div>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <SectionLabel>The Menu · 42 Dishes</SectionLabel>
          <h1 className="mt-5 font-albertus font-bold text-[clamp(48px,8vw,96px)] leading-[0.95] text-ivory">
            Crafted to <span className="italic text-flame">remember</span>.
          </h1>
          <p className="mt-5 font-sans font-light text-ivory/65 leading-relaxed text-[15px] max-w-2xl mx-auto">
            Five cuisines, one obsession, slow cooking, fire, fermentation and the finest produce.
            Every plate at <span className="text-gold">Atmosphere</span> is finished by a chef, not a machine.
          </p>

          <div className="mt-7 flex items-center justify-center gap-2 font-sans font-medium text-[11px] uppercase tracking-[0.36em] text-gold/85">
            <Star className="h-3 w-3 text-flame fill-flame" />
            4.4 · 1,175+ reviews
            <span className="text-ivory/30">·</span>
            <Sparkles className="h-3 w-3 text-flame" />
            Chef&apos;s Tasting Available
          </div>
        </motion.div>
      </section>

      <section
        className={`sticky top-[80px] z-50 mt-14 bg-espresso border-y border-gold/15 transition-all duration-300 lg:hidden ${
          showFilterBar
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ivory/50" />
              <input
                type="text"
                placeholder="Search a dish..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="atm-input pl-9 h-10 text-xs"
              />
            </div>

            {/* Category tabs */}
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  onClick={() => setActiveCat('all')}
                  className={`px-3.5 h-9 text-[10px] uppercase tracking-[0.3em] border transition whitespace-nowrap ${
                    activeCat === 'all'
                      ? 'border-flame text-flame bg-flame/10'
                      : 'border-gold/25 text-ivory/70 hover:border-flame/60'
                  }`}
                >
                  All
                </button>
                {MENU_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCat(c.id)}
                    className={`px-3.5 h-9 text-[10px] uppercase tracking-[0.3em] border transition whitespace-nowrap ${
                      activeCat === c.id
                        ? 'border-flame text-flame bg-flame/10'
                        : 'border-gold/25 text-ivory/70 hover:border-flame/60'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Veg / Non-veg / Signature filter pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 h-9 text-[10px] uppercase tracking-[0.3em] border transition whitespace-nowrap ${
                    filter === f.id
                      ? 'border-flame text-flame bg-flame/10'
                      : 'border-gold/25 text-ivory/55 hover:border-flame/60'
                  }`}
                >
                  {f.id === 'veg' && <Leaf className="inline h-3 w-3 mr-1.5 -mt-0.5" />}
                  {f.id === 'nonveg' && <Flame className="inline h-3 w-3 mr-1.5 -mt-0.5" />}
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Menu Legend / Instructions ─────────────────────── */}
      <div className="container mt-8">
        <div className="border border-gold/15 bg-espresso-mid/30 px-4 py-3 md:px-6 md:py-4 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="font-sans font-semibold text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gold/90">
              Dietary & Spice Guide
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-ivory/80">
                <VegBadge veg={true} />
                <span>Vegetarian</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-ivory/80">
                <VegBadge veg={false} />
                <span>Non-Vegetarian</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-ivory/80">
                <SpicyDots level={3} />
                <span>Spice Level (1-3)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Result count ──────────────────────────────────── */}
      <div className="container mt-10 flex items-center justify-between">
        <p className="font-sans font-medium text-[11px] uppercase tracking-[0.36em] text-gold/85">
          Showing <span className="text-flame">{filtered.length}</span> of {MENU.length} dishes
        </p>
        <button
          onClick={openModal}
          className="btn-flame px-5 py-2.5 font-sans font-medium text-[12px] uppercase tracking-[0.18em]"
        >
          Reserve Table
        </button>
      </div>

      {/* ── Menu List Layout (Grid on Desktop, Single Column on Mobile) ── */}
      <div className="container mt-10 grid lg:grid-cols-[260px_1fr] gap-10 items-start relative">
        {/* Left Column: Premium Sticky Sidebar (Desktop Only) */}
        <aside
          data-lenis-prevent
          className="hidden lg:block sticky top-[100px] self-start space-y-5 border border-gold/15 bg-[#170e06]/90 backdrop-blur-md p-5 rounded-md max-h-[80vh] overflow-y-auto sidebar-scrollbar shadow-2xl z-40"
        >
          {/* Section Header */}
          <div className="border-b border-gold/10 pb-3">
            <h3 className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-gold/90">
              Filter & Sort
            </h3>
          </div>

          {/* Main Veg / Non-Veg Toggle on Top */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold font-sans">Dietary Option</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFilter(filter === 'veg' ? 'all' : 'veg')}
                className={`flex items-center justify-center py-2.5 px-2.5 border rounded-md transition-all duration-300 gap-2 ${
                  filter === 'veg'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                    : 'border-gold/15 bg-espresso/40 text-ivory/60 hover:border-gold/40 hover:text-ivory'
                }`}
              >
                <VegBadge veg={true} />
                <span className="text-[10px] uppercase tracking-[0.15em]">Veg</span>
              </button>
              <button
                onClick={() => setFilter(filter === 'nonveg' ? 'all' : 'nonveg')}
                className={`flex items-center justify-center py-2.5 px-2.5 border rounded-md transition-all duration-300 gap-2 ${
                  filter === 'nonveg'
                    ? 'border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)] font-semibold'
                    : 'border-gold/15 bg-espresso/40 text-ivory/60 hover:border-gold/40 hover:text-ivory'
                }`}
              >
                <VegBadge veg={false} />
                <span className="text-[10px] uppercase tracking-[0.15em]">Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Cuisine & Courses Categories Widget */}
          <div className="border-t border-gold/10 pt-4 space-y-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold font-sans">Cuisine & Courses</h4>
            <div className="space-y-1 font-sans">
              <button
                onClick={() => setActiveCat('all')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left text-[11px] uppercase tracking-[0.15em] border-l-2 transition-all duration-300 ${
                  activeCat === 'all'
                    ? 'border-flame text-flame bg-flame/[0.03] font-semibold'
                    : 'border-gold/10 text-ivory/60 hover:text-ivory hover:border-flame/50'
                }`}
              >
                <span>All Cuisines</span>
                <span className="text-[9px] text-gold/40">({MENU.length})</span>
              </button>
              {MENU_CATEGORIES.map((cat) => {
                const count = MENU.filter(d => d.cat === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left text-[11px] uppercase tracking-[0.15em] border-l-2 transition-all duration-300 ${
                      activeCat === cat.id
                        ? 'border-flame text-flame bg-flame/[0.03] font-semibold'
                        : 'border-gold/10 text-ivory/60 hover:text-ivory hover:border-flame/50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[9px] text-gold/40">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spice Level Filter */}
          <div className="border-t border-gold/10 pt-4 space-y-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold font-sans">Spice Level</h4>
            <div className="grid grid-cols-4 gap-1.5 font-sans">
              <button
                onClick={() => setSpiceFilter('all')}
                className={`h-8 border text-[10px] uppercase tracking-[0.1em] transition rounded-sm font-semibold ${
                  spiceFilter === 'all'
                    ? 'border-gold text-gold bg-gold/10'
                    : 'border-gold/25 text-ivory/60 hover:border-gold/50'
                }`}
              >
                All
              </button>
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => setSpiceFilter(String(level))}
                  className={`h-8 border flex items-center justify-center gap-1 transition rounded-sm ${
                    spiceFilter === String(level)
                      ? 'border-red-500 text-red-400 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.15)] font-semibold'
                      : 'border-gold/25 text-ivory/60 hover:border-gold/50'
                  }`}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: level }).map((_, i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Price Widget */}
          <div className="border-t border-gold/10 pt-4 space-y-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold font-sans">Sort By Price</h4>
            <div className="space-y-1.5 font-sans">
              <button
                onClick={() => setSortBy(sortBy === 'price-low-high' ? 'none' : 'price-low-high')}
                className={`w-full flex items-center justify-between px-3 h-8 text-[10px] uppercase tracking-[0.15em] border transition ${
                  sortBy === 'price-low-high'
                    ? 'border-flame text-flame bg-flame/10 font-semibold'
                    : 'border-gold/25 text-ivory/60 hover:border-gold/60'
                }`}
              >
                <span>Low to High</span>
                <span className="text-[9px] text-gold/50 font-normal">₹ → ₹₹₹</span>
              </button>
              <button
                onClick={() => setSortBy(sortBy === 'price-high-low' ? 'none' : 'price-high-low')}
                className={`w-full flex items-center justify-between px-3 h-8 text-[10px] uppercase tracking-[0.15em] border transition ${
                  sortBy === 'price-high-low'
                    ? 'border-flame text-flame bg-flame/10 font-semibold'
                    : 'border-gold/25 text-ivory/60 hover:border-gold/60'
                }`}
              >
                <span>High to Low</span>
                <span className="text-[9px] text-gold/50 font-normal">₹₹₹ → ₹</span>
              </button>
            </div>
          </div>

          {/* Reset Filters Widget */}
          {(activeCat !== 'all' || filter !== 'all' || spiceFilter !== 'all' || sortBy !== 'none') && (
            <div className="border-t border-gold/10 pt-4">
              <button
                onClick={() => {
                  setActiveCat('all');
                  setFilter('all');
                  setSpiceFilter('all');
                  setSortBy('none');
                }}
                className="w-full h-8 border border-dashed border-gold/30 hover:border-flame text-gold hover:text-flame transition text-[10px] uppercase tracking-[0.2em] font-sans"
              >
                Reset Filters
              </button>
            </div>
          )}
        </aside>

        {/* Right Column: Menu Grids (Mobile and Desktop) */}
        <section className="space-y-20">
          {MENU_CATEGORIES.map((cat) => {
            const items = grouped[cat.id];
            if (!items || items.length === 0) return null;
            return (
              <div key={cat.id} id={cat.id} className="scroll-mt-40">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-end justify-between mb-8 pb-5 border-b border-gold/15"
                >
                  <div>
                    <div className="font-sans font-medium text-[11px] uppercase tracking-[0.3em] text-flame">
                      Course
                    </div>
                    <h2 className="mt-2 font-cormorant font-light text-3xl md:text-4xl text-ivory">
                      {cat.label}
                    </h2>
                  </div>
                  <div className="hidden md:block font-sans font-normal text-[11px] uppercase tracking-[0.32em] text-gold/70">
                    {items.length} {items.length === 1 ? 'dish' : 'dishes'}
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 md:gap-8">
                  <AnimatePresence mode="popLayout">
                    {items.map((dish, i) => (
                      <DishCard dish={dish} idx={i} key={dish.id} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-ivory/60">No dishes match your filters.</p>
              <button
                onClick={() => {
                  setActiveCat('all');
                  setFilter('all');
                  setSpiceFilter('all');
                  setSortBy('none');
                  setQuery('');
                }}
                className="mt-5 text-flame text-[11px] uppercase tracking-[0.36em] underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
          {/* Menu End Marker for Scroll Fadeout Trigger */}
          <div id="menu-end-marker" className="h-px w-full" />
        </section>
      </div>

      {/* ── Dish Request Section ───────────────────────────── */}
      <section className="container mt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden border border-dashed border-gold/30 bg-espresso-mid/45 p-8 md:p-12 text-center rounded-xl max-w-3xl mx-auto"
        >
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-flame/[0.02] to-transparent" />
          <div className="relative z-10">
            <h3 className="font-cormorant font-light text-[24px] xs:text-[28px] md:text-[36px] text-ivory leading-tight">
              Not finding what you are looking for?
            </h3>
            <p className="mt-3 font-sans font-light text-[12px] xs:text-[13px] md:text-[14px] text-ivory/60 max-w-xl mx-auto leading-relaxed">
              Our culinary team is always exploring new borders. If you have a specific dish in mind, request it to be added to our seasonal selection.
            </p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="mt-6 btn-outline-gold px-6 py-3 font-sans font-medium text-[11px] xs:text-[12px] uppercase tracking-[0.2em] inline-flex items-center gap-2"
            >
              Request a New Dish
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Dish Request Modal ──────────────────────────────── */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-[#1a1008] border border-gold/30 p-6 md:p-8 rounded-xl shadow-2xl shadow-black max-w-md w-full z-10 overflow-hidden text-left"
            >
              <div className="absolute inset-0 diagonal-pattern opacity-10 pointer-events-none" />
              
              <h3 className="font-cormorant font-light text-2xl md:text-3xl text-ivory leading-tight">
                Request a Custom Dish
              </h3>
              <p className="mt-2 font-sans font-light text-[12px] text-gold/80 leading-relaxed">
                Enter the details of the dish you would love to experience at Atmosphere.
              </p>

              <form onSubmit={handleRequestSubmit} className="mt-6 space-y-4 font-sans">
                <div>
                  <label htmlFor="req-name" className="block text-[10px] uppercase tracking-[0.15em] text-ivory/60 mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="req-name"
                    type="text"
                    required
                    value={requestForm.name}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, name: e.target.value }))}
                    className="atm-input text-xs"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="req-email" className="block text-[10px] uppercase tracking-[0.15em] text-ivory/60 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="req-email"
                    type="email"
                    required
                    value={requestForm.email}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, email: e.target.value }))}
                    className="atm-input text-xs"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="req-dish" className="block text-[10px] uppercase tracking-[0.15em] text-ivory/60 mb-1.5">
                    Dish Name
                  </label>
                  <input
                    id="req-dish"
                    type="text"
                    required
                    value={requestForm.dishName}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, dishName: e.target.value }))}
                    className="atm-input text-xs"
                    placeholder="e.g. Truffle Mushroom Risotto"
                  />
                </div>

                <div>
                  <label htmlFor="req-cat" className="block text-[10px] uppercase tracking-[0.15em] text-ivory/60 mb-1.5">
                    Cuisine / Category
                  </label>
                  <select
                    id="req-cat"
                    value={requestForm.category}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, category: e.target.value }))}
                    className="atm-input text-xs bg-[#2d1f10] text-ivory border-gold/20"
                  >
                    <option value="North Indian">North Indian</option>
                    <option value="Continental">Continental</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Pasta & Pizza">Pasta & Pizza</option>
                    <option value="Desserts & Bar">Desserts & Bar</option>
                    <option value="Other">Other / Custom Cuisine</option>
                  </select>
                </div>

                <AnimatePresence>
                  {requestForm.category === 'Other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <label htmlFor="req-custom-cat" className="block text-[10px] uppercase tracking-[0.15em] text-ivory/60 mb-1.5">
                        Please Specify
                      </label>
                      <input
                        id="req-custom-cat"
                        type="text"
                        required
                        value={requestForm.customCategory || ''}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, customCategory: e.target.value }))}
                        className="atm-input text-xs"
                        placeholder="Specify custom cuisine or category"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label htmlFor="req-notes" className="block text-[10px] uppercase tracking-[0.15em] text-ivory/60 mb-1.5">
                    Why do you love this dish? (Optional)
                  </label>
                  <textarea
                    id="req-notes"
                    rows={3}
                    value={requestForm.notes}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="atm-input text-xs py-2 h-auto"
                    placeholder="Any specific style, ingredients or preference..."
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2.5 font-sans font-medium text-[11px] uppercase tracking-[0.18em] text-ivory/60 hover:text-ivory transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRequestSubmitting}
                    className="btn-flame px-5 py-2.5 font-sans font-medium text-[11px] uppercase tracking-[0.18em] disabled:opacity-50"
                  >
                    {isRequestSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Final CTA strip ───────────────────────────────── */}
      <section className="container mt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden border border-gold/20 bg-espresso-mid/70 p-8 md:p-14 grid md:grid-cols-[1.3fr_1fr] gap-8 items-center"
        >
          <div className="absolute inset-0 diagonal-pattern opacity-20 pointer-events-none" />
          <div className="relative">
            <SectionLabel>Chef&apos;s Tasting</SectionLabel>
            <h3 className="mt-4 font-cormorant font-normal text-3xl md:text-5xl text-ivory leading-tight">
              Seven courses. <span className="font-playfair font-normal italic text-gold">One unforgettable night.</span>
            </h3>
            <p className="mt-4 font-sans font-light text-ivory/65 max-w-xl text-[14px] leading-relaxed">
              Curated by Chef Aravind, a journey through fire, smoke, fermentation and dessert.
              Available Wed to Sun, by reservation only.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={openModal}
                className="btn-flame px-7 py-3.5 font-sans font-medium text-[13px] uppercase tracking-[0.18em]"
              >
                Reserve a Table
              </button>
              <a
                href={`tel:${BRAND.phoneRaw}`}
                className="px-7 py-3.5 font-sans font-medium text-[13px] uppercase tracking-[0.18em] border border-gold/30 text-ivory/85 hover:border-flame hover:text-flame transition"
              >
                Call {BRAND.phone}
              </a>
            </div>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden border border-gold/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90"
              alt="Chef's tasting"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 to-transparent" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
