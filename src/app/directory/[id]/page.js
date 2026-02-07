'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPublicOrganisationProfile } from '@/lib/api';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';

function TierBadge({ tierSlug, tierName }) {
  const styles = {
    full: { bg: '#fdf0ea', color: '#d96534', label: tierName || 'Full' },
    basic: { bg: '#e8eef2', color: '#385664', label: tierName || 'Basic' },
  };
  const style = styles[tierSlug] || styles.basic;
  return (
    <span
      className="text-sm font-semibold px-3 py-1 rounded-full"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label} Member
    </span>
  );
}

function formatPrice(listing) {
  if (listing.price_type === 'on_request') return 'Price on request';
  const currency = listing.currency || 'KES';
  if (listing.price_type === 'exact') {
    return `${currency} ${Number(listing.price_min).toLocaleString()}`;
  }
  if (listing.price_type === 'range') {
    return `${currency} ${Number(listing.price_min).toLocaleString()} - ${Number(listing.price_max).toLocaleString()}`;
  }
  return '';
}

function formatWhatsAppUrl(phone) {
  // Strip non-numeric characters and ensure country code
  const cleaned = phone.replace(/[^0-9+]/g, '');
  const number = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
  return `https://wa.me/${number}`;
}

function ListingCard({ listing }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
  const photos = Array.isArray(listing.photos) ? listing.photos : [];
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      >
        {/* Photo */}
        <div className="h-44 bg-gray-100 relative">
          {photos.length > 0 ? (
            <img
              src={`${API_BASE}${photos[0]}`}
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
          {listing.category_icon && (
            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              {listing.category_icon} {listing.category_name}
            </span>
          )}
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:underline" style={{ color: 'var(--text-primary)' }}>
            {listing.title}
          </h4>
          {listing.short_summary && (
            <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {listing.short_summary}
            </p>
          )}
          <p className="text-sm font-bold" style={{ color: 'var(--brand-primary)' }}>
            {formatPrice(listing)}
            {listing.unit_of_sale && (
              <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}> / {listing.unit_of_sale}</span>
            )}
          </p>
        </div>
      </div>

      {/* Listing Detail Modal */}
      {showDetail && (
        <ListingDetailModal listing={listing} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}

function ListingDetailModal({ listing, onClose }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
  const photos = Array.isArray(listing.photos) ? listing.photos : [];
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            {listing.category_icon && (
              <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {listing.category_icon} {listing.category_name}
              </span>
            )}
            <h3 className="text-lg font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {listing.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Photos */}
        {photos.length > 0 && (
          <div className="border-b">
            <div className="h-64 bg-gray-100">
              <img
                src={`${API_BASE}${photos[activePhoto]}`}
                alt={listing.title}
                className="w-full h-full object-contain"
              />
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      idx === activePhoto ? 'border-red-500 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={`${API_BASE}${photo}`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Price */}
          <div className="flex items-center gap-3">
            <p className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>
              {formatPrice(listing)}
            </p>
            {listing.unit_of_sale && (
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>per {listing.unit_of_sale}</span>
            )}
          </div>

          {/* Summary */}
          {listing.short_summary && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {listing.short_summary}
            </p>
          )}

          {/* Contact buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {listing.whatsapp_phone && (
              <a
                href={formatWhatsAppUrl(listing.whatsapp_phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 shadow-sm"
                style={{ backgroundColor: '#25D366' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact via WhatsApp
              </a>
            )}
            {listing.contact_email && (
              <a
                href={`mailto:${listing.contact_email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            )}
            {listing.contact_phone && (
              <a
                href={`tel:${listing.contact_phone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicOrganisationProfilePage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [org, setOrg] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

  useEffect(() => {
    loadProfile();
  }, [params.id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicOrganisationProfile(params.id);
      setOrg(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.status === 404 ? 'Organisation not found' : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4"
              style={{ borderBottomColor: 'var(--brand-primary)' }}
            />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center max-w-md mx-auto px-4">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {error}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              This organisation may not be available in the public directory.
            </p>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Back to Directory
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sectors = Array.isArray(org.sectors) ? org.sectors : [];
  const counties = Array.isArray(org.counties_of_operation) ? org.counties_of_operation : [];
  const listings = Array.isArray(org.listings) ? org.listings : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Breadcrumb */}
      <div className="pt-24 pb-2 px-4" style={{ backgroundColor: '#f7f8fa' }}>
        <div className="container mx-auto max-w-5xl">
          <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <Link href="/directory" className="hover:underline" style={{ color: 'var(--brand-secondary)' }}>
              Directory
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{org.name}</span>
          </nav>
        </div>
      </div>

      {/* Profile Header */}
      <section className="pb-8 px-4" style={{ backgroundColor: '#f7f8fa' }}>
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-50 border flex-shrink-0 flex items-center justify-center overflow-hidden">
                {org.logo_url ? (
                  <img
                    src={`${API_BASE}${org.logo_url}`}
                    alt={`${org.name} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <svg className="w-12 h-12" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {org.name}
                  </h1>
                  <TierBadge tierSlug={org.membership_tier_slug} tierName={org.membership_tier} />
                </div>

                {org.short_description && (
                  <p className="text-base mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {org.short_description}
                  </p>
                )}

                {/* Quick details */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {org.county && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span style={{ color: 'var(--text-secondary)' }}>{org.county}</span>
                    </div>
                  )}
                  {org.website && (
                    <a
                      href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:underline"
                      style={{ color: 'var(--brand-secondary)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Website
                    </a>
                  )}
                  {org.email && (
                    <a
                      href={`mailto:${org.email}`}
                      className="flex items-center gap-1.5 hover:underline"
                      style={{ color: 'var(--brand-secondary)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </a>
                  )}
                  {org.phone_number && (
                    <a
                      href={`tel:${org.phone_number}`}
                      className="flex items-center gap-1.5 hover:underline"
                      style={{ color: 'var(--brand-secondary)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {org.phone_number}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              {org.full_description && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>About</h2>
                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {org.full_description}
                  </div>
                </div>
              )}

              {/* Listings */}
              {listings.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Goods & Services ({listings.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Sectors */}
              {sectors.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Sectors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: '#f0f5eb', color: '#5a6b4d' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Counties of operation */}
              {counties.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Counties of Operation
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {counties.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-100"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact card */}
              {(org.email || org.phone_number || org.physical_address) && (
                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Contact
                  </h3>
                  <div className="space-y-3 text-sm">
                    {org.physical_address && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span style={{ color: 'var(--text-secondary)' }}>{org.physical_address}</span>
                      </div>
                    )}
                    {org.email && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${org.email}`} className="hover:underline" style={{ color: 'var(--brand-secondary)' }}>
                          {org.email}
                        </a>
                      </div>
                    )}
                    {org.phone_number && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${org.phone_number}`} className="hover:underline" style={{ color: 'var(--brand-secondary)' }}>
                          {org.phone_number}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Member since */}
              {org.membership_start_date && (
                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Member Since
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(org.membership_start_date).toLocaleDateString('en-KE', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
