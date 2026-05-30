'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Search, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      if (!res.ok) throw new Error('Failed to load logs');
      const json = await res.json();
      setLogs(json.items || []);
    } catch (err) {
      toast.error(err.message || 'Error fetching activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionColor = (action) => {
    switch (String(action).toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'UPDATE':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'STATUS_CHANGE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-gold/10 text-gold border-gold/20';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      String(log.user).toLowerCase().includes(search.toLowerCase()) ||
      String(log.details).toLowerCase().includes(search.toLowerCase()) ||
      String(log.action).toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === 'all' || String(log.action).toUpperCase() === actionFilter.toUpperCase();

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory tracking-wide">Admin Activity Logs</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
            Audit history of database updates, menu adjustments, and reservations
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="h-10 px-4 border border-gold/30 hover:border-flame hover:bg-flame/10 text-gold flex items-center gap-2 text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filters block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1f1209] p-4 border border-gold/15 rounded-lg">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search logs by user, action, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="atm-input pl-9"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
        </div>

        {/* Action Dropdown */}
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="atm-input"
        >
          <option value="all">All Action Types</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="STATUS_CHANGE">STATUS_CHANGE</option>
        </select>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-[#1f1209] border border-gold/15 rounded-lg shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gold">
            <RefreshCw className="h-7 w-7 animate-spin" />
            <span className="text-[10px] uppercase tracking-widest font-sans">Retrieving audit trail...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-espresso text-gold uppercase tracking-wider font-mono">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold w-32">Action</th>
                  <th className="p-4 font-semibold">Details / Description</th>
                  <th className="p-4 font-semibold w-48">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-ivory/40">
                      No activity logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-flame/[0.02] transition-colors group">
                      <td className="p-4 text-gold font-mono font-bold">
                        @{log.user}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold border rounded-sm ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-ivory/85 text-[13px] font-sans">
                        {log.details}
                      </td>
                      <td className="p-4 text-ivory/50 font-mono text-[11px] flex items-center gap-1.5 mt-0.5">
                        <Clock className="h-3 w-3 text-gold/50" />
                        {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
