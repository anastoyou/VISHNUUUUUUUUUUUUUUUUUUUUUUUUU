'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface RsvpItem {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  attending: string;
  guest_count: number;
  event_type: string;
  message: string | null;
  visitor_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface AnalyticsData {
  overview: {
    total_views: number;
    unique_visitors: number;
    unique_sessions: number;
  };
  devices: Array<{ device: string; count: number }>;
  topPages: Array<{ page_path: string; views: number; visitors: number }>;
  topBrowsers: Array<{ browser: string; count: number }>;
  eventCounts: Array<{ event_name: string; count: number }>;
  recentViews: Array<{
    id: number;
    visitor_id: string;
    page_path: string;
    page_title: string;
    device_type: string;
    browser: string;
    os: string;
    ip_address: string;
    country: string | null;
    city: string | null;
    created_at: string;
  }>;
  recentEvents: Array<{
    id: number;
    visitor_id: string;
    event_name: string;
    page_path: string;
    event_data: Record<string, unknown>;
    ip_address: string;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'rsvps' | 'analytics'>('rsvps');
  const [rsvps, setRsvps] = useState<RsvpItem[]>([]);
  const [rsvpSummary, setRsvpSummary] = useState<{
    totalResponses: number;
    attendingCount: number;
    attendingGuests: number;
    declinedCount: number;
    maybeCount: number;
  }>({
    totalResponses: 0,
    attendingCount: 0,
    attendingGuests: 0,
    declinedCount: 0,
    maybeCount: 0,
  });

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterAttending, setFilterAttending] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rsvpRes, analyticsRes] = await Promise.all([
        fetch('/api/rsvp'),
        fetch('/api/analytics'),
      ]);

      if (rsvpRes.ok) {
        const rData = await rsvpRes.json();
        if (rData.success) {
          setRsvps(rData.rsvps || []);
          setRsvpSummary(rData.summary || {});
        }
      }

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        if (aData.success) {
          setAnalytics(aData);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportRsvpsCsv = () => {
    if (!rsvps.length) return;
    const headers = [
      'ID',
      'Name',
      'Attendance',
      'Guest Count',
      'Event Type',
      'Phone',
      'Email',
      'Message / Wishes',
      'IP Address',
      'Submitted At',
    ];

    const rows = rsvps.map((r) => [
      r.id,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      r.attending,
      r.guest_count,
      r.event_type,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      r.ip_address || '',
      new Date(r.created_at).toLocaleString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wedding-rsvps-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRsvps = rsvps.filter((r) => {
    const matchesFilter = filterAttending === 'all' || r.attending === filterAttending;
    const matchesSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.phone && r.phone.includes(searchQuery)) ||
      (r.message && r.message.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDF9F2] text-[#2D1525] p-4 sm:p-6 md:p-10 font-[family-name:var(--font-montserrat)]">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/30">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <h1 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold text-[#9C1448]">
              Wedding Portal Dashboard
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#7E5874] mt-1">
            Connected to Neon PostgreSQL Database • Vishnu &amp; Vani Wedding Celebration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-white/80 hover:bg-white border border-[#D4AF37]/40 rounded-full text-xs font-semibold text-[#9C1448] transition-all shadow-xs"
          >
            ← View Invitation
          </Link>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-[#C2185B] to-[#9C1448] text-white rounded-full text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>🔄</span>
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-white/70 backdrop-blur-md border border-[#D4AF37]/35 rounded-2xl p-5 shadow-xs">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#7E5874] mb-1">
            Total RSVPs
          </div>
          <div className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-[#9C1448]">
            {rsvpSummary.totalResponses}
          </div>
          <div className="text-[11px] text-[#58334E] mt-1">
            {rsvpSummary.attendingCount} attending • {rsvpSummary.declinedCount} declined
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-[#D4AF37]/35 rounded-2xl p-5 shadow-xs">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#7E5874] mb-1">
            Confirmed Guests
          </div>
          <div className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-[#2E7D32]">
            {rsvpSummary.attendingGuests}
          </div>
          <div className="text-[11px] text-[#58334E] mt-1">
            Total headcount joining celebration
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-[#D4AF37]/35 rounded-2xl p-5 shadow-xs">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#7E5874] mb-1">
            Total Page Views
          </div>
          <div className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-[#1976D2]">
            {analytics?.overview.total_views ?? 0}
          </div>
          <div className="text-[11px] text-[#58334E] mt-1">
            Across invitation &amp; reception pages
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-[#D4AF37]/35 rounded-2xl p-5 shadow-xs">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#7E5874] mb-1">
            Unique Visitors
          </div>
          <div className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-[#6A1B9A]">
            {analytics?.overview.unique_visitors ?? 0}
          </div>
          <div className="text-[11px] text-[#58334E] mt-1">
            {analytics?.overview.unique_sessions ?? 0} unique browsing sessions
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 border-b border-[#D4AF37]/30 mb-6">
        <button
          onClick={() => setActiveTab('rsvps')}
          className={`px-5 py-2.5 text-xs md:text-sm font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${activeTab === 'rsvps'
            ? 'border-[#C2185B] text-[#9C1448]'
            : 'border-transparent text-[#7E5874] hover:text-[#9C1448]'
            }`}
        >
          💌 RSVP Data Store ({rsvps.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 text-xs md:text-sm font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${activeTab === 'analytics'
            ? 'border-[#C2185B] text-[#9C1448]'
            : 'border-transparent text-[#7E5874] hover:text-[#9C1448]'
            }`}
        >
          📊 Whole Analytics Details
        </button>
      </div>

      {/* TAB CONTENT: RSVPS */}
      {activeTab === 'rsvps' && (
        <div className="max-w-7xl mx-auto flex flex-col gap-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-[#D4AF37]/30">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#58334E]">Filter:</span>
              {(['all', 'yes', 'no', 'maybe'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterAttending(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${filterAttending === opt
                    ? 'bg-[#9C1448] text-white shadow-xs'
                    : 'bg-white/80 text-[#7E5874] hover:bg-white'
                    }`}
                >
                  {opt === 'all'
                    ? 'All'
                    : opt === 'yes'
                      ? 'Attending'
                      : opt === 'no'
                        ? 'Declined'
                        : 'Maybe'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search guest or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-1.5 bg-white border border-[#D4AF37]/40 rounded-xl text-xs text-[#2D1525] outline-none w-full sm:w-56"
              />
              <button
                onClick={exportRsvpsCsv}
                disabled={!rsvps.length}
                className="px-4 py-1.5 bg-white hover:bg-stone-50 border border-[#D4AF37] text-[#9C1448] rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-40 whitespace-nowrap"
              >
                📥 Export CSV
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#9C1448]/8 text-[#9C1448] uppercase tracking-wider font-semibold border-b border-[#D4AF37]/25">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Phone / Contact</th>
                    <th className="py-3 px-4">Wishes &amp; Message</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/20">
                  {filteredRsvps.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-[#7E5874]">
                        {loading ? 'Loading RSVP entries...' : 'No RSVP entries match your criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredRsvps.map((rsvp, idx) => (
                      <tr key={rsvp.id} className="hover:bg-white/70 transition-colors">
                        <td className="py-3 px-4 font-mono text-[#7E5874]">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-[#2D1525]">{rsvp.name}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${rsvp.attending === 'yes'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : rsvp.attending === 'no'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                          >
                            {rsvp.attending === 'yes'
                              ? 'Attending'
                              : rsvp.attending === 'no'
                                ? 'Declined'
                                : 'Maybe'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#9C1448]">
                          {rsvp.attending === 'yes' ? rsvp.guest_count : '-'}
                        </td>
                        <td className="py-3 px-4 text-[#58334E] capitalize">
                          {rsvp.event_type === 'both'
                            ? 'Both Events'
                            : rsvp.event_type === 'invitation'
                              ? 'Ceremony'
                              : 'Reception'}
                        </td>
                        <td className="py-3 px-4">
                          {rsvp.phone ? (
                            <a
                              href={`tel:${rsvp.phone}`}
                              className="text-[#1976D2] hover:underline"
                            >
                              {rsvp.phone}
                            </a>
                          ) : (
                            <span className="text-stone-400 italic">None</span>
                          )}
                          {rsvp.email && (
                            <div className="text-[11px] text-[#7E5874]">{rsvp.email}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-[#58334E]" title={rsvp.message || ''}>
                          {rsvp.message || <span className="text-stone-400 italic">—</span>}
                        </td>
                        <td className="py-3 px-4 text-[#7E5874] whitespace-nowrap">
                          {new Date(rsvp.created_at).toLocaleDateString()}{' '}
                          <span className="text-[10px] text-stone-400">
                            {new Date(rsvp.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: WHOLE ANALYTICS DETAILS */}
      {activeTab === 'analytics' && (
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Detailed Analytics Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Devices Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 p-5 shadow-xs">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm font-bold text-[#9C1448] mb-3 uppercase tracking-wider flex items-center gap-2">
                <span>📱</span> Device Breakdown
              </h3>
              <div className="flex flex-col gap-2.5">
                {analytics?.devices.length ? (
                  analytics.devices.map((d) => {
                    const total = analytics.overview.total_views || 1;
                    const pct = Math.round((d.count / total) * 100);
                    return (
                      <div key={d.device} className="text-xs">
                        <div className="flex justify-between font-semibold mb-1 capitalize">
                          <span>{d.device}</span>
                          <span className="text-[#9C1448]">
                            {d.count} views ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#C2185B] to-[#D4AF37] h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#7E5874]">No device data yet.</p>
                )}
              </div>
            </div>

            {/* Top Visited Pages */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 p-5 shadow-xs">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm font-bold text-[#9C1448] mb-3 uppercase tracking-wider flex items-center gap-2">
                <span>📄</span> Top Pages Visited
              </h3>
              <div className="flex flex-col gap-2">
                {analytics?.topPages.length ? (
                  analytics.topPages.map((p) => (
                    <div
                      key={p.page_path}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 border border-stone-200/60"
                    >
                      <span className="font-mono text-[#58334E]">{p.page_path}</span>
                      <span className="font-bold text-[#9C1448]">
                        {p.views} views / {p.visitors} visitors
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#7E5874]">No page data recorded yet.</p>
                )}
              </div>
            </div>

            {/* Interaction Events */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 p-5 shadow-xs">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm font-bold text-[#9C1448] mb-3 uppercase tracking-wider flex items-center gap-2">
                <span>⚡</span> User Engagement Events
              </h3>
              <div className="flex flex-col gap-2">
                {analytics?.eventCounts.length ? (
                  analytics.eventCounts.map((e) => (
                    <div
                      key={e.event_name}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 border border-stone-200/60"
                    >
                      <span className="font-semibold text-[#58334E] capitalize">
                        {e.event_name.replace(/_/g, ' ')}
                      </span>
                      <span className="px-2 py-0.5 bg-[#9C1448]/10 text-[#9C1448] rounded-full font-bold">
                        {e.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#7E5874]">No event actions logged yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Page Views Log */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 overflow-hidden shadow-xs">
            <div className="p-4 bg-[#9C1448]/8 border-b border-[#D4AF37]/25 flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm font-bold text-[#9C1448] uppercase tracking-wider flex items-center gap-2">
                <span>👁️</span> Recent Page Views Stream (Neon DB)
              </h3>
              <span className="text-[11px] text-[#7E5874]">
                Showing latest {analytics?.recentViews.length || 0} visits
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDF9F2] text-[#7E5874] uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-4">Time</th>
                    <th className="py-2.5 px-4">Visitor ID</th>
                    <th className="py-2.5 px-4">Path</th>
                    <th className="py-2.5 px-4">Device</th>
                    <th className="py-2.5 px-4">Browser &amp; OS</th>
                    <th className="py-2.5 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70">
                  {analytics?.recentViews.map((view) => (
                    <tr key={view.id} className="hover:bg-stone-50/80">
                      <td className="py-2.5 px-4 text-[#7E5874] whitespace-nowrap">
                        {new Date(view.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-[#58334E]">
                        {view.visitor_id.substring(0, 14)}...
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs font-semibold text-[#9C1448]">
                        {view.page_path}
                      </td>
                      <td className="py-2.5 px-4 capitalize">{view.device_type}</td>
                      <td className="py-2.5 px-4 text-[#7E5874]">
                        {view.browser} • {view.os}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-stone-500">
                        {view.ip_address || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Action Events Log */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 overflow-hidden shadow-xs">
            <div className="p-4 bg-[#9C1448]/8 border-b border-[#D4AF37]/25 flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm font-bold text-[#9C1448] uppercase tracking-wider flex items-center gap-2">
                <span>🎯</span> Recent Interaction Events (Clicks, Audio, RSVP)
              </h3>
              <span className="text-[11px] text-[#7E5874]">
                Showing latest {analytics?.recentEvents.length || 0} events
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDF9F2] text-[#7E5874] uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-4">Time</th>
                    <th className="py-2.5 px-4">Event</th>
                    <th className="py-2.5 px-4">Page</th>
                    <th className="py-2.5 px-4">Payload / Details</th>
                    <th className="py-2.5 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70">
                  {analytics?.recentEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-stone-50/80">
                      <td className="py-2.5 px-4 text-[#7E5874] whitespace-nowrap">
                        {new Date(evt.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-[#C2185B]">
                        {evt.event_name}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-[#58334E]">
                        {evt.page_path || '—'}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-stone-600 max-w-sm truncate">
                        {JSON.stringify(evt.event_data)}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-stone-500">
                        {evt.ip_address || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

