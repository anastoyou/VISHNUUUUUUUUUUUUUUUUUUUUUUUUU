'use client';

import React from 'react';
import { WeddingEventData } from '@/lib/events';
import { trackEvent } from '@/lib/analytics';

interface VenueSectionProps {
  data: WeddingEventData;
}

export default function VenueSection({ data }: VenueSectionProps) {
  return (
    <section id="venue" className="w-full flex justify-center">
      <div className="glass-panel w-full p-8 md:p-12 text-center">
        <div className="text-xs tracking-[4px] text-[#D4AF37] font-semibold mb-2">
          📍 VENUE &amp; DIRECTIONS
        </div>

        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold text-[#9C1448] tracking-wide">
          {data.venueName}
        </h2>
        <p className="font-[family-name:var(--font-cormorant)] text-base md:text-lg text-[#7E5874] mt-1 mb-3">
          {data.venueLocationSub}
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 max-w-[200px] mx-auto mb-8">
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          <span className="text-[#D4AF37] text-xs">◆</span>
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        </div>

        {/* Info Blocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
          <div className="glass-subcard p-5 text-center">
            <div className="text-3xl mb-2">🏛️</div>
            <h4 className="font-[family-name:var(--font-cinzel)] text-sm md:text-base font-bold text-[#9C1448] mb-1">
              {data.venueBlockTitle}
            </h4>
            <p className="text-xs text-[#58334E] whitespace-pre-line leading-relaxed">
              {data.venueBlockDesc}
            </p>
          </div>

          <div className="glass-subcard p-5 text-center">
            <div className="text-3xl mb-2">⏰</div>
            <h4 className="font-[family-name:var(--font-cinzel)] text-sm md:text-base font-bold text-[#9C1448] mb-1">
              Timing
            </h4>
            <p className="text-xs text-[#58334E] whitespace-pre-line leading-relaxed">
              {data.venueTiming}
            </p>
          </div>

          <div className="glass-subcard p-5 text-center sm:col-span-2 md:col-span-1">
            <div className="text-3xl mb-2">📞</div>
            <h4 className="font-[family-name:var(--font-cinzel)] text-sm md:text-base font-bold text-[#9C1448] mb-1">
              Contact
            </h4>
            <p className="text-xs text-[#58334E] leading-relaxed">
              Ramadevi Kuttan Marar<br />
              +91 7356721868
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <a
            href={data.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('map_open', { venue: data.venueName, mapUrl: data.mapUrl })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#E91E63] via-[#C2185B] to-[#880E4F] text-white text-xs md:text-sm font-semibold rounded-full shadow-[0_6px_18px_rgba(194,24,91,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(194,24,91,0.45)]"
          >
            <span>🗺️</span>
            <span>Open in Maps</span>
          </a>

          <a
            href={`tel:${data.phone}`}
            onClick={() => trackEvent('phone_call', { phone: data.phone })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/70 hover:bg-white/90 border border-[#D4AF37]/40 text-[#2D1525] text-xs md:text-sm font-semibold rounded-full shadow-xs transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>📞</span>
            <span>Call (+91 7356721868)</span>
          </a>

          <a
            href={`https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_wishes_click', { number: data.whatsappNumber })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs md:text-sm font-semibold rounded-full shadow-[0_6px_18px_rgba(37,211,102,0.3)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>💬</span>
            <span>Send Wishes</span>
          </a>
        </div>
      </div>
    </section>
  );
}

