'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, Trash2, Eye, EyeOff, X, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactMessagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeItem, setActiveItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact');
      if (!res.ok) throw new Error('Failed to load messages');
      const json = await res.json();
      setItems(json.items || []);
    } catch (err) {
      toast.error(err.message || 'Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReadChange = async (id, isRead) => {
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: isRead }),
      });
      if (!res.ok) throw new Error('Failed to update read state');
      
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: isRead } : item))
      );
      if (activeItem && activeItem.id === id) {
        setActiveItem((prev) => ({ ...prev, read: isRead }));
      }
      toast.success(isRead ? 'Message marked as read' : 'Message marked as unread');
    } catch (err) {
      toast.error(err.message || 'Error updating message status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/contact?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete message');
      
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (activeItem && activeItem.id === id) {
        setActiveItem(null);
      }
      setConfirmDeleteId(null);
      toast.success('Message deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Error deleting message');
    }
  };

  const viewMessage = (msg) => {
    setActiveItem(msg);
    if (!msg.read) {
      handleReadChange(msg.id, true);
    }
  };

  // Filter items
  const filtered = items.filter((item) => {
    const matchesSearch =
      String(item.name).toLowerCase().includes(search.toLowerCase()) ||
      String(item.email).toLowerCase().includes(search.toLowerCase()) ||
      (item.subject && String(item.subject).toLowerCase().includes(search.toLowerCase())) ||
      (item.message && String(item.message).toLowerCase().includes(search.toLowerCase()));

    const matchesRead =
      readFilter === 'all' ||
      (readFilter === 'read' && item.read) ||
      (readFilter === 'unread' && !item.read);

    return matchesSearch && matchesRead;
  });

  // Pagination (20 per page)
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, readFilter]);

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory tracking-wide">Contact Messages</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
            Review questions, queries and guest feedback
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1f1209] p-4 border border-gold/15 rounded-lg">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email, subject or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="atm-input pl-9"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
        </div>

        {/* Read Status Dropdown */}
        <select
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value)}
          className="atm-input"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread Messages Only</option>
          <option value="read">Read Messages Only</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-[#1f1209] border border-gold/15 rounded-lg shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gold">
            <RefreshCw className="h-7 w-7 animate-spin" />
            <span className="text-[10px] uppercase tracking-widest font-sans">Syncing messages...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gold/15 bg-espresso text-gold uppercase tracking-wider font-mono">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Subject</th>
                    <th className="p-4 font-semibold">Message Preview</th>
                    <th className="p-4 font-semibold">Received At</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-ivory/40">
                        No messages found.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((r) => (
                      <tr
                        key={r.id}
                        className={`hover:bg-flame/[0.04] transition-colors group ${
                          !r.read ? 'border-l-4 border-l-gold bg-gold/[0.015]' : ''
                        }`}
                      >
                        <td className="p-4 text-ivory font-medium flex items-center gap-2">
                          {!r.read && <span className="h-2 w-2 rounded-full bg-gold shrink-0" />}
                          {r.name}
                        </td>
                        <td className="p-4 text-ivory/70">{r.email}</td>
                        <td className="p-4 text-gold font-medium">{r.subject}</td>
                        <td className="p-4 text-ivory/60 truncate max-w-[200px]" title={r.message}>
                          {r.message}
                        </td>
                        <td className="p-4 text-ivory/50 font-mono">
                          {r.created_at ? new Date(r.created_at).toLocaleString() : 'N/A'}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => viewMessage(r)}
                            className="p-2 border border-gold/20 text-gold hover:border-flame hover:bg-flame/10 hover:text-flame transition cursor-pointer"
                            title="Read Message"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleReadChange(r.id, !r.read)}
                            className="p-2 border border-gold/20 text-gold hover:border-gold hover:bg-[#3d2b18]/25 transition cursor-pointer"
                            title={r.read ? 'Mark as Unread' : 'Mark as Read'}
                          >
                            {r.read ? <EyeOff className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
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

            {/* Pagination Controls */}
            <div className="p-4 bg-espresso border-t border-gold/10 flex items-center justify-between text-xs">
              <span className="text-ivory/50">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gold/20 hover:border-gold hover:bg-[#3d2b18]/25 transition disabled:opacity-30 cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-3 py-1.5 font-mono text-gold bg-black/45 border border-gold/15">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gold/20 hover:border-gold hover:bg-[#3d2b18]/25 transition disabled:opacity-30 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Slide-over Drawer for Details */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setActiveItem(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#1a1008] border-l border-gold/25 shadow-2xl p-6 md:p-8 z-10 flex flex-col justify-between h-full text-left"
            >
              <div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 h-8 w-8 border border-gold/25 text-gold hover:border-flame hover:text-flame flex items-center justify-center transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="text-flame text-[10px] uppercase tracking-[0.4em] mb-2 font-sans font-bold">
                  Drawer · Contact Message
                </div>
                <h3 className="font-display text-2xl text-ivory">Message Content</h3>
                <p className="text-[10px] text-gold/60 mt-1 uppercase tracking-widest font-mono">
                  Atmosphere Guest Relations
                </p>

                <div className="mt-8 space-y-4 text-xs">
                  <DetailRow label="Sender Name" value={activeItem.name} />
                  <DetailRow label="Email" value={activeItem.email} />
                  <DetailRow label="Phone" value={activeItem.phone || 'None provided'} />
                  <DetailRow label="Subject" value={activeItem.subject} />
                  <div className="border-b border-gold/10 pb-3">
                    <span className="block text-[10px] uppercase tracking-wider text-gold/60 mb-1">Full Message</span>
                    <p className="text-ivory bg-[#0f0a05] p-4 rounded leading-relaxed border border-gold/5 italic max-h-48 overflow-y-auto no-scrollbar font-serif text-sm">
                      "{activeItem.message}"
                    </p>
                  </div>
                  <DetailRow
                    label="Received At"
                    value={activeItem.created_at ? new Date(activeItem.created_at).toLocaleString() : 'N/A'}
                  />
                </div>
              </div>

              <div className="border-t border-gold/15 pt-4 mt-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReadChange(activeItem.id, !activeItem.read)}
                    className="flex-grow py-3 border border-gold/20 text-gold hover:border-gold hover:bg-[#3d2b18]/25 text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                  >
                    {activeItem.read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDeleteId(activeItem.id);
                    }}
                    className="py-3 px-6 bg-red-600 hover:bg-red-500 text-ivory text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
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
              <h3 className="font-display text-xl text-ivory">Delete Message</h3>
              <p className="text-xs text-ivory/65 mt-2 leading-relaxed">
                Are you absolutely sure you want to delete this message? This action cannot be undone.
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

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-gold/10 pb-3">
      <span className="text-[10px] uppercase tracking-wider text-gold/60">{label}</span>
      <span className="text-ivory font-medium">{value}</span>
    </div>
  );
}
