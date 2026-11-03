'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EVENT_DATA, WeddingEventData } from '@/lib/events';
import { trackEvent } from '@/lib/analytics';

interface AudioControllerProps {
  data?: WeddingEventData;
  onOpen?: () => void;
  onOpeningStart?: () => void;
}

export default function AudioController({ data, onOpen, onOpeningStart }: AudioControllerProps) {
  const eventData = data || EVENT_DATA.invitation;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
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

    // Start background music immediately on user gesture
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          trackEvent('audio_play_on_open');
        })
        .catch((err) => console.log('Playback error:', err));
    }

    // Trigger 3D double-door open, center zoom-in, and smooth fade
    setIsOpening(true);
    onOpeningStart?.();

    // Allow 2.0s for the door inward swing + cinematic camera zoom into the temple light
    setTimeout(() => {
      setIsOpened(true);
      document.body.style.overflow = '';
      onOpen?.();
    }, 2000);
  };

  useEffect(() => {
    if (!isOpened) {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpened]);

  return (
    <>
      <audio ref={audioRef} loop preload="auto" src="/assets/bgm.mp3" />

      {/* Initial 3D Double-Door Center-Open Gateway Screen */}
      {!isOpened && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-0 overflow-hidden select-none transition-opacity duration-700 ${
            isOpening ? 'pointer-events-none' : ''
          }`}
        >
          {/* Ambient background sparkles */}
          <div className="absolute inset-0 sparkles opacity-40 pointer-events-none" />

          {/* 
            3D Portal Stage:
            Fitted to screen height (h-screen h-[100dvh] w-auto aspect-[687/1024] max-w-none).
            Has box-shadow to cover outside areas while leaving the doorway completely see-through to the page's HeroSection!
          */}
          <div className="door-portal-stage relative h-screen h-[100dvh] w-auto aspect-[687/1024] max-w-none flex items-center justify-center">
            {/* 
              DOOR-RELATED SECTION:
              Only the doors, arch frame, and prompt controls animate and zoom away!
            */}
            <div
              className={`door-elements-wrapper absolute inset-0 w-full h-full pointer-events-none ${
                isOpening ? 'door-elements-zoomed' : ''
              }`}
            >
              {/* 
                3D Double Doors (split into Left & Right center-opening leaves)
                Positioned to fill the inner cutout of image-arch.png.
                Rendered with soft blur on load, sharpening and swinging open on click!
              */}
              <div
                onClick={handleOpenInvitation}
                role="button"
                tabIndex={0}
                aria-label="Open Door"
                title="Click or Tap to Open Door"
                className="door-perspective absolute top-[18.55%] left-[26.35%] w-[44.7%] h-[72.2%] flex z-10 cursor-pointer pointer-events-auto group"
              >
                {/* Left Door Leaf (swings open to the left on origin-left, blurred on load) */}
                <div
                  className={`door-panel-left relative w-1/2 h-full shadow-2xl ${isOpening ? 'door-open-left' : 'door-blur-initial'
                    }`}
                >
                  <img
                    src="/assets/door-left.jpg"
                    alt="Left Temple Door"
                    className="w-full h-full object-fill pointer-events-none select-none"
                    style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                  />
                  {/* Traditional Brass Door Handle - Left leaf */}
                  <div className="absolute top-[52%] right-1.5 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f3d7a4] shadow-[0_0_4px_#f3d7a4]" />
                    <div className="w-1 h-5 bg-gradient-to-b from-[#d8bd91] via-[#f5e4c3] to-[#b38e55] rounded-sm shadow-md" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f3d7a4] shadow-[0_0_4px_#f3d7a4]" />
                  </div>
                </div>

                {/* Right Door Leaf (swings open to the right on origin-right, blurred on load) */}
                <div
                  className={`door-panel-right relative w-1/2 h-full shadow-2xl ${isOpening ? 'door-open-right' : 'door-blur-initial'
                    }`}
                >
                  <img
                    src="/assets/door-right.jpg"
                    alt="Right Temple Door"
                    className="w-full h-full object-fill pointer-events-none select-none"
                    style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                  />
                  {/* Traditional Brass Door Handle - Right leaf */}
                  <div className="absolute top-[52%] left-1.5 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f3d7a4] shadow-[0_0_4px_#f3d7a4]" />
                    <div className="w-1 h-5 bg-gradient-to-b from-[#d8bd91] via-[#f5e4c3] to-[#b38e55] rounded-sm shadow-md" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f3d7a4] shadow-[0_0_4px_#f3d7a4]" />
                  </div>
                </div>

                {/* Subtle gold center seam light when closed */}
                <div
                  className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#ffd700]/70 to-transparent transition-opacity duration-300 pointer-events-none ${isOpening ? 'opacity-0' : 'opacity-80'
                    }`}
                />
              </div>

              {/* 3. Outer Arch & Portal Frame (image-arch.png with cutout, blurred initially like the door) */}
              <img
                src="/assets/image-arch.png"
                alt="Temple Portal & Couple"
                className={`absolute inset-0 w-full h-full object-fill pointer-events-none z-20 drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] transition-[filter] duration-700 will-change-[filter] ${isOpening ? 'filter-none' : 'door-blur-initial'
                  }`}
              />

              {/* 4. Elegant Header above the Arch */}
              <div
                className={`absolute top-2 sm:top-4 inset-x-0 z-30 flex flex-col items-center text-center px-4 transition-all duration-500 ease-out pointer-events-none ${isOpening ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-[#e8d3aa]/80" />
                  <span className="text-sm sm:text-base animate-heart">💍</span>
                  <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-[#e8d3aa]/80" />
                </div>
                <h2 className="font-script text-2xl sm:text-3xl text-[#fff0df] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Vishnu &amp; Vani
                </h2>
                <p className="font-serif text-[9px] sm:text-[11px] uppercase tracking-[3px] text-[#e8d3aa] font-bold drop-shadow">
                  {data?.tagline || 'Wedding Invitation'}
                </p>
              </div>

              {/* 5. Sleek Floating "Open Invitation" Button at the Base (unobstructed door view) */}
              <div
                className={`absolute bottom-3 sm:bottom-6 inset-x-0 z-30 flex flex-col items-center text-center px-4 transition-all duration-500 ease-out pointer-events-auto ${isOpening ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
                  }`}
              >
                <button
                  onClick={handleOpenInvitation}
                  className="group relative flex items-center justify-center gap-2.5 px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-[#d8bd91] via-[#fff1d6] to-[#d8bd91] text-[#25050b] font-bold text-xs sm:text-sm tracking-widest uppercase rounded-full shadow-[0_6px_25px_rgba(232,211,170,0.4)] hover:shadow-[0_10px_32px_rgba(232,211,170,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#fff0df]/90 cursor-pointer"
                >
                  <span className="text-base group-hover:scale-125 transition-transform duration-300">✉️</span>
                  <span>Open Invitation</span>
                </button>

                <p className="text-[10px] sm:text-xs text-[#e8d3aa]/90 tracking-wider mt-1.5 flex items-center gap-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  <span>♪</span>
                  <span>Tap door or button to enter</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Audio Controller */}
      <button
        onClick={togglePlay}
        className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40 flex items-center gap-2.5 px-4 py-2 bg-[#25050b]/85 backdrop-blur-md border border-[#e8d3aa]/50 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.6)] text-[#e8d3aa] font-semibold text-xs md:text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:bg-[#3b0912]"
        aria-label="Toggle Background Music"
        title="Play / Pause Wedding Music"
      >
        <div className="flex items-end gap-[3px] h-4">
          <span className={`w-[3px] h-full bg-[#e8d3aa] rounded-sm origin-bottom ${isPlaying ? 'animate-bar-1' : 'scale-y-[0.25]'}`} />
          <span className={`w-[3px] h-full bg-[#e8d3aa] rounded-sm origin-bottom ${isPlaying ? 'animate-bar-2' : 'scale-y-[0.25]'}`} />
          <span className={`w-[3px] h-full bg-[#e8d3aa] rounded-sm origin-bottom ${isPlaying ? 'animate-bar-3' : 'scale-y-[0.25]'}`} />
          <span className={`w-[3px] h-full bg-[#e8d3aa] rounded-sm origin-bottom ${isPlaying ? 'animate-bar-4' : 'scale-y-[0.25]'}`} />
        </div>
        <span>{isPlaying ? 'Pause' : 'Music'}</span>
      </button>
    </>
  );
}
