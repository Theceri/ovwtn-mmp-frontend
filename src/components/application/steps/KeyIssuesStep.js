'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

const CONTRIBUTION_OPTIONS = [
  { value: 'technical_expertise', label: 'Technical Expertise' },
  { value: 'training_mentorship', label: 'Training / Mentorship' },
  { value: 'advocacy_support', label: 'Advocacy Support' },
  { value: 'financial_contributions', label: 'Financial Contributions' },
  { value: 'partnerships_networks', label: 'Partnerships / Networks' },
  { value: 'sector_insights', label: 'Sector-specific or other market insights' },
  { value: 'other', label: 'Other' },
];

/**
 * Step 9: Addressing Key Issues
 * Capture priorities and contributions
 */
export default function KeyIssuesStep() {
  const { formData, updateField } = useApplicationStore();
  
  const handleContributionChange = (value, checked) => {
    const current = formData.contributions || [];
    if (checked) {
      updateField('contributions', [...current, value]);
    } else {
      updateField('contributions', current.filter((v) => v !== value));
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div 
          className="inline-flex items-center px-4 py-2 rounded-full mb-4"
          style={{ backgroundColor: 'rgba(56, 86, 100, 0.1)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--brand-secondary)' }}>
            Addressing Key Issues
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Share your priorities with us
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Help us understand the key issues you&apos;d like the Network to address
        </p>
      </div>
      
      {/* Questions */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Trade Barriers */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            What are the top 3 barriers your members face when participating in trade?
          </label>
          <textarea
            value={formData.tradeBarriers}
            onChange={(e) => updateField('tradeBarriers', e.target.value)}
            placeholder="Describe the main challenges your members face..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all resize-none"
          />
        </div>
        
        {/* Advocacy Messages */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            What are the top 3 advocacy messages you want us to promote at the policy level?
          </label>
          <textarea
            value={formData.advocacyMessages}
            onChange={(e) => updateField('advocacyMessages', e.target.value)}
            placeholder="What policy changes would benefit your members?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all resize-none"
          />
        </div>
        
        {/* Association Needs */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            What are your needs as an association?
          </label>
          <textarea
            value={formData.associationNeeds}
            onChange={(e) => updateField('associationNeeds', e.target.value)}
            placeholder="What support does your association need?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all resize-none"
          />
        </div>
        
        {/* Expected Benefits */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            What benefits do you expect to receive as a member of the Network?
          </label>
          <textarea
            value={formData.expectedBenefits}
            onChange={(e) => updateField('expectedBenefits', e.target.value)}
            placeholder="What do you hope to gain from membership?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all resize-none"
          />
        </div>
        
        {/* Contributions */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            What contributions can your association make towards growth, development, and 
            sustainability of the Network?
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {CONTRIBUTION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.contributions?.includes(option.value)
                    ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.contributions?.includes(option.value) || false}
                  onChange={(e) => handleContributionChange(option.value, e.target.checked)}
                  className="sr-only"
                />
                <div 
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                    formData.contributions?.includes(option.value)
                      ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]'
                      : 'border-gray-300'
                  }`}
                >
                  {formData.contributions?.includes(option.value) && (
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
          {formData.contributions?.includes('other') && (
            <div className="mt-3">
              <input
                type="text"
                value={formData.contributionsOther}
                onChange={(e) => updateField('contributionsOther', e.target.value)}
                placeholder="Please specify your contribution"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
