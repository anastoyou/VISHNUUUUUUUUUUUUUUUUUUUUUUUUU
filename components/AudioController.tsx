'use client';

import React, { useEffect, useRef, useState } from 'react';
import { WeddingEventData } from '@/lib/events';
import { trackEvent } from '@/lib/analytics';

interface AudioControllerProps {
  data?: WeddingEventData;
  onOpen?: () => void;
}

export default function AudioController({ data, onOpen }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      trackEvent('audio_pause');
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          trackEvent('audio_play');
        })
        .catch((err) => console.log('Audio autoplay prevented:', err));
    }
  };

  const handleOpenInvitation = () => {
    trackEvent('invitation_opened', { eventType: data?.id || 'invitation' });
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          trackEvent('audio_play_on_open');
        })
        .catch((err) => console.log('Playback error:', err));
    }
    setIsExiting(true);
    setTimeout(() => {
      setIsOpened(true);
      document.body.style.overflow = '';
      onOpen?.();
    }, 600);
  };

  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpened]);

  return (
    <>
      <audio ref={audioRef} loop preload="auto" src="/assets/bgm.mp3" />

      {/* Initial Load "Open Invitation" Screen */}
      {!isOpened && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md transition-all duration-700 ease-out ${
            isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <div className="relative max-w-sm sm:max-w-md w-full bg-[#FCF8F2] border-2 border-[#D4AF37]/70 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(45,21,37,0.5)] text-center">
            {/* Elegant inner ornate border */}
            <div className="border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-7 flex flex-col items-center">
              <span className="text-3xl mb-2 animate-heart">💍</span>

              <p className="font-[family-name:var(--font-cormorant)] text-xs uppercase tracking-[4px] text-[#9C1448] font-bold mb-1">
                Wedding Invitation
              </p>

              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl font-bold text-[#2D1525] my-2 tracking-wide">
                Sreeraj & Suji
              </h2>

              <p className="font-[family-name:var(--font-cinzel)] text-xs text-[#7E5874] tracking-wider mb-6">
                {data?.heroDate || 'Wednesday, December 30, 2026'}
              </p>

              <button
                onClick={handleOpenInvitation}
                className="group relative flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#9C1448] via-[#C2185B] to-[#9C1448] text-white font-semibold text-sm sm:text-base tracking-wider uppercase rounded-full shadow-[0_8px_25px_rgba(194,24,91,0.35)] hover:shadow-[0_12px_30px_rgba(194,24,91,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-[#D4AF37]/50 cursor-pointer"
              >
                <span className="text-lg group-hover:scale-125 transition-transform duration-300">💌</span>
                <span>Open Invitation</span>
              </button>

              <p className="text-[11px] text-[#7E5874] tracking-wide mt-3 flex items-center justify-center gap-1.5 opacity-80">
                <span>♪</span>
                <span>Plays wedding music</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Audio Controller */}
      <button
        onClick={togglePlay}
        className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40 flex items-center gap-2.5 px-4 py-2 bg-white/75 backdrop-blur-md border border-[#D4AF37]/40 rounded-full shadow-[0_8px_20px_rgba(106,27,154,0.16)] text-[#9C1448] font-semibold text-xs md:text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:bg-white/90"
        aria-label="Toggle Background Music"
        title="Play / Pause Wedding Music"
      >
        <div className="flex items-end gap-[3px] h-4">
          <span className={`w-[3px] h-full bg-[#C2185B] rounded-sm origin-bottom ${isPlaying ? 'animate-bar-1' : 'scale-y-[0.25]'}`} />
          <span className={`w-[3px] h-full bg-[#C2185B] rounded-sm origin-bottom ${isPlaying ? 'animate-bar-2' : 'scale-y-[0.25]'}`} />
          <span className={`w-[3px] h-full bg-[#C2185B] rounded-sm origin-bottom ${isPlaying ? 'animate-bar-3' : 'scale-y-[0.25]'}`} />
          <span className={`w-[3px] h-full bg-[#C2185B] rounded-sm origin-bottom ${isPlaying ? 'animate-bar-4' : 'scale-y-[0.25]'}`} />
        </div>
        <span>{isPlaying ? 'Pause' : 'Music'}</span>
      </button>
    </>
  );
}

