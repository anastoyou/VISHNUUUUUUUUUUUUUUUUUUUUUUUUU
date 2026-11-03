'use client';

import React from 'react';

export interface ImagePlaceholderProps {
  /** Identifier for this image slot, e.g. 'flower-tl', 'lantern', 'flower-br', 'flower-bl', 'couple' */
  slot: 'flower-tl' | 'lantern' | 'flower-br' | 'flower-bl' | 'couple' | 'custom';
  label?: string;
  src?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Image Placeholder Component
 * Replaces old SVG vector art with customizable image slots.
 * When `src` is supplied (e.g. '/assets/flowers/flower-tl.png'), it renders the real image.
 * Otherwise, it shows an elegant placeholder frame matching the royal invitation aesthetic.
 */
export default function ImagePlaceholder({
  slot,
  label,
  src,
  className = '',
  style
}: ImagePlaceholderProps) {
  const defaultLabels: Record<string, string> = {
    'flower-tl': 'Floral Corner (Top-Left)',
    'lantern': 'Hanging Lantern',
    'flower-br': 'Floral Corner (Bottom-Right)',
    'flower-bl': 'Floral Corner (Bottom-Left)',
    'couple': 'Couple Illustration / Silhouette'
  };

  const displayLabel = label || defaultLabels[slot] || 'Image Placeholder';

  if (src) {
    return (
      <img
        src={src}
        alt={displayLabel}
        className={`object-contain pointer-events-none select-none ${className}`}
        style={style}
        loading="lazy"
      />
    );
  }

  // Elegant placeholder frame (No SVG used)
  return (
    <div
      data-placeholder-slot={slot}
      className={`border border-dashed border-[#e8d3aa]/35 bg-[#25050b]/40 rounded-lg backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center pointer-events-none transition-all duration-300 hover:border-[#e8d3aa]/60 ${className}`}
      style={style}
      title={`${displayLabel} — replace with your image file`}
    >
      <span className="text-[10px] tracking-wider uppercase font-semibold text-[#e8d3aa]/70 leading-tight">
        {displayLabel}
      </span>
      <span className="text-[9px] text-[#e8d3aa]/45 tracking-widest mt-0.5 font-mono">
        [Add Image Here]
      </span>
    </div>
  );
}

