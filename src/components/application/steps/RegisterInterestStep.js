'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

/**
 * Step 8: Register Interest / Payment
 * Payment details for Register Interest tier or when eligibility not met
 */
export default function RegisterInterestStep() {
  const { formData, updateField } = useApplicationStore();
  
  // Determine context - is this a "failed eligibility" redirect or direct "Registering Interest"?
  const isDirectRegisterInterest = formData.membershipType === 'registering_interest';
  const failedEligibility = (
    formData.membershipType === 'full' || formData.membershipType === 'basic'
  ) && (
    formData.isAssociation === false || 
    formData.isRegistered === false || 
    formData.representsWomenInTrade === false
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div 
          className="inline-flex items-center px-4 py-2 rounded-full mb-4"
          style={{ backgroundColor: 'rgba(217, 101, 52, 0.1)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--brand-orange)' }}>
            Register Interest
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Register Your Interest
        </h2>
        <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          {failedEligibility ? (
            <>
              If you are not currently eligible to register as a member of the One Voice Network, 
              you can register your interest to keep up to date with the Network&apos;s activities 
              with the option to convert to a basic or full membership in 6 months.
            </>
          ) : (
            <>
              Stay updated with the One Voice Network for 6 months. This can be converted to a 
              basic or full membership within 3 months by contributing the difference in membership fees.
            </>
          )}
        </p>
      </div>
      
      {/* Contact Info */}
      <div className="max-w-2xl mx-auto">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-8">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              If you&apos;d like to be in touch with us directly regarding other modes of engagement 
              or receive our communications and updates, please contact{' '}
              <a href="mailto:info@onevoice.ke" className="font-medium underline">info@onevoice.ke</a>{' '}
              and follow us on LinkedIn and social media.
            </p>
          </div>
        </div>
      </div>
      
      {/* Register Interest Question */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Would you like to register your interest?
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Today&apos;s contribution is <strong>KES 2,500</strong>. This can be converted to a basic or 
            full membership within 3 months by contributing the difference in membership fees.
          </p>
          
          {/* Radio Options */}
          <div className="space-y-3 mb-6">
            <label
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.registerInterest === true
                  ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="registerInterest"
                checked={formData.registerInterest === true}
                onChange={() => updateField('registerInterest', true)}
                className="sr-only"
              />
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  formData.registerInterest === true
                    ? 'border-[var(--brand-accent)]'
                    : 'border-gray-300'
                }`}
              >
                {formData.registerInterest === true && (
                  <div className="w-3 h-3 rounded-full bg-[var(--brand-accent)]" />
                )}
              </div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Yes, I want to register my interest
              </span>
            </label>
            
            <label
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.registerInterest === false
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="registerInterest"
                checked={formData.registerInterest === false}
                onChange={() => updateField('registerInterest', false)}
                className="sr-only"
              />
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  formData.registerInterest === false
                    ? 'border-gray-500'
                    : 'border-gray-300'
                }`}
              >
                {formData.registerInterest === false && (
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                )}
              </div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                No, proceed to submit the form
              </span>
            </label>
          </div>
          
          {/* Payment Section - Only show if Yes selected */}
          {formData.registerInterest === true && (
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Payment Details
              </h4>
              
              {/* Payment Mode Selection */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* M-Pesa */}
                  <label
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMode === 'mpesa'
                        ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      value="mpesa"
                      checked={formData.paymentMode === 'mpesa'}
                      onChange={(e) => updateField('paymentMode', e.target.value)}
                      className="sr-only"
                    />
                    <span className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      M-Pesa Paybill
                    </span>
                    <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <p><strong>Paybill Number:</strong> 303030</p>
                      <p><strong>Account:</strong> DEZB#{formData.organisationName || '[association name]'}</p>
                    </div>
                  </label>
                  
                  {/* Cheque */}
                  <label
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMode === 'cheque'
                        ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cheque"
                      checked={formData.paymentMode === 'cheque'}
                      onChange={(e) => updateField('paymentMode', e.target.value)}
                      className="sr-only"
                    />
                    <span className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Cheque
                    </span>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <p><strong>Made out to:</strong></p>
                      <p>ONE VOICE WOMEN TRADE NETWORK CLG LTD</p>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Payment Reference */}
              {formData.paymentMode && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    {formData.paymentMode === 'mpesa' 
                      ? 'M-Pesa Confirmation Code' 
                      : 'Cheque Reference Number'
                    } <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.paymentReference}
                    onChange={(e) => updateField('paymentReference', e.target.value.toUpperCase())}
                    placeholder={formData.paymentMode === 'mpesa' ? 'e.g., QK123ABC456' : 'e.g., CHQ-001234'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
                    required
                  />
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {formData.paymentMode === 'mpesa'
                      ? 'Enter the confirmation code you received after making the M-Pesa payment'
                      : 'Enter the reference number from your cheque'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
