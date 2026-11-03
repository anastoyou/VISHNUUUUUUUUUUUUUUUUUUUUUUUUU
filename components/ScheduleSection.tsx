'use client';

import React from 'react';
import { WeddingEventData } from '@/lib/events';

interface ScheduleSectionProps {
  data: WeddingEventData;
}

export default function ScheduleSection({ data }: ScheduleSectionProps) {
  return (
    <section id="events" className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold text-[#9C1448] tracking-wide">
          {data.timelineTitle}
        </h2>
        <p className="font-[family-name:var(--font-cormorant)] text-base md:text-lg text-[#7E5874] mt-1">
          {data.timelineSubtitle}
        </p>
        <div className="flex items-center justify-center gap-3 max-w-[200px] mx-auto mt-3">
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          <span className="text-[#D4AF37] text-xs">◆</span>
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        </div>
      </div>

      {/* Timeline List */}
      <div className="w-full flex flex-col gap-5 mb-8">
        {(data.timeline || []).map((item, index) => (
          <div
            key={index}
            className={`glass-panel p-6 flex flex-col gap-4 ${
              item.highlight
                ? '!bg-[#FFFDF8]/[0.24] border-[#D4AF37]/50 shadow-[0_8px_25px_rgba(170,130,10,0.08)]'
                : ''
            }`}
          >
            {/* Time Badge */}
            <div className="self-start">
              <span
                className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                  item.highlight
                    ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#AA820A]'
                    : 'bg-[#C2185B]/10 border border-[#C2185B]/25 text-[#C2185B]'
                }`}
              >
                {item.time}
              </span>
            </div>

            {/* Content Row */}
            <div className="flex items-start gap-4 md:gap-5">
              <div
                className={`w-12 h-12 min-w-12 rounded-full flex items-center justify-center text-xl md:text-2xl shadow-sm ${
                  item.highlight
                    ? 'bg-gradient-to-br from-[#FFF9E6] to-[#FFE79A] border border-[#D4AF37]'
                    : 'bg-white/60 border border-white/70'
                }`}
              >
                {item.icon}
              </div>

              <div className="flex-1">
                {item.ribbon && (
                  <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-[#AA820A] mb-1">
                    {item.ribbon}
                  </span>
                )}
                <h3 className="font-[family-name:var(--font-cinzel)] text-lg md:text-xl font-bold text-[#9C1448] mb-1">
                  {item.title}
                </h3>
                {item.sub && (
                  <p className="font-[family-name:var(--font-cormorant)] text-base font-bold text-[#C2185B] mb-1">
                    {item.sub}
                  </p>
                )}
                <p className="text-xs md:text-sm text-[#58334E] leading-relaxed mb-2">
                  {item.desc}
                </p>
                <span className="inline-block text-[11px] px-2.5 py-0.5 bg-white/40 border border-white/60 rounded-full text-[#7E5874]">
                  {item.tag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

