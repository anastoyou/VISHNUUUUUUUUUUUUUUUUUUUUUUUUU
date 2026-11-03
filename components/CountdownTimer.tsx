'use client';

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string; // ISO string
  heading?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export default function CountdownTimer({ targetDate, heading }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isComplete: false,
      };
    };

    // Calculate immediately on client mount
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="my-5 w-full">
        {heading && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#d9bd92] mb-3 text-center">
            {heading}
          </p>
        )}
        <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-sm mx-auto">
          {['Days', 'Hours', 'Mins', 'Secs'].map((lbl, idx) => (
            <div
              key={idx}
              className="flex-1 py-2 px-1 rounded-lg bg-[#25050b]/60 border border-[#e8d3aa]/30 text-center"
            >
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#f1dfc5] leading-none">
                --
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-[#d9bd92]/80 mt-1">
                {lbl}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = [
    { label: 'Days', val: timeLeft.days },
    { label: 'Hours', val: timeLeft.hours },
    { label: 'Mins', val: timeLeft.minutes },
    { label: 'Secs', val: timeLeft.seconds },
  ];

  return (
    <div className="my-5 w-full">
      {heading && (
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#d9bd92] mb-3 text-center">
          {timeLeft.isComplete ? 'Celebrations Underway' : heading}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-sm mx-auto">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 py-2 px-1 rounded-lg bg-[#25050b]/60 border border-[#e8d3aa]/30 text-center backdrop-blur-xs shadow-inner"
          >
            <span className="block font-serif text-xl sm:text-2xl font-bold text-[#f1dfc5] leading-none">
              {String(item.val).padStart(2, '0')}
            </span>
            <span className="block text-[9px] uppercase tracking-wider text-[#d9bd92]/80 mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
