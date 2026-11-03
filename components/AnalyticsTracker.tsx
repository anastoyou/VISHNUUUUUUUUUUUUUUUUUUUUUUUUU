'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackEvent } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedDepths = useRef<Set<number>>(new Set());

  // Track page view when pathname changes
  useEffect(() => {
    trackedDepths.current.clear();
    trackPageView(document.title);
  }, [pathname]);

  // Track scroll depth engagement
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return;

      const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));

      const milestones = [25, 50, 75, 100];
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          trackEvent('scroll_depth', { depth: milestone, percent: `${milestone}%` });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}

