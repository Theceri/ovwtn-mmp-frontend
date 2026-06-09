'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

// Kenya counties list
const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans-Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

const MEMBERSHIP_LABELS = {
  full: 'Full Membership',
  basic: 'Basic Membership',
  associate: 'Associate / Affiliate',
  registering_interest: 'Registering Interest',
};

/**
 * Basic Information
 * Common for all membership types. The membership tier is chosen earlier in the
 * flow, so here we only collect the organisation's details.
 */
export default function BasicInfoStep() {
  const { formData, updateField } = useApplicationStore();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Basic Information
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Tell us about your organisation
        </p>
      </div>
      
      {/* Organisation Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Organisation Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Name of Association/Institution <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.organisationName}
            onChange={(e) => updateField('organisationName', e.target.value)}
            placeholder="Enter your organisation name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            required
          />
        </div>
        
        {/* Physical Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Physical Address
          </label>
          <input
            type="text"
            value={formData.physicalAddress}
            onChange={(e) => updateField('physicalAddress', e.target.value)}
            placeholder="Street address, building, floor"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
          />
        </div>
        
        {/* Postal Address */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Postal Address
          </label>
          <input
            type="text"
            value={formData.postalAddress}
            onChange={(e) => updateField('postalAddress', e.target.value)}
            placeholder="P.O. Box"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
          />
        </div>
        
        {/* County */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            County <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.county}
            onChange={(e) => updateField('county', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all bg-white"
            required
          >
            <option value="">Select county</option>
            {KENYA_COUNTIES.map((county) => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>
        
        {/* Telephone */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Telephone No. <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => updateField('telephone', e.target.value)}
            placeholder="+254 7XX XXX XXX"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            required
          />
        </div>
        
        {/* Email Address (organisation email) */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.emailAddress}
            onChange={(e) => updateField('emailAddress', e.target.value)}
            placeholder="info@organisation.co.ke"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            required
          />
        </div>
        
        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://www.yourwebsite.co.ke"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
          />
        </div>
        
        {/* Sectors */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Sector(s)
          </label>
          <input
            type="text"
            value={formData.sectors}
            onChange={(e) => updateField('sectors', e.target.value)}
            placeholder="e.g., Agriculture, Textiles, Services"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
          />
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            The sector(s) your organisation operates in
          </p>
        </div>
        
        {/* Counties of Operation */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Counties of Operation
          </label>
          <input
            type="text"
            value={formData.countiesOfOperation}
            onChange={(e) => updateField('countiesOfOperation', e.target.value)}
            placeholder="e.g., Nairobi, Mombasa, Kisumu"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
          />
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            List the counties where your organisation operates
          </p>
        </div>
      </div>
      
      {/* Selected Membership (chosen in the first step) */}
      {formData.membershipType && (
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20">
            <div className="flex items-center space-x-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(150, 32, 33, 0.1)' }}
              >
                <svg className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                  Selected Membership
                </p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {MEMBERSHIP_LABELS[formData.membershipType] || formData.membershipType}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
