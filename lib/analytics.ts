'use client';

const VISITOR_KEY = 'wedding_visitor_id';
const SESSION_KEY = 'wedding_session_id';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anon_' + Date.now();
  }
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateId();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return 'sess_' + Date.now();
  }
}

function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      screen_resolution: '',
      language: '',
      deviceType: 'desktop',
    };
  }

  const width = window.innerWidth;
  const isMobile = /mobile/i.test(navigator.userAgent) || width < 768;
  const isTablet = /tablet|ipad/i.test(navigator.userAgent) || (width >= 768 && width <= 1024);

  return {
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || 'en',
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
}

/**
 * Tracks a page view and sends to /api/analytics
 */
export async function trackPageView(pageTitle?: string, eventType?: string) {
  if (typeof window === 'undefined') return;

  const visitor_id = getVisitorId();
  const session_id = getSessionId();
  const device = getDeviceInfo();

  const payload = {
    type: 'page_view',
    visitor_id,
    session_id,
    page_path: window.location.pathname,
    page_title: pageTitle || document.title,
    event_type: eventType || (window.location.pathname.includes('reception') ? 'reception' : 'invitation'),
    referrer: document.referrer || null,
    screen_resolution: device.screen_resolution,
    language: device.language,
    deviceType: device.deviceType,
  };

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch (err) {
    console.debug('Analytics view tracking failed:', err);
  }
}

/**
 * Tracks a custom user interaction event (e.g. 'audio_play', 'map_click', etc.)
 */
export async function trackEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  const visitor_id = getVisitorId();
  const session_id = getSessionId();

  const payload = {
    type: 'event',
    visitor_id,
    session_id,
    event_name: eventName,
    page_path: window.location.pathname,
    event_data: eventData || {},
  };

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch (err) {
    console.debug('Analytics event tracking failed:', err);
  }
}

