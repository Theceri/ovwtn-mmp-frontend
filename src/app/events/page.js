'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { getPublicEvents } from '@/lib/api';

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(isoString) {
  if (!isoString) return { day: '', month: '' };
  const d = new Date(isoString);
  return {
    day: d.getDate(),
    month: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
  };
}

export default function PublicEventsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [page, searchTerm, showPast]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12, upcoming_only: !showPast };
      if (searchTerm) params.search = searchTerm;
      const data = await getPublicEvents(params);
      setEvents(data.items);
      setTotalEvents(data.total);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--brand-primary, #962021)' }}>
              Events
            </h1>
            <p className="mt-3 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary, #64748b)' }}>
              Discover upcoming events, workshops, and networking opportunities from the network.
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary, #94a3b8)' }}>
              Members can register for events.{' '}
              <Link href="/login" className="underline hover:no-underline" style={{ color: 'var(--brand-primary, #962021)' }}>
                Sign in
              </Link>{' '}
              to register.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 w-full max-w-md bg-white"
            style={{ borderColor: 'var(--input-border, #e2e8f0)' }}
          />
          <button
            onClick={() => { setShowPast(!showPast); setPage(1); }}
            className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              showPast ? 'bg-gray-200' : 'bg-white hover:bg-gray-50'
            }`}
            style={{ borderColor: 'var(--input-border, #e2e8f0)', color: 'var(--text-primary, #1e293b)' }}
          >
            {showPast ? 'Showing all events' : 'Show past events'}
          </button>
        </div>

        {loading && events.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: 'var(--brand-primary, #962021)' }} />
              <p style={{ color: 'var(--text-secondary, #64748b)' }}>Loading events...</p>
            </div>
          </div>
        ) : events.length > 0 ? (
          <>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary, #64748b)' }}>
              {totalEvents} event{totalEvents !== 1 ? 's' : ''} found
            </p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const { day, month } = formatDateShort(event.start_date);
                return (
                  <div key={event.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    {/* Date badge */}
                    <div className="flex items-start gap-4 p-5">
                      <div className="shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--brand-primary, #962021)' }}>
                        <span className="text-white text-lg font-bold leading-none">{day}</span>
                        <span className="text-white text-[10px] font-medium leading-none mt-0.5">{month}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text-primary, #1e293b)' }}>
                          {event.title}
                        </h3>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary, #94a3b8)' }}>
                          {formatDateTime(event.start_date)}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-2">
                      <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary, #64748b)' }}>
                        {event.description}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="mt-auto px-5 py-3 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {event.location && (
                          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-tertiary, #94a3b8)' }}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location.length > 25 ? event.location.substring(0, 25) + '...' : event.location}
                          </span>
                        )}
                        {event.is_online && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                            Online
                          </span>
                        )}
                      </div>
                      {event.registration_capacity && (
                        <span className="text-xs font-medium" style={{ color: event.spots_remaining <= 0 ? '#ef4444' : 'var(--text-secondary, #64748b)' }}>
                          {event.spots_remaining > 0 ? `${event.spots_remaining} spots left` : 'Full'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm" style={{ color: 'var(--text-secondary, #64748b)' }}>
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white"
                    style={{ borderColor: 'var(--input-border, #e2e8f0)', color: 'var(--text-primary, #1e293b)' }}>Previous</button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white"
                    style={{ borderColor: 'var(--input-border, #e2e8f0)', color: 'var(--text-primary, #1e293b)' }}>Next</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary, #64748b)' }}>
              No {showPast ? '' : 'upcoming '}events at the moment. Check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
