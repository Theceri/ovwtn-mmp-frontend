'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

/**
 * Step 5 (Full/Basic): Eligibility Check - Do you represent women in export value chains?
 * If No → redirects to Register Interest section
 */
export default function EligibilityStep3() {
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
            Eligibility: Membership
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Membership Eligibility
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Question 3 of 3
        </p>
      </div>
      
      {/* Question */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Do you represent women in export value chains in Kenya as part of your membership?
          </h3>
          
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            One Voice Women Trade Network focuses on empowering women-led associations and 
            enterprises involved in international trade and export value chains in Kenya.
          </p>
          
          {/* Radio Options */}
          <div className="space-y-3">
            <label
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.representsWomenInTrade === true
                  ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="representsWomenInTrade"
                checked={formData.representsWomenInTrade === true}
                onChange={() => updateField('representsWomenInTrade', true)}
                className="sr-only"
              />
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  formData.representsWomenInTrade === true
                    ? 'border-[var(--brand-accent)]'
                    : 'border-gray-300'
                }`}
              >
                {formData.representsWomenInTrade === true && (
                  <div className="w-3 h-3 rounded-full bg-[var(--brand-accent)]" />
                )}
              </div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Yes
              </span>
            </label>
            
            <label
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.representsWomenInTrade === false
                  ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="representsWomenInTrade"
                checked={formData.representsWomenInTrade === false}
                onChange={() => updateField('representsWomenInTrade', false)}
                className="sr-only"
              />
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  formData.representsWomenInTrade === false
                    ? 'border-[var(--brand-orange)]'
                    : 'border-gray-300'
                }`}
              >
                {formData.representsWomenInTrade === false && (
                  <div className="w-3 h-3 rounded-full bg-[var(--brand-orange)]" />
                )}
              </div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                No
              </span>
            </label>
          </div>
          
          {/* Success message if Yes selected */}
          {formData.representsWomenInTrade === true && (
            <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Congratulations! You meet the eligibility requirements
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Please proceed to fill out the registration form with your association details.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Warning if No selected */}
          {formData.representsWomenInTrade === false && (
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
                    Your organisation doesn&apos;t currently meet the membership criteria, but you can 
                    register your interest to stay connected with the Network.
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
