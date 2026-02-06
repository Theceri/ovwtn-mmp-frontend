'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getMemberListings, deleteListing, getPublicCategories } from '@/lib/api';

export default function MemberListingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (token) {
      loadCategories();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadListings();
    }
  }, [token, page, search, categoryFilter]);

  const loadCategories = async () => {
    try {
      const data = await getPublicCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (categoryFilter) params.category_id = categoryFilter;
      const data = await getMemberListings(params, token);
      setListings(data.items);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Failed to load listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    setDeleting(true);
    try {
      await deleteListing(listingId, token);
      toast.success('Listing deleted successfully');
      setDeleteConfirm(null);
      loadListings();
    } catch (error) {
      toast.error(error.message || 'Failed to delete listing');
    } finally {
      setDeleting(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadListings();
  };

  const formatPrice = (listing) => {
    if (listing.price_type === 'on_request') return 'Price on request';
    const currency = listing.currency || 'KES';
    if (listing.price_type === 'exact') {
      return `${currency} ${Number(listing.price_min).toLocaleString()}`;
    }
    if (listing.price_type === 'range') {
      return `${currency} ${Number(listing.price_min).toLocaleString()} - ${Number(listing.price_max).toLocaleString()}`;
    }
    return '';
  };

  const getVisibilityBadge = (visibility) => {
    const badges = {
      public: { label: 'Public', color: '#91a27b', bg: '#f0f5eb' },
      members_only: { label: 'Members Only', color: '#385664', bg: '#e8eef2' },
      paid_tier_only: { label: 'Paid Tier Only', color: '#d96534', bg: '#fdf0ea' },
    };
    return badges[visibility] || badges.public;
  };

  if (loading && listings.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderBottomColor: 'var(--brand-primary)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            My Listings
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage your goods and services listings ({total} total)
          </p>
        </div>
        <Link
          href="/member/listings/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Listing
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: 'var(--input-border)' }}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border rounded-lg text-sm bg-white"
            style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--brand-secondary)' }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No listings yet
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Create your first listing to showcase your goods or services to other members.
          </p>
          <Link
            href="/member/listings/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => {
            const visibilityBadge = getVisibilityBadge(listing.visibility);
            return (
              <div
                key={listing.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Photo thumbnail */}
                <div className="h-40 bg-gray-100 relative">
                  {listing.photos && listing.photos.length > 0 ? (
                    <img
                      src={`http://localhost:8000${listing.photos[0]}`}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Status badges */}
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: visibilityBadge.bg, color: visibilityBadge.color }}
                    >
                      {visibilityBadge.label}
                    </span>
                    {!listing.is_active && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  {/* Category */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm">{listing.category_icon}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                      {listing.category_name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {listing.title}
                  </h3>

                  {/* Summary */}
                  {listing.short_summary && (
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {listing.short_summary}
                    </p>
                  )}

                  {/* Price */}
                  <p className="text-sm font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>
                    {formatPrice(listing)}
                    {listing.unit_of_sale && (
                      <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>
                        {' '}/ {listing.unit_of_sale}
                      </span>
                    )}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Link
                      href={`/member/listings/${listing.id}/edit`}
                      className="flex-1 text-center px-3 py-2 text-xs font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(listing)}
                      className="px-3 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-40 hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
          >
            Previous
          </button>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-40 hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Delete Listing
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--text-primary)' }}>
              Are you sure you want to delete <strong>&quot;{deleteConfirm.title}&quot;</strong>?
              All photos and documents will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
