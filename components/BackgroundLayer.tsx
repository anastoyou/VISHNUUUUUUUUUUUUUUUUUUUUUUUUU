'use client';

import React, { useEffect, useRef } from 'react';

interface BackgroundLayerProps {
  isOpened?: boolean;
  isOpening?: boolean;
}

export default function BackgroundLayer({
  isOpened = false,
  isOpening = false,
}: BackgroundLayerProps) {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const fgImageRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;
    let lastBlur = -1;
    let lastOpacity = -1;

    const updateLayer = () => {
      const scrollPos = window.scrollY;

      // Blur: starts at 0px on initial view, smoothly ramps up to 10px as user scrolls
      const rawBlur = Math.min(Math.max((scrollPos - 40) / 35, 0), 10);
      const blur = Math.round(rawBlur * 10) / 10;

      // Overlay opacity: starts at a gentle 0.25 on initial view (keeps photo clear and vibrant),
      // then deepens up to 0.82 to create a shaded royal wine background for the invitation card
      const rawOpacity = 0.25 + Math.min(Math.max((scrollPos - 30) / 220, 0), 0.57);
      const opacity = Math.round(rawOpacity * 100) / 100;

      if (imageRef.current && blur !== lastBlur) {
        lastBlur = blur;
        const filterVal = blur > 0 ? `blur(${blur}px)` : 'none';
        imageRef.current.style.filter = filterVal;
        if (fgImageRef.current) {
          fgImageRef.current.style.filter = filterVal;
        }
      }

      if (overlayRef.current && opacity !== lastOpacity) {
        lastOpacity = opacity;
        overlayRef.current.style.opacity = String(opacity);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateLayer);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateLayer();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden pointer-events-none will-change-transform">
      {/* 
        Layered 2.5D Background:
        1. Base photo: /assets/image.png with slow ambient drift (animate-bg-float)
        2. Foreground cutout: /assets/image-removebg.png placed on top with complementary float (animate-fg-float)
        Both images move with subtle organic 2.5D parallax!
      */}
      <div
        className={`absolute inset-0 w-full h-full bg-portal-container ${
          !isOpened ? (isOpening ? 'bg-zoom-in' : 'bg-scaled-down') : ''
        }`}
      >
        {/* Layer 1: Background Image (/assets/image.png) */}
        <div
          ref={imageRef}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-[filter] duration-75 will-change-[filter,transform] animate-bg-float"
          style={{
            backgroundImage: "url('/assets/image.png')",
            backgroundPosition: 'center 20%',
            filter: 'none',
          }}
        />

        {/* Layer 2: Foreground Cutout Image (/assets/image-removebg.png) placed on top of image.png */}
        <div
          ref={fgImageRef}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-[filter] duration-75 will-change-[filter,transform] animate-fg-float pointer-events-none"
          style={{
            backgroundImage: "url('/assets/image-removebg.png')",
            backgroundPosition: 'center 20%',
            filter: 'none',
          }}
        />

        {/* Layer 3: CSS Cinematic Light Effect (Volumetric God Rays & Anamorphic Lens Flare) */}
        <div className="cinematic-light-container">
          <div className="cinematic-god-ray" />
          <div className="cinematic-god-ray-beam" />
          <div className="cinematic-lens-flare" />
          <div className="cinematic-flare-orb" />
        </div>

        {/* 
          Layer 4: Dynamic Royal Wine & Shading Overlay:
          Light tint initially, deepening on scroll to provide a shaded background for card elements.
        */}
        <div
          ref={overlayRef}
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#190409]/60 via-[#30070d]/80 to-[#190409]/95 pointer-events-none will-change-[opacity]"
          style={{ opacity: 0.25 }}
        />
      </div>

      {/* Ambient golden dust sparkles overlay */}
      <div className="absolute inset-0 w-full h-full sparkles pointer-events-none opacity-40" />
    </div>
  );
}
