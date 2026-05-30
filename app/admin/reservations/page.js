'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Trash2, Eye, Download, X, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReservationsManagerPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeItem, setActiveItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reservations');
      if (!res.ok) throw new Error('Failed to load reservations');
      const json = await res.json();
      setItems(json.items || []);
    } catch (err) {
      toast.error(err.message || 'Error loading reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (activeItem && activeItem.id === id) {
        setActiveItem((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Reservation status set to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || 'Error updating status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/reservations?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete reservation');
      
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (activeItem && activeItem.id === id) {
        setActiveItem(null);
      }
      setConfirmDeleteId(null);
      toast.success('Reservation deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Error deleting reservation');
    }
  };

  // Filter items
  const filtered = items.filter((item) => {
    const matchesSearch =
      String(item.name).toLowerCase().includes(search.toLowerCase()) ||
      String(item.phone).includes(search) ||
      (item.reference && String(item.reference).toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesDate = !dateFilter || item.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
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
  }, [search, statusFilter, dateFilter]);

  // CSV Exporter
  const exportToCSV = () => {
    if (filtered.length === 0) {
      toast.error('No reservations to export');
      return;
    }
    const headers = ['Ref#', 'Name', 'Phone', 'Email', 'Date', 'Time', 'Guests', 'Occasion', 'Dietary', 'Status', 'Created At'];
    const rows = filtered.map((i) => [
      i.reference || 'N/A',
      i.name,
      i.phone,
      i.email || '',
      i.date,
      i.time,
      i.guests,
      i.occasion || '',
      i.dietary || 'No preference',
      i.status,
      i.created_at,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reservations_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV download started!');
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory tracking-wide">Reservations</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
            Manage your tables and guest lists
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="h-10 px-5 bg-flame hover:bg-flame-light text-ivory flex items-center gap-2 text-xs uppercase tracking-wider font-sans font-bold transition cursor-pointer self-start"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#1f1209] p-4 border border-gold/15 rounded-lg">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="atm-input pl-9"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="atm-input pl-9"
          />
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60 pointer-events-none" />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="atm-input"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-[#1f1209] border border-gold/15 rounded-lg shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gold">
            <RefreshCw className="h-7 w-7 animate-spin" />
            <span className="text-[10px] uppercase tracking-widest font-sans">Syncing reservations...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gold/15 bg-espresso text-gold uppercase tracking-wider font-mono">
                    <th className="p-4 font-semibold">Ref#</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Phone</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Time</th>
                    <th className="p-4 font-semibold">Guests</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Created At</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-ivory/40">
                        No reservations found.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((r) => (
                      <tr key={r.id} className="hover:bg-flame/[0.04] transition-colors group">
                        <td className="p-4 font-mono text-gold font-bold">{r.reference || 'N/A'}</td>
                        <td className="p-4 text-ivory font-medium">{r.name}</td>
                        <td className="p-4 text-ivory/70">{r.phone}</td>
                        <td className="p-4 text-ivory/70">{r.date}</td>
                        <td className="p-4 text-ivory/70">{r.time}</td>
                        <td className="p-4 text-ivory/70 font-mono">{r.guests}</td>
                        <td className="p-4">
                          <select
                            value={r.status}
                            onChange={(e) => handleStatusChange(r.id, e.target.value)}
                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded-sm border cursor-pointer bg-black/40 outline-none transition-all ${
                              r.status === 'confirmed'
                                ? 'text-emerald-300 border-emerald-500/20'
                                : r.status === 'cancelled'
                                ? 'text-red-300 border-red-500/20'
                                : 'text-amber-300 border-amber-500/20'
                            }`}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-ivory/50 font-mono">
                          {r.created_at ? new Date(r.created_at).toLocaleString() : 'N/A'}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => setActiveItem(r)}
                            className="p-2 border border-gold/20 text-gold hover:border-flame hover:bg-flame/10 hover:text-flame transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setActiveItem(null)}
            />
            {/* Drawer */}
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
                  Drawer · Info
                </div>
                <h3 className="font-display text-2xl text-ivory">Reservation Details</h3>
                <p className="text-[10px] text-gold/60 mt-1 uppercase tracking-widest font-mono">
                  REF#: {activeItem.reference || 'N/A'}
                </p>

                <div className="mt-8 space-y-4 text-xs">
                  <DetailRow label="Name" value={activeItem.name} />
                  <DetailRow label="Phone" value={activeItem.phone} />
                  <DetailRow label="Email" value={activeItem.email || 'None provided'} />
                  <DetailRow label="Date" value={activeItem.date} />
                  <DetailRow label="Time" value={activeItem.time} />
                  <DetailRow label="Guests" value={activeItem.guests} />
                  <DetailRow label="Occasion" value={activeItem.occasion || 'None'} />
                  <DetailRow label="Dietary Preference" value={activeItem.dietary || 'No preference'} />
                  <div className="border-b border-gold/10 pb-3">
                    <span className="block text-[10px] uppercase tracking-wider text-gold/60 mb-1">Special Requests</span>
                    <p className="text-ivory bg-[#0f0a05] p-3 rounded leading-relaxed border border-gold/5 italic max-h-32 overflow-y-auto no-scrollbar">
                      {activeItem.special_requests || 'No special requests.'}
                    </p>
                  </div>
                  <DetailRow
                    label="Created At"
                    value={activeItem.created_at ? new Date(activeItem.created_at).toLocaleString() : 'N/A'}
                  />
                </div>
              </div>

              <div className="border-t border-gold/15 pt-4 mt-6">
                <span className="block text-[10px] uppercase tracking-wider text-gold/60 mb-2">Change Status</span>
                <div className="flex gap-2">
                  {['confirmed', 'pending', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeItem.id, st)}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold transition border cursor-pointer ${
                        activeItem.status === st
                          ? 'bg-flame border-flame text-ivory'
                          : 'border-gold/25 text-ivory/70 hover:border-gold'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
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
              <h3 className="font-display text-xl text-ivory">Delete Reservation</h3>
              <p className="text-xs text-ivory/65 mt-2 leading-relaxed">
                Are you absolutely sure you want to delete this reservation? This action cannot be undone.
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
