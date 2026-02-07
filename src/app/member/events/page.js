'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getPublicEvents,
  getMemberEvents,
  getMemberRegisteredEventIds,
  registerForEvent,
  unregisterFromEvent,
} from '@/lib/api';

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

export default function MemberEventsPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'registered'
  const [loading, setLoading] = useState(true);

  // Upcoming events
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // My registrations
  const [myEvents, setMyEvents] = useState([]);

  // Registered event IDs for badge display
  const [registeredIds, setRegisteredIds] = useState(new Set());

  // Action loading
  const [actionLoading, setActionLoading] = useState(null);

  // Confirm modal
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'register' | 'unregister', event }

  useEffect(() => {
    if (token) {
      loadRegisteredIds();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      if (tab === 'upcoming') {
        loadUpcomingEvents();
      } else {
        loadMyEvents();
      }
    }
  }, [token, tab, page, searchTerm]);

  const loadRegisteredIds = async () => {
    try {
      const data = await getMemberRegisteredEventIds(token);
      setRegisteredIds(new Set(data.event_ids));
    } catch {
      // silent fail
    }
  };

  const loadUpcomingEvents = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12, upcoming_only: true };
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

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      const data = await getMemberEvents({ limit: 50 }, token);
      setMyEvents(data.items);
    } catch (error) {
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    setActionLoading(event.id);
    try {
      await registerForEvent(event.id, token);
      toast.success(`Registered for "${event.title}"`);
      setRegisteredIds((prev) => new Set([...prev, event.id]));
      setConfirmAction(null);
      // Reload data
      if (tab === 'upcoming') loadUpcomingEvents();
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnregister = async (event) => {
    setActionLoading(event.id);
    try {
      await unregisterFromEvent(event.id, token);
      toast.success('Unregistered from event');
      setRegisteredIds((prev) => {
        const updated = new Set(prev);
        updated.delete(event.id);
        return updated;
      });
      setConfirmAction(null);
      // Reload data
      if (tab === 'registered') loadMyEvents();
      loadRegisteredIds();
    } catch (error) {
      toast.error(error.message || 'Failed to unregister');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && events.length === 0 && myEvents.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: 'var(--brand-primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Events</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Browse upcoming events and manage your registrations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => { setTab('upcoming'); setPage(1); }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === 'upcoming' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
          }`}
          style={{ color: 'var(--text-primary)' }}
        >
          Upcoming Events
        </button>
        <button
          onClick={() => setTab('registered')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === 'registered' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
          }`}
          style={{ color: 'var(--text-primary)' }}
        >
          My Registrations
          {registeredIds.size > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white" style={{ backgroundColor: 'var(--brand-primary)' }}>
              {registeredIds.size}
            </span>
          )}
        </button>
      </div>

      {/* Upcoming Events Tab */}
      {tab === 'upcoming' && (
        <>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 w-64"
              style={{ borderColor: 'var(--input-border)' }}
            />
          </div>

          {events.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const { day, month } = formatDateShort(event.start_date);
                const isRegistered = registeredIds.has(event.id);
                const isFull = event.registration_capacity && event.spots_remaining <= 0;

                return (
                  <div key={event.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start gap-4 p-5">
                      <div className="shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
                        <span className="text-white text-lg font-bold leading-none">{day}</span>
                        <span className="text-white text-[10px] font-medium leading-none mt-0.5">{month}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <h3 className="text-sm font-semibold line-clamp-2 flex-1" style={{ color: 'var(--text-primary)' }}>
                            {event.title}
                          </h3>
                          {isRegistered && (
                            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                              Registered
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                          {formatDateTime(event.start_date)}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-2">
                      <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{event.description}</p>
                    </div>

                    {/* Location + Spots */}
                    <div className="px-5 py-2 flex items-center gap-2 flex-wrap">
                      {event.location && (
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location.length > 30 ? event.location.substring(0, 30) + '...' : event.location}
                        </span>
                      )}
                      {event.is_online && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">Online</span>
                      )}
                    </div>

                    {/* Action */}
                    <div className="mt-auto px-5 py-3 border-t flex items-center justify-between">
                      <div>
                        {event.registration_capacity && (
                          <span className="text-xs font-medium" style={{ color: isFull ? '#ef4444' : 'var(--text-secondary)' }}>
                            {isFull ? 'Full' : `${event.spots_remaining} spots left`}
                          </span>
                        )}
                      </div>
                      {event.allow_registration && (
                        isRegistered ? (
                          <button
                            onClick={() => setConfirmAction({ type: 'unregister', event })}
                            disabled={actionLoading === event.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === event.id ? 'Processing...' : 'Unregister'}
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmAction({ type: 'register', event })}
                            disabled={actionLoading === event.id || isFull}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-all hover:shadow-sm disabled:opacity-50"
                            style={{ backgroundColor: 'var(--brand-primary)' }}
                          >
                            {actionLoading === event.id ? 'Processing...' : isFull ? 'Full' : 'Register'}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No upcoming events at the moment. Check back later.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}>Previous</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}>Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* My Registrations Tab */}
      {tab === 'registered' && (
        <>
          {myEvents.length > 0 ? (
            <div className="space-y-3">
              {myEvents.map((item) => {
                const event = item.event;
                const { day, month } = formatDateShort(event.start_date);
                return (
                  <div key={item.registration_id} className="bg-white rounded-xl border shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
                      <span className="text-white text-lg font-bold leading-none">{day}</span>
                      <span className="text-white text-[10px] font-medium leading-none mt-0.5">{month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{event.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{formatDateTime(event.start_date)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {event.location && (
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{event.location}</span>
                        )}
                        {event.is_online && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">Online</span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Registered
                      </span>
                      <button
                        onClick={() => setConfirmAction({ type: 'unregister', event })}
                        disabled={actionLoading === event.id}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        Unregister
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                You haven&apos;t registered for any events yet.
              </p>
              <button
                onClick={() => setTab('upcoming')}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-all hover:shadow-sm"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Browse Upcoming Events
              </button>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setConfirmAction(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {confirmAction.type === 'register' ? 'Confirm Registration' : 'Confirm Unregistration'}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {confirmAction.type === 'register'
                ? <>Are you sure you want to register for <strong>&quot;{confirmAction.event.title}&quot;</strong>?</>
                : <>Are you sure you want to unregister from <strong>&quot;{confirmAction.event.title}&quot;</strong>?</>
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmAction.type === 'register' ? handleRegister(confirmAction.event) : handleUnregister(confirmAction.event)}
                disabled={actionLoading === confirmAction.event.id}
                className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-all disabled:opacity-50 ${
                  confirmAction.type === 'register' ? '' : 'bg-red-600 hover:bg-red-700'
                }`}
                style={confirmAction.type === 'register' ? { backgroundColor: 'var(--brand-primary)' } : {}}
              >
                {actionLoading === confirmAction.event.id ? 'Processing...' : confirmAction.type === 'register' ? 'Register' : 'Unregister'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
