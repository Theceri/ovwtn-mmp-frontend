'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getMemberProfile } from '@/lib/api';
import Link from 'next/link';

export default function MemberProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getMemberProfile(token);
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderBottomColor: 'var(--brand-primary)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load profile. Please try again.</p>
      </div>
    );
  }

  const { user, organisation: org, membership } = profile;

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    expired: 'bg-red-100 text-red-800 border-red-200',
    suspended: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  // Parse JSON fields
  const parseSectors = (sectors) => {
    if (!sectors) return [];
    try {
      return JSON.parse(sectors);
    } catch {
      return sectors.split(',').map((s) => s.trim());
    }
  };

  const parseCounties = (counties) => {
    if (!counties) return [];
    try {
      return JSON.parse(counties);
    } catch {
      return counties.split(',').map((c) => c.trim());
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Organisation Profile
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            View and manage your organisation information
          </p>
        </div>
        <Link
          href="/member/profile/edit"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </Link>
      </div>

      {/* Organisation Header Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="h-24" style={{ backgroundColor: 'var(--brand-secondary)' }} />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10">
            {/* Logo */}
            <div className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
              {org?.logo_url ? (
                <img
                  src={`http://localhost:8000${org.logo_url}`}
                  alt={`${org.name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gray-100"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  {org?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>

            <div className="flex-1 pt-2">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {org?.name || 'Organisation'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {org?.county} {org?.registration_type ? `| ${org.registration_type}` : ''}
              </p>
            </div>

            {/* Membership Badge */}
            <div className="flex items-center gap-2">
              {membership?.tier_name && (
                <span
                  className="px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  {membership.tier_name}
                </span>
              )}
              {membership?.membership_status && (
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize border ${
                    statusColors[membership.membership_status] || statusColors.pending
                  }`}
                >
                  {membership.membership_status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Membership Details */}
      {membership && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Membership Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DetailItem label="Tier" value={membership.tier_name} />
            <DetailItem label="Status" value={membership.membership_status} capitalize />
            <DetailItem
              label="Start Date"
              value={
                membership.membership_start_date
                  ? new Date(membership.membership_start_date).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })
                  : null
              }
            />
            <DetailItem
              label="Expiry Date"
              value={
                membership.membership_expiry_date
                  ? new Date(membership.membership_expiry_date).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })
                  : 'No expiry'
              }
            />
          </div>

          {/* Permissions */}
          <div className="mt-5 pt-5 border-t">
            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Permissions
            </p>
            <div className="flex flex-wrap gap-2">
              <PermissionPill label="Voting Rights" enabled={membership.has_voting_rights} />
              <PermissionPill label="Post Listings" enabled={membership.can_post_listings} />
              <PermissionPill label="Access Resources" enabled={membership.can_access_resources} />
              <PermissionPill label="Register Events" enabled={membership.can_register_events} />
            </div>
          </div>
        </div>
      )}

      {/* Organisation Details */}
      {org && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Organisation Information
          </h3>

          {/* Description */}
          {(org.short_description || org.full_description) && (
            <div className="mb-6 pb-6 border-b">
              {org.short_description && (
                <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  {org.short_description}
                </p>
              )}
              {org.full_description && (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {org.full_description}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Physical Address" value={org.physical_address} />
            <DetailItem label="Postal Address" value={org.postal_address} />
            <DetailItem label="County" value={org.county} />
            <DetailItem label="Total Members" value={org.total_members?.toString()} />
            <DetailItem label="Registration Type" value={org.registration_type} />
            <DetailItem label="Registration Number" value={org.registration_number} />
            <DetailItem
              label="Registration Date"
              value={
                org.registration_date
                  ? new Date(org.registration_date).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })
                  : null
              }
            />
            <DetailItem
              label="Public Visibility"
              value={org.is_public_visible ? 'Visible' : 'Hidden'}
            />
          </div>

          {/* Sectors */}
          {org.sectors && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Sectors
              </p>
              <div className="flex flex-wrap gap-2">
                {parseSectors(org.sectors).map((sector, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Counties of Operation */}
          {org.counties_of_operation && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Counties of Operation
              </p>
              <div className="flex flex-wrap gap-2">
                {parseCounties(org.counties_of_operation).map((county, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
                  >
                    {county}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Information */}
      {org && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Organisation Phone" value={org.phone_number} />
            <DetailItem label="Organisation Email" value={org.email} />
            <DetailItem label="Website" value={org.website} isLink />
            <DetailItem label="Representative" value={org.representative_name} />
            <DetailItem label="Representative Email" value={org.representative_email} />
            <DetailItem label="Representative Phone" value={org.representative_phone} />
            <DetailItem label="Designation" value={org.representative_designation} />
          </div>
        </div>
      )}

      {/* Leadership */}
      {org && (org.chairperson_name || org.vice_chair_name || org.ceo_name) && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Leadership
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem label="Chairperson" value={org.chairperson_name} />
            <DetailItem label="Vice Chair" value={org.vice_chair_name} />
            <DetailItem label="CEO / Director" value={org.ceo_name} />
          </div>
        </div>
      )}

      {/* Account Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Account Email" value={user?.email} />
          <DetailItem label="Name" value={[user?.first_name, user?.last_name].filter(Boolean).join(' ') || null} />
          <DetailItem label="Phone" value={user?.phone_number} />
          <DetailItem
            label="Member Since"
            value={
              user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })
                : null
            }
          />
          <DetailItem
            label="Last Login"
            value={
              user?.last_login
                ? new Date(user.last_login).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })
                : 'First login'
            }
          />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, capitalize, isLink }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
      {isLink && value ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline"
          style={{ color: 'var(--brand-primary)' }}
        >
          {value}
        </a>
      ) : (
        <p
          className={`text-sm font-medium ${capitalize ? 'capitalize' : ''}`}
          style={{ color: value ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
        >
          {value || 'Not set'}
        </p>
      )}
    </div>
  );
}

function PermissionPill({ label, enabled }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
        enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
      }`}
    >
      {enabled ? (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
      {label}
    </span>
  );
}
