'use client';

import React, { useState } from 'react';
import { EVENT_DATA, EventType } from '@/lib/events';
import BackgroundLayer from './BackgroundLayer';
import ParticlesCanvas from './ParticlesCanvas';
import AudioController from './AudioController';
import AutoScrollManager from './AutoScrollManager';
import HeroSection from './HeroSection';
import AnnouncementSection from './AnnouncementSection';
import FamilyUnionSection from './FamilyUnionSection';
import ScheduleSection from './ScheduleSection';
import CountdownSection from './CountdownSection';
import VenueSection from './VenueSection';
import RsvpSection from './RsvpSection';
import ClosingSection from './ClosingSection';

interface WeddingViewProps {
  eventType?: EventType;
}

export default function WeddingView({ eventType = 'invitation' }: WeddingViewProps) {
  const data = EVENT_DATA[eventType] || EVENT_DATA.invitation;
  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <main className="relative min-h-screen">
      {/* 1. Multi-layer Fixed Background & Scroll Blur */}
      <BackgroundLayer />

      {/* 2. Interactive Petals & Golden Sparkles */}
      <ParticlesCanvas />

      {/* 3. Floating Audio Player & Open Invitation Gate */}
      <AudioController data={data} onOpen={() => setIsOpened(true)} />

      {/* 4. Auto-Scroll on 3-second Inactivity */}
      <AutoScrollManager isInvitationOpened={isOpened} inactivityDelayMs={3000} speedPxPerSecond={70} />

      {/* 5. Page Content Container */}
      <div className="relative z-10 max-w-[820px] mx-auto px-3.5 sm:px-4 md:px-6 flex flex-col gap-8 md:gap-10">
        {/* First Viewport: Names Only (No Hero Card, Pure Artwork) */}
        <HeroSection data={data} />

        {/* Reveals on scroll: Announcement & Golden Crest */}
        <AnnouncementSection data={data} />

        {/* The Auspicious Union: Parents & Family Details */}
        <FamilyUnionSection data={data} />

        {/* Schedule & Timeline */}
        <ScheduleSection data={data} />

        {/* Live Countdown Timer & Calendar */}
        <CountdownSection data={data} />

        {/* Venue, Maps & Directions */}
        <VenueSection data={data} />

        {/* Guest Attendance Confirmation Form */}
        <RsvpSection data={data} />

        {/* Closing Greetings & Share */}
        <ClosingSection data={data} />
      </div>
    </main>
  );
}

