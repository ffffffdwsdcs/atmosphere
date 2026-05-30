'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, X, AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OffersManagerPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form states
  const [bank, setBank] = useState('');
  const [domain, setDomain] = useState('');
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [code, setCode] = useState('');
  const [valid, setValid] = useState('');
  const [gradient, setGradient] = useState('linear-gradient(135deg, #c4560a 0%, #f56d0a 60%, #f7874d 100%)');

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/offers');
      if (!res.ok) throw new Error('Failed to load bank offers');
      const json = await res.json();
      setItems(json.items || []);
    } catch (err) {
      toast.error(err.message || 'Error loading offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openForm = (item = null) => {
    if (item) {
      setEditItem(item);
      setBank(item.bank);
      setDomain(item.domain || '');
      setTitle(item.title);
      setSub(item.sub);
      setCode(item.code);
      setValid(item.valid || '');
      setGradient(item.gradient || 'linear-gradient(135deg, #c4560a 0%, #f56d0a 60%, #f7874d 100%)');
    } else {
      setEditItem(null);
      setBank('');
      setDomain('');
      setTitle('');
      setSub('');
      setCode('');
      setValid('');
      setGradient('linear-gradient(135deg, #c4560a 0%, #f56d0a 60%, #f7874d 100%)');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bank.trim() || !title.trim() || !sub.trim() || !code.trim()) {
      toast.error('Please fill in bank name, discount title, subtext, and offer code');
      return;
    }

    // Site-wide dash protection
    const cleanBank = bank.replace(/[\u2013\u2014–—]/g, '-');
    const cleanTitle = title.replace(/[\u2013\u2014–—]/g, '-');
    const cleanSub = sub.replace(/[\u2013\u2014–—]/g, '-');
    const cleanCode = code.replace(/[\u2013\u2014–—]/g, '-');
    const cleanValid = valid.replace(/[\u2013\u2014–—]/g, '-');

    const payload = {
      bank: cleanBank,
      domain: domain || 'bank.com',
      title: cleanTitle,
      sub: cleanSub,
      code: cleanCode,
      valid: cleanValid,
      gradient,
    };

    try {
      if (editItem) {
        // UPDATE (PATCH)
        const res = await fetch('/api/admin/offers', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editItem.id, ...payload }),
        });
        if (!res.ok) throw new Error('Failed to update offer');
        
        setItems((prev) =>
          prev.map((i) => (i.id === editItem.id ? { ...i, ...payload } : i))
        );
        toast.success('Offer updated successfully!');
      } else {
        // CREATE (POST)
        const res = await fetch('/api/admin/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Failed to add offer');
        
        setItems((prev) => [json.item, ...prev]);
        toast.success('New offer added!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error saving offer');
    }
  };

  const handleActiveToggle = async (id, currentActive) => {
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      if (!res.ok) throw new Error('Failed to update active state');
      
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, active: !currentActive } : i))
      );
      toast.success(!currentActive ? 'Offer activated' : 'Offer deactivated');
    } catch (err) {
      toast.error(err.message || 'Error updating status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete offer');
      
      setItems((prev) => prev.filter((i) => i.id !== id));
      setConfirmDeleteId(null);
      toast.success('Offer deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Error deleting offer');
    }
  };

  const filtered = items.filter((item) => {
    return (
      String(item.bank).toLowerCase().includes(search.toLowerCase()) ||
      String(item.title).toLowerCase().includes(search.toLowerCase()) ||
      String(item.code).toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory tracking-wide">Bank Offers Manager</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
            Add, edit or delete bank credit & debit card privileges shown on site
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="h-10 px-5 bg-flame hover:bg-flame-light text-ivory flex items-center gap-2 text-xs uppercase tracking-wider font-sans font-bold transition cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Offer</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-[#1f1209] p-4 border border-gold/15 rounded-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Search bank name, discount title or code..."
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
            <span className="text-[10px] uppercase tracking-widest font-sans">Syncing offers...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-espresso text-gold uppercase tracking-wider font-mono">
                  <th className="p-4 font-semibold">Bank Name</th>
                  <th className="p-4 font-semibold">Domain</th>
                  <th className="p-4 font-semibold">Offer Title</th>
                  <th className="p-4 font-semibold">Details</th>
                  <th className="p-4 font-semibold">Promo Code</th>
                  <th className="p-4 font-semibold">Validity</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-ivory/40">
                      No bank offers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className={`hover:bg-flame/[0.04] transition-colors group ${!r.active ? 'opacity-50' : ''}`}>
                      <td className="p-4">
                        <div className="font-semibold text-ivory text-sm">{r.bank}</div>
                      </td>
                      <td className="p-4 text-gold/80 font-mono">
                        {r.domain}
                      </td>
                      <td className="p-4 text-flame font-mono font-bold text-sm">
                        {r.title}
                      </td>
                      <td className="p-4 text-ivory/70 max-w-[200px] truncate" title={r.sub}>
                        {r.sub}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-black/45 border border-dashed border-gold/30 text-xs font-mono text-gold rounded font-bold">
                          {r.code}
                        </span>
                      </td>
                      <td className="p-4 text-ivory/60">
                        {r.valid}
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
                  {editItem ? 'Edit Bank Offer' : 'Add New Offer'}
                </h3>
                <p className="text-[10px] text-gold/60 mt-1 uppercase tracking-widest font-mono">
                  {editItem ? 'Update MongoDB bank_offers collection' : 'Insert into MongoDB bank_offers collection'}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Bank & Domain */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Bank Name *</span>
                      <input
                        required
                        type="text"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="atm-input"
                        placeholder="e.g. HDFC Bank"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Domain name *</span>
                      <input
                        required
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="atm-input"
                        placeholder="e.g. hdfcbank.com"
                      />
                    </label>
                  </div>

                  {/* Title & Sub */}
                  <div className="grid grid-cols-3 gap-4">
                    <label className="block col-span-1">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Promo Title *</span>
                      <input
                        required
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="atm-input text-flame font-bold"
                        placeholder="e.g. 15% OFF"
                      />
                    </label>

                    <label className="block col-span-2">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Promo Description *</span>
                      <input
                        required
                        type="text"
                        value={sub}
                        onChange={(e) => setSub(e.target.value)}
                        className="atm-input"
                        placeholder="e.g. on dining bills above ₹3,000"
                      />
                    </label>
                  </div>

                  {/* Code & Valid */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Promo Code *</span>
                      <input
                        required
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="atm-input font-mono text-gold font-semibold uppercase"
                        placeholder="e.g. HDFC15"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Validity Detail *</span>
                      <input
                        required
                        type="text"
                        value={valid}
                        onChange={(e) => setValid(e.target.value)}
                        className="atm-input"
                        placeholder="e.g. Valid till 31 Dec 2025"
                      />
                    </label>
                  </div>

                  {/* Card Background Gradient */}
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">CSS Card Gradient *</span>
                    <input
                      required
                      type="text"
                      value={gradient}
                      onChange={(e) => setGradient(e.target.value)}
                      className="atm-input font-mono text-xs text-ivory/80"
                      placeholder="e.g. linear-gradient(135deg, #c4560a 0%, #f56d0a 60%, #f7874d 100%)"
                    />
                  </label>

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
                      {editItem ? 'Save Changes' : 'Create Offer'}
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
              <h3 className="font-display text-xl text-ivory">Delete Bank Offer</h3>
              <p className="text-xs text-ivory/65 mt-2 leading-relaxed">
                Are you absolutely sure you want to delete this bank offer card from MongoDB? This will reflect on the website offers page in real-time.
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
