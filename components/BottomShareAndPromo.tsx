'use client';

import React, { useState } from 'react';

export interface BottomSharePromoProps {
  /**
   * Title text for the promotion section
   * @default 'Celebrate your moments with invitation'
   */
  title?: string;
  /**
   * Subtitle / tagline
   * @default 'Create your own personalized royal wedding web invitation'
   */
  subtitle?: string;
  /**
   * Label for work inquiry
   * @default 'Contact for Work'
   */
  contactText?: string;
  /**
   * WhatsApp contact phone number (with country code)
   * @default '+918086870169'
   */
  whatsappNumber?: string;
  /**
   * Default message to send on WhatsApp
   */
  whatsappMessage?: string;
  /**
   * Invitation page title for sharing
   * @default 'Vishnu & Vani | Wedding Invitation'
   */
  shareTitle?: string;
  /**
   * Invitation description for sharing
   * @default 'Join us in celebrating the royal wedding of Vishnu & Vani!'
   */
  shareText?: string;
  /**
   * URL to share. Defaults to window.location.href
   */
  shareUrl?: string;
  /**
   * Custom additional CSS classes
   */
  className?: string;
}

export default function BottomShareAndPromo({
  title = 'Celebrate your moments with invitation',
  subtitle = 'Create your own personalized royal wedding web invitation',
  contactText = 'Contact for Work',
  whatsappNumber = '+918086870169',
  whatsappMessage = 'Hello! I would like to create a wedding invitation website like Vishnu & Vani. Please share details!',
  shareTitle = 'Vishnu & Vani | Wedding Invitation',
  shareText = 'Join us in celebrating the royal wedding of Vishnu & Vani!',
  shareUrl,
  className = '',
}: BottomSharePromoProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Format WhatsApp number (digits only for wa.me link)
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const whatsappHref = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  // Share handlers
  const handleShare = async () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    handleCopyLink();
  };

  const handleCopyLink = async () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      prompt('Copy invitation link:', url);
    }
  };

  const handleWhatsAppShare = () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const text = `${shareTitle}\n${shareText}\n\n${url}`;
    const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(waShareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      aria-label="Share and Contact"
      className={`w-full max-w-xl mx-auto mt-10 mb-6 px-3 ${className}`}
    >
      {/* Simple promo card */}
      <div className="animate-promo-in rounded-xl border border-white/15 bg-white/5 p-5 text-center font-sans">
        <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-promo-pulse group relative mt-4 flex w-full items-center overflow-hidden justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#04210f] transition-colors hover:bg-[#3ee27c] cursor-pointer"
        >
          <span aria-hidden="true" className="animate-promo-shine pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-white/40 blur-sm" />
          <svg className="h-5 w-5 shrink-0 fill-current transition-transform group-hover:rotate-12" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>{contactText}</span>
        </a>
      </div>
    </section>
  );
}
