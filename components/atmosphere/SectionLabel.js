'use client';

export default function SectionLabel({ eyebrow, title, accent = 'flame', center = true }) {
  const color = accent === 'gold' ? 'text-gold' : 'text-flame';
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : ''}>
      <div className={`lux-divider justify-center ${color} font-sans font-medium text-[11px] uppercase tracking-[0.3em]`}>
        {eyebrow}
      </div>
      <h2 className="mt-5 font-cormorant font-light text-[clamp(36px,5vw,64px)] leading-[1.1] tracking-[0.01em] text-ivory">
        {title}
      </h2>
    </div>
  );
}
