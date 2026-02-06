'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getMemberProfile,
  updateMemberProfile,
  updateMemberContacts,
  uploadOrganisationLogo,
} from '@/lib/api';

export default function EditProfilePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const fileInputRef = useRef(null);

  // Form state
  const [generalForm, setGeneralForm] = useState({
    short_description: '',
    full_description: '',
    physical_address: '',
    postal_address: '',
    website: '',
    is_public_visible: false,
  });

  const [contactForm, setContactForm] = useState({
    phone_number: '',
    email: '',
    website: '',
    representative_email: '',
    representative_phone: '',
  });

  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (token) loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getMemberProfile(token);
      setProfile(data);

      if (data.organisation) {
        const org = data.organisation;
        setGeneralForm({
          short_description: org.short_description || '',
          full_description: org.full_description || '',
          physical_address: org.physical_address || '',
          postal_address: org.postal_address || '',
          website: org.website || '',
          is_public_visible: org.is_public_visible || false,
        });
        setContactForm({
          phone_number: org.phone_number || '',
          email: org.email || '',
          website: org.website || '',
          representative_email: org.representative_email || '',
          representative_phone: org.representative_phone || '',
        });
        if (org.logo_url) {
          setLogoPreview(org.logo_url);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await updateMemberProfile(generalForm, token);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContacts = async () => {
    setSaving(true);
    try {
      await updateMemberContacts(contactForm, token);
      toast.success('Contact methods updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update contacts');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, GIF, or WebP image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingLogo(true);
    try {
      const result = await uploadOrganisationLogo(file, token);
      setLogoPreview(result.logo_url);
      toast.success('Logo updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info' },
    { id: 'contacts', label: 'Contact Methods' },
    { id: 'logo', label: 'Logo' },
  ];

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

  const org = profile?.organisation;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Edit Profile
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Update your organisation&apos;s editable information
          </p>
        </div>
        <button
          onClick={() => router.push('/member/profile')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
          style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Profile
        </button>
      </div>

      {/* Protected fields notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Some fields are protected</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Organisation name, registration details, and membership tier can only be changed by OVWTN administrators.
              Contact the secretariat if you need to update these fields.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--brand-primary)]'
                  : 'border-transparent hover:border-gray-300'
              }`}
              style={{
                color: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        {/* General Info Tab */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            {/* Read-only fields */}
            <div className="grid grid-cols-2 gap-4 pb-5 border-b">
              <ReadOnlyField label="Organisation Name" value={org?.name} />
              <ReadOnlyField label="County" value={org?.county} />
              <ReadOnlyField label="Registration Type" value={org?.registration_type} />
              <ReadOnlyField label="Registration Number" value={org?.registration_number} />
            </div>

            {/* Editable fields */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Short Description
              </label>
              <textarea
                value={generalForm.short_description}
                onChange={(e) => setGeneralForm({ ...generalForm, short_description: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                rows={2}
                maxLength={500}
                placeholder="Brief description of your organisation (max 500 characters)"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {generalForm.short_description.length}/500
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Full Description
              </label>
              <textarea
                value={generalForm.full_description}
                onChange={(e) => setGeneralForm({ ...generalForm, full_description: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                rows={4}
                placeholder="Detailed description of your organisation, services, and activities"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Physical Address
                </label>
                <input
                  type="text"
                  value={generalForm.physical_address}
                  onChange={(e) => setGeneralForm({ ...generalForm, physical_address: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Postal Address
                </label>
                <input
                  type="text"
                  value={generalForm.postal_address}
                  onChange={(e) => setGeneralForm({ ...generalForm, postal_address: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Website
              </label>
              <input
                type="url"
                value={generalForm.website}
                onChange={(e) => setGeneralForm({ ...generalForm, website: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                placeholder="https://"
              />
            </div>

            {/* Visibility toggle */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setGeneralForm({ ...generalForm, is_public_visible: !generalForm.is_public_visible })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  generalForm.is_public_visible ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    generalForm.is_public_visible ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Public Directory Visibility
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {generalForm.is_public_visible
                    ? 'Your organisation is visible in the public directory'
                    : 'Your organisation is hidden from the public directory'}
                </p>
              </div>
            </div>

            {/* Save button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveGeneral}
                disabled={saving}
                className="px-6 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Contact Methods Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Organisation Phone
              </label>
              <input
                type="tel"
                value={contactForm.phone_number}
                onChange={(e) => setContactForm({ ...contactForm, phone_number: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                placeholder="+254..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Organisation Email
              </label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                placeholder="info@organisation.co.ke"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Website
              </label>
              <input
                type="url"
                value={contactForm.website}
                onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                placeholder="https://"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Representative Email
                </label>
                <input
                  type="email"
                  value={contactForm.representative_email}
                  onChange={(e) => setContactForm({ ...contactForm, representative_email: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Representative Phone
                </label>
                <input
                  type="tel"
                  value={contactForm.representative_phone}
                  onChange={(e) => setContactForm({ ...contactForm, representative_phone: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="+254..."
                />
              </div>
            </div>

            {/* Save button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveContacts}
                disabled={saving}
                className="px-6 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {saving ? 'Saving...' : 'Save Contacts'}
              </button>
            </div>
          </div>
        )}

        {/* Logo Tab */}
        {activeTab === 'logo' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Organisation Logo
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Upload a logo for your organisation. Accepted formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB.
              </p>
            </div>

            <div className="flex flex-col items-center gap-5">
              {/* Current logo */}
              <div
                className="w-40 h-40 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50"
                style={{ borderColor: logoPreview ? 'var(--brand-primary)' : 'var(--input-border)' }}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview.startsWith('blob:') ? logoPreview : `http://localhost:8000${logoPreview}`}
                    alt="Organisation logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <svg className="w-12 h-12 mx-auto mb-2" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No logo uploaded</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {uploadingLogo ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </span>
                ) : logoPreview ? (
                  'Change Logo'
                ) : (
                  'Upload Logo'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
      <p className="text-sm font-medium flex items-center gap-1.5" style={{ color: value ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
        {value || 'Not set'}
        <svg className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </p>
    </div>
  );
}
