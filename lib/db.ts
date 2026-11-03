import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const DEFAULT_DATABASE_URL =
  'postgresql://neondb_owner:npg_M0hRF8xrIVsw@ep-broad-union-b3nbps4v-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

// Singleton Neon SQL client
export const sql: NeonQueryFunction<false, false> = neon(connectionString);

export interface RsvpRecord {
  id?: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  attending: 'yes' | 'no' | 'maybe';
  guest_count?: number;
  event_type?: string;
  message?: string | null;
  visitor_id?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
}

export interface PageViewRecord {
  id?: number;
  visitor_id: string;
  session_id?: string | null;
  page_path: string;
  page_title?: string | null;
  event_type?: string | null;
  referrer?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  device_type?: string | null;
  browser?: string | null;
  os?: string | null;
  screen_resolution?: string | null;
  language?: string | null;
  country?: string | null;
  city?: string | null;
  created_at?: string;
}

export interface EventRecord {
  id?: number;
  visitor_id: string;
  session_id?: string | null;
  event_name: string;
  page_path?: string | null;
  event_data?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
}

/**
 * Ensures required database tables and indexes exist.
 */
export async function ensureTablesExist() {
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      email VARCHAR(255),
      attending VARCHAR(20) NOT NULL,
      guest_count INTEGER DEFAULT 1,
      event_type VARCHAR(50) NOT NULL DEFAULT 'both',
      message TEXT,
      visitor_id VARCHAR(100),
      ip_address VARCHAR(100),
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS analytics_views (
      id SERIAL PRIMARY KEY,
      visitor_id VARCHAR(100) NOT NULL,
      session_id VARCHAR(100),
      page_path VARCHAR(255) NOT NULL,
      page_title VARCHAR(255),
      event_type VARCHAR(50),
      referrer TEXT,
      ip_address VARCHAR(100),
      user_agent TEXT,
      device_type VARCHAR(50),
      browser VARCHAR(100),
      os VARCHAR(100),
      screen_resolution VARCHAR(50),
      language VARCHAR(50),
      country VARCHAR(100),
      city VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id SERIAL PRIMARY KEY,
      visitor_id VARCHAR(100) NOT NULL,
      session_id VARCHAR(100),
      event_name VARCHAR(100) NOT NULL,
      page_path VARCHAR(255),
      event_data JSONB DEFAULT '{}'::jsonb,
      ip_address VARCHAR(100),
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_views_visitor ON analytics_views(visitor_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_views_created_at ON analytics_views(created_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_visitor ON analytics_events(visitor_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(event_name);`;
}

/**
 * Inserts a new RSVP submission.
 */
export async function createRsvp(data: RsvpRecord) {
  const result = await sql`
    INSERT INTO rsvps (
      name,
      phone,
      email,
      attending,
      guest_count,
      event_type,
      message,
      visitor_id,
      ip_address,
      user_agent
    ) VALUES (
      ${data.name},
      ${data.phone || null},
      ${data.email || null},
      ${data.attending},
      ${data.guest_count ?? 1},
      ${data.event_type || 'both'},
      ${data.message || null},
      ${data.visitor_id || null},
      ${data.ip_address || null},
      ${data.user_agent || null}
    )
    RETURNING *;
  `;
  return result[0];
}

/**
 * Retrieves all RSVPs and calculates summary figures.
 */
export async function getRsvpsWithSummary() {
  const rsvps = await sql`
    SELECT * FROM rsvps ORDER BY created_at DESC;
  `;

  const totalResponses = rsvps.length;
  let attendingCount = 0;
  let attendingGuests = 0;
  let declinedCount = 0;
  let maybeCount = 0;

  for (const r of rsvps) {
    if (r.attending === 'yes') {
      attendingCount += 1;
      attendingGuests += Number(r.guest_count) || 1;
    } else if (r.attending === 'no') {
      declinedCount += 1;
    } else {
      maybeCount += 1;
    }
  }

  return {
    rsvps,
    summary: {
      totalResponses,
      attendingCount,
      attendingGuests,
      declinedCount,
      maybeCount,
    },
  };
}

/**
 * Records a page view with complete analytics attributes.
 */
export async function recordPageView(data: PageViewRecord) {
  const result = await sql`
    INSERT INTO analytics_views (
      visitor_id,
      session_id,
      page_path,
      page_title,
      event_type,
      referrer,
      ip_address,
      user_agent,
      device_type,
      browser,
      os,
      screen_resolution,
      language,
      country,
      city
    ) VALUES (
      ${data.visitor_id},
      ${data.session_id || null},
      ${data.page_path},
      ${data.page_title || null},
      ${data.event_type || null},
      ${data.referrer || null},
      ${data.ip_address || null},
      ${data.user_agent || null},
      ${data.device_type || 'unknown'},
      ${data.browser || null},
      ${data.os || null},
      ${data.screen_resolution || null},
      ${data.language || null},
      ${data.country || null},
      ${data.city || null}
    )
    RETURNING id, created_at;
  `;
  return result[0];
}

/**
 * Records a custom user action / event.
 */
export async function recordAnalyticsEvent(data: EventRecord) {
  const eventDataJson = JSON.stringify(data.event_data || {});
  const result = await sql`
    INSERT INTO analytics_events (
      visitor_id,
      session_id,
      event_name,
      page_path,
      event_data,
      ip_address,
      user_agent
    ) VALUES (
      ${data.visitor_id},
      ${data.session_id || null},
      ${data.event_name},
      ${data.page_path || null},
      ${eventDataJson}::jsonb,
      ${data.ip_address || null},
      ${data.user_agent || null}
    )
    RETURNING id, created_at;
  `;
  return result[0];
}

/**
 * Aggregates complete analytics metrics for the dashboard.
 */
export async function getAnalyticsSummary() {
  // Total page views & unique visitors
  const overviewRes = await sql`
    SELECT
      COUNT(*)::int AS total_views,
      COUNT(DISTINCT visitor_id)::int AS unique_visitors,
      COUNT(DISTINCT session_id)::int AS unique_sessions
    FROM analytics_views;
  `;
  const overview = overviewRes[0] || { total_views: 0, unique_visitors: 0, unique_sessions: 0 };

  // Device breakdown
  const devices = await sql`
    SELECT COALESCE(device_type, 'unknown') as device, COUNT(*)::int as count
    FROM analytics_views
    GROUP BY device_type
    ORDER BY count DESC;
  `;

  // Top Pages
  const topPages = await sql`
    SELECT page_path, COUNT(*)::int as views, COUNT(DISTINCT visitor_id)::int as visitors
    FROM analytics_views
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 10;
  `;

  // Top Browsers
  const topBrowsers = await sql`
    SELECT COALESCE(browser, 'Other') as browser, COUNT(*)::int as count
    FROM analytics_views
    GROUP BY browser
    ORDER BY count DESC
    LIMIT 5;
  `;

  // Interaction Events counts
  const eventCounts = await sql`
    SELECT event_name, COUNT(*)::int as count
    FROM analytics_events
    GROUP BY event_name
    ORDER BY count DESC;
  `;

  // Recent Page Views
  const recentViews = await sql`
    SELECT id, visitor_id, page_path, page_title, device_type, browser, os, ip_address, country, city, created_at
    FROM analytics_views
    ORDER BY created_at DESC
    LIMIT 25;
  `;

  // Recent Events
  const recentEvents = await sql`
    SELECT id, visitor_id, event_name, page_path, event_data, ip_address, created_at
    FROM analytics_events
    ORDER BY created_at DESC
    LIMIT 25;
  `;

  return {
    overview,
    devices,
    topPages,
    topBrowsers,
    eventCounts,
    recentViews,
    recentEvents,
  };
}

