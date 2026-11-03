'use client';

import React from 'react';
import { WeddingEventData } from '@/lib/events';
import ImagePlaceholder from './ImagePlaceholder';
import CountdownTimer from './CountdownTimer';
import RsvpSection from './RsvpSection';

interface InvitationCardProps {
  data: WeddingEventData;
}

export default function InvitationCard({ data }: InvitationCardProps) {
  const isReception = data.id === 'reception';

  // Helper to generate Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    data.calendarSummary
  )}&details=${encodeURIComponent(data.calendarDetails)}&location=${encodeURIComponent(
    data.calendarLocation
  )}&dates=${data.startUtc}/${data.endUtc}`;

  return (
    <article
      id="invitation-card"
      className="invite relative w-full text-center"
    >
      {/* Sparkles background layer */}
      <div className="sparkles" aria-hidden="true" />

      {/* Inner Content Frame: Seamlessly part of the shade, zero side gaps on mobile */}
      <div className="invite-inner-frame relative mx-auto">


        {/* 1. Top-Left Floral Corner (using /assets/1.png - enlarged and bled off-screen) */}
        <div className="absolute  top-[-50px] left-[-150px] sm:top-[-54px] sm:left-[-64px] md:top-[-70px] md:left-[-200px] z-20 pointer-events-none">
          <ImagePlaceholder
            slot="flower-tl"
            src="/assets/1.png"
            label="Top-Left Floral"
            className="w-48 h-auto sm:w-64 md:w-80 max-w-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.75)]"
          />
        </div>

        {/* 2. Top-Right Hanging Light / Lantern (using /assets/hanging.png - increased size with warm glow) */}
        <div className="absolute top-[20px] animate-pulse sm:top-[-10px] right-[-15px] sm:right-[18px] md:right-[-26px] z-20 pointer-events-none">
          <ImagePlaceholder
            slot="lantern"
            src="/assets/hanging.png"
            label="Hanging Light"
            className="w-28 h-auto sm:w-36 md:w-44 max-w-none animate-lantern-glow"
          />
        </div>

        {/* 3. Bottom-Right Floral Corner (using /assets/1.png - enlarged and bled off-screen) */}
        {/* <div className="absolute bottom-[-36px] right-[-36px] sm:bottom-[-54px] sm:right-[-64px] md:bottom-[-70px] md:right-[-85px] z-20 pointer-events-none">
          <ImagePlaceholder
            slot="flower-br"
            src="/assets/1.png"
            label="Bottom-Right Floral"
            className="w-48 h-auto sm:w-64 md:w-80 max-w-none rotate-180 drop-shadow-[0_12px_24px_rgba(0,0,0,0.75)]"
          />
        </div> */}

        {/* Main Content Area */}
        <div className="relative z-10 px-2 sm:px-4">
          {/* Eyebrow */}
          <p className="eyebrow text-[#ead7bd]">
            {isReception ? (
              <>


                we invite you to join us for the wedding reception of
              </>
            ) : (
              <>

                we cordially invite you to celebrate the wedding ceremony of
              </>
            )}
          </p>

          {/* Couple Names */}
          <h2 className="script names text-[#f1dfc5]">
            Vishnu <span className="amp font-serif italic text-3xl my-1 text-[#d8bd91]">&amp;</span> Vani
          </h2>

          {/* Intro */}


          <div className="gold-line" />

          {/* Dedicated Single Function Schedule Block */}

          <>
            {!isReception &&
              <div className="my-5 max-w-sm mx-auto p-4 sm:p-5 rounded-xl bg-[#25050b]/60 border border-[#e8d3aa]/40 shadow-inner backdrop-blur-xs">
                <p className="event-label text-[#d9bd92] text-xs uppercase tracking-[0.2em] font-semibold">
                  Thalikettu
                </p>
                <p className="event-date text-[#fff0df] font-serif text-2xl sm:text-3xl font-semibold mt-1">
                  {data.templeMentioned}
                </p>
                <p className="event-time text-[#f1dfc5] text-base sm:text-lg font-medium mt-1">
                  {data.heroDate}
                </p>
                <p className="event-time text-[#f1dfc5] text-base sm:text-lg font-medium mt-1">
                  06:00 AM to 06:30 AM
                </p>


                <div className="mt-3 flex items-center justify-center gap-3">
                  <a
                    className="map inline-flex items-center gap-1.5 px-3 py-1 bg-[#2b070f] border border-[#e8d3aa]/50 rounded-full text-xs text-[#f0dcb8] hover:text-white hover:border-[#e8d3aa] transition-colors"
                    href='https://maps.app.goo.gl/SCAK7u29Jju8FVkV7'
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>📍Temple Location</span>
                    <span className="text-[10px]">↗</span>
                  </a>

                </div>

              </div>
            }
          </>


          < div className="my-5 max-w-sm mx-auto p-4 sm:p-5 rounded-xl bg-[#25050b]/60 border border-[#e8d3aa]/40 shadow-inner backdrop-blur-xs">
            <p className="event-label text-[#d9bd92] text-xs uppercase tracking-[0.2em] font-semibold">
              {data.tagline}
            </p>
            <p className="event-date text-[#fff0df] font-serif text-2xl sm:text-3xl font-semibold mt-1">
              {data.announcementDate}
            </p>
            <p className="event-time text-[#f1dfc5] text-base sm:text-lg font-medium mt-1">
              {data.timingPill}
            </p>


            <div className="space-y-5 text-center">
              <div>

                <h3 className="venue-name font-serif text-2xl sm:text-3xl font-semibold text-[#fff0df] mt-1">
                  {data.venueName}
                </h3>
                <p className="venue-place text-[#e1ceb5] text-base mt-1">
                  {data.venueLocationSub}
                </p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <a
                    className="map inline-flex items-center gap-1.5 px-3 py-1 bg-[#2b070f] border border-[#e8d3aa]/50 rounded-full text-xs text-[#f0dcb8] hover:text-white hover:border-[#e8d3aa] transition-colors"
                    href={data.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>📍 View on Google Maps</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                  <a
                    className="map inline-flex items-center gap-1.5 px-3 py-1 bg-[#2b070f] border border-[#e8d3aa]/50 rounded-full text-xs text-[#f0dcb8] hover:text-white hover:border-[#e8d3aa] transition-colors"
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>📅 Add to Calendar</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

          {/* Live Countdown Timer */}
          <CountdownTimer
            targetDate={data.countdownTarget}
            heading={data.countdownHeading}
          />

          <div className="gold-line" />

          {/* Venue Information */}

          <div className="gold-line" />

          <div className="w-full space-y-4 my-6">
            {/* Box 1: Groom Box */}
            <div className="max-w-md mx-auto p-5 sm:p-6 rounded-2xl bg-[#25050b]/60 border border-[#e8d3aa]/40 text-center shadow-inner backdrop-blur-xs">
              <span className="inline-block px-3 py-1 rounded-full bg-[#e8d3aa]/15 border border-[#e8d3aa]/30 text-[#e8d3aa] text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">
                The Groom
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#fff0df] mb-1">
                {data.groom.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#e6d3bd] leading-relaxed mt-1">
                Son of<br />
                <strong className="text-[#f1dfc5] font-medium">{data.groom.parents}</strong>
              </p>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#e8d3aa]/40 to-transparent mx-auto my-3" />
              <p className="text-xs text-[#d9bd92]/90 leading-relaxed">
                Grandson of<br />
                {data.groom.grandparents.map((gp, i) => (
                  <span key={i} className="block text-[#e6d3bd]">{gp}</span>
                ))}
              </p>
            </div>

            {/* Elegant connector ornament between the 2 boxes */}
            <div className="flex items-center justify-center gap-3 max-w-[200px] mx-auto opacity-75">
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#e8d3aa]/40 to-transparent" />
              <span className="text-[#e8d3aa] text-xs font-serif italic">&amp;</span>
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#e8d3aa]/40 to-transparent" />
            </div>

            {/* Box 2: Bride Box */}
            <div className="max-w-md mx-auto p-5 sm:p-6 rounded-2xl bg-[#25050b]/60 border border-[#e8d3aa]/40 text-center shadow-inner backdrop-blur-xs">
              <span className="inline-block px-3 py-1 rounded-full bg-[#e8d3aa]/15 border border-[#e8d3aa]/30 text-[#e8d3aa] text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">
                The Bride
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#fff0df] mb-1">
                {data.bride.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#e6d3bd] leading-relaxed mt-1">
                Daughter of<br />
                <strong className="text-[#f1dfc5] font-medium">{data.bride.parents}</strong>
              </p>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#e8d3aa]/40 to-transparent mx-auto my-3" />
              <p className="text-xs text-[#d9bd92]/90 leading-relaxed">
                Granddaughter of<br />
                {data.bride.grandparents.map((gp, i) => (
                  <span key={i} className="block text-[#e6d3bd]">{gp}</span>
                ))}
              </p>
            </div>
          </div>

          <div className="gold-line" />

          {/* Interactive RSVP Form with direct Database Integration */}
          <RsvpSection data={data} />

          <div className="gold-line" />

          {/* With Love & RSVP */}
          <div className="space-y-3">
            <div>
              <p className="venue-title">With Love</p>
              <p className="venue-name font-serif text-xl sm:text-2xl text-[#f1dfc5] mt-1">
                {data.withLove.join(' & ')}
              </p>
            </div>

            <div className="pt-2">
              <p className="small uppercase tracking-widest text-[#d9bd92] font-semibold text-[11px]">
                Contact
              </p>
              <div className="flex items-center justify-center gap-4 mt-2">
                {data.contacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <a
                      href={`tel:${contact}`}
                      className="text-xl text-[#e8d3aa] hover:text-white underline underline-offset-4 decoration-[#e8d3aa]/40 transition-colors"
                    >
                      📞 {contact}
                    </a>
                    <a
                      href={`https://wa.me/91${contact.replace(/\D/g, '')}?text=${encodeURIComponent(
                        data.whatsappMsg
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl text-[#70e000] hover:scale-110 transition-transform"
                      title="Send WhatsApp message"
                    >
                      💬
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <p className="small text-xs text-[#ddc9b1] leading-relaxed">
                Family Address<br />
                {data.familyAddress.line1}<br />
                {data.familyAddress.line2}<br />
                {data.familyAddress.line3}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article >
  );
}

