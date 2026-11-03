'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { WeddingEventData } from '@/lib/events';
import { getVisitorId, getSessionId, trackEvent } from '@/lib/analytics';

interface RsvpSectionProps {
  data: WeddingEventData;
}

export default function RsvpSection({ data }: RsvpSectionProps) {
  const pathname = usePathname();
  // Automatically determine event type from data.id or the dynamic path
  const dynamicEventType =
    data?.id || (pathname?.includes('reception') ? 'reception' : 'invitation');
  const eventLabel =
    dynamicEventType === 'reception' ? 'Wedding Reception' : 'Wedding Ceremony';

  const [name, setName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    setLoading(true);

    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          guest_count: attending === 'yes' ? 1 : 0,
          event_type: dynamicEventType, // taken automatically from dynamic path
          visitor_id: visitorId,
          session_id: sessionId,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit response.');
      }

      setSubmitted(true);
      trackEvent('attendance_submit_success', {
        name: name.trim(),
        attending,
        event_type: dynamicEventType,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      trackEvent('attendance_submit_error', { error: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setAttending('yes');
  };

  return (
    <section id="attendance" className="w-full flex justify-center">
      <div className="glass-panel w-full p-6 sm:p-8 md:p-10 text-center relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#D4AF37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-xs tracking-[4px] text-[#D4AF37] font-semibold mb-2">
            🌸 BE OUR GUEST
          </div>

          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold text-[#9C1448] tracking-wide">
            Confirm Your Presence
          </h2>
          <p className="font-[family-name:var(--font-cormorant)] text-base md:text-lg text-[#7E5874] mt-1 mb-3">
            {eventLabel} • Please let us know if you can grace this special occasion
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 max-w-[200px] mx-auto mb-6">
            <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <span className="text-[#D4AF37] text-xs">◆</span>
            <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </div>

          {submitted ? (
            <div className="glass-subcard max-w-md mx-auto p-6 sm:p-8 text-center border border-[#D4AF37]/50 shadow-[0_8px_30px_rgba(212,175,55,0.15)]">
              <div className="text-4xl mb-3 animate-heart">💖</div>
              <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#9C1448] mb-2">
                Thank You, {name}!
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-base md:text-lg text-[#58334E] leading-relaxed mb-5">
                {attending === 'yes' ? (
                  <>
                    Your response for the <strong>{eventLabel}</strong> has been received with love. We look forward to celebrating with you!
                  </>
                ) : (
                  <>
                    Your response for the <strong>{eventLabel}</strong> has been noted with gratitude. Thank you for sending your prayers and blessings!
                  </>
                )}
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 bg-white/70 hover:bg-white/90 border border-[#D4AF37]/50 text-[#9C1448] text-xs font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto text-left flex flex-col gap-4">
              {errorMsg && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-700 text-xs rounded-xl text-center font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Attendance Choice */}
              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#58334E] uppercase mb-2">
                  Will you attend?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAttending('yes');
                      trackEvent('attendance_option_selected', { option: 'yes', event: dynamicEventType });
                    }}
                    className={`py-3 px-4 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      attending === 'yes'
                        ? 'bg-gradient-to-r from-[#9C1448]/15 via-[#C2185B]/15 to-[#D4AF37]/15 border-[#C2185B] shadow-sm font-bold text-[#9C1448]'
                        : 'bg-white/40 border-white/60 hover:bg-white/70 text-[#58334E]'
                    }`}
                  >
                    <span>🌸</span>
                    <span className="text-xs">Yes, Attending</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAttending('no');
                      trackEvent('attendance_option_selected', { option: 'no', event: dynamicEventType });
                    }}
                    className={`py-3 px-4 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      attending === 'no'
                        ? 'bg-gradient-to-r from-[#9C1448]/15 via-[#C2185B]/15 to-[#D4AF37]/15 border-[#C2185B] shadow-sm font-bold text-[#9C1448]'
                        : 'bg-white/40 border-white/60 hover:bg-white/70 text-[#58334E]'
                    }`}
                  >
                    <span>💌</span>
                    <span className="text-xs">Unable to Attend</span>
                  </button>
                </div>
              </div>

              {/* Guest Name Only */}
              <div>
                <label htmlFor="attendance-name" className="block text-xs font-semibold tracking-wider text-[#58334E] uppercase mb-1.5">
                  Your Name / Family Name *
                </label>
                <input
                  id="attendance-name"
                  type="text"
                  required
                  placeholder="e.g. Anand & Family"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/75 focus:bg-white border border-[#D4AF37]/45 focus:border-[#C2185B] rounded-xl text-xs md:text-sm text-[#2D1525] outline-none transition-all shadow-inner"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#E91E63] via-[#C2185B] to-[#880E4F] text-white text-xs md:text-sm font-semibold rounded-full shadow-[0_6px_20px_rgba(194,24,91,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(194,24,91,0.45)] cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Recording Your Response...</span>
                    </>
                  ) : (
                    <>
                      <span>🌸</span>
                      <span>Confirm Attendance</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
