'use client';

import React from 'react';
import Image from 'next/image';
import { WeddingEventData } from '@/lib/events';

interface HeroSectionProps {
  data: WeddingEventData;
}

export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <section id="hero" className="min-h-[100svh] flex flex-col justify-between items-center text-center pb-8 pt-[48svh] px-4 relative">
      <div className="flex flex-col items-center gap-2 mb-4 animate-fade-in scale-105 sm:scale-115 md:scale-125 transition-transform duration-300">
        <Image
          src="/assets/save-the-date.png"
          alt="Save the Date"
          width={697}
          height={358}
          priority
          className="w-56 sm:w-72 md:w-84 lg:w-96 max-w-[90vw] h-auto object-contain drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)]"
        />

        <div className="flex flex-col items-center gap-2 my-2">
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
            Sreeraj
          </h1>
          <h1 className="animate-pulse font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
            ❤︎
          </h1>

          {/* <div className="flex items-center gap-3 my-1">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <span className="text-xl animate-heart">💍</span>
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </div> */}

          {/* <Image
            src="/assets/heart1.png"

            alt="Save the Date"
            width={697}
            height={358}
            priority
            className="w-14 animate-bounce sm:w-72 md:w-84 lg:w-96 max-w-[90vw] h-auto object-contain drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)]"
          /> */}



          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
            Suji
          </h1>
          {/* <h1 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
          </h1> */}
        </div>

        {/* 
        <p className="font-[family-name:var(--font-cinzel)] text-md md:text-sm font-bold tracking-wider text-[#2D1525] drop-shadow-[0_1px_8px_rgba(255,255,255,0.95)]">
          {data.heroDate}
        </p> */}
      </div>

      <a
        href="#announcement"
        className="flex flex-col items-center gap-2 text-[#7E5874] text-xs uppercase tracking-widest transition-all duration-300 hover:text-[#C2185B] hover:translate-y-1"
      >
        <span>Scroll to Explore</span>
        <div className="w-5 h-8 border-2 border-current rounded-full relative">
          <div className="w-1 h-1.5 bg-current rounded-full absolute top-1.5 left-1/2 -translate-x-1/2 animate-bounce" />
        </div>
      </a>
    </section>
  );
}

