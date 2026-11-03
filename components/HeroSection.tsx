'use client';

import React from 'react';
import { WeddingEventData } from '@/lib/events';

interface HeroSectionProps {
  data: WeddingEventData;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const isReception = data.id === 'reception';

  return (
    <section
      id="hero"
      className="min-h-[100svh] w-full flex flex-col justify-between items-center text-center px-4 pt-12 pb-8 relative z-10"
    >
      {/* Top Function Badge */}
      <div className="mt-2">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#190409]/80 border border-[#e8d3aa]/40 text-[11px] uppercase tracking-[0.22em] text-[#e8d3aa] font-semibold backdrop-blur-xs shadow-md">
          {isReception ? 'Wedding Reception Invitation' : 'Wedding Ceremony Invitation'}
        </span>
      </div>

      {/* Center: Full View Artwork & Couple Names */}
      <div className="flex flex-col items-center justify-center my-auto py-6 max-w-xl">



        {/* Grand Calligraphy Names */}
        <div className="my-2">
          <h1 className="font-script text-7xl sm:text-7xl  font-semibold md:text-8xl text-[#fff0df] leading-none tracking-normal drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Vishnu
          </h1>
          <span className="block my-1 font-serif italic text-2xl sm:text-3xl text-[#d8bd91] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            &amp;
          </span>
          <h1 className="font-script text-7xl sm:text-7xl  font-semibold md:text-8xl text-[#fff0df] leading-none tracking-normal drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Vani
          </h1>
        </div>

        {/* Date & Muhurtham pill */}
        <div className="mt-4 px-5 py-2 rounded-full bg-[#190409]/75 border border-[#e8d3aa]/50 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <p className="font-serif text-sm sm:text-base tracking-widest text-[#f1dfc5] font-semibold">
            {data.heroDate}
          </p>
          <p className="text-xs text-[#d8bd91] tracking-wider mt-0.5">
            {data.timingPill}
          </p>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <a
        href="#invitation-card"
        className="group flex flex-col items-center gap-2 text-[#e8d3aa]/85 text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#fff0df]"
      >
        <span className="tracking-[0.25em] text-[11px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          Scroll to view invitation
        </span>
        <div className="w-5 h-8 border border-[#e8d3aa]/60 rounded-full relative bg-[#190409]/40 backdrop-blur-xs">
          <div className="w-1 h-2 bg-[#e8d3aa] rounded-full absolute top-1.5 left-1/2 -translate-x-1/2 animate-bounce" />
        </div>
      </a>
    </section>
  );
}
