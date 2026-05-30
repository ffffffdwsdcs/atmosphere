'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const WORD = 'ATMOSPHERE';

export default function Preloader() {
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReady(true);
    const visited = window.sessionStorage.getItem('atm:visited');
    if (!visited) {
      setShow(true);
      const t = setTimeout(() => {
        window.sessionStorage.setItem('atm:visited', 'true');
        setShow(false);
      }, 2400);
      return () => clearTimeout(t);
    }
  }, []);

  if (!ready) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9998] flex items-center justify-center preloader-bg"
        >
          <div className="absolute inset-0 grain" />
          <div className="relative flex flex-col items-center gap-6">
            {/* Brand Logo in Loading Screen */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                scale: [1, 1.04, 1],
                opacity: 1,
              }}
              transition={{
                scale: {
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeInOut",
                },
                default: {
                  delay: 0.1,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }
              }}
              className="h-20 w-20 overflow-hidden flex items-center justify-center mb-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/atmosphere_logo.webp"
                alt="Atmosphere logo"
                className="h-full w-full object-contain"
              />
            </motion.div>

            <div className="flex items-end gap-[2px] sm:gap-1">
              {WORD.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 32, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{
                    delay: 0.1 + i * 0.07,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-albertus font-bold text-[clamp(20px,4vw,44px)] leading-none tracking-[0.4em] text-gold"
                >
                  {ch}
                </motion.span>
              ))}
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-44 origin-left bg-gradient-to-r from-transparent via-flame to-transparent"
            />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="font-sans font-light text-[11px] uppercase tracking-[0.3em] text-gold/80"
            >
              Mysuru • Est. 2013
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
