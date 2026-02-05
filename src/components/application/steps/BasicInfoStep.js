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

const MEMBERSHIP_TYPES = [
  {
    value: 'full',
    label: 'Full Membership',
    description: 'KES 10,000/year + KES 10,000 registration. All benefits including voting rights.',
    price: '10,000',
  },
  {
    value: 'basic',
    label: 'Basic Membership',
    description: 'KES 5,000/year + KES 10,000 registration. All benefits except voting rights.',
    price: '5,000',
  },
  {
    value: 'associate',
    label: 'Associate / Affiliate',
    description: 'No fee. For ecosystem stakeholders, corporates, apex bodies, and trade support institutions.',
    price: 'Free',
  },
  {
    value: 'registering_interest',
    label: 'Registering Interest',
    description: 'KES 2,500 for 6 months. Stay updated and convert to Basic/Full membership within 3 months.',
    price: '2,500',
  },
];

/**
 * Step 2: Basic Information + Membership Type Selection
 * Common for all membership types
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
      
      {/* Membership Type Selection */}
      <div className="pt-6 border-t border-gray-200">
        <label className="block text-sm font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          Which type of membership are you interested in? <span className="text-red-500">*</span>
        </label>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {MEMBERSHIP_TYPES.map((type) => (
            <label
              key={type.value}
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.membershipType === type.value
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="membershipType"
                value={type.value}
                checked={formData.membershipType === type.value}
                onChange={(e) => updateField('membershipType', e.target.value)}
                className="sr-only"
              />
              
              {/* Radio indicator */}
              <div className="flex items-start space-x-3">
                <div 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    formData.membershipType === type.value
                      ? 'border-[var(--brand-primary)]'
                      : 'border-gray-300'
                  }`}
                >
                  {formData.membershipType === type.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {type.label}
                    </span>
                    <span 
                      className="text-sm font-medium px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: type.price === 'Free' ? 'rgba(145, 162, 123, 0.2)' : 'rgba(150, 32, 33, 0.1)',
                        color: type.price === 'Free' ? 'var(--brand-accent)' : 'var(--brand-primary)',
                      }}
                    >
                      {type.price === 'Free' ? 'Free' : `KES ${type.price}`}
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {type.description}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
