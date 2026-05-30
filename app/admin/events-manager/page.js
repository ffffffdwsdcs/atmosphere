'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, X, AlertTriangle, RefreshCw, Music, Wine, ChefHat, Calendar, Clock, Ticket, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ICONS = [
  { id: 'Music', label: 'Music', Icon: Music },
  { id: 'Wine', label: 'Wine', Icon: Wine },
  { id: 'ChefHat', label: 'Chef Hat', Icon: ChefHat },
  { id: 'Calendar', label: 'Calendar', Icon: Calendar },
  { id: 'Clock', label: 'Clock', Icon: Clock },
  { id: 'Ticket', label: 'Ticket', Icon: Ticket },
];

export default function EventsManagerPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [blurb, setBlurb] = useState('');
  const [icon, setIcon] = useState('Calendar');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events-manager');
      if (!res.ok) throw new Error('Failed to load events');
      const json = await res.json();
      setItems(json.items || []);
    } catch (err) {
      toast.error(err.message || 'Error loading events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openForm = (item = null) => {
    if (item) {
      setEditItem(item);
      setName(item.name);
      setDay(item.day);
      setTime(item.time);
      setPrice(item.price);
      setImg(item.img || '');
      setBlurb(item.blurb || '');
      setIcon(item.icon || 'Calendar');
    } else {
      setEditItem(null);
      setName('');
      setDay('');
      setTime('');
      setPrice('');
      setImg('');
      setBlurb('');
      setIcon('Calendar');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !day.trim() || !time.trim() || !price.trim()) {
      toast.error('Please fill in name, day, time, and price');
      return;
    }

    // Site-wide dash protection
    const cleanName = name.replace(/[\u2013\u2014–—]/g, '-');
    const cleanDay = day.replace(/[\u2013\u2014–—]/g, '-');
    const cleanTime = time.replace(/[\u2013\u2014–—]/g, '-');
    const cleanPrice = price.replace(/[\u2013\u2014–—]/g, '-');
    const cleanBlurb = blurb.replace(/[\u2013\u2014–—]/g, '-');

    const payload = {
      name: cleanName,
      day: cleanDay,
      time: cleanTime,
      price: cleanPrice,
      img: img || undefined,
      blurb: cleanBlurb,
      icon,
    };

    try {
      if (editItem) {
        // UPDATE (PATCH)
        const res = await fetch('/api/admin/events-manager', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editItem.id, ...payload }),
        });
        if (!res.ok) throw new Error('Failed to update event');
        
        setItems((prev) =>
          prev.map((i) => (i.id === editItem.id ? { ...i, ...payload } : i))
        );
        toast.success('Event updated successfully!');
      } else {
        // CREATE (POST)
        const res = await fetch('/api/admin/events-manager', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Failed to add event');
        
        setItems((prev) => [json.item, ...prev]);
        toast.success('New event added!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error saving event');
    }
  };

  const handleActiveToggle = async (id, currentActive) => {
    try {
      const res = await fetch('/api/admin/events-manager', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      if (!res.ok) throw new Error('Failed to update active state');
      
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, active: !currentActive } : i))
      );
      toast.success(!currentActive ? 'Event activated' : 'Event deactivated');
    } catch (err) {
      toast.error(err.message || 'Error updating status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/events-manager?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      
      setItems((prev) => prev.filter((i) => i.id !== id));
      setConfirmDeleteId(null);
      toast.success('Event deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Error deleting event');
    }
  };

  const filtered = items.filter((item) => {
    return (
      String(item.name).toLowerCase().includes(search.toLowerCase()) ||
      String(item.blurb || '').toLowerCase().includes(search.toLowerCase()) ||
      String(item.day).toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory tracking-wide">Events Calendar Manager</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
            Add, edit or delete experiences displayed in the events calendar
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="h-10 px-5 bg-flame hover:bg-flame-light text-ivory flex items-center gap-2 text-xs uppercase tracking-wider font-sans font-bold transition cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-[#1f1209] p-4 border border-gold/15 rounded-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Search event name, description or schedule day..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="atm-input pl-9"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-[#1f1209] border border-gold/15 rounded-lg shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gold">
            <RefreshCw className="h-7 w-7 animate-spin" />
            <span className="text-[10px] uppercase tracking-widest font-sans">Syncing events...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-espresso text-gold uppercase tracking-wider font-mono">
                  <th className="p-4 font-semibold w-16">Image</th>
                  <th className="p-4 font-semibold">Event Details</th>
                  <th className="p-4 font-semibold">Schedule</th>
                  <th className="p-4 font-semibold">Icon</th>
                  <th className="p-4 font-semibold">Price / Cover</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-ivory/40">
                      No calendar events found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const matchedIcon = ICONS.find((i) => i.id === r.icon) || ICONS[3];
                    return (
                      <tr key={r.id} className={`hover:bg-flame/[0.04] transition-colors group ${!r.active ? 'opacity-50' : ''}`}>
                        <td className="p-4">
                          <div className="h-10 w-12 border border-gold/20 overflow-hidden relative bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={r.img || 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=100&q=80'}
                              alt={r.name}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-ivory font-medium text-sm">{r.name}</div>
                          <div className="text-[11px] text-ivory/50 mt-0.5 max-w-[280px] line-clamp-2" title={r.blurb}>
                            {r.blurb}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gold/90 font-sans font-semibold">{r.day}</div>
                          <div className="text-[10px] text-ivory/60 mt-0.5">{r.time}</div>
                        </td>
                        <td className="p-4 text-gold">
                          <div className="flex items-center gap-1.5 bg-black/30 border border-gold/15 py-1 px-2.5 rounded w-fit">
                            <matchedIcon.Icon className="h-3.5 w-3.5 text-flame" />
                            <span className="text-[10px] uppercase font-mono">{matchedIcon.label}</span>
                          </div>
                        </td>
                        <td className="p-4 text-ivory font-medium">
                          {r.price}
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleActiveToggle(r.id, r.active)}
                            className={`p-1.5 border transition cursor-pointer flex items-center gap-1 text-[9px] uppercase tracking-wider ${
                              r.active
                                ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/20'
                                : 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/20'
                            }`}
                          >
                            {r.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            <span>{r.active ? 'Active' : 'Hidden'}</span>
                          </button>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2 items-center mt-2.5">
                          <button
                            onClick={() => openForm(r)}
                            className="p-2 border border-gold/20 text-gold hover:border-flame hover:bg-flame/10 hover:text-flame transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(r.id)}
                            className="p-2 border border-gold/20 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
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
              className="relative w-full max-w-lg bg-[#1a1008] border border-gold/30 shadow-2xl p-6 md:p-8 z-10 text-left rounded-lg max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col justify-between"
            >
              <div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 h-8 w-8 border border-gold/25 text-gold hover:border-flame hover:text-flame flex items-center justify-center transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                <h3 className="font-display text-2xl text-ivory">
                  {editItem ? 'Edit Event Details' : 'Add New Event'}
                </h3>
                <p className="text-[10px] text-gold/60 mt-1 uppercase tracking-widest font-mono">
                  {editItem ? 'Update MongoDB events collection' : 'Insert into MongoDB events collection'}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Name */}
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Event Title *</span>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="atm-input"
                      placeholder="e.g. Acoustic Sessions"
                    />
                  </label>

                  {/* Blurb */}
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Blurb / Description *</span>
                    <textarea
                      required
                      rows={2}
                      value={blurb}
                      onChange={(e) => setBlurb(e.target.value)}
                      className="atm-input resize-none"
                      placeholder="e.g. Unplugged sets by Mysuru's favourite singer-songwriters..."
                    />
                  </label>

                  {/* Day & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Schedule Day *</span>
                      <input
                        required
                        type="text"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="atm-input"
                        placeholder="e.g. Every Wednesday"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Schedule Time *</span>
                      <input
                        required
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="atm-input"
                        placeholder="e.g. 8:00 PM, 11:00 PM"
                      />
                    </label>
                  </div>

                  {/* Price & Icon */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Price / Ticket / Cover *</span>
                      <input
                        required
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="atm-input"
                        placeholder="e.g. Tasting menu ₹ 1,800"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Theme Icon *</span>
                      <select
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="atm-input"
                      >
                        {ICONS.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {/* Image Upload instead of URL */}
                  <div className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Event Banner Image *</span>
                    {img ? (
                      <div className="relative border border-gold/25 bg-espresso p-2 rounded">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="Uploaded Event Preview" className="h-40 w-full object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setImg('')}
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
                            
                            const uploadToast = toast.loading('Uploading event banner...');
                            try {
                              const res = await fetch('/api/admin/upload', {
                                method: 'POST',
                                body: formData
                              });
                              if (!res.ok) throw new Error('Upload failed');
                              const data = await res.json();
                              if (data.success && data.urls.length > 0) {
                                setImg(data.urls[0]);
                                toast.success('Event banner uploaded!', { id: uploadToast });
                              }
                            } catch (err) {
                              toast.error('Error uploading banner', { id: uploadToast });
                            }
                          }}
                        />
                        <ImageIcon className="h-6 w-6 text-gold/60 mb-2 group-hover:text-flame transition" />
                        <span className="text-[10px] uppercase tracking-wider text-gold font-sans font-semibold">Select Event Image</span>
                        <span className="text-[9px] text-ivory/40 mt-1">PNG, JPG, WEBP up to 5MB</span>
                      </label>
                    )}
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gold/15">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="flex-1 py-3 text-xs uppercase tracking-wider border border-gold/20 text-ivory/80 hover:border-gold hover:bg-[#3d2b18]/25 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-flame hover:bg-flame-light text-ivory text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                    >
                      {editItem ? 'Save Changes' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setConfirmDeleteId(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#1a1008] border border-gold/30 p-6 z-10 text-center rounded-lg"
            >
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-display text-xl text-ivory">Delete Event</h3>
              <p className="text-xs text-ivory/65 mt-2 leading-relaxed">
                Are you absolutely sure you want to delete this event from the calendar? This will reflect on the website experiences list in real-time.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-3 text-xs uppercase tracking-wider font-semibold border border-gold/20 text-ivory/80 hover:border-gold hover:bg-[#3d2b18]/25 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-ivory text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
