'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

const REFERRAL_OPTIONS = [
  { value: 'website_social', label: 'OVWTN Website / Social Media' },
  { value: 'programmes', label: 'OVWTN Programmes / Projects' },
  { value: 'workshop', label: 'OVWTN Workshop' },
  { value: 'cbi_summit', label: 'CBI Summit or Communication' },
  { value: 'professional_referral', label: 'Professional Referral' },
  { value: 'other', label: 'Other' },
];

/**
 * Step 10: Submit Form
 * Final step with referral source and consent
 */
export default function SubmitStep() {
  const { formData, updateField } = useApplicationStore();
  
  const handleReferralChange = (value, checked) => {
    const current = formData.referralSource || [];
    if (checked) {
      updateField('referralSource', [...current, value]);
    } else {
      updateField('referralSource', current.filter((v) => v !== value));
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div 
          className="inline-flex items-center px-4 py-2 rounded-full mb-4"
          style={{ backgroundColor: 'rgba(150, 32, 33, 0.1)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
            Submit Form
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Almost done!
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Please complete the final details and submit your application
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Referral Source */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            How did you hear about the One Voice Women Trade Network?
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {REFERRAL_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.referralSource?.includes(option.value)
                    ? 'border-[var(--brand-secondary)] bg-[var(--brand-secondary)]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.referralSource?.includes(option.value) || false}
                  onChange={(e) => handleReferralChange(option.value, e.target.checked)}
                  className="sr-only"
                />
                <div 
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                    formData.referralSource?.includes(option.value)
                      ? 'border-[var(--brand-secondary)] bg-[var(--brand-secondary)]'
                      : 'border-gray-300'
                  }`}
                >
                  {formData.referralSource?.includes(option.value) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          
          {/* Other input */}
          {formData.referralSource?.includes('other') && (
            <div className="mt-3">
              <input
                type="text"
                value={formData.referralSourceOther}
                onChange={(e) => updateField('referralSourceOther', e.target.value)}
                placeholder="Please specify how you heard about us"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
              />
            </div>
          )}
        </div>
        
        {/* Data Consent */}
        <div className="pt-6 border-t border-gray-200">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Data Protection Consent <span className="text-red-500">*</span>
            </h3>
            
            <label className="flex items-start space-x-4 cursor-pointer">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={formData.dataConsent}
                  onChange={(e) => updateField('dataConsent', e.target.checked)}
                  className="sr-only"
                />
                <div 
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    formData.dataConsent
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]'
                      : 'border-gray-300'
                  }`}
                >
                  {formData.dataConsent && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  By completing and signing this form, I consent to the collection, use and storage 
                  of my/the association&apos;s data by One Voice Women Trade Network for purposes 
                  related to membership management, communication, organisational reporting and 
                  statutory compliance. I understand that my data will be processed in accordance 
                  with the <strong>Data Protection Act, 2019</strong> and the Network&apos;s Data Protection 
                  Policy. I may request access to, correction of or deletion of the data at any 
                  time by contacting the Secretariat.
                </p>
              </div>
            </label>
          </div>
        </div>
        
        {/* Application Summary Preview */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Application Summary
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <div className="flex justify-between items-center p-4">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Organisation</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {formData.organisationName || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center p-4">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {formData.email || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center p-4">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Membership Type</span>
              <span 
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: 'rgba(150, 32, 33, 0.1)',
                  color: 'var(--brand-primary)'
                }}
              >
                {formData.membershipType ? formData.membershipType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center p-4">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>County</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {formData.county || '-'}
              </span>
            </div>
            {formData.representativeName && (
              <div className="flex justify-between items-center p-4">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Representative</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {formData.representativeName}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Warning if consent not checked */}
        {!formData.dataConsent && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-amber-800">
                Please check the data protection consent box above to submit your application.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
