'use client';

import React, { useEffect, useRef } from 'react';

export default function BackgroundLayer() {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;
    let lastBlur = -1;
    let lastOpacity = -1;

    const updateLayer = () => {
      const scrollPos = window.scrollY;

      // Blur: 0px on first viewport, smoothly scales up to 6px
      const rawBlur = Math.min(Math.max((scrollPos - 70) / 45, 0), 6);
      const blur = Math.round(rawBlur * 10) / 10; // round to 1 decimal place

      // Overlay opacity: 0 on landing, fades to 0.7
      const rawOpacity = Math.min(Math.max((scrollPos - 80) / 180, 0), 0.7);
      const opacity = Math.round(rawOpacity * 100) / 100;

      if (imageRef.current && blur !== lastBlur) {
        lastBlur = blur;
        imageRef.current.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
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
        {/* Static background image - GPU accelerated, no transition delay */}
        <div
          ref={imageRef}
          className="absolute inset-0 w-full h-full bg-cover bg-no-repeat will-change-[filter]"
          style={{
            backgroundImage: "url('/assets/couple.jpeg')",
            backgroundPosition: 'center 8%',
            filter: 'none',
          }}
        />

        {/* Gentle gradient overlay that fades in as user scrolls */}
        <div
          ref={overlayRef}
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-[#FDF5F0]/45 to-[#F5E6F0]/80 pointer-events-none will-change-[opacity]"
          style={{ opacity: 0 }}
        />
      </div>
      );
}
