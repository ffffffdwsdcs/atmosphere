'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Building,
  Ticket,
  MessageSquare,
  UtensilsCrossed,
  Music,
  Image as ImageIcon,
  Tag,
  Images,
  Film,
  Settings,
  LogOut,
  Bell,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', Icon: LayoutDashboard },
  { label: 'Reservations', href: '/admin/reservations', Icon: Calendar },
  { label: 'Banquet Inquiries', href: '/admin/banquet', Icon: Building },
  { label: 'Event Bookings', href: '/admin/events', Icon: Ticket },
  { label: 'Contact Messages', href: '/admin/contact', Icon: MessageSquare },
  { label: 'Menu Manager', href: '/admin/menu', Icon: UtensilsCrossed },
  { label: 'Events Manager', href: '/admin/events-manager', Icon: Music },
  { label: 'Offers Manager', href: '/admin/offers', Icon: Tag },
  { label: 'Gallery Manager', href: '/admin/gallery', Icon: Images },
  { label: 'Activity Logs', href: '/admin/logs', Icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dateTime, setDateTime] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }) +
          ' · ' +
          now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
      );
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch real notification counts from API
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        
        // Load cleared/viewed activities from localStorage to persist read state
        let readIds = [];
        try {
          readIds = JSON.parse(localStorage.getItem('admin_read_notification_ids') || '[]');
        } catch (_) {}

        // Construct visual notifications from recent activities
        const list = (json.recentActivities || []).map((act, index) => {
          let href = '/admin/dashboard';
          if (act.type === 'reservation') href = '/admin/reservations';
          else if (act.type === 'banquet') href = '/admin/banquet';
          else if (act.type === 'message') href = '/admin/contact';

          const uniqueId = `${act.type}-${act.createdAt}-${act.description}`;

          return {
            id: uniqueId,
            type: act.type,
            description: act.description,
            createdAt: act.createdAt,
            href,
            read: readIds.includes(uniqueId),
          };
        });
        
        setNotifications(list);
        
        // Calculate unread count (unread if not marked as read in localStorage)
        const unread = list.filter(item => !item.read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (pathname !== '/admin/login') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 45000);
      return () => clearInterval(interval);
    }
  }, [pathname]);

  // Do not render sidebar layout on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleNotificationClick = (item) => {
    setShowNotifications(false);
    
    // Save to localStorage
    try {
      const readIds = JSON.parse(localStorage.getItem('admin_read_notification_ids') || '[]');
      if (!readIds.includes(item.id)) {
        readIds.push(item.id);
        localStorage.setItem('admin_read_notification_ids', JSON.stringify(readIds));
      }
    } catch (_) {}

    // Refresh list locally
    setNotifications(prev => 
      prev.map(n => n.id === item.id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    router.push(item.href);
  };

  return (
    <div className="min-h-screen bg-[#0f0a05] text-[#fdf6f0] flex">
      {/* Sidebar Navigation */}
      <aside className="w-[260px] bg-[#1a1008] border-r border-gold/15 flex flex-col justify-between shrink-0 h-screen fixed left-0 top-0 z-40">
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-gold/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo/atmosphere_logo.webp"
                  alt="Atmosphere logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="leading-none">
                <div className="font-albertus text-[18px] tracking-[0.25em] text-ivory font-bold uppercase">
                  ATMOSPHERE
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-gold mt-1 font-semibold">
                  Admin Panel
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-[14px] font-sans font-normal border-l-2 transition-all tracking-[0.05em] ${
                    active
                      ? 'border-flame text-flame bg-[#3d2b18]/45'
                      : 'border-transparent text-ivory/60 hover:text-gold hover:bg-[#3d2b18]/20'
                  }`}
                >
                  <item.Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gold/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-sans font-normal text-flame hover:bg-flame/10 transition rounded cursor-pointer animate-none bg-transparent border-0 text-left tracking-[0.05em]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <div className="flex-1 pl-[260px] flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-gold/15 bg-[#1a1008]/85 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <span className="text-ivory/70 text-xs font-semibold">
              Good morning, <span className="text-gold">Atmosphere</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Live Clock */}
            <span className="text-[11px] text-gold/80 font-mono tracking-wider">
              {dateTime}
            </span>

            {/* Notification Bell with Dropdown Panel */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 border border-gold/20 bg-[#1a1008] hover:bg-flame/10 hover:border-flame text-gold transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-flame text-[9px] text-ivory flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Interactive Notification Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setShowNotifications(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 bg-[#1f1209] border border-gold/25 rounded-md shadow-2xl z-50 overflow-hidden text-left"
                    >
                      <div className="p-3 border-b border-gold/15 bg-[#1a1008] flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider font-semibold text-gold">Notifications</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={() => {
                              try {
                                const allIds = notifications.map(n => n.id);
                                localStorage.setItem('admin_read_notification_ids', JSON.stringify(allIds));
                              } catch (_) {}
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                              setUnreadCount(0);
                              toast.success('Marked all as read');
                            }}
                            className="text-[10px] text-flame hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-y-auto divide-y divide-gold/10">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-ivory/40">
                            No notifications.
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <div 
                              key={item.id} 
                              onClick={() => handleNotificationClick(item)}
                              className={`p-3 hover:bg-[#3d2b18]/25 transition cursor-pointer text-xs ${
                                !item.read ? 'bg-gold/[0.02] border-l-2 border-flame' : 'opacity-65'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase ${
                                  item.type === 'reservation' 
                                    ? 'bg-flame/15 text-flame' 
                                    : item.type === 'banquet' 
                                    ? 'bg-gold/15 text-gold' 
                                    : 'bg-sky-400/15 text-sky-300'
                                }`}>
                                  {item.type}
                                </span>
                                <span className="text-[9px] text-ivory/40 font-mono">
                                  {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <p className={`leading-relaxed truncate ${!item.read ? 'text-ivory font-medium' : 'text-ivory/60'}`}>{item.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Subpage Main Content Area */}
        <main className="flex-1 bg-[#140d06] p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
