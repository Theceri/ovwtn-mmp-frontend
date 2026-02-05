'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useApplicationStore } from '@/store/useApplicationStore';
import { apiPost } from '@/lib/api';
import FormProgress from '@/components/application/FormProgress';
import FormNavigation from '@/components/application/FormNavigation';
import {
  EmailStep,
  BasicInfoStep,
  EligibilityStep1,
  EligibilityStep2,
  EligibilityStep3,
  AssociationDetailsStep,
  MembershipContributionStep,
  RegisterInterestStep,
  KeyIssuesStep,
  SubmitStep,
  ConfirmationStep,
} from '@/components/application/steps';

/**
 * Multi-step membership application form
 * Implements the exact flow from wiwimow.md for each membership type
 */
export default function ApplyPage() {
  const searchParams = useSearchParams();
  const {
    currentStep,
    formData,
    isSubmitted,
    isSubmitting,
    nextStep,
    prevStep,
    setCurrentStep,
    updateField,
    setSubmitting,
    setSubmitted,
    setSubmissionError,
    getCurrentStepInfo,
    getStepMap,
    formStarted,
    clearSavedData,
  } = useApplicationStore();

  // Handle pre-selected tier from URL
  useEffect(() => {
    const tier = searchParams.get('tier');
    if (tier && !formStarted) {
      const tierMap = {
        'full': 'full',
        'basic': 'basic',
        'associate': 'associate',
        'registering-interest': 'registering_interest',
      };
      if (tierMap[tier]) {
        updateField('membershipType', tierMap[tier]);
      }
    }
  }, [searchParams, formStarted, updateField]);

  const steps = getStepMap();
  const currentStepInfo = getCurrentStepInfo();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStepInfo?.id === 'submit';

  // Render the appropriate step component
  const renderStep = () => {
    if (isSubmitted) {
      return <ConfirmationStep />;
    }

    switch (currentStepInfo?.id) {
      case 'email':
        return <EmailStep />;
      case 'basic-info':
        return <BasicInfoStep />;
      case 'eligibility-1':
        return <EligibilityStep1 />;
      case 'eligibility-2':
        return <EligibilityStep2 />;
      case 'eligibility-3':
        return <EligibilityStep3 />;
      case 'association-details':
        return <AssociationDetailsStep />;
      case 'membership-contribution':
        return <MembershipContributionStep />;
      case 'register-interest':
        return <RegisterInterestStep />;
      case 'key-issues':
        return <KeyIssuesStep />;
      case 'submit':
        return <SubmitStep />;
      default:
        return <EmailStep />;
    }
  };

  const handleNext = () => {
    // Update the step map after state changes, then move to next
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmissionError(null);

    try {
      // Prepare submission data
      const submissionData = {
        email: formData.email,
        organisation_name: formData.organisationName,
        physical_address: formData.physicalAddress,
        postal_address: formData.postalAddress,
        county: formData.county,
        phone_number: formData.telephone,
        email_address: formData.emailAddress,
        website: formData.website,
        sectors: formData.sectors,
        counties_of_operation: formData.countiesOfOperation,
        membership_type: formData.membershipType,
        
        // Eligibility
        is_association: formData.isAssociation,
        is_registered: formData.isRegistered,
        represents_women_in_trade: formData.representsWomenInTrade,
        
        // Association details
        registration_type: formData.registrationType,
        registration_type_other: formData.registrationTypeOther,
        organisation_description: formData.organisationDescription,
        total_members: formData.totalMembers ? parseInt(formData.totalMembers) : null,
        registration_number: formData.registrationNumber,
        registration_date: formData.registrationDate || null,
        
        // Representative
        representative_name: formData.representativeName,
        representative_designation: formData.representativeDesignation,
        representative_email: formData.representativeEmail,
        representative_phone: formData.representativePhone,
        
        // Leadership
        chairperson_name: formData.chairpersonName,
        vice_chair_name: formData.viceChairName,
        ceo_name: formData.ceoName,
        
        // Payment
        register_interest: formData.registerInterest,
        payment_mode: formData.paymentMode,
        payment_reference: formData.paymentReference,
        
        // Key issues
        trade_barriers: formData.tradeBarriers,
        advocacy_messages: formData.advocacyMessages,
        association_needs: formData.associationNeeds,
        expected_benefits: formData.expectedBenefits,
        contributions: formData.contributions,
        contributions_other: formData.contributionsOther,
        
        // Referral and consent
        referral_source: formData.referralSource,
        referral_source_other: formData.referralSourceOther,
        data_consent: formData.dataConsent,
      };

      const response = await apiPost('/applications', submissionData);
      
      setSubmitted(true, response.application_number);
      toast.success('Application submitted successfully!');
      
      // Clear saved form data after successful submission
      clearSavedData();
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError(error.message);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If already submitted, show confirmation
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <ConfirmationStep />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 relative">
                <Image
                  src="/One-Voice-Final-LOGO.png"
                  alt="OVWTN Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  One Voice Women Trade Network
                </h1>
                <p className="text-xs leading-tight" style={{ color: 'var(--text-tertiary)' }}>
                  Membership Application
                </p>
              </div>
            </Link>
            
            <Link
              href="/"
              className="flex items-center space-x-2 text-sm hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="hidden sm:inline">Exit</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <FormProgress />
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
            {renderStep()}
            
            {/* Navigation */}
            <FormNavigation
              onNext={handleNext}
              onPrev={handlePrev}
              onSubmit={handleSubmit}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              loading={isSubmitting}
            />
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Need help? Contact us at{' '}
              <a 
                href="mailto:info@onevoice.ke" 
                className="font-medium hover:underline"
                style={{ color: 'var(--brand-primary)' }}
              >
                info@onevoice.ke
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
