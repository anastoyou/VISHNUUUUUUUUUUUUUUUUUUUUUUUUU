import { NextRequest, NextResponse } from 'next/server';
import { createRsvp, getRsvpsWithSummary, recordAnalyticsEvent, ensureTablesExist } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await ensureTablesExist();
    const body = await req.json();

    const {
      name,
      phone,
      email,
      attending,
      guest_count,
      event_type,
      message,
      visitor_id,
      session_id,
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide your name.' },
        { status: 400 }
      );
    }

    if (!attending || !['yes', 'no', 'maybe'].includes(attending)) {
      return NextResponse.json(
        { success: false, error: 'Please specify attendance (yes, no, or maybe).' },
        { status: 400 }
      );
    }

    // Extract client IP and user-agent
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      null;
    const userAgent = req.headers.get('user-agent') || null;

    const guestCountNum = Math.max(1, parseInt(guest_count, 10) || 1);

    const rsvp = await createRsvp({
      name: name.trim(),
      phone: phone ? String(phone).trim() : null,
      email: email ? String(email).trim() : null,
      attending,
      guest_count: attending === 'yes' ? guestCountNum : 0,
      event_type: event_type || 'both',
      message: message ? String(message).trim() : null,
      visitor_id: visitor_id || null,
      ip_address: ip,
      user_agent: userAgent,
    });

    // Also record an RSVP analytics event
    if (visitor_id) {
      await recordAnalyticsEvent({
        visitor_id,
        session_id: session_id || null,
        event_name: 'rsvp_submit',
        page_path: req.nextUrl.pathname,
        event_data: {
          attending,
          guest_count: attending === 'yes' ? guestCountNum : 0,
          event_type: event_type || 'both',
          has_message: Boolean(message),
        },
        ip_address: ip,
        user_agent: userAgent,
      }).catch((e) => console.error('Failed to log rsvp analytics event:', e));
    }

    return NextResponse.json({
      success: true,
      message: attending === 'yes'
        ? 'Thank you! Your presence has been joyfully recorded.'
        : 'Thank you for letting us know. Warm regards!',
      rsvp,
    });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record RSVP. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await ensureTablesExist();
    const data = await getRsvpsWithSummary();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs.' },
      { status: 500 }
    );
  }
}

