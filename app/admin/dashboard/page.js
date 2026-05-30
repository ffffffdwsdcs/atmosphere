'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Building, MessageSquare, UtensilsCrossed, Eye, X, RefreshCw, Clock, Users, TrendingUp, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeReservation, setActiveReservation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      toast.error(err.message || 'Error fetching stats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh the dashboard every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 10) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    return `${diffDay}d ago`;
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-gold">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="text-xs uppercase tracking-[0.2em] font-sans">Loading metrics...</span>
      </div>
    );
  }

  const { stats, recentReservations, recentActivities } = data || {
    stats: {
      totalReservations: 0,
      pendingBanquets: 0,
      newMessages: 0,
      totalMenuItems: 42,
      liveUsers: 0,
      dailyVisitors: 0,
      weeklyVisitors: 0,
      monthlyVisitors: 0
    },
    recentReservations: [],
    recentActivities: [],
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cormorant font-light text-3xl text-ivory tracking-wide">Dashboard</h1>
          <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">Atmosphere Restobar Overview</p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="h-10 px-4 border border-gold/30 hover:border-flame hover:bg-flame/10 text-gold flex items-center gap-2 text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Calendar}
          label="Total Reservations"
          value={stats.totalReservations}
          color="text-flame"
        />
        <StatCard
          icon={Building}
          label="Pending Banquets"
          value={stats.pendingBanquets}
          color="text-gold"
        />
        <StatCard
          icon={MessageSquare}
          label="New Messages"
          value={stats.newMessages}
          color="text-sky-400"
        />
        <StatCard
          icon={UtensilsCrossed}
          label="Total Menu Items"
          value={stats.totalMenuItems}
          color="text-emerald-400"
        />
      </div>

      {/* Real-time Analytics & Traffic Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-cormorant font-light text-xl text-ivory tracking-wide">Live Traffic & Analytics</h2>
          <span className="h-px bg-gold/10 flex-1 mx-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Live Users Card */}
          <div className="bg-[#1f1209] border border-gold/15 p-5 flex items-center justify-between rounded-lg shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-flame/5 via-transparent to-transparent pointer-events-none" />
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-gold/75 font-sans font-semibold mb-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Live Active Users
              </span>
              <span className="font-albertus text-4xl leading-none font-bold text-emerald-400">
                {stats.liveUsers ?? 0}
              </span>
              <span className="block text-[9px] text-ivory/45 mt-1.5 uppercase tracking-wider font-sans">
                Real-time site presence
              </span>
            </div>
            <div className="h-12 w-12 border border-gold/20 flex items-center justify-center bg-espresso/50 text-emerald-400 rounded shrink-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
          </div>

          {/* Daily Visitors */}
          <StatCard
            icon={Users}
            label="Daily Visitors"
            value={(stats.dailyVisitors ?? 0).toLocaleString()}
            color="text-gold"
            trend="Past 24 hours"
          />

          {/* Weekly Visitors */}
          <StatCard
            icon={TrendingUp}
            label="Weekly Visitors"
            value={(stats.weeklyVisitors ?? 0).toLocaleString()}
            color="text-flame"
            trend="Past 7 days"
          />

          {/* Monthly Visitors */}
          <StatCard
            icon={Activity}
            label="Monthly Visitors"
            value={(stats.monthlyVisitors ?? 0).toLocaleString()}
            color="text-sky-400"
            trend="Past 30 days"
          />
        </div>
      </div>

      {/* Grid: Recent Reservations & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-6">
        
        {/* LEFT COLUMN: Recent Reservations Table */}
        <div className="bg-[#1f1209] border border-gold/15 p-6 rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cormorant font-light text-xl text-ivory">Recent Reservations</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold/10 text-gold uppercase tracking-[0.12em] font-sans font-medium text-[11px]">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Guests</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {recentReservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-ivory/40">
                      No reservations found.
                    </td>
                  </tr>
                ) : (
                  recentReservations.map((r) => (
                    <tr key={r.id} className="hover:bg-flame/[0.04] transition-colors group">
                      <td className="py-3.5 font-sans font-light text-[14px] text-ivory">{r.name}</td>
                      <td className="py-3.5 font-sans font-light text-[14px] text-ivory/70">{r.phone}</td>
                      <td className="py-3.5 font-sans font-light text-[14px] text-ivory/70">{r.date}</td>
                      <td className="py-3.5 font-sans font-light text-[14px] text-ivory/70">{r.time}</td>
                      <td className="py-3.5 font-sans font-light text-[14px] text-ivory/70">{r.guests}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-sans uppercase font-bold ${
                          r.status === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : r.status === 'cancelled'
                            ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setActiveReservation(r)}
                          className="p-1.5 border border-gold/25 text-gold hover:border-flame hover:text-flame bg-espresso/50 hover:bg-flame/10 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activities Feed */}
        <div className="bg-[#1f1209] border border-gold/15 p-6 rounded-lg shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-cormorant font-light text-xl text-ivory">Recent Activity</h2>
              <span className="text-[9px] uppercase tracking-widest text-gold bg-flame/10 border border-flame/20 px-2 py-0.5 rounded flex items-center gap-1 font-sans">
                <Clock className="h-2.5 w-2.5 animate-pulse" /> Live Feed
              </span>
            </div>

            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-6 text-ivory/40 text-xs">
                  No recent activities.
                </div>
              ) : (
                recentActivities.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs border-b border-gold/5 pb-3 last:border-0 last:pb-0">
                    <span className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ${
                      act.type === 'reservation'
                        ? 'bg-flame shadow-[0_0_6px_rgba(245,109,10,0.8)]'
                        : act.type === 'banquet'
                        ? 'bg-gold shadow-[0_0_6px_rgba(201,168,130,0.8)]'
                        : 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-ivory/80 leading-relaxed break-words">{act.description}</p>
                      <span className="text-[10px] text-gold/60 mt-1 block font-mono">{formatRelativeTime(act.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Detail Dialog popup */}
      <AnimatePresence>
        {activeReservation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActiveReservation(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#1a1008] border border-gold/30 shadow-2xl p-6 md:p-8 z-10 text-left rounded-lg"
            >
              <button
                onClick={() => setActiveReservation(null)}
                className="absolute top-4 right-4 h-8 w-8 border border-gold/25 text-gold hover:border-flame hover:text-flame flex items-center justify-center transition cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-flame text-[10px] uppercase tracking-[0.4em] mb-2 font-sans font-bold">
                <Calendar className="h-3.5 w-3.5" /> Details
              </div>
              <h3 className="font-cormorant font-light text-2xl text-ivory">Reservation Information</h3>
              <p className="text-[11px] text-gold/70 mt-1 uppercase tracking-widest font-mono">Ref#: {activeReservation.reference || 'N/A'}</p>

              <div className="mt-6 space-y-4 text-xs">
                <DetailRow label="Guest Name" value={activeReservation.name} />
                <DetailRow label="Phone" value={activeReservation.phone} />
                <DetailRow label="Email" value={activeReservation.email || 'None provided'} />
                <div className="grid grid-cols-3 gap-3 border-b border-gold/10 pb-3">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-gold/60 mb-1">Date</span>
                    <span className="text-ivory font-medium">{activeReservation.date}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-gold/60 mb-1">Time</span>
                    <span className="text-ivory font-medium">{activeReservation.time}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-gold/60 mb-1">Guests</span>
                    <span className="text-ivory font-medium font-mono">{activeReservation.guests}</span>
                  </div>
                </div>
                <DetailRow label="Occasion" value={activeReservation.occasion || 'None'} />
                <DetailRow label="Dietary Preference" value={activeReservation.dietary || 'No preference'} />
                <div className="border-b border-gold/10 pb-3">
                  <span className="block text-[10px] uppercase tracking-wider text-gold/60 mb-1">Special Requests</span>
                  <p className="text-ivory bg-[#0f0a05] p-3 rounded leading-relaxed italic border border-gold/5 max-h-24 overflow-y-auto no-scrollbar">
                    {activeReservation.special_requests || 'No special requests.'}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-gold/60">Status</span>
                  <span className={`px-3 py-1 text-xs uppercase font-bold ${
                    activeReservation.status === 'confirmed'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : activeReservation.status === 'cancelled'
                      ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {activeReservation.status}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className="bg-[#1f1209] border border-gold/15 p-5 flex items-center justify-between rounded-lg shadow-lg relative overflow-hidden group">
      <div>
        <span className="block text-[10px] uppercase tracking-widest text-gold/75 font-sans font-semibold mb-1">
          {label}
        </span>
        <span className={`font-albertus text-4xl leading-none font-bold ${color}`}>
          {value}
        </span>
        {trend && (
          <span className="block text-[9px] text-emerald-400 mt-1.5 uppercase tracking-wider font-sans font-medium">
            {trend}
          </span>
        )}
      </div>
      <div className="h-12 w-12 border border-gold/20 flex items-center justify-center bg-espresso/50 text-gold/75 rounded shrink-0">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-gold/10 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] uppercase tracking-wider text-gold/60">{label}</span>
      <span className="text-ivory font-medium">{value}</span>
    </div>
  );
}
