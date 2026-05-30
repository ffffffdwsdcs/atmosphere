'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, X, AlertTriangle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'starters-veg', label: 'Starters · Veg' },
  { id: 'starters-nonveg', label: 'Starters · Non-Veg' },
  { id: 'north-indian', label: 'North Indian Mains' },
  { id: 'continental', label: 'Continental' },
  { id: 'chinese', label: 'Chinese & Asian' },
  { id: 'pasta-pizza', label: 'Pasta & Pizza' },
  { id: 'cocktails', label: 'Signature Cocktails' },
  { id: 'mocktails', label: 'Mocktails' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'spirits', label: 'Wines & Spirits' },
];

const AVAILABLE_TAGS = ['Signature', 'Bestseller', 'Chef Pick', 'New', 'Regional', 'Spicy', 'House', 'Glass'];

export default function MenuManagerPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [cat, setCat] = useState(CATEGORIES[0].id);
  const [veg, setVeg] = useState(true);
  const [spicy, setSpicy] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [img, setImg] = useState('');

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/menu');
      if (!res.ok) throw new Error('Failed to load menu items');
      const json = await res.json();
      setItems(json.items || []);
    } catch (err) {
      toast.error(err.message || 'Error loading menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openForm = (item = null) => {
    if (item) {
      setEditItem(item);
      setName(item.name);
      setDesc(item.desc || '');
      setPrice(item.price);
      setCat(item.cat);
      setVeg(item.veg);
      setSpicy(item.spicy || 0);
      setSelectedTags(item.tags || []);
      setImg(item.img || '');
    } else {
      setEditItem(null);
      setName('');
      setDesc('');
      setPrice('');
      setCat(CATEGORIES[0].id);
      setVeg(true);
      setSpicy(0);
      setSelectedTags([]);
      setImg('');
    }
    setModalOpen(true);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !cat) {
      toast.error('Please fill in name, price, and category');
      return;
    }

    const payload = {
      name,
      desc,
      price: Number(price),
      cat,
      veg,
      spicy: Number(spicy),
      tags: selectedTags,
      img: img || undefined,
    };

    try {
      if (editItem) {
        // UPDATE (PATCH)
        const res = await fetch('/api/admin/menu', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editItem.id, ...payload }),
        });
        if (!res.ok) throw new Error('Failed to update item');
        
        setItems((prev) =>
          prev.map((i) => (i.id === editItem.id ? { ...i, ...payload } : i))
        );
        toast.success('Menu item updated successfully!');
      } else {
        // CREATE (POST)
        const res = await fetch('/api/admin/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Failed to add item');
        
        setItems((prev) => [json.item, ...prev]);
        toast.success('New menu item added!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error saving menu item');
    }
  };

  const handleActiveToggle = async (id, currentActive) => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      if (!res.ok) throw new Error('Failed to update active state');
      
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, active: !currentActive } : i))
      );
      toast.success(!currentActive ? 'Item activated' : 'Item deactivated');
    } catch (err) {
      toast.error(err.message || 'Error updating status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      
      setItems((prev) => prev.filter((i) => i.id !== id));
      setConfirmDeleteId(null);
      toast.success('Menu item deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Error deleting item');
    }
  };

  // Filtering
  const filtered = items.filter((item) => {
    const matchesSearch =
      String(item.name).toLowerCase().includes(search.toLowerCase()) ||
      String(item.desc || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesCat = categoryFilter === 'all' || item.cat === categoryFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory tracking-wide">Menu Manager</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
            Add, edit or delete dishes shown on your menu
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="h-10 px-5 bg-flame hover:bg-flame-light text-ivory flex items-center gap-2 text-xs uppercase tracking-wider font-sans font-bold transition cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1f1209] p-4 border border-gold/15 rounded-lg">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search dish name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="atm-input pl-9"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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
            <span className="text-[10px] uppercase tracking-widest font-sans">Syncing dishes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-espresso text-gold uppercase tracking-wider font-mono">
                  <th className="p-4 font-semibold w-16">Image</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Tags</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-ivory/40">
                      No menu items found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className={`hover:bg-flame/[0.04] transition-colors group ${!r.active ? 'opacity-50' : ''}`}>
                      <td className="p-4">
                        <div className="h-10 w-12 border border-gold/20 overflow-hidden relative bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80'}
                            alt={r.name}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-ivory font-medium">{r.name}</div>
                        <div className="text-[11px] text-ivory/50 mt-0.5 truncate max-w-[240px]" title={r.desc}>
                          {r.desc}
                        </div>
                      </td>
                      <td className="p-4 text-gold/80 font-mono">
                        {CATEGORIES.find((c) => c.id === r.cat)?.label || r.cat}
                      </td>
                      <td className="p-4 text-flame font-mono font-bold text-sm">
                        ₹ {r.price}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${
                          r.veg
                            ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                            : 'text-rose-400 border-rose-500/20 bg-rose-500/5'
                        }`}>
                          {r.veg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {r.tags && r.tags.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-gold/10 border border-gold/25 text-[8.5px] text-gold uppercase tracking-wider rounded-sm font-sans">
                              {tag}
                            </span>
                          ))}
                        </div>
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
                      <td className="p-4 text-right flex justify-end gap-2 h-full items-center mt-2.5">
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
                  {editItem ? 'Edit Dish details' : 'Add New Menu Item'}
                </h3>
                <p className="text-[10px] text-gold/60 mt-1 uppercase tracking-widest font-mono">
                  {editItem ? 'Update MongoDB menu_items' : 'Insert into MongoDB menu_items'}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Name */}
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Dish Name *</span>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="atm-input"
                      placeholder="e.g. Tandoori Broccoli Malai"
                    />
                  </label>

                  {/* Description */}
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Description</span>
                    <textarea
                      rows={2}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="atm-input resize-none"
                      placeholder=" Cashew-yogurt marinade, charred over coal..."
                    />
                  </label>

                  {/* Category & Price */}
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
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Price (₹) *</span>
                      <input
                        required
                        type="number"
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="atm-input"
                        placeholder="e.g. 480"
                      />
                    </label>
                  </div>

                  {/* Type (Veg/Nonveg) & Spice Level */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Dish Type</span>
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setVeg(true)}
                          className={`flex-1 py-2 text-[10px] uppercase font-bold border transition cursor-pointer ${
                            veg
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                              : 'border-gold/20 text-ivory/60'
                          }`}
                        >
                          Veg
                        </button>
                        <button
                          type="button"
                          onClick={() => setVeg(false)}
                          className={`flex-1 py-2 text-[10px] uppercase font-bold border transition cursor-pointer ${
                            !veg
                              ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-bold'
                              : 'border-gold/20 text-ivory/60'
                          }`}
                        >
                          Non-Veg
                        </button>
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Spice Level (0-3)</span>
                      <div className="flex gap-1.5 mt-1">
                        {[0, 1, 2, 3].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSpicy(lvl)}
                            className={`h-9 w-9 border text-xs font-bold font-mono transition cursor-pointer ${
                              spicy === lvl
                                ? 'bg-flame border-flame text-ivory'
                                : 'border-gold/20 text-ivory/60 hover:border-gold'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </label>
                  </div>

                  {/* Image Upload instead of URL */}
                  <div className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Dish Image *</span>
                    {img ? (
                      <div className="relative border border-gold/25 bg-espresso p-2 rounded">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="Uploaded Dish Preview" className="h-40 w-full object-cover rounded" />
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
                            
                            const uploadToast = toast.loading('Uploading dish image...');
                            try {
                              const res = await fetch('/api/admin/upload', {
                                method: 'POST',
                                body: formData
                              });
                              if (!res.ok) throw new Error('Upload failed');
                              const data = await res.json();
                              if (data.success && data.urls.length > 0) {
                                setImg(data.urls[0]);
                                toast.success('Dish image uploaded!', { id: uploadToast });
                              }
                            } catch (err) {
                              toast.error('Error uploading dish image', { id: uploadToast });
                            }
                          }}
                        />
                        <ImageIcon className="h-6 w-6 text-gold/60 mb-2 group-hover:text-flame transition" />
                        <span className="text-[10px] uppercase tracking-wider text-gold font-sans font-semibold">Select Dish Image</span>
                        <span className="text-[9px] text-ivory/40 mt-1">PNG, JPG, WEBP up to 5MB</span>
                      </label>
                    )}
                  </div>

                  {/* Tags Multi-Select */}
                  <div className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Pills & Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_TAGS.map((tag) => {
                        const selected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={`px-2 py-1 border text-[9px] uppercase tracking-wider transition rounded cursor-pointer ${
                              selected
                                ? 'bg-flame border-flame text-ivory'
                                : 'border-gold/20 text-ivory/60 hover:border-gold'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
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
                      {editItem ? 'Save Changes' : 'Create Item'}
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
              <h3 className="font-display text-xl text-ivory">Delete Menu Item</h3>
              <p className="text-xs text-ivory/65 mt-2 leading-relaxed">
                Are you absolutely sure you want to delete this dish from MongoDB? This will reflect on the website menu in real-time.
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
