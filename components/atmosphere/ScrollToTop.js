'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ScrollToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((window.scrollY / scrollHeight) * 100);
      }
      setVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-gold/30 bg-espresso/85 backdrop-blur-md text-gold flex items-center justify-center hover:text-ivory hover:border-flame transition group shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
          aria-label="Scroll to top"
        >
          {/* Subtle scroll progress ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="transparent"
              stroke="rgba(245, 109, 10, 0.15)"
              strokeWidth="1.5"
            />
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="transparent"
              stroke="#f56d0a"
              strokeWidth="2"
              strokeDasharray={138.2}
              strokeDashoffset={138.2 - (138.2 * scrollProgress) / 100}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-75"
            />
          </svg>

          <ArrowUp className="h-5 w-5 transition group-hover:-translate-y-1 duration-300 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
