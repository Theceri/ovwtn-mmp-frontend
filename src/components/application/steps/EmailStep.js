'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

/**
 * Step 1: Email capture
 * First step for all membership types
 */
export default function EmailStep() {
  const { formData, updateField } = useApplicationStore();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Apply for Membership
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Let&apos;s start with your email address
        </p>
      </div>
      
      {/* Email Input */}
      <div className="max-w-md mx-auto">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="yourorganisation@example.com"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
          style={{ backgroundColor: 'white' }}
          required
        />
        <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          We&apos;ll use this email for all communications regarding your application.
        </p>
      </div>
      
      {/* Info Card */}
      <div className="max-w-md mx-auto mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <div className="flex items-start space-x-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(56, 86, 100, 0.1)' }}
          >
            <svg 
              className="w-4 h-4" 
              style={{ color: 'var(--brand-secondary)' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              What happens next?
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              After completing the form, your application will be reviewed by the OVWTN Secretariat. 
              You&apos;ll receive a confirmation email and be notified of the decision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
