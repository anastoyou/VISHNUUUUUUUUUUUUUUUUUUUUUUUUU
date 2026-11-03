'use client';

import React, { useEffect, useState } from 'react';
import { EVENT_DATA, EventType } from '@/lib/events';
import BackgroundLayer from './BackgroundLayer';
import ParticlesCanvas from './ParticlesCanvas';
import AudioController from './AudioController';
import HeroSection from './HeroSection';
import InvitationCard from './InvitationCard';

interface WeddingViewProps {
  eventType?: EventType;
}

export default function WeddingView({ eventType = 'invitation' }: WeddingViewProps) {
  const data = EVENT_DATA[eventType] || EVENT_DATA.invitation;
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);

  // Always reset scroll to the top on every refresh / initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <main className="relative min-h-screen text-[#fff0df]">
      {/* 
        1. Fixed Multi-layer Background with Dynamic Scroll Blur & Shading
        Initial View: Image displayed crisp in full view
        On Scroll: Blurs dynamically and darkens softly behind invitation elements
      */}
      <BackgroundLayer isOpened={isOpened} isOpening={isOpening} />

      {/* 2. Ambient Floating Golden Particles */}
      <ParticlesCanvas />

      {/* 3. Audio Controller playing /assets/bgm.mp3 with "Open Invitation" gateway */}
      <AudioController
        data={data}
        onOpeningStart={() => setIsOpening(true)}
        onOpen={() => {
          setIsOpened(true);
          setIsOpening(false);
        }}
      />

      {/* 4. Page Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* First Viewport: Initial Full View with Vishnu & Vani and ceremony date */}
        <div
          className={`hero-portal-container w-full ${
            !isOpened
              ? isOpening
                ? 'hero-zoom-in'
                : 'hero-scaled-down'
              : ''
          }`}
        >
          <HeroSection data={data} />
        </div>

        {/* Revealed on Scroll: Seamless flow from the background shade */}
        <div className="w-full">
          <InvitationCard data={data} />
        </div>
      </div>
    </main>
  );
}
