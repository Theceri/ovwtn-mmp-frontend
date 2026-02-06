'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getMemberOnboardingStatus,
  completeOnboardingStep,
  skipOnboarding,
  changePassword,
  updateMemberProfile,
  updateMemberContacts,
  uploadOrganisationLogo,
  getMemberProfile,
} from '@/lib/api';

/**
 * Onboarding Modal - Displayed on first login for new member accounts
 * 
 * Steps:
 * 1. Update password (change from temporary) - mandatory
 * 2. Confirm/update organisation profile - mandatory
 * 3. Add contact methods - skippable
 * 4. Upload organisation logo - skippable
 * 5. Create first listing (Basic/Full only) - skippable
 */
export default function OnboardingModal({ onComplete }) {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState(null);
  const [profile, setProfile] = useState(null);

  // Step 1: Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Profile confirmation
  const [profileForm, setProfileForm] = useState({});

  // Step 3: Contact methods
  const [contactForm, setContactForm] = useState({});

  // Step 4: Logo upload
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      setLoading(true);
      const status = await getMemberOnboardingStatus(token);
      setOnboardingData(status);

      if (!status.onboarding_completed && status.first_login) {
        setIsOpen(true);
        // Set current step to the next incomplete step
        const nextStep = status.onboarding_step + 1;
        setCurrentStep(Math.min(nextStep, 5));

        // Load profile data for steps 2-4
        const profileData = await getMemberProfile(token);
        setProfile(profileData);

        if (profileData.organisation) {
          setProfileForm({
            short_description: profileData.organisation.short_description || '',
            full_description: profileData.organisation.full_description || '',
            physical_address: profileData.organisation.physical_address || '',
            postal_address: profileData.organisation.postal_address || '',
            website: profileData.organisation.website || '',
          });
          setContactForm({
            phone_number: profileData.organisation.phone_number || '',
            email: profileData.organisation.email || '',
            website: profileData.organisation.website || '',
            representative_email: profileData.organisation.representative_email || '',
            representative_phone: profileData.organisation.representative_phone || '',
          });
          if (profileData.organisation.logo_url) {
            setLogoPreview(profileData.organisation.logo_url);
          }
        }
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step handlers
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      await completeOnboardingStep(1, token);
      toast.success('Password changed successfully!');
      setCurrentStep(2);
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileConfirm = async () => {
    setSubmitting(true);
    try {
      // Only send fields that have values
      const updates = {};
      Object.entries(profileForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          updates[key] = value;
        }
      });

      if (Object.keys(updates).length > 0) {
        await updateMemberProfile(updates, token);
      }
      await completeOnboardingStep(2, token);
      toast.success('Organisation profile confirmed!');
      setCurrentStep(3);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactUpdate = async () => {
    setSubmitting(true);
    try {
      const updates = {};
      Object.entries(contactForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          updates[key] = value;
        }
      });

      if (Object.keys(updates).length > 0) {
        await updateMemberContacts(updates, token);
      }
      await completeOnboardingStep(3, token);
      toast.success('Contact methods updated!');
      setCurrentStep(4);
    } catch (error) {
      toast.error(error.message || 'Failed to update contacts');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      // Skip if no file selected, just complete step
      try {
        await completeOnboardingStep(4, token);
        advanceAfterStep4();
      } catch (error) {
        toast.error(error.message || 'Failed to complete step');
      }
      return;
    }

    setSubmitting(true);
    try {
      await uploadOrganisationLogo(logoFile, token);
      await completeOnboardingStep(4, token);
      toast.success('Logo uploaded successfully!');
      advanceAfterStep4();
    } catch (error) {
      toast.error(error.message || 'Failed to upload logo');
    } finally {
      setSubmitting(false);
    }
  };

  const advanceAfterStep4 = () => {
    // Check if step 5 is applicable (Basic/Full members only)
    const step5 = onboardingData?.steps?.[5];
    if (step5 && step5.applicable) {
      setCurrentStep(5);
    } else {
      handleComplete();
    }
  };

  const handleSkipStep = async () => {
    if (currentStep <= 1) return; // Can't skip password change
    
    setSubmitting(true);
    try {
      await completeOnboardingStep(currentStep, token);
      
      if (currentStep >= 5 || (currentStep === 4 && !onboardingData?.steps?.[5]?.applicable)) {
        handleComplete();
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to skip step');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipAll = async () => {
    setSubmitting(true);
    try {
      await skipOnboarding(token);
      toast.success('Onboarding completed! You can update your profile anytime.');
      handleComplete();
    } catch (error) {
      toast.error(error.message || 'Failed to skip onboarding');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    if (onComplete) onComplete();
  };

  const handleListingSkip = async () => {
    setSubmitting(true);
    try {
      await completeOnboardingStep(5, token);
      toast.success('Onboarding complete! You can create listings anytime from your dashboard.');
      handleComplete();
    } catch (error) {
      toast.error(error.message || 'Failed to complete onboarding');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
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

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  if (loading || !isOpen) return null;

  // Step progress
  const totalSteps = onboardingData?.total_steps || 5;
  const progressPercent = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Welcome to OVWTN!
            </h2>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100" style={{ color: 'var(--text-secondary)' }}>
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'var(--brand-primary)',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Step 1: Password Change */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Update Your Password
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  For security, please change your temporary password.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="Enter your temporary password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="Min 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="Repeat new password"
                />
              </div>
            </div>
          )}

          {/* Step 2: Profile Confirmation */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Confirm Organisation Profile
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Review and update your organisation details.
                </p>
              </div>

              {profile?.organisation && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {profile.organisation.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    {profile.organisation.county} &bull; {profile.organisation.registration_type}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Short Description
                </label>
                <textarea
                  value={profileForm.short_description}
                  onChange={(e) => setProfileForm({ ...profileForm, short_description: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                  rows={2}
                  maxLength={500}
                  placeholder="Brief description of your organisation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Full Description
                </label>
                <textarea
                  value={profileForm.full_description}
                  onChange={(e) => setProfileForm({ ...profileForm, full_description: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                  rows={3}
                  placeholder="Detailed description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    Physical Address
                  </label>
                  <input
                    type="text"
                    value={profileForm.physical_address}
                    onChange={(e) => setProfileForm({ ...profileForm, physical_address: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--input-border)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--input-border)' }}
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Methods */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Contact Methods
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Add or update how people can reach your organisation.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Organisation Phone
                </label>
                <input
                  type="tel"
                  value={contactForm.phone_number}
                  onChange={(e) => setContactForm({ ...contactForm, phone_number: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="+254..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Organisation Email
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="info@organisation.co.ke"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Website
                </label>
                <input
                  type="url"
                  value={contactForm.website}
                  onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="https://"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Representative Email
                </label>
                <input
                  type="email"
                  value={contactForm.representative_email}
                  onChange={(e) => setContactForm({ ...contactForm, representative_email: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Representative Phone
                </label>
                <input
                  type="tel"
                  value={contactForm.representative_phone}
                  onChange={(e) => setContactForm({ ...contactForm, representative_phone: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="+254..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Logo Upload */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Organisation Logo
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Upload your organisation&apos;s logo. Accepts JPEG, PNG, GIF, or WebP (max 5MB).
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                {/* Logo preview */}
                <div
                  className="w-32 h-32 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50"
                  style={{ borderColor: logoPreview ? 'var(--brand-primary)' : 'var(--input-border)' }}
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview.startsWith('blob:') ? logoPreview : `http://localhost:8000${logoPreview}`}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-10 h-10 mx-auto mb-1" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No logo</span>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                >
                  {logoPreview ? 'Change Logo' : 'Choose File'}
                </button>

                {logoFile && (
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {logoFile.name} ({(logoFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Create First Listing */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Create Your First Listing
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  As a {profile?.membership?.tier_name} member, you can post goods and services listings.
                  You can skip this and create listings later from your dashboard.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  You&apos;ll be able to create detailed listings with photos, pricing, and contact details
                  from the Listings section in your dashboard after completing setup.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between gap-3">
          {/* Skip options */}
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleSkipAll}
                disabled={submitting}
                className="text-sm transition-colors disabled:opacity-50"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Skip all remaining
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {/* Skip current step */}
            {onboardingData?.steps?.[currentStep]?.skippable && (
              <button
                type="button"
                onClick={handleSkipStep}
                disabled={submitting}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors disabled:opacity-50"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-secondary)' }}
              >
                Skip for now
              </button>
            )}

            {/* Action button */}
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1) handlePasswordChange();
                else if (currentStep === 2) handleProfileConfirm();
                else if (currentStep === 3) handleContactUpdate();
                else if (currentStep === 4) handleLogoUpload();
                else if (currentStep === 5) handleListingSkip(); // Skip to dashboard for listing creation
              }}
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-medium rounded-lg text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : currentStep === 1 ? (
                'Change Password'
              ) : currentStep === 2 ? (
                'Confirm Profile'
              ) : currentStep === 3 ? (
                'Save Contacts'
              ) : currentStep === 4 ? (
                logoFile ? 'Upload Logo' : 'Continue'
              ) : (
                'Complete Setup'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
