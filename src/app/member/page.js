'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getMemberProfile } from '@/lib/api';
import OnboardingModal from '@/components/member/OnboardingModal';
import Link from 'next/link';

export default function MemberDashboardPage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    if (token) {
      loadProfile();
    }
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

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    loadProfile(); // Reload to get updated data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderBottomColor: 'var(--brand-primary)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const org = profile?.organisation;
  const membership = profile?.membership;

  // Status badge colors
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-100 text-gray-800',
  };

  return (
    <>
      {/* Onboarding Modal */}
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}

      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Welcome back{user?.first_name ? `, ${user.first_name}` : ''}!
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {org ? org.name : 'Your member dashboard'}
              </p>
            </div>
            {org?.logo_url && (
              <img
                src={`http://localhost:8000${org.logo_url}`}
                alt={`${org.name} logo`}
                className="w-14 h-14 rounded-lg object-contain border"
              />
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Membership Tier */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}
              >
                <svg className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                  Membership Tier
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {membership?.tier_name || 'N/A'}
                </p>
              </div>
            </div>
            {membership?.has_voting_rights && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Voting Rights
              </span>
            )}
          </div>

          {/* Membership Status */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--brand-accent)', opacity: 0.15 }}
              >
                <svg className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                  Status
                </p>
                <span
                  className={`inline-block text-sm font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    statusColors[membership?.membership_status] || statusColors.pending
                  }`}
                >
                  {membership?.membership_status || 'Pending'}
                </span>
              </div>
            </div>
            {membership?.membership_expiry_date && (
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Expires: {new Date(membership.membership_expiry_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Quick Actions
            </p>
            <div className="space-y-2">
              <Link
                href="/member/profile"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                style={{ color: 'var(--brand-primary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </Link>
              <Link
                href="/member/profile/edit"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                style={{ color: 'var(--brand-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Organisation Info Card */}
        {org && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Organisation Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="County" value={org.county} />
              <InfoItem label="Registration Type" value={org.registration_type} />
              <InfoItem label="Registration Number" value={org.registration_number} />
              <InfoItem label="Phone" value={org.phone_number} />
              <InfoItem label="Email" value={org.email} />
              <InfoItem label="Website" value={org.website} />
              {org.short_description && (
                <div className="md:col-span-2">
                  <InfoItem label="Description" value={org.short_description} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Permissions Card */}
        {membership && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Your Permissions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <PermissionBadge label="Post Listings" enabled={membership.can_post_listings} />
              <PermissionBadge label="Access Resources" enabled={membership.can_access_resources} />
              <PermissionBadge label="Register for Events" enabled={membership.can_register_events} />
              <PermissionBadge label="Voting Rights" enabled={membership.has_voting_rights} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
      <p className="text-sm font-medium" style={{ color: value ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
        {value || 'Not set'}
      </p>
    </div>
  );
}

function PermissionBadge({ label, enabled }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
      enabled ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
    }`}>
      {enabled ? (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
      {label}
    </div>
  );
}
