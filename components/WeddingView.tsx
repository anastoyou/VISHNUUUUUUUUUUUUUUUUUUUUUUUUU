'use client';

import React, { useState } from 'react';
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

  return (
    <main className="relative min-h-screen text-[#fff0df]">
      {/* 
        1. Fixed Multi-layer Background with Dynamic Scroll Blur & Shading
        Initial View: Image displayed crisp in full view
        On Scroll: Blurs dynamically and darkens softly behind invitation elements
      */}
      <BackgroundLayer />

      {/* 2. Ambient Floating Golden Particles */}
      <ParticlesCanvas />

      {/* 3. Audio Controller playing /assets/bgm.mp3 with "Open Invitation" gateway */}
      <AudioController data={data} onOpen={() => setIsOpened(true)} />

      {/* 4. Page Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* First Viewport: Initial Full View with Vishnu & Vani and ceremony date */}
        <HeroSection data={data} />

        {/* Revealed on Scroll: Seamless flow from the background shade */}
        <div className="w-full">
          <InvitationCard data={data} />
        </div>
      </div>
    </main>
  );
}
