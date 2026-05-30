'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, X, AlertTriangle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'interiors', label: 'Interiors' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'banquet', label: 'Banquet' },
  { id: 'live', label: 'Live Nights' },
];

const SPANS = [
  { id: 'normal', label: 'Normal (4:3)' },
  { id: 'wide', label: 'Wide (16:9 - 2 columns)' },
  { id: 'tall', label: 'Tall (3:4 - 2 rows)' },
];

export default function GalleryManagerPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form states
  const [src, setSrc] = useState('');
  const [cat, setCat] = useState('food');
  const [span, setSpan] = useState('normal');
  const [alt, setAlt] = useState('');

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      if (!res.ok) throw new Error('Failed to load gallery items');
      const json = await res.json();
      setItems(json.items || []);
    } catch (err) {
      toast.error(err.message || 'Error loading gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const openForm = (item = null) => {
    if (item) {
      setEditItem(item);
      setSrc(item.src);
      setCat(item.cat);
      setSpan(item.span || 'normal');
      setAlt(item.alt || '');
    } else {
      setEditItem(null);
      setSrc('');
      setCat('food');
      setSpan('normal');
      setAlt('');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!src.trim() || !cat) {
      toast.error('Please fill in image source and category');
      return;
    }

    // Site-wide dash protection
    const cleanAlt = alt.replace(/[\u2013\u2014–—]/g, '-');

    const payload = {
      src: src.trim(),
      cat,
      span,
      alt: cleanAlt,
    };

    try {
      if (editItem) {
        // UPDATE (PATCH)
        const res = await fetch('/api/admin/gallery', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editItem.id, ...payload }),
        });
        if (!res.ok) throw new Error('Failed to update photo');
        
        setItems((prev) =>
          prev.map((i) => (i.id === editItem.id ? { ...i, ...payload } : i))
        );
        toast.success('Photo updated successfully!');
      } else {
        // CREATE (POST)
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Failed to add photo');
        
        setItems((prev) => [json.item, ...prev]);
        toast.success('New photo added to gallery!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error saving photo');
    }
  };

  const handleActiveToggle = async (id, currentActive) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      if (!res.ok) throw new Error('Failed to update active state');
      
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, active: !currentActive } : i))
      );
      toast.success(!currentActive ? 'Photo activated' : 'Photo deactivated');
    } catch (err) {
      toast.error(err.message || 'Error updating status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete photo');
      
      setItems((prev) => prev.filter((i) => i.id !== id));
      setConfirmDeleteId(null);
      toast.success('Photo deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Error deleting photo');
    }
  };

  const filtered = items.filter((item) => {
    const matchesSearch = String(item.alt || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'all' || item.cat === catFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory tracking-wide">Media Gallery Manager</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
            Add, edit or delete photos showcased in the visual gallery
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="h-10 px-5 bg-flame hover:bg-flame-light text-ivory flex items-center gap-2 text-xs uppercase tracking-wider font-sans font-bold transition cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1f1209] p-4 border border-gold/15 rounded-lg">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search photo description/alt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="atm-input pl-9"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
        </div>

        {/* Category Filter */}
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="atm-input"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main Table Grid */}
      <div className="bg-[#1f1209] border border-gold/15 rounded-lg shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gold">
            <RefreshCw className="h-7 w-7 animate-spin" />
            <span className="text-[10px] uppercase tracking-widest font-sans">Syncing gallery...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-espresso text-gold uppercase tracking-wider font-mono">
                  <th className="p-4 font-semibold w-24">Image</th>
                  <th className="p-4 font-semibold">Alt / Caption</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Layout style</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-ivory/40">
                      No gallery items found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className={`hover:bg-flame/[0.04] transition-colors group ${!r.active ? 'opacity-50' : ''}`}>
                      <td className="p-4">
                        <div className="h-12 w-16 border border-gold/20 overflow-hidden relative bg-black rounded">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.src || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80'}
                            alt={r.alt}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-ivory font-medium text-xs leading-relaxed max-w-[280px]">
                          {r.alt || 'No Caption Provided'}
                        </div>
                        <div className="text-[10px] text-ivory/40 mt-0.5 truncate max-w-[280px]" title={r.src}>
                          {r.src}
                        </div>
                      </td>
                      <td className="p-4 text-gold/80 font-mono">
                        {CATEGORIES.find((c) => c.id === r.cat)?.label || r.cat}
                      </td>
                      <td className="p-4 text-ivory/70 font-mono">
                        {SPANS.find((s) => s.id === r.span)?.label || r.span || 'normal'}
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
                  ))
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
                  {editItem ? 'Edit Photo details' : 'Add New Photo'}
                </h3>
                <p className="text-[10px] text-gold/60 mt-1 uppercase tracking-widest font-mono">
                  {editItem ? 'Update MongoDB gallery collection' : 'Insert into MongoDB gallery collection'}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Src Image URL & Local Upload Button */}
                  <div className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Upload Gallery Image *</span>
                    {src ? (
                      <div className="relative border border-gold/25 bg-espresso p-2 rounded">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="Uploaded Gallery Preview" className="h-40 w-full object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setSrc('')}
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
                            
                            const uploadToast = toast.loading('Uploading gallery file...');
                            try {
                              const res = await fetch('/api/admin/upload', {
                                method: 'POST',
                                body: formData
                              });
                              if (!res.ok) throw new Error('Upload failed');
                              const data = await res.json();
                              if (data.success && data.urls.length > 0) {
                                setSrc(data.urls[0]);
                                toast.success('Gallery image uploaded!', { id: uploadToast });
                              }
                            } catch (err) {
                              toast.error('Error uploading file', { id: uploadToast });
                            }
                          }}
                        />
                        <ImageIcon className="h-6 w-6 text-gold/60 mb-2 group-hover:text-flame transition" />
                        <span className="text-[10px] uppercase tracking-wider text-gold font-sans font-semibold">Select Local Photo</span>
                        <span className="text-[9px] text-ivory/40 mt-1">PNG, JPG, WEBP up to 5MB</span>
                      </label>
                    )}
                  </div>

                  {/* Alt Caption */}
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Caption / Alt Accessibility Text</span>
                    <input
                      type="text"
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                      className="atm-input"
                      placeholder="e.g. Wedding Hall seating design with floral arch"
                    />
                  </label>

                  {/* Category & Layout style */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Category *</span>
                      <select
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                        className="atm-input"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Layout Style</span>
                      <select
                        value={span}
                        onChange={(e) => setSpan(e.target.value)}
                        className="atm-input"
                      >
                        {SPANS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>
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
                      {editItem ? 'Save Changes' : 'Create Photo'}
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
              <h3 className="font-display text-xl text-ivory">Delete Photo</h3>
              <p className="text-xs text-ivory/65 mt-2 leading-relaxed">
                Are you absolutely sure you want to delete this photo from the media gallery? This will reflect on the website gallery in real-time.
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
