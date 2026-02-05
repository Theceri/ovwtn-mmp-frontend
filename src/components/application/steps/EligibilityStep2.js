'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

/**
 * Step 4 (Full/Basic): Eligibility Check - Are you formally registered?
 * If No → redirects to Register Interest section
 */
export default function EligibilityStep2() {
  const { formData, updateField } = useApplicationStore();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div 
          className="inline-flex items-center px-4 py-2 rounded-full mb-4"
          style={{ backgroundColor: 'rgba(56, 86, 100, 0.1)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--brand-secondary)' }}>
            Eligibility: Registration
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Registration Status
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Question 2 of 3
        </p>
      </div>
      
      {/* Question */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Are you formally registered?
          </h3>
          
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            We are currently enrolling only formally registered entities as official members. 
            However, if you are not formally registered, please share your details so we can 
            be in touch on how to engage with you.
          </p>
          
          {/* Radio Options */}
          <div className="space-y-3">
            <label
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.isRegistered === true
                  ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="isRegistered"
                checked={formData.isRegistered === true}
                onChange={() => updateField('isRegistered', true)}
                className="sr-only"
              />
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  formData.isRegistered === true
                    ? 'border-[var(--brand-accent)]'
                    : 'border-gray-300'
                }`}
              >
                {formData.isRegistered === true && (
                  <div className="w-3 h-3 rounded-full bg-[var(--brand-accent)]" />
                )}
              </div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Yes
              </span>
            </label>
            
            <label
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.isRegistered === false
                  ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="isRegistered"
                checked={formData.isRegistered === false}
                onChange={() => updateField('isRegistered', false)}
                className="sr-only"
              />
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  formData.isRegistered === false
                    ? 'border-[var(--brand-orange)]'
                    : 'border-gray-300'
                }`}
              >
                {formData.isRegistered === false && (
                  <div className="w-3 h-3 rounded-full bg-[var(--brand-orange)]" />
                )}
              </div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                No
              </span>
            </label>
          </div>
          
          {/* Warning if No selected */}
          {formData.isRegistered === false && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    You&apos;ll be redirected to Register Interest
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Since your organisation is not formally registered, you can register your interest 
                    to stay updated while you work towards formal registration.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
