'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Minimal luxury cursor: 10px filled flame circle.
 * - position: fixed, z-index 99999, transform translate (not top/left)
 * - Hover (a, button, [role=button]): scale 2.5
 * - mousedown: scale 0.8
 */
export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef(null);
  const stateRef = useRef({ hover: false, down: false });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const dot = dotRef.current;
    if (!dot) return;

    const applyTransform = (x, y) => {
      const { hover, down } = stateRef.current;
      const scale = down ? 0.8 : hover ? 2.5 : 1;
      dot.style.transform = `translate3d(${x - 5}px, ${y - 5}px, 0)`;
      const inner = dot.querySelector('.cursor-inner');
      if (inner) {
        inner.style.transform = `scale(${scale})`;
      }
    };

    let lastX = -100;
    let lastY = -100;
    applyTransform(lastX, lastY);

    const onMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      applyTransform(lastX, lastY);
    };

    const isInteractive = (el) => {
      if (!el || el.nodeType !== 1) return false;
      return !!el.closest('a, button, [role="button"], [data-cursor="hover"]');
    };

    const onOver = (e) => {
      stateRef.current.hover = isInteractive(e.target);
      applyTransform(lastX, lastY);
    };
    const onOut = () => {
      stateRef.current.hover = false;
      applyTransform(lastX, lastY);
    };
    const onDown = () => {
      stateRef.current.down = true;
      applyTransform(lastX, lastY);
    };
    const onUp = () => {
      stateRef.current.down = false;
      applyTransform(lastX, lastY);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 10,
        height: 10,
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
      }}
    >
      <div
        className="cursor-inner"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: '#f56d0a',
          boxShadow: '0 0 12px rgba(245,109,10,0.6)',
          transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
