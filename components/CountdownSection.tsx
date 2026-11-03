'use client';

import React, { useEffect, useState } from 'react';
import { WeddingEventData } from '@/lib/events';
import { trackEvent } from '@/lib/analytics';

interface CountdownSectionProps {
  data: WeddingEventData;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownSection({ data }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(data.countdownTarget).getTime();

    const updateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [data.countdownTarget]);

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(data.calendarSummary);
    const details = encodeURIComponent(data.calendarDetails);
    const location = encodeURIComponent(data.calendarLocation);

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${data.startUtc}/${data.endUtc}&details=${details}&location=${location}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Vishnu & Vani Wedding//EN',
      'BEGIN:VEVENT',
      `UID:${data.id}-vishnu-vani-20261230`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${data.startUtc}`,
      `DTEND:${data.endUtc}`,
      `SUMMARY:${data.calendarSummary}`,
      `DESCRIPTION:${data.calendarDetails.replace(/\n/g, '\\n')}`,
      `LOCATION:${data.calendarLocation}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const userChoice = confirm('Click OK to open Google Calendar, or Cancel to download an iCal (.ics) file.');
    if (userChoice) {
      trackEvent('calendar_add_google', { eventId: data.id });
      window.open(googleCalUrl, '_blank');
    } else {
      trackEvent('calendar_add_ics', { eventId: data.id });
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `${data.id}-vishnu-vani.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="glass-panel w-full p-8 md:p-10 text-center mb-8">
      <h3 className="font-[family-name:var(--font-cinzel)] text-lg md:text-xl font-bold text-[#C2185B] tracking-wide mb-6">
        {data.countdownHeading}
      </h3>

      {/* Timer Grid */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 mb-8">
        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[70px] p-2.5 sm:p-3 bg-white/25 border border-white/35 rounded-xl shadow-xs">
          <span className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#9C1448] leading-none">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#7E5874] font-semibold mt-1.5">
            Days
          </span>
        </div>

        <span className="font-[family-name:var(--font-cinzel)] text-xl sm:text-2xl font-bold text-[#D4AF37] -mt-4">:</span>

        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[70px] p-2.5 sm:p-3 bg-white/25 border border-white/35 rounded-xl shadow-xs">
          <span className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#9C1448] leading-none">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#7E5874] font-semibold mt-1.5">
            Hours
          </span>
        </div>

        <span className="font-[family-name:var(--font-cinzel)] text-xl sm:text-2xl font-bold text-[#D4AF37] -mt-4">:</span>

        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[70px] p-2.5 sm:p-3 bg-white/25 border border-white/35 rounded-xl shadow-xs">
          <span className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#9C1448] leading-none">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#7E5874] font-semibold mt-1.5">
            Minutes
          </span>
        </div>

        <span className="font-[family-name:var(--font-cinzel)] text-xl sm:text-2xl font-bold text-[#D4AF37] -mt-4">:</span>

        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[70px] p-2.5 sm:p-3 bg-white/25 border border-white/35 rounded-xl shadow-xs">
          <span className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#9C1448] leading-none">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#7E5874] font-semibold mt-1.5">
            Seconds
          </span>
        </div>
      </div>

      {/* Add to Calendar Button */}
      <button
        onClick={handleAddToCalendar}
        className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/35 hover:bg-white/50 border border-[#D4AF37]/35 rounded-full text-xs md:text-sm font-semibold text-[#2D1525] shadow-xs transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
      >
        <span>📅</span>
        <span>Add to Google Calendar / iCal</span>
      </button>
    </div>
  );
}

