'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[9997] h-[2px] w-full origin-left bg-gradient-to-r from-flame-dark via-flame to-flame-light shadow-[0_0_12px_rgba(245,109,10,0.6)]"
    />
  );
}
