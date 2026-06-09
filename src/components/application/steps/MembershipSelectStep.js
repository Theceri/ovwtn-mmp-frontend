'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

/**
 * Step 1 (all flows): Membership selection
 *
 * Shown first so applicants understand the membership options available
 * BEFORE they are asked to commit or share any details. This follows the
 * decision-architecture principle of presenting choices before action.
 */
const MEMBERSHIP_OPTIONS = [
  {
    value: 'registering_interest',
    label: 'Registering Interest',
    price: 'KES 2,500',
    period: '6 months',
    description:
      'Stay updated with the Network with the option to upgrade to Basic or Full within 3 months.',
    highlights: [
      'Network updates & communications',
      'Event invitations & registration',
      'Resource library access',
    ],
    color: 'var(--brand-orange)',
    bgColor: 'rgba(217, 101, 52, 0.1)',
  },
  {
    value: 'basic',
    label: 'Basic Membership',
    price: 'KES 5,000',
    period: '12 months',
    description:
      'Full member access with a public profile and listing capabilities (no voting rights).',
    highlights: [
      'Public directory listing',
      'Post goods & services listings',
      'AI business assistance & badge',
    ],
    color: 'var(--brand-secondary)',
    bgColor: 'rgba(56, 86, 100, 0.1)',
  },
  {
    value: 'full',
    label: 'Full Membership',
    price: 'KES 10,000',
    period: '12 months',
    description:
      'Complete membership with voting rights and full participation in the Network.',
    highlights: [
      'All Basic membership benefits',
      'Voting rights in Network decisions',
      'Priority event & featured listings',
    ],
    badge: 'Most Popular',
    color: 'var(--brand-primary)',
    bgColor: 'rgba(150, 32, 33, 0.1)',
  },
  {
    value: 'associate',
    label: 'Associate / Affiliate',
    price: 'Free',
    period: 'No expiry',
    description:
      'For ecosystem stakeholders, corporates, apex bodies, and trade support institutions.',
    highlights: [
      'Network linkage & collaboration',
      'Event participation',
      'Partnership opportunities',
    ],
    color: 'var(--brand-accent)',
    bgColor: 'rgba(145, 162, 123, 0.1)',
  },
];

export default function MembershipSelectStep() {
  const { formData, updateField } = useApplicationStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Choose Your Membership
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review the options below and select the membership that best fits your organisation.
          All paid tiers include a one-time registration fee of{' '}
          <span className="font-semibold">KES 10,000</span> (waived for Associate members).
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {MEMBERSHIP_OPTIONS.map((option) => {
          const selected = formData.membershipType === option.value;
          return (
            <label
              key={option.value}
              className={`relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selected
                  ? 'shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={selected ? { borderColor: option.color, backgroundColor: option.bgColor } : {}}
            >
              <input
                type="radio"
                name="membershipType"
                value={option.value}
                checked={selected}
                onChange={(e) => updateField('membershipType', e.target.value)}
                className="sr-only"
              />

              {option.badge && (
                <span
                  className="absolute -top-3 right-4 px-3 py-0.5 rounded-full text-white text-xs font-medium whitespace-nowrap"
                  style={{ backgroundColor: option.color }}
                >
                  {option.badge}
                </span>
              )}

              {/* Title row */}
              <div className="flex items-start space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    selected ? '' : 'border-gray-300'
                  }`}
                  style={selected ? { borderColor: option.color } : {}}
                >
                  {selected && (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: option.color }} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {option.label}
                    </span>
                    <span
                      className="text-sm font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: option.bgColor, color: option.color }}
                    >
                      {option.price}
                      {option.price !== 'Free' && (
                        <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>
                          {' '}/ {option.period}
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                    {option.description}
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <ul className="mt-4 pl-8 space-y-1.5">
                {option.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: option.color }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </label>
          );
        })}
      </div>

      {/* Eligibility note for Full/Basic */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
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
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Choosing <span className="font-medium">Basic</span> or{' '}
            <span className="font-medium">Full</span> membership? Don&apos;t worry &mdash; we&apos;ll
            run a quick eligibility check next so you can confirm you qualify before sharing any
            details.
          </p>
        </div>
      </div>
    </div>
  );
}
