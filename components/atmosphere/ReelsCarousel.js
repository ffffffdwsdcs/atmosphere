'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, VolumeX, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const getSafeVideoUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/Reels videos/')) {
    const filename = url.substring('/Reels videos/'.length);
    return `/Reels videos/${encodeURIComponent(filename)}`;
  }
  return url;
};

// Infinite marquee of reel cards (240x427, aspect ratio 9:16).
// Clean CSS animation for buttery smooth loop scroll.
export default function ReelsCarousel() {
  const [reelsList, setReelsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const scrollerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Custom player states
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch reels from database
  useEffect(() => {
    async function loadReels() {
      try {
        const res = await fetch('/api/reels');
        if (!res.ok) throw new Error('Failed to load reels');
        const json = await res.json();
        setReelsList(json.items || []);
      } catch (err) {
        console.error(err);
        setReelsList([]);
      } finally {
        setLoading(false);
      }
    }
    loadReels();
  }, []);

  // Reliable cross-browser scroll lock hook
  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [openIndex]);

  // Smooth JS auto-scroll marquee that pauses on touch/drag interaction
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || reelsList.length === 0) return;

    let animationFrameId;
    let lastTime = performance.now();
    const speed = 0.055; // buttery smooth slow marquee crawl speed

    const scrollStep = (timestamp) => {
      if (!isInteracting && !paused && openIndex === null) {
        const delta = timestamp - lastTime;
        scroller.scrollLeft += speed * delta;

        // Seamless infinite loop when passing the mid point
        const halfWidth = scroller.scrollWidth / 2;
        if (scroller.scrollLeft >= halfWidth) {
          scroller.scrollLeft -= halfWidth;
        }
      }
      lastTime = timestamp;
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting, paused, openIndex, reelsList]);

  // Handle play/pause, time, and duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setPlaying(true);
    setCurrentTime(0);

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('ended', onEnded);

    // Try unmuted play first
    video.muted = false;
    setMuted(false);

    video.play().catch((err) => {
      console.warn("Unmuted playback blocked, playing muted as fallback:", err);
      video.muted = true;
      setMuted(true);
      video.play().catch((playErr) => {
        console.error("Playback failed entirely:", playErr);
        setPlaying(false);
      });
    });

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('ended', onEnded);
    };
  }, [openIndex]);

  // Arrow key navigation for modal
  useEffect(() => {
    if (openIndex === null || reelsList.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setOpenIndex((prev) => (prev === 0 ? reelsList.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setOpenIndex((prev) => (prev === reelsList.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openIndex, reelsList]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    const newTime = pct * duration;
    if (isFinite(newTime)) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  if (loading) {
    return (
      <section className="relative bg-espresso py-20 md:py-36 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gold">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <span className="text-[10px] uppercase tracking-widest font-sans">Syncing reels...</span>
        </div>
      </section>
    );
  }

  // If database contains no reels, hide section completely
  if (reelsList.length === 0) {
    return null;
  }

  const reels = [...reelsList, ...reelsList]; // duplicated for seamless loop

  return (
    <section
      className="relative bg-espresso py-20 md:py-36 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 diagonal-pattern opacity-40 pointer-events-none" />
      <div className="radial-glow pointer-events-none" />
      <div className="container relative pointer-events-none">
        <div className="flex flex-col items-center text-center">
          <div className="lux-divider text-flame font-sans font-medium text-[11px] uppercase tracking-[0.3em]">
            Reels &amp; moments
          </div>
          <h2 className="mt-5 font-cormorant font-light text-[clamp(36px,5vw,64px)] text-ivory leading-tight">
            Atmosphere in <span className="italic text-flame">motion</span>
          </h2>
          <p className="mt-4 max-w-xl font-playfair font-normal italic text-[clamp(16px,1.8vw,22px)] text-gold tracking-[0.02em]">
            Hover to pause. Tap any reel to play.
          </p>
        </div>
      </div>

      <div className="relative mt-14 max-w-[1600px] mx-auto overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-72 lg:w-96 z-10 bg-gradient-to-r from-espresso via-espresso/85 via-espresso/30 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-72 lg:w-96 z-10 bg-gradient-to-l from-espresso via-espresso/85 via-espresso/30 to-transparent" />

        <div className="overflow-hidden py-10">
          <div
            ref={scrollerRef}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
            onMouseDown={() => setIsInteracting(true)}
            onMouseUp={() => setIsInteracting(false)}
            onMouseLeave={() => {
              setIsInteracting(false);
              setPaused(false);
            }}
            onMouseEnter={() => setPaused(true)}
            className={`flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden hide-scrollbar touch-pan-x select-none px-[8vw] md:px-0 ${
              isInteracting ? 'snap-x snap-mandatory' : ''
            }`}
            style={{
              width: '100%',
              scrollBehavior: 'auto',
            }}
          >
             {reels.map((r, i) => {
              const realIdx = i % reelsList.length;
              return (
                <motion.button
                  type="button"
                  data-reel-card
                  key={`${r.title}-${i}`}
                  onClick={() => setOpenIndex(realIdx)}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative shrink-0 overflow-hidden border border-gold/25 bg-espresso-mid cursor-pointer w-[84vw] aspect-[9/16] md:aspect-auto md:w-[300px] md:h-[533px] rounded-[12px] snap-center"
                >
                  <video
                    src={getSafeVideoUrl(r.video)}
                    poster={r.poster}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/35 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="h-9 w-9 md:h-14 md:w-14 rounded-full border border-flame/70 bg-espresso/60 backdrop-blur flex items-center justify-center bg-flame">
                      <Play className="h-3.5 w-3.5 md:h-5 md:w-5 text-ivory translate-x-0.5" fill="currentColor" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-5 text-left bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="font-sans font-medium text-[9px] md:text-[11px] uppercase tracking-[0.12em] text-gold">
                      {r.sub}
                    </div>
                    <div className="mt-0.5 md:mt-1 font-cormorant font-normal text-[13px] md:text-[18px] text-ivory leading-tight line-clamp-2">
                      {r.title}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overhauled Modal Popup */}
      <AnimatePresence>
        {openIndex !== null && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setOpenIndex(null)}
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="fixed top-4 right-4 z-[320] h-10 w-10 border border-white/20 rounded-full flex items-center justify-center bg-black/45 backdrop-blur text-ivory hover:bg-flame hover:border-flame transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left and Right navigation buttons beside the card */}
            <div className="absolute inset-y-0 left-0 md:left-8 z-[310] flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((prev) => (prev === 0 ? reelsList.length - 1 : prev - 1));
                }}
                className="h-12 w-12 border border-white/20 rounded-full flex items-center justify-center bg-black/50 hover:bg-flame hover:border-flame transition pointer-events-auto text-ivory cursor-pointer shadow-lg"
                aria-label="Previous Reel"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 md:right-8 z-[310] flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((prev) => (prev === reelsList.length - 1 ? 0 : prev + 1));
                }}
                className="h-12 w-12 border border-white/20 rounded-full flex items-center justify-center bg-black/50 hover:bg-flame hover:border-flame transition pointer-events-auto text-ivory cursor-pointer shadow-lg"
                aria-label="Next Reel"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col lg:flex-row items-center justify-center z-10 w-full max-w-5xl px-4 md:px-6 pointer-events-none"
            >
              {/* Left Column: Center Video player container (Larger size on desktop, exact 9:16 aspect ratio) */}
              <div 
                className="relative bg-black w-full aspect-[9/16] h-[72vh] max-h-[660px] xs:h-[78vh] xs:max-h-[700px] md:h-[84vh] md:max-h-[760px] md:w-auto rounded-[20px] overflow-hidden border border-gold/30 shadow-2xl flex-shrink-0 pointer-events-auto"
              >
                <video
                  ref={videoRef}
                  src={getSafeVideoUrl(reelsList[openIndex].video)}
                  poster={reelsList[openIndex].poster}
                  playsInline
                  autoPlay
                  muted={muted}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                
                {/* Dark gradient overlay under video (behind controls) */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

                {/* Controls Row and Seekbar */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end z-10">
                  {/* Seekbar */}
                  <div
                    className="w-full flex items-center h-4 cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div className="relative w-full h-[3px] bg-white/25 rounded-full overflow-visible">
                      <div
                        className="absolute left-0 top-0 h-full bg-flame rounded-full"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-gold shadow-md"
                        style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between mt-2.5 w-full">
                    {/* Play/Pause */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="h-11 w-11 rounded-full bg-flame hover:bg-flame-light text-ivory flex items-center justify-center transition shadow-lg shrink-0 cursor-pointer border-0"
                      aria-label={playing ? 'Pause' : 'Play'}
                    >
                      {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current translate-x-[1px]" />}
                    </button>

                    {/* Mute/Unmute */}
                    <button
                      type="button"
                      onClick={() => setMuted(!muted)}
                      className="h-11 w-11 rounded-full border border-white/20 bg-black/40 backdrop-blur text-flame flex items-center justify-center hover:bg-flame hover:text-ivory hover:border-flame transition cursor-pointer"
                      aria-label={muted ? 'Unmute' : 'Mute'}
                    >
                      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Description, Tags, and Up Next with thumbnail (Floating style, no bounding box) */}
              <div className="hidden lg:flex flex-col justify-between h-[84vh] max-h-[760px] w-[360px] p-6 text-left pointer-events-auto ml-8 overflow-y-auto no-scrollbar">
                <div>
                  {/* Sub/Label */}
                  <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-gold font-sans font-bold block mb-2">
                    {reelsList[openIndex].sub}
                  </span>
                  
                  {/* Title */}
                  <h3 className="font-cormorant font-light text-[26px] md:text-[32px] text-ivory leading-tight mb-4">
                    {reelsList[openIndex].title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-[13.5px] md:text-[14.5px] text-ivory/70 font-sans leading-relaxed mb-6 font-light">
                    Experience the vibrant rhythms and signature hospitality of Atmosphere. A curated sensory journey, crafted for those who celebrate life with dynamic music, artisan drinks, and unmatched vibes.
                  </p>
                  
                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-flame/10 border border-flame/20 text-[9px] uppercase tracking-wider text-flame rounded-full font-sans font-medium">
                      #atmospheremysuru
                    </span>
                    <span className="px-3 py-1 bg-flame/10 border border-flame/20 text-[9px] uppercase tracking-wider text-flame rounded-full font-sans font-medium">
                      #reelsinmotion
                    </span>
                    <span className="px-3 py-1 bg-flame/10 border border-flame/20 text-[9px] uppercase tracking-wider text-flame rounded-full font-sans font-medium">
                      #luxurylifestyle
                    </span>
                  </div>
                </div>

                {/* Up Next Card */}
                <div className="mt-8 border-t border-gold/10 pt-6">
                  <h4 className="text-[10px] uppercase tracking-widest text-gold font-sans font-bold mb-3.5">
                    Up Next
                  </h4>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const nextIdx = (openIndex + 1) % reelsList.length;
                      setOpenIndex(nextIdx);
                    }}
                    className="w-full flex gap-4 p-3 bg-black/40 hover:bg-[#1a120a] border border-gold/15 rounded-xl transition-all text-left group"
                  >
                    {/* Next Reel Thumbnail */}
                    <div className="relative w-12 aspect-[9/16] rounded-lg overflow-hidden shrink-0 border border-gold/20 bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={reelsList[(openIndex + 1) % reelsList.length]?.poster || ''}
                        alt="Next Reel Thumbnail"
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="h-3.5 w-3.5 text-ivory fill-current opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    
                    {/* Next Reel Meta */}
                    <div className="flex flex-col justify-center overflow-hidden">
                      <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-gold font-sans font-semibold">
                        {reelsList[(openIndex + 1) % reelsList.length]?.sub || ''}
                      </span>
                      <span className="text-[12px] md:text-[13.5px] text-ivory font-medium font-sans truncate mt-1 group-hover:text-white transition">
                        {reelsList[(openIndex + 1) % reelsList.length]?.title || ''}
                      </span>
                      <span className="text-[10px] md:text-[11px] text-flame font-sans font-semibold mt-1.5 flex items-center gap-1">
                        Play Now <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
