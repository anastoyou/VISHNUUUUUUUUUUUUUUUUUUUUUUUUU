'use client';

import React, { useState } from 'react';
import { WeddingEventData } from '@/lib/events';
import { getVisitorId, getSessionId, trackEvent } from '@/lib/analytics';

interface RsvpSectionProps {
  data: WeddingEventData;
}

export default function RsvpSection({ data }: RsvpSectionProps) {
  const isReception = data.id === 'reception';
  const eventLabel = isReception ? 'Wedding Reception' : 'Wedding Ceremony';

  const [name, setName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState<number>(1);
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
          guest_count: attending === 'yes' ? guestCount : 0,
          event_type: data.id,
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
        event_type: data.id,
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
    setGuestCount(1);
    setAttending('yes');
  };

  return (
    <section id="rsvp-section" className="w-full my-6 text-center">
      <div className="max-w-md mx-auto p-5 sm:p-7 rounded-2xl bg-[#25050b]/65 border border-[#e8d3aa]/40 backdrop-blur-md shadow-inner text-[#fff0df]">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#d9bd92] font-semibold mb-1">
          RSVP
        </p>

        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#f1dfc5] mb-1">
          Confirm Your Presence
        </h3>

        <p className="text-xs text-[#ead7bd]/80 mb-5">
          {eventLabel} • Please let us know if you will grace the occasion
        </p>

        {submitted ? (
          <div className="py-4 text-center animate-fade-in">
            <span className="text-4xl block mb-2 animate-heart">💖</span>
            <h4 className="font-serif text-xl font-bold text-[#f1dfc5] mb-2">
              Thank You, {name}!
            </h4>
            <p className="text-xs sm:text-sm text-[#e6d3bd] leading-relaxed mb-5">
              {attending === 'yes' ? (
                <>
                  Your RSVP for the <strong>{eventLabel}</strong> ({guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}) has been joyfully recorded in our database. We look forward to celebrating with you!
                </>
              ) : (
                <>
                  Your response has been noted with gratitude. Thank you for your heartfelt prayers and blessings for Vishnu &amp; Vani!
                </>
              )}
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2 rounded-full bg-[#1c040a] hover:bg-[#3b0912] border border-[#e8d3aa]/50 text-[#e8d3aa] text-xs font-semibold transition-colors cursor-pointer"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-left space-y-4">
            {errorMsg && (
              <div className="p-2.5 bg-red-950/80 border border-red-500/50 text-red-200 text-xs rounded-lg text-center font-medium">
                {errorMsg}
              </div>
            )}

            {/* Attendance Choice Buttons */}
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-[#d9bd92] uppercase mb-1.5">
                Will you be attending? *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                    attending === 'yes'
                      ? 'bg-gradient-to-r from-[#d8bd91] via-[#f1dfc5] to-[#d8bd91] text-[#25050b] font-bold border-[#fff0df] shadow'
                      : 'bg-[#190409]/60 border-[#e8d3aa]/30 text-[#e6d3bd] hover:border-[#e8d3aa]/60'
                  }`}
                >
                  <span>🌸</span>
                  <span>Joyfully Attending</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                    attending === 'no'
                      ? 'bg-[#3b0912] border-[#e8d3aa] text-[#f1dfc5] font-bold shadow'
                      : 'bg-[#190409]/60 border-[#e8d3aa]/30 text-[#e6d3bd] hover:border-[#e8d3aa]/60'
                  }`}
                >
                  <span>💌</span>
                  <span>Regretfully Declining</span>
                </button>
              </div>
            </div>

            {/* Guest Name */}
            <div>
              <label htmlFor="rsvp-name" className="block text-[11px] font-semibold tracking-wider text-[#d9bd92] uppercase mb-1">
                Your Name / Family Name *
              </label>
              <input
                id="rsvp-name"
                type="text"
                required
                placeholder="e.g. Anand & Family"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#190409]/80 border border-[#e8d3aa]/40 focus:border-[#f1dfc5] rounded-xl text-xs sm:text-sm text-[#fff0df] placeholder-[#d9bd92]/40 outline-none transition-colors"
              />
            </div>

            {/* Guest Count (Only if Attending) */}
            {attending === 'yes' && (
              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-[#d9bd92] uppercase mb-1">
                  Number of Guests Attending
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGuestCount(count)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        guestCount === count
                          ? 'bg-[#e8d3aa] text-[#25050b] border-[#fff0df] font-bold shadow'
                          : 'bg-[#190409]/60 border-[#e8d3aa]/30 text-[#e6d3bd] hover:border-[#e8d3aa]/60'
                      }`}
                    >
                      {count === 5 ? '5+' : count}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#d8bd91] via-[#f1dfc5] to-[#d8bd91] text-[#25050b] text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_4px_20px_rgba(232,211,170,0.3)] hover:shadow-[0_6px_25px_rgba(232,211,170,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#25050b] border-t-transparent rounded-full animate-spin" />
                    <span>Saving to Guestbook...</span>
                  </>
                ) : (
                  <>
                    <span>💌</span>
                    <span>Submit RSVP Response</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
