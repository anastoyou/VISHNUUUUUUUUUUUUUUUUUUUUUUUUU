'use client';

import React from 'react';
import { WeddingEventData } from '@/lib/events';
import { trackEvent } from '@/lib/analytics';

interface ClosingSectionProps {
  data: WeddingEventData;
}

export default function ClosingSection({ data }: ClosingSectionProps) {
  const handleShare = async () => {
    trackEvent('share_click');
    const shareData = {
      title: data.pageTitle,
      text: `You are cordially invited to celebrate the ${data.tagline} of Sreeraj & Suji on December 30, 2026.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user dismissed share dialog
      }
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert('Invitation link copied to clipboard!'))
        .catch(() => prompt('Copy this invitation link:', window.location.href));
    }
  };

  return (
    <section id="closing" className="w-full flex justify-center pb-12">
      <div className="glass-panel w-full p-8 md:p-12 text-center flex flex-col items-center">
        <div className="text-3xl md:text-4xl animate-heart mb-3">💖</div>

        <p className="text-xs uppercase tracking-[3px] text-[#7E5874] font-semibold mb-2">
          With Best Compliments &amp; Warm Regards
        </p>

        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold text-[#9C1448] leading-tight mb-2">
          Vadakkoot Family <br />
          <span className="text-xl md:text-2xl text-[#9C1448]">&amp;</span>
          <br />
          K.P. Family
        </h2>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 max-w-[180px] my-4">
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          <span className="text-[#D4AF37] text-xs">❖</span>
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        </div>

        <p className="font-[family-name:var(--font-cormorant)] text-base md:text-lg text-[#58334E] leading-relaxed max-w-lg mb-8">
          Your warm wishes, prayers, and graceful presence on this special milestone are our greatest gift. We look
          forward to welcoming you!
        </p>

        {/* Share & Back to Top */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 hover:bg-white/90 border border-[#D4AF37]/35 rounded-full text-xs md:text-sm font-semibold text-[#9C1448] shadow-xs transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>📲</span>
            <span>Share Invitation</span>
          </button>

          <a
            href="#hero"
            className="inline-flex items-center px-4 py-2.5 bg-white/40 hover:bg-white/70 border border-white/50 rounded-full text-xs text-[#7E5874] transition-all duration-300 hover:text-[#C2185B]"
          >
            ↑ Back to Top
          </a>
        </div>

        <p className="text-[11px] text-[#7E5874] tracking-wide">
          Made with love for Sreeraj &amp; Suji • 2026
        </p>
      </div>
    </section>
  );
}

