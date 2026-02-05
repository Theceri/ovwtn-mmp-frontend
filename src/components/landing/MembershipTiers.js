'use client';

import Link from 'next/link';

const tiers = [
  {
    name: 'Registering Interest',
    price: '2,500',
    registrationFee: '10,000',
    period: '6 months',
    description: 'Stay updated with the Network with the option to upgrade within 6 months.',
    features: [
      { text: 'Network updates & communications', included: true },
      { text: 'Event invitations & registration', included: true },
      { text: 'Resource library access', included: true },
      { text: 'Convertible to Basic/Full within 3 months', included: true },
      { text: 'Public directory listing', included: false },
      { text: 'Post goods & services', included: false },
      { text: 'Voting rights', included: false },
    ],
    highlight: false,
    color: 'var(--brand-orange)',
    bgColor: 'rgba(217, 101, 52, 0.1)',
  },
  {
    name: 'Basic',
    price: '5,000',
    registrationFee: '10,000',
    period: '12 months',
    description: 'Full member access with public profile and listing capabilities.',
    features: [
      { text: 'All Registering Interest benefits', included: true },
      { text: 'Public directory listing', included: true },
      { text: 'Post goods & services listings', included: true },
      { text: 'Member networking features', included: true },
      { text: 'AI business assistance', included: true },
      { text: 'Membership badge', included: true },
      { text: 'Voting rights', included: false },
    ],
    highlight: false,
    color: 'var(--brand-secondary)',
    bgColor: 'rgba(56, 86, 100, 0.1)',
  },
  {
    name: 'Full',
    price: '10,000',
    registrationFee: '10,000',
    period: '12 months',
    description: 'Complete membership with voting rights and full participation.',
    features: [
      { text: 'All Basic membership benefits', included: true },
      { text: 'Voting rights in Network decisions', included: true },
      { text: 'Priority event access', included: true },
      { text: 'Featured listing opportunities', included: true },
      { text: 'Advanced networking tools', included: true },
      { text: 'Exclusive member resources', included: true },
      { text: 'Full advocacy participation', included: true },
    ],
    highlight: true,
    badge: 'Most Popular',
    color: 'var(--brand-primary)',
    bgColor: 'rgba(150, 32, 33, 0.1)',
  },
  {
    name: 'Associate / Affiliate',
    price: 'Free',
    registrationFee: 'Waived',
    period: 'No expiry',
    description: 'For ecosystem stakeholders, corporates, and trade support institutions.',
    features: [
      { text: 'Network linkage & collaboration', included: true },
      { text: 'Event participation', included: true },
      { text: 'Resource access', included: true },
      { text: 'Partnership opportunities', included: true },
      { text: 'Public directory listing', included: false },
      { text: 'Post goods & services', included: false },
      { text: 'Voting rights', included: false },
    ],
    highlight: false,
    color: 'var(--brand-accent)',
    bgColor: 'rgba(145, 162, 123, 0.1)',
  },
];

export default function MembershipTiers() {
  return (
    <section id="membership" className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(150, 32, 33, 0.1)' }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
              Membership Tiers
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Choose Your Membership Level
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Select the membership tier that best fits your organization&apos;s needs. 
            All tiers include a one-time registration fee of <span className="font-semibold">KES 10,000</span> 
            (waived for Associate members).
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                tier.highlight ? 'ring-2 scale-105 z-10' : ''
              }`}
              style={{ 
                borderColor: tier.highlight ? tier.color : 'transparent',
                '--tier-color': tier.color,
              }}
            >
              {tier.badge && (
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-medium whitespace-nowrap"
                  style={{ backgroundColor: tier.color }}
                >
                  {tier.badge}
                </div>
              )}
              
              <div className="p-6 lg:p-8">
                {/* Tier Header */}
                <div className="mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: tier.bgColor }}
                  >
                    <svg 
                      className="w-6 h-6" 
                      style={{ color: tier.color }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {tier.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {tier.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-baseline">
                    {tier.price !== 'Free' ? (
                      <>
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>KES</span>
                        <span className="text-4xl font-bold mx-1" style={{ color: tier.color }}>
                          {tier.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold" style={{ color: tier.color }}>
                        Free
                      </span>
                    )}
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      / {tier.period}
                    </span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                    {tier.registrationFee !== 'Waived' 
                      ? `+ KES ${tier.registrationFee} one-time registration`
                      : 'Registration fee waived'
                    }
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      {feature.included ? (
                        <svg 
                          className="w-5 h-5 flex-shrink-0 mt-0.5" 
                          style={{ color: 'var(--brand-accent)' }}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg 
                          className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-300" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span 
                        className={`text-sm ${feature.included ? '' : 'text-gray-400'}`}
                        style={{ color: feature.included ? 'var(--text-secondary)' : undefined }}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/apply?tier=${tier.name.toLowerCase().replace(/[^a-z]/g, '-')}`}
                  className={`block w-full py-3 px-4 text-center font-semibold rounded-xl transition-all ${
                    tier.highlight 
                      ? 'text-white hover:opacity-90 shadow-lg hover:shadow-xl' 
                      : 'hover:opacity-90'
                  }`}
                  style={{ 
                    backgroundColor: tier.highlight ? tier.color : tier.bgColor,
                    color: tier.highlight ? 'white' : tier.color,
                  }}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Need help choosing? <a href="#" className="font-medium hover:underline" style={{ color: 'var(--brand-primary)' }}>Contact our Secretariat</a> for guidance.
          </p>
        </div>
      </div>
    </section>
  );
}
