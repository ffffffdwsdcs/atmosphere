'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Login failed');
      }

      toast.success('Welcome back, Admin!');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(true);
      toast.error('Invalid credentials');
      setTimeout(() => setError(false), 600); // reset shake state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f0a05] flex items-center justify-center p-4">
      {/* Background glow and grids */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-flame/[0.06] blur-[150px] rounded-full" />
        <div className="absolute inset-0 diagonal-pattern opacity-10" />
      </div>

      <motion.div
        animate={error ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-[#1a1008] border border-gold/25 p-8 md:p-10 shadow-2xl shadow-black rounded-lg"
      >
        <div className="text-center">
          <div className="lux-divider justify-center text-flame text-[10px] uppercase tracking-[0.55em] mb-4">
            <Sparkles className="h-3 w-3" /> RESTOBAR
          </div>
          <h1 className="font-display text-4xl text-ivory tracking-widest uppercase">
            ATMOSPHERE
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-gold font-sans font-semibold">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.32em] text-gold/80 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="atm-input !pl-12"
                placeholder="Enter username"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.32em] text-gold/80 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="atm-input !pl-12 !pr-12"
                placeholder="Enter password"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/60 hover:text-gold transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-flame w-full py-4 text-[11px] uppercase tracking-[0.36em] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
