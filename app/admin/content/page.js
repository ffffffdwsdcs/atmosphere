'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, RefreshCw, Image as ImageIcon, Type, BarChart2, Briefcase, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Loaded Config State
  const [heroImages, setHeroImages] = useState([]);
  const [marqueeWords, setMarqueeWords] = useState([]);
  const [stats, setStats] = useState([]);
  const [brand, setBrand] = useState({
    name: '',
    shortDesc: '',
    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    city: '',
    hours: [],
  });

  // Modal States for Adding Items
  const [newHeroImg, setNewHeroImg] = useState({ src: '', alt: '' });
  const [newMarqueeWord, setNewMarqueeWord] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to load content config');
      const json = await res.json();
      const config = json.config || {};
      
      setHeroImages(config.hero_images || []);
      setMarqueeWords(config.marquee_words || []);
      setStats(config.stats || []);
      setBrand(config.brand || { hours: [] });
    } catch (err) {
      toast.error(err.message || 'Error loading config');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (updatedFields) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error('Failed to update config');
      toast.success('Site content saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Error saving content');
    } finally {
      setSaving(false);
    }
  };

  // --- HERO ACTIONS ---
  const addHeroImage = () => {
    if (!newHeroImg.src.trim()) {
      toast.error('Image source URL is required');
      return;
    }
    const updated = [...heroImages, { ...newHeroImg }];
    setHeroImages(updated);
    setNewHeroImg({ src: '', alt: '' });
    setModalOpen(false);
    handleSave({ hero_images: updated });
  };

  const deleteHeroImage = (idx) => {
    const updated = heroImages.filter((_, i) => i !== idx);
    setHeroImages(updated);
    handleSave({ hero_images: updated });
  };

  const moveHeroImage = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === heroImages.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...heroImages];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    setHeroImages(updated);
    handleSave({ hero_images: updated });
  };

  // --- MARQUEE ACTIONS ---
  const addMarqueeWord = () => {
    if (!newMarqueeWord.trim()) return;
    const cleanWord = newMarqueeWord.replace(/[\u2013\u2014–—]/g, '-');
    const updated = [...marqueeWords, cleanWord];
    setMarqueeWords(updated);
    setNewMarqueeWord('');
    handleSave({ marquee_words: updated });
  };

  const deleteMarqueeWord = (idx) => {
    const updated = marqueeWords.filter((_, i) => i !== idx);
    setMarqueeWords(updated);
    handleSave({ marquee_words: updated });
  };

  // --- STATS ACTIONS ---
  const handleStatChange = (idx, field, val) => {
    const updated = stats.map((s, i) => (i === idx ? { ...s, [field]: val } : s));
    setStats(updated);
  };

  // --- BRAND ACTIONS ---
  const handleBrandChange = (field, val) => {
    setBrand((prev) => ({ ...prev, [field]: val }));
  };

  const handleHourChange = (idx, field, val) => {
    const updatedHours = brand.hours.map((h, i) => (i === idx ? { ...h, [field]: val } : h));
    setBrand((prev) => ({ ...prev, hours: updatedHours }));
  };

  const addHourRow = () => {
    const updatedHours = [...brand.hours, { day: 'New Day Slot', time: '12:00 PM to 11:30 PM' }];
    setBrand((prev) => ({ ...prev, hours: updatedHours }));
  };

  const deleteHourRow = (idx) => {
    const updatedHours = brand.hours.filter((_, i) => i !== idx);
    setBrand((prev) => ({ ...prev, hours: updatedHours }));
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-gold">
        <RefreshCw className="h-7 w-7 animate-spin" />
        <span className="text-[10px] uppercase tracking-widest font-sans">Syncing site content...</span>
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Hero Slider', Icon: ImageIcon },
    { id: 'marquee', label: 'Marquee Text', Icon: Type },
    { id: 'stats', label: 'Core Stats', Icon: BarChart2 },
    { id: 'brand', label: 'Brand Details', Icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory tracking-wide">Hero & Content Editor</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
            Update homepage carousel, marquee banners, stats counters, and contact details
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gold/15 bg-espresso rounded-t-lg overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-flame text-flame bg-[#3d2b18]/20'
                : 'border-transparent text-ivory/60 hover:text-gold hover:bg-[#3d2b18]/10'
            }`}
          >
            <tab.Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-[#1f1209] border border-gold/15 rounded-b-lg p-6 md:p-8 min-h-[400px]">
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gold/10 pb-4">
              <div>
                <h3 className="font-display text-xl text-ivory">Hero Carousel Images</h3>
                <p className="text-[10px] text-gold/60 mt-0.5 uppercase tracking-wider font-mono">
                  Drag / reorder images display order on landing hero page (Max 8 recommended)
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="h-9 px-4 bg-flame hover:bg-flame-light text-ivory flex items-center gap-1.5 text-xs uppercase tracking-wider font-sans font-semibold transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Slider Image</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {heroImages.map((img, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 border border-gold/15 bg-espresso rounded-lg items-center relative overflow-hidden group"
                >
                  <div className="h-20 w-32 shrink-0 border border-gold/20 overflow-hidden relative bg-black rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} className="absolute inset-0 h-full w-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gold/60 uppercase font-mono tracking-widest">
                      Slide #{i + 1}
                    </div>
                    <div className="text-xs text-ivory font-medium mt-1 truncate" title={img.src}>
                      URL: {img.src}
                    </div>
                    <div className="text-[11px] text-ivory/60 mt-0.5 truncate">
                      Alt: {img.alt || 'No Alt Text Provided'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 z-10 shrink-0">
                    <button
                      onClick={() => moveHeroImage(i, 'up')}
                      disabled={i === 0}
                      className="p-1.5 border border-gold/25 text-gold hover:border-flame hover:text-flame disabled:opacity-20 transition"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveHeroImage(i, 'down')}
                      disabled={i === heroImages.length - 1}
                      className="p-1.5 border border-gold/25 text-gold hover:border-flame hover:text-flame disabled:opacity-20 transition"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteHeroImage(i)}
                      className="p-1.5 border border-gold/25 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition"
                      title="Delete Slide"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {heroImages.length === 0 && (
              <div className="text-center py-10 text-ivory/40 text-sm">No hero images configured. Add some!</div>
            )}
          </div>
        )}

        {activeTab === 'marquee' && (
          <div className="space-y-6">
            <div className="border-b border-gold/10 pb-4">
              <h3 className="font-display text-xl text-ivory">Marquee Word Strip</h3>
              <p className="text-[10px] text-gold/60 mt-0.5 uppercase tracking-wider font-mono">
                Continuous horizontal looping text displayed under landing hero section
              </p>
            </div>

            {/* Add strip word */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Add text e.g. Fine Wines"
                value={newMarqueeWord}
                onChange={(e) => setNewMarqueeWord(e.target.value)}
                className="atm-input"
                onKeyDown={(e) => e.key === 'Enter' && addMarqueeWord()}
              />
              <button
                onClick={addMarqueeWord}
                className="h-11 px-6 bg-flame hover:bg-flame-light text-ivory flex items-center justify-center font-semibold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Word Chips */}
            <div className="flex flex-wrap gap-2 pt-4">
              {marqueeWords.map((word, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-espresso border border-gold/25 py-2 px-3.5 rounded text-xs text-gold uppercase font-mono font-semibold"
                >
                  <span>{word}</span>
                  <button
                    onClick={() => deleteMarqueeWord(i)}
                    className="text-red-400 hover:text-red-500 transition focus:outline-none"
                    aria-label="Delete word"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {marqueeWords.length === 0 && (
              <div className="text-center py-10 text-ivory/40 text-sm">No marquee words configured.</div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gold/10 pb-4">
              <div>
                <h3 className="font-display text-xl text-ivory">Key Statistics Counts</h3>
                <p className="text-[10px] text-gold/60 mt-0.5 uppercase tracking-wider font-mono">
                  Manage counts and hospitality milestones displayed in story welcome block
                </p>
              </div>
              <button
                onClick={() => handleSave({ stats })}
                disabled={saving}
                className="h-9 px-4 bg-flame hover:bg-flame-light text-ivory flex items-center gap-1.5 text-xs uppercase tracking-wider font-sans font-semibold transition cursor-pointer disabled:opacity-60"
              >
                {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Stats</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="p-5 bg-espresso border border-gold/15 rounded-lg space-y-4">
                  <div className="text-[10px] text-gold/60 uppercase font-mono tracking-widest">
                    Statistic Card #{i + 1}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="block col-span-1">
                      <span className="text-[10px] uppercase text-gold/80 block mb-1">Value</span>
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => handleStatChange(i, 'value', e.target.value)}
                        className="atm-input text-center font-display text-xl text-flame"
                      />
                    </label>
                    <label className="block col-span-2">
                      <span className="text-[10px] uppercase text-gold/80 block mb-1">Label</span>
                      <input
                        type="text"
                        value={s.label}
                        onChange={(e) => handleStatChange(i, 'label', e.target.value)}
                        className="atm-input"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'brand' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gold/10 pb-4">
              <div>
                <h3 className="font-display text-xl text-ivory">Brand Configuration</h3>
                <p className="text-[10px] text-gold/60 mt-0.5 uppercase tracking-wider font-mono">
                  Modify global contact numbers, email, addresses and timing configurations
                </p>
              </div>
              <button
                onClick={() => handleSave({ brand })}
                disabled={saving}
                className="h-9 px-4 bg-flame hover:bg-flame-light text-ivory flex items-center gap-1.5 text-xs uppercase tracking-wider font-sans font-semibold transition cursor-pointer disabled:opacity-60"
              >
                {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Details</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column inputs */}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] uppercase text-gold/80 block mb-1">Brand Name</span>
                  <input
                    type="text"
                    value={brand.name}
                    onChange={(e) => handleBrandChange('name', e.target.value)}
                    className="atm-input"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase text-gold/80 block mb-1">Short Description / SEO tagline</span>
                  <textarea
                    rows={3}
                    value={brand.shortDesc}
                    onChange={(e) => handleBrandChange('shortDesc', e.target.value)}
                    className="atm-input resize-none text-xs"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] uppercase text-gold/80 block mb-1">Phone (Formatted)</span>
                    <input
                      type="text"
                      value={brand.phone}
                      onChange={(e) => handleBrandChange('phone', e.target.value)}
                      className="atm-input"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase text-gold/80 block mb-1">Phone (Raw digits)</span>
                    <input
                      type="text"
                      value={brand.phoneRaw}
                      onChange={(e) => handleBrandChange('phoneRaw', e.target.value)}
                      className="atm-input"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[10px] uppercase text-gold/80 block mb-1">Email Address</span>
                  <input
                    type="email"
                    value={brand.email}
                    onChange={(e) => handleBrandChange('email', e.target.value)}
                    className="atm-input"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] uppercase text-gold/80 block mb-1">Address Line</span>
                    <input
                      type="text"
                      value={brand.address}
                      onChange={(e) => handleBrandChange('address', e.target.value)}
                      className="atm-input"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase text-gold/80 block mb-1">City / State Zip</span>
                    <input
                      type="text"
                      value={brand.city}
                      onChange={(e) => handleBrandChange('city', e.target.value)}
                      className="atm-input"
                    />
                  </label>
                </div>
              </div>

              {/* Right Column: Operating Hours List */}
              <div className="p-5 bg-espresso border border-gold/15 rounded-lg space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                  <span className="text-[10px] uppercase text-gold/80 block">Operating Hours Slots</span>
                  <button
                    type="button"
                    onClick={addHourRow}
                    className="text-[9px] uppercase tracking-wider text-flame border border-flame/30 px-2 py-0.5 rounded bg-flame/5 hover:bg-flame/15 transition cursor-pointer"
                  >
                    + Add Slot
                  </button>
                </div>

                <div className="space-y-3">
                  {brand.hours && brand.hours.map((h, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={h.day}
                        onChange={(e) => handleHourChange(i, 'day', e.target.value)}
                        className="atm-input text-xs"
                        placeholder="e.g. Mon to Thu"
                      />
                      <input
                        type="text"
                        value={h.time}
                        onChange={(e) => handleHourChange(i, 'time', e.target.value)}
                        className="atm-input text-xs"
                        placeholder="e.g. 12:00 PM to 11:30 PM"
                      />
                      <button
                        type="button"
                        onClick={() => deleteHourRow(i)}
                        className="p-2 border border-gold/25 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition cursor-pointer shrink-0"
                        title="Delete slot"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {(!brand.hours || brand.hours.length === 0) && (
                    <div className="text-center py-6 text-ivory/40 text-xs">No hours slots configured.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Slider Image Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#1a1008] border border-gold/30 p-6 z-10 text-left rounded-lg"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 border border-gold/25 text-gold hover:border-flame hover:text-flame flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="font-display text-xl text-ivory">Add Hero Image</h3>
              <p className="text-[10px] text-gold/60 mt-1 uppercase tracking-widest font-mono">
                Provide image source URL and descriptive Alt accessibility text
              </p>

              <div className="mt-6 space-y-4">
                <div className="block">
                  <span className="text-[10px] uppercase text-gold/80 block mb-2">Upload Hero Image *</span>
                  {newHeroImg.src ? (
                    <div className="relative border border-gold/25 bg-espresso p-2 rounded">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={newHeroImg.src} alt="Uploaded Hero Preview" className="h-40 w-full object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setNewHeroImg({ ...newHeroImg, src: '' })}
                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-ivory p-1.5 rounded transition cursor-pointer"
                        title="Remove Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gold/20 hover:border-flame bg-espresso/30 hover:bg-flame/5 p-6 rounded cursor-pointer transition text-center group">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          
                          const formData = new FormData();
                          formData.append('files', files[0]);
                          
                          const uploadToast = toast.loading('Uploading hero image...');
                          try {
                            const res = await fetch('/api/admin/upload', {
                              method: 'POST',
                              body: formData
                            });
                            if (!res.ok) throw new Error('Upload failed');
                            const data = await res.json();
                            if (data.success && data.urls.length > 0) {
                              setNewHeroImg({ ...newHeroImg, src: data.urls[0] });
                              toast.success('Hero image uploaded!', { id: uploadToast });
                            }
                          } catch (err) {
                            toast.error('Upload failed', { id: uploadToast });
                          }
                        }}
                      />
                      <ImageIcon className="h-6 w-6 text-gold/60 mb-2 group-hover:text-flame transition" />
                      <span className="text-[10px] uppercase tracking-wider text-gold font-sans font-semibold">Select Local Image</span>
                      <span className="text-[9px] text-ivory/40 mt-1">PNG, JPG, WEBP up to 5MB</span>
                    </label>
                  )}
                </div>

                <label className="block">
                  <span className="text-[10px] uppercase text-gold/80 block mb-1">Descriptive Alt Text</span>
                  <input
                    type="text"
                    value={newHeroImg.alt}
                    onChange={(e) => setNewHeroImg({ ...newHeroImg, alt: e.target.value })}
                    className="atm-input"
                    placeholder="e.g. Elegant Candlelit Dinner Table setting"
                  />
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 text-xs uppercase tracking-wider border border-gold/20 text-ivory/80 hover:border-gold hover:bg-[#3d2b18]/25 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addHeroImage}
                    className="flex-1 py-3 bg-flame hover:bg-flame-light text-ivory text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                  >
                    Add Image
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
