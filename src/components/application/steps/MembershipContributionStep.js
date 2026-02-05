'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

/**
 * Step 7 (Full/Basic): Membership Contribution Info
 * Informational page before payment section
 */
export default function MembershipContributionStep() {
  const { formData } = useApplicationStore();
  
  const membershipFee = formData.membershipType === 'full' ? '10,000' : '5,000';
  const registrationFee = '10,000';
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div 
          className="inline-flex items-center px-4 py-2 rounded-full mb-4"
          style={{ backgroundColor: 'rgba(150, 32, 33, 0.1)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
            Membership Contribution
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Thank you for providing your association details
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          The One Voice Secretariat will review your application and communicate with you 
          for any further information required including payment options.
        </p>
      </div>
      
      {/* Fee Summary Card */}
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {formData.membershipType === 'full' ? 'Full' : 'Basic'} Membership Fees
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span style={{ color: 'var(--text-secondary)' }}>Annual Membership Fee</span>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                KES {membershipFee}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span style={{ color: 'var(--text-secondary)' }}>One-time Registration Fee</span>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                KES {registrationFee}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Total</span>
              <span 
                className="text-xl font-bold"
                style={{ color: 'var(--brand-primary)' }}
              >
                KES {parseInt(membershipFee.replace(',', '')) + parseInt(registrationFee.replace(',', ''))}
              </span>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-gray-50">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong>Note:</strong> The one-time registration fee of KES 10,000 is charged only once 
              during your first registration with the Network.
            </p>
          </div>
        </div>
      </div>
      
      {/* What's Next */}
      <div className="max-w-lg mx-auto mt-8">
        <div className="bg-gradient-to-br from-[var(--brand-secondary)]/5 to-[var(--brand-secondary)]/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            What happens next?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Complete the remaining sections of this application
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                The Secretariat will review your application
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                You&apos;ll receive payment instructions via email
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Once payment is verified, your membership will be activated
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Info */}
      <div className="text-center mt-8">
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          On the next page, please share the key issues you&apos;d like the Network to address.
        </p>
      </div>
    </div>
  );
}
