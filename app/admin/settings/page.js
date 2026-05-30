'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Key, Shield, Globe, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Settings states
  const [seoTitle, setSeoTitle] = useState('Atmosphere Restobar & Banquet Mysuru');
  const [metaDesc, setMetaDesc] = useState("Mysuru's finest multi-cuisine restobar & luxury banquet venue. Experience premium dining, candlelit music nights and wedding banquets.");
  const [analyticsId, setAnalyticsId] = useState('G-ATMOSPHERE2025');
  const [primaryColor, setPrimaryColor] = useState('#f56d0a');
  const [bgColor, setBgColor] = useState('#0f0a05');

  // Credentials states
  const [username, setUsername] = useState('atmosphere_admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const json = await res.json();
        const config = json.config || {};
        if (config.seo_title) setSeoTitle(config.seo_title);
        if (config.meta_description) setMetaDesc(config.meta_description);
        if (config.analytics_id) setAnalyticsId(config.analytics_id);
      }
      
      // Fetch dynamic admin user if available
      const userRes = await fetch('/api/admin/settings-user');
      if (userRes.ok) {
        const userJson = await userRes.json();
        if (userJson.username) setUsername(userJson.username);
      }
    } catch (err) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveMetadata = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Dash protection on settings inputs
      const cleanTitle = seoTitle.replace(/[\u2013\u2014–—]/g, '-');
      const cleanDesc = metaDesc.replace(/[\u2013\u2014–—]/g, '-');

      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seo_title: cleanTitle,
          meta_description: cleanDesc,
          analytics_id: analyticsId,
        }),
      });
      if (!res.ok) throw new Error('Failed to update metadata settings');
      toast.success('Metadata settings updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required to update credentials');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to update credentials');
      toast.success('Credentials updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Error updating credentials');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-gold">
        <RefreshCw className="h-7 w-7 animate-spin" />
        <span className="text-[10px] uppercase tracking-widest font-sans">Syncing metadata...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl text-ivory tracking-wide">System Settings</h1>
        <p className="text-xs text-gold/60 mt-1 uppercase tracking-wider font-sans">
          Configure search engine optimization, analytic trackers, and admin access keys
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SEO & METADATA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1f1209] border border-gold/15 p-6 md:p-8 rounded-lg space-y-6"
        >
          <div className="flex items-center gap-2.5 border-b border-gold/10 pb-3">
            <Globe className="h-5 w-5 text-flame" />
            <h3 className="font-display text-xl text-ivory">SEO & Metadata Settings</h3>
          </div>

          <form onSubmit={handleSaveMetadata} className="space-y-4">
            <label className="block">
              <span className="text-[10px] uppercase text-gold/80 block mb-1">Search Engine Title (SEO)</span>
              <input
                required
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="atm-input text-xs"
              />
            </label>

            <label className="block">
              <span className="text-[10px] uppercase text-gold/80 block mb-1">Meta Description</span>
              <textarea
                required
                rows={4}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="atm-input text-xs resize-none"
              />
            </label>

            <label className="block">
              <span className="text-[10px] uppercase text-gold/80 block mb-1">Google Analytics ID / Tag</span>
              <input
                type="text"
                value={analyticsId}
                onChange={(e) => setAnalyticsId(e.target.value)}
                className="atm-input font-mono text-xs text-gold"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] uppercase text-gold/80 block mb-1">Primary Color (Flame)</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-10 border border-gold/30 bg-transparent cursor-pointer rounded"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    disabled
                    className="atm-input text-xs font-mono select-all flex-1"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-[10px] uppercase text-gold/80 block mb-1">Background Color</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-10 border border-gold/30 bg-transparent cursor-pointer rounded"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    disabled
                    className="atm-input text-xs font-mono select-all flex-1"
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full h-11 bg-flame hover:bg-flame-light text-ivory flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-sans font-bold transition cursor-pointer disabled:opacity-60"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Save System Settings</span>
            </button>
          </form>
        </motion.div>

        {/* SECURITY CREDENTIALS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1f1209] border border-gold/15 p-6 md:p-8 rounded-lg space-y-6"
        >
          <div className="flex items-center gap-2.5 border-b border-gold/10 pb-3">
            <Shield className="h-5 w-5 text-flame" />
            <h3 className="font-display text-xl text-ivory">Security & Access Keys</h3>
          </div>

          <form onSubmit={handleUpdateCredentials} className="space-y-4">
            <label className="block">
              <span className="text-[10px] uppercase text-gold/80 block mb-1">Admin Username</span>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="atm-input font-mono text-xs text-gold"
              />
            </label>

            <label className="block">
              <span className="text-[10px] uppercase text-gold/80 block mb-1">Current Password *</span>
              <input
                required
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="atm-input font-mono text-xs"
                placeholder="••••••••••••••"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] uppercase text-gold/80 block mb-1">New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="atm-input font-mono text-xs"
                  placeholder="••••••••••••••"
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase text-gold/80 block mb-1">Confirm New Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="atm-input font-mono text-xs"
                  placeholder="••••••••••••••"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full h-11 border border-flame text-flame hover:bg-flame/15 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-sans font-bold transition cursor-pointer disabled:opacity-60"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
              <span>Update Access Credentials</span>
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
