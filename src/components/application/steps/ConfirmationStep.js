'use client';

import Link from 'next/link';
import { useApplicationStore } from '@/store/useApplicationStore';

/**
 * Confirmation page after successful submission
 */
export default function ConfirmationStep() {
  const { applicationNumber, formData, resetForm } = useApplicationStore();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        {/* Success Icon */}
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(145, 162, 123, 0.2)' }}
        >
          <svg 
            className="w-10 h-10" 
            style={{ color: 'var(--brand-accent)' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Success Message */}
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Application Submitted!
        </h1>
        <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          Thank you for applying to join the One Voice Women Trade Network.
        </p>
        
        {/* Application Reference */}
        {applicationNumber && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Your Application Reference Number
            </p>
            <p 
              className="text-2xl font-mono font-bold"
              style={{ color: 'var(--brand-primary)' }}
            >
              {applicationNumber}
            </p>
            <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
              Please save this number for your records.
            </p>
          </div>
        )}
        
        {/* What's Next */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left mb-8">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            What happens next?
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Confirmation Email
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  You&apos;ll receive a confirmation email at <strong>{formData.email}</strong>
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Application Review
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  The Secretariat will review your application within 5-7 business days
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Decision Notification
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  You&apos;ll be notified of the decision and next steps via email
                </p>
              </div>
            </li>
          </ul>
        </div>
        
        {/* Contact Info */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-8">
          <p className="text-sm text-blue-800">
            Questions? Contact the Secretariat at{' '}
            <a href="mailto:info@onevoice.ke" className="font-medium underline">
              info@onevoice.ke
            </a>{' '}
            or{' '}
            <a href="https://wa.me/254743525312" className="font-medium underline">
              +254 743 525 312
            </a>
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Return to Homepage
          </Link>
          <button
            onClick={resetForm}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-medium border transition-all hover:bg-gray-50"
            style={{ 
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-color)'
            }}
          >
            Start New Application
          </button>
        </div>
      </div>
    </div>
  );
}
