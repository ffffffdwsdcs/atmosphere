'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, X, AlertTriangle, RefreshCw, Film, Image as ImageIcon, Video } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReelsManagerPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [poster, setPoster] = useState('');
  const [video, setVideo] = useState('');

  const fetchReels = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reels');
      if (!res.ok) throw new Error('Failed to load reels');
      const json = await res.json();
      setItems(json.items || []);
    } catch (err) {
      toast.error(err.message || 'Error loading reels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const openForm = (item = null) => {
    if (item) {
      setEditItem(item);
      setTitle(item.title);
      setSub(item.sub);
      setPoster(item.poster || '');
      setVideo(item.video || '');
    } else {
      setEditItem(null);
      setTitle('');
      setSub('');
      setPoster('');
      setVideo('');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !sub.trim() || !poster.trim() || !video.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      title: title.trim().replace(/[\u2013\u2014–—]/g, '-'),
      sub: sub.trim().replace(/[\u2013\u2014–—]/g, '-'),
      poster: poster.trim(),
      video: video.trim(),
    };

    try {
      if (editItem) {
        // UPDATE (PATCH)
        const res = await fetch('/api/admin/reels', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editItem.id, ...payload }),
        });
        if (!res.ok) throw new Error('Failed to update reel');
        
        setItems((prev) =>
          prev.map((i) => (i.id === editItem.id ? { ...i, ...payload } : i))
        );
        toast.success('Reel updated successfully!');
      } else {
        // CREATE (POST)
        const res = await fetch('/api/admin/reels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Failed to add reel');
        
        setItems((prev) => [json.item, ...prev]);
        toast.success('New reel added to list!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error saving reel');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/reels?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete reel');
      
      setItems((prev) => prev.filter((i) => i.id !== id));
      setConfirmDeleteId(null);
      toast.success('Reel deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Error deleting reel');
    }
  };

  const filtered = items.filter((item) => {
    return (
      String(item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      String(item.sub || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant font-light text-3xl text-ivory tracking-wide">Reels & Moments Manager</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
            Manage visual 9:16 reels shown on the landing page of the website
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="h-10 px-5 bg-flame hover:bg-flame-light text-ivory flex items-center gap-2 text-xs uppercase tracking-wider font-sans font-bold transition cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Reel</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-[#1f1209] p-4 border border-gold/15 rounded-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or subtitle..."
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
            <span className="text-[10px] uppercase tracking-widest font-sans">Syncing reels...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-espresso text-gold uppercase tracking-wider font-mono">
                  <th className="p-4 font-semibold w-24">Poster</th>
                  <th className="p-4 font-semibold">Title / Subtitle</th>
                  <th className="p-4 font-semibold">Video File URL</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-ivory/40">
                      No reels found. Create your first reel above!
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-flame/[0.04] transition-colors group">
                      <td className="p-4">
                        <div className="h-16 w-10 border border-gold/20 overflow-hidden relative bg-black rounded shadow">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.poster || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&q=80'}
                            alt={r.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-ivory font-medium text-sm leading-tight">
                          {r.title}
                        </div>
                        <div className="text-[11px] text-gold/80 mt-1 uppercase tracking-wider font-sans">
                          {r.sub}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-ivory/70 truncate max-w-[320px]" title={r.video}>
                          {r.video}
                        </div>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2 items-center mt-3">
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
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative w-full max-w-lg bg-[#1a1008] border border-gold/30 shadow-2xl p-6 md:p-8 z-10 text-left rounded-lg max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col justify-between"
          >
            <div>
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 border border-gold/25 text-gold hover:border-flame hover:text-flame flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="font-cormorant font-light text-2xl text-ivory">
                {editItem ? 'Edit Reel Details' : 'Add New Reel'}
              </h3>
              <p className="text-[10px] text-gold/60 mt-1 uppercase tracking-widest font-mono">
                {editItem ? 'Update Supabase Reels Table' : 'Insert into Supabase Reels Table'}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-sans">
                {/* Title and Subtitle */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Reel Title *</span>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="atm-input text-xs"
                      placeholder="e.g. Saturday Beats"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Subtitle / Tag *</span>
                    <input
                      type="text"
                      required
                      value={sub}
                      onChange={(e) => setSub(e.target.value)}
                      className="atm-input text-xs"
                      placeholder="e.g. Live Sessions"
                    />
                  </label>
                </div>

                {/* Poster Image File Upload & Input */}
                <div className="block border-t border-gold/10 pt-4">
                  <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Poster Image (9:16 Aspect Ratio) *</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={poster}
                      onChange={(e) => setPoster(e.target.value)}
                      className="atm-input text-xs flex-1"
                      placeholder="Paste image URL or upload file..."
                    />
                    <label className="px-3 border border-gold/30 hover:border-flame hover:bg-flame/15 text-gold flex items-center justify-center cursor-pointer transition rounded shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          
                          const formData = new FormData();
                          formData.append('files', files[0]);
                          
                          const uploadToast = toast.loading('Uploading poster image...');
                          try {
                            const res = await fetch('/api/admin/upload', {
                              method: 'POST',
                              body: formData
                            });
                            if (!res.ok) throw new Error('Upload failed');
                            const data = await res.json();
                            if (data.success && data.urls.length > 0) {
                              setPoster(data.urls[0]);
                              toast.success('Poster uploaded!', { id: uploadToast });
                            }
                          } catch (err) {
                            toast.error('Error uploading image', { id: uploadToast });
                          }
                        }}
                      />
                      <ImageIcon className="h-4 w-4" />
                    </label>
                  </div>
                </div>

                {/* Video File Upload & Input */}
                <div className="block border-t border-gold/10 pt-4">
                  <span className="text-[10px] uppercase tracking-wider text-gold/80 mb-2 block">Video File (9:16 MP4 Format) *</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={video}
                      onChange={(e) => setVideo(e.target.value)}
                      className="atm-input text-xs flex-1"
                      placeholder="Paste MP4 video URL or upload file..."
                    />
                    <label className="px-3 border border-gold/30 hover:border-flame hover:bg-flame/15 text-gold flex items-center justify-center cursor-pointer transition rounded shrink-0">
                      <input
                        type="file"
                        accept="video/mp4,video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          
                          const formData = new FormData();
                          formData.append('files', files[0]);
                          
                          const uploadToast = toast.loading('Uploading video file...');
                          try {
                            const res = await fetch('/api/admin/upload', {
                              method: 'POST',
                              body: formData
                            });
                            if (!res.ok) throw new Error('Upload failed');
                            const data = await res.json();
                            if (data.success && data.urls.length > 0) {
                              setVideo(data.urls[0]);
                              toast.success('Video uploaded!', { id: uploadToast });
                            }
                          } catch (err) {
                            toast.error('Error uploading video', { id: uploadToast });
                          }
                        }}
                      />
                      <Video className="h-4 w-4" />
                    </label>
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
                    {editItem ? 'Save Changes' : 'Create Reel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDeleteId(null)}
          />
          <div
            className="relative w-full max-w-sm bg-[#1a1008] border border-gold/30 p-6 z-10 text-center rounded-lg"
          >
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-cormorant text-xl text-ivory">Delete Reel</h3>
            <p className="text-xs text-ivory/65 mt-2 leading-relaxed">
              Are you absolutely sure you want to delete this reel? It will immediately stop rendering on the website.
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
          </div>
        </div>
      )}
    </div>
  );
}
