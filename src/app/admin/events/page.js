'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
} from '@/lib/api';

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toLocalInputValue(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function isUpcoming(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) >= new Date();
}

const EMPTY_FORM = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  location: '',
  is_online: false,
  online_link: '',
  registration_capacity: '',
  registration_deadline: '',
  allow_registration: true,
  is_published: false,
};

export default function AdminEventsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Create/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Registrations drawer
  const [showRegistrations, setShowRegistrations] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  useEffect(() => {
    if (token) loadEvents();
  }, [token, page, searchTerm, filterStatus]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (searchTerm) params.search = searchTerm;
      if (filterStatus) params.status = filterStatus;
      const data = await getAdminEvents(params, token);
      setEvents(data.items);
      setTotalEvents(data.total);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingEvent(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title || '',
      description: event.description || '',
      start_date: toLocalInputValue(event.start_date),
      end_date: toLocalInputValue(event.end_date),
      location: event.location || '',
      is_online: event.is_online || false,
      online_link: event.online_link || '',
      registration_capacity: event.registration_capacity ?? '',
      registration_deadline: toLocalInputValue(event.registration_deadline),
      allow_registration: event.allow_registration ?? true,
      is_published: event.is_published || false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!form.start_date) {
      toast.error('Start date is required');
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: form.title.trim(),
        description: form.description.trim(),
        start_date: new Date(form.start_date).toISOString(),
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
        location: form.location.trim() || null,
        is_online: form.is_online,
        online_link: form.online_link.trim() || null,
        registration_capacity: form.registration_capacity ? parseInt(form.registration_capacity) : null,
        registration_deadline: form.registration_deadline ? new Date(form.registration_deadline).toISOString() : null,
        allow_registration: form.allow_registration,
        is_published: form.is_published,
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, data, token);
        toast.success('Event updated');
      } else {
        await createEvent(data, token);
        toast.success('Event created');
      }

      setShowModal(false);
      loadEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (event) => {
    try {
      await updateEvent(event.id, { is_published: !event.is_published }, token);
      toast.success(event.is_published ? 'Event unpublished' : 'Event published');
      loadEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to update event');
    }
  };

  const handleDelete = async (eventId) => {
    setDeleting(true);
    try {
      await deleteEvent(eventId, token);
      toast.success('Event deleted');
      setDeleteConfirm(null);
      loadEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const openRegistrations = async (event) => {
    setShowRegistrations(event);
    setLoadingRegs(true);
    try {
      const data = await getEventRegistrations(event.id, { limit: 200 }, token);
      setRegistrations(data.items);
    } catch (error) {
      toast.error('Failed to load registrations');
      setRegistrations([]);
    } finally {
      setLoadingRegs(false);
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderBottomColor: 'var(--brand-primary)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Events
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage events ({totalEvents} total)
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 w-64"
          style={{ borderColor: 'var(--input-border)' }}
        />
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
        >
          <option value="">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>Event</th>
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>Date</th>
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>Location</th>
              <th className="text-center text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>Registrations</th>
              <th className="text-center text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>Status</th>
              <th className="text-right text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {event.title}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      {event.description?.substring(0, 60)}{event.description?.length > 60 ? '...' : ''}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatDateTime(event.start_date)}
                    </p>
                    {!isUpcoming(event.start_date) && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">Past</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {event.is_online ? (event.location ? `${event.location} + Online` : 'Online') : (event.location || '—')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openRegistrations(event)}
                    className="text-sm font-medium hover:underline"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    {event.registration_count || 0}
                    {event.registration_capacity ? ` / ${event.registration_capacity}` : ''}
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleTogglePublished(event)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      event.is_published
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    {event.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(event)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(event)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {events.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No events found. Create your first event to get started.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages} ({totalEvents} events)
          </p>
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
              {editingEvent ? 'Edit Event' : 'Create Event'}
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="Event title" maxLength={255} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  rows={3} placeholder="Event description" />
              </div>

              {/* Date / Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Start Date &amp; Time <span className="text-red-500">*</span>
                  </label>
                  <input type="datetime-local" value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    End Date &amp; Time
                  </label>
                  <input type="datetime-local" value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }} />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Location
                </label>
                <input type="text" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="Venue name and address" maxLength={500} />
              </div>

              {/* Online toggle + link */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => setForm({ ...form, is_online: !form.is_online })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_online ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_online ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Online event</span>
                </div>
                {form.is_online && (
                  <input type="url" value={form.online_link}
                    onChange={(e) => setForm({ ...form, online_link: e.target.value })}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }}
                    placeholder="Meeting link (Zoom, Teams, etc.)" />
                )}
              </div>

              {/* Registration settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Registration Capacity
                  </label>
                  <input type="number" min="1" value={form.registration_capacity}
                    onChange={(e) => setForm({ ...form, registration_capacity: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }}
                    placeholder="Unlimited" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Registration Deadline
                  </label>
                  <input type="datetime-local" value={form.registration_deadline}
                    onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }} />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => setForm({ ...form, allow_registration: !form.allow_registration })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.allow_registration ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.allow_registration ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Allow registration</span>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => setForm({ ...form, is_published: !form.is_published })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_published ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_published ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Published</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-primary)' }}>
                {saving ? 'Saving...' : editingEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Delete Event</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
              Are you sure you want to delete <strong>&quot;{deleteConfirm.title}&quot;</strong>?
            </p>
            {deleteConfirm.registration_count > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-700">
                  This event has {deleteConfirm.registration_count} registration(s). All registrations will also be deleted.
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registrations Modal */}
      {showRegistrations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowRegistrations(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Registrations</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {showRegistrations.title} — {formatDateTime(showRegistrations.start_date)}
                </p>
              </div>
              <button onClick={() => setShowRegistrations(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingRegs ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-3" style={{ borderBottomColor: 'var(--brand-primary)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
              </div>
            ) : registrations.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left text-xs font-medium uppercase px-4 py-2" style={{ color: 'var(--text-tertiary)' }}>Name</th>
                    <th className="text-left text-xs font-medium uppercase px-4 py-2" style={{ color: 'var(--text-tertiary)' }}>Email</th>
                    <th className="text-left text-xs font-medium uppercase px-4 py-2" style={{ color: 'var(--text-tertiary)' }}>Organisation</th>
                    <th className="text-left text-xs font-medium uppercase px-4 py-2" style={{ color: 'var(--text-tertiary)' }}>Status</th>
                    <th className="text-left text-xs font-medium uppercase px-4 py-2" style={{ color: 'var(--text-tertiary)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b last:border-b-0">
                      <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-primary)' }}>{reg.registrant_name}</td>
                      <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{reg.registrant_email}</td>
                      <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{reg.organisation_name || '—'}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          reg.status === 'registered' ? 'bg-green-100 text-green-700' :
                          reg.status === 'cancelled' ? 'bg-gray-100 text-gray-500' :
                          'bg-blue-100 text-blue-700'
                        }`}>{reg.status}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatDate(reg.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No registrations yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
