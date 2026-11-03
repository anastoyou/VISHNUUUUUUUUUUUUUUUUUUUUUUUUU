'use client';

import React from 'react';
import { WeddingEventData } from '@/lib/events';

interface FamilyUnionSectionProps {
  data: WeddingEventData;
}

export default function FamilyUnionSection({ data }: FamilyUnionSectionProps) {
  return (
    <section id="story" className="w-full flex justify-center">
      <div className="glass-panel w-full p-8 md:p-12 text-center">
        <div className="text-xs tracking-[4px] text-[#D4AF37] font-semibold mb-2">
          ❖ ❖ ❖
        </div>

        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold text-[#9C1448] tracking-wide mb-3">
          The Auspicious Union
        </h2>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 max-w-[240px] mx-auto mb-8">
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          <span className="text-[#D4AF37] text-xs">◆</span>
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        </div>

        {/* Family Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 mb-8">
          {/* Groom's Side */}
          <div className="glass-subcard p-6 text-center">
            <span className="inline-block text-[11px] uppercase tracking-wider px-3 py-1 bg-[#C2185B]/10 text-[#C2185B] rounded-full font-semibold mb-2">
              The Groom
            </span>
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl font-bold text-[#C2185B] mb-1">
              Sreeraj
            </h3>
            <p className="font-[family-name:var(--font-cormorant)] text-base text-[#7E5874] italic">
              Son of
            </p>
            <p className="font-[family-name:var(--font-cormorant)] text-lg font-bold text-[#2D1525] mt-1">
              Mrs. Ramadevi Kuttan Marar
            </p>
            <p className="font-[family-name:var(--font-cormorant)] text-base text-[#58334E]">
              &amp; Late Kuttan Marar
            </p>
            <p className="text-xs text-[#7E5874] mt-2 leading-relaxed">
              Vadakkoot Marath House<br />
              Karathur, Kainikkara
            </p>
          </div>

          {/* Center Heart Divider */}
          <div className="flex md:flex-col items-center justify-center gap-3">
            <span className="w-10 md:w-[1px] h-[1px] md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />
            <span className="text-2xl animate-heart">❤️</span>
            <span className="w-10 md:w-[1px] h-[1px] md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />
          </div>

          {/* Bride's Side */}
          <div className="glass-subcard p-6 text-center">
            <span className="inline-block text-[11px] uppercase tracking-wider px-3 py-1 bg-[#C2185B]/10 text-[#C2185B] rounded-full font-semibold mb-2">
              The Bride
            </span>
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl font-bold text-[#C2185B] mb-1">
              Suji
            </h3>
            <p className="font-[family-name:var(--font-cormorant)] text-base text-[#7E5874] italic">
              Daughter of
            </p>
            <p className="font-[family-name:var(--font-cormorant)] text-lg font-bold text-[#2D1525] mt-1">
              Mrs. Thankamani Govindankutty Nair
            </p>
            <p className="font-[family-name:var(--font-cormorant)] text-base text-[#58334E]">
              &amp; Late Govindankutty Nair
            </p>
            <p className="text-xs text-[#7E5874] mt-2 leading-relaxed">
              Purassery House<br />
              Deshamangalam, Thrissur
            </p>
          </div>
        </div>

        {/* Invitation Host Note */}
        <div className="glass-subcard border-l-4 border-l-[#D4AF37] rounded-r-2xl rounded-l-none p-6 text-center">
          <p className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl italic text-[#2D1525] leading-relaxed">
            {data.quote}
          </p>
          <div className="mt-4 flex flex-col">
            <strong className="font-[family-name:var(--font-cinzel)] text-base text-[#9C1448]">
              {data.inviterName}
            </strong>
            <span className="text-xs text-[#7E5874]">{data.inviterHouse}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

