'use client';

import React from 'react';
import { WeddingEventData } from '@/lib/events';

interface AnnouncementSectionProps {
  data: WeddingEventData;
}

export default function AnnouncementSection({ data }: AnnouncementSectionProps) {
  return (
    <section id="announcement" className="w-full flex justify-center pt-4">
      <div className="glass-panel w-full p-8 md:p-12 text-center flex flex-col items-center">
        {/* Golden Mandala Icon */}
        <div className="w-16 h-16 text-[#D4AF37] mb-4 animate-mandala">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1" />
            <path d="M50 5 L53 35 L50 40 L47 35 Z" fill="currentColor" />
            <path d="M50 95 L53 65 L50 60 L47 65 Z" fill="currentColor" />
            <path d="M5 50 L35 53 L40 50 L35 47 Z" fill="currentColor" />
            <path d="M95 50 L65 53 L60 50 L65 47 Z" fill="currentColor" />
            <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8" />
          </svg>
        </div>

        <p className="font-[family-name:var(--font-cormorant)] text-2xl md:text-xl  tracking-widest text-[#6f0056] mb-2 font-bold">
          {data.heroSubtext}
        </p>

        <div className="inline-block px-4 py-1.5 bg-[#C2185B]/10 border border-[#C2185B]/25 rounded-full text-xs md:text-sm font-semibold text-[#C2185B] tracking-wide mb-6">
          {data.badgeText}
        </div>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/28 border border-[#D4AF37]/30 rounded-full font-[family-name:var(--font-cinzel)] text-sm md:text-base font-semibold text-[#2D1525] shadow-sm mb-2">
          <span>🗓️</span>
          <span>{data.announcementDate}</span>
        </div>

        <p className="font-[family-name:var(--font-cormorant)] text-sm md:text-base text-[#AA820A] font-semibold">
          {data.timingPill}
        </p>
      </div>
    </section>
  );
}

