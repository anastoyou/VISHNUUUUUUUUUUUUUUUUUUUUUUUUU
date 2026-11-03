import { NextRequest, NextResponse } from 'next/server';
import {
  recordPageView,
  recordAnalyticsEvent,
  getAnalyticsSummary,
  ensureTablesExist,
} from '@/lib/db';

function parseUserAgent(ua: string | null) {
  if (!ua) return { browser: 'Unknown', os: 'Unknown', deviceType: 'desktop' };

  let deviceType = 'desktop';
  if (/mobile/i.test(ua)) deviceType = 'mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

  let browser = 'Other';
  if (/chrome|crios/i.test(ua) && !/edg|opr\//i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opr\//i.test(ua)) browser = 'Opera';

  let os = 'Other';
  if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { browser, os, deviceType };
}

export async function POST(req: NextRequest) {
  try {
    await ensureTablesExist();
    const body = await req.json();
    const type = body.type || 'page_view'; // 'page_view' | 'event'

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      null;
    const userAgent = req.headers.get('user-agent') || body.userAgent || null;
    const country = req.headers.get('x-vercel-ip-country') || body.country || null;
    const city = req.headers.get('x-vercel-ip-city') || body.city || null;

    const parsedUa = parseUserAgent(userAgent);
    const deviceType = body.deviceType || parsedUa.deviceType;
    const browser = body.browser || parsedUa.browser;
    const os = body.os || parsedUa.os;

    if (type === 'page_view') {
      const {
        visitor_id,
        session_id,
        page_path,
        page_title,
        event_type,
        referrer,
        screen_resolution,
        language,
      } = body;

      if (!visitor_id || !page_path) {
        return NextResponse.json(
          { success: false, error: 'visitor_id and page_path are required' },
          { status: 400 }
        );
      }

      const view = await recordPageView({
        visitor_id,
        session_id: session_id || null,
        page_path,
        page_title: page_title || null,
        event_type: event_type || null,
        referrer: referrer || null,
        ip_address: ip,
        user_agent: userAgent,
        device_type: deviceType,
        browser,
        os,
        screen_resolution: screen_resolution || null,
        language: language || null,
        country,
        city,
      });

      return NextResponse.json({ success: true, view });
    } else if (type === 'event') {
      const { visitor_id, session_id, event_name, page_path, event_data } = body;

      if (!visitor_id || !event_name) {
        return NextResponse.json(
          { success: false, error: 'visitor_id and event_name are required' },
          { status: 400 }
        );
      }

      const evt = await recordAnalyticsEvent({
        visitor_id,
        session_id: session_id || null,
        event_name,
        page_path: page_path || null,
        event_data: event_data || {},
        ip_address: ip,
        user_agent: userAgent,
      });

      return NextResponse.json({ success: true, event: evt });
    }

    return NextResponse.json({ success: false, error: 'Invalid tracking type' }, { status: 400 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await ensureTablesExist();
    const summary = await getAnalyticsSummary();
    return NextResponse.json({ success: true, ...summary });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics summary' },
      { status: 500 }
    );
  }
}

