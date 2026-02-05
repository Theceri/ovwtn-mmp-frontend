'use client';

const benefits = [
  {
    category: 'Networking & Visibility',
    items: [
      {
        title: 'Member Directory Listing',
        description: 'Get listed in our searchable public directory, visible to potential partners, buyers, and stakeholders.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
      },
      {
        title: 'Goods & Services Marketplace',
        description: 'Showcase your products and services to the network and beyond with detailed listings and WhatsApp integration.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
      {
        title: 'Membership Badge',
        description: 'Display your OVWTN membership badge to demonstrate credibility and network affiliation.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
      },
    ],
    color: 'var(--brand-primary)',
    bgColor: 'rgba(150, 32, 33, 0.1)',
  },
  {
    category: 'Resources & Support',
    items: [
      {
        title: 'Resource Library',
        description: 'Access exclusive documents, templates, market reports, and learning materials curated for members.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        title: 'AI Business Assistant',
        description: 'Get instant answers to FAQs, business guidance, and personalized support through our AI assistant.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      },
      {
        title: 'Secretariat Support',
        description: 'Direct access to the OVWTN Secretariat for guidance, queries, and personalized assistance.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
    ],
    color: 'var(--brand-secondary)',
    bgColor: 'rgba(56, 86, 100, 0.1)',
  },
  {
    category: 'Growth & Advocacy',
    items: [
      {
        title: 'Events & Training',
        description: 'Participate in workshops, seminars, networking events, and capacity building programs.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Policy Advocacy',
        description: 'Your voice in trade policy discussions at national and county levels through collective advocacy.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        ),
      },
      {
        title: 'Voting Rights',
        description: 'Full members participate in network governance and decision-making processes.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
    ],
    color: 'var(--brand-accent)',
    bgColor: 'rgba(145, 162, 123, 0.2)',
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(217, 101, 52, 0.1)' }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--brand-orange)' }}>
              Member Benefits
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Why Join One Voice?
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            As a member, you gain access to a comprehensive suite of benefits designed 
            to help your organization grow and thrive in trade.
          </p>
        </div>

        {/* Benefits Categories */}
        <div className="space-y-16">
          {benefits.map((category, catIndex) => (
            <div key={category.category}>
              {/* Category Header */}
              <div className="flex items-center space-x-4 mb-8">
                <div 
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {category.category}
                </h3>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {category.items.map((benefit, index) => (
                  <div
                    key={benefit.title}
                    className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                  >
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: category.bgColor }}
                    >
                      <span style={{ color: category.color }}>
                        {benefit.icon}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      {benefit.title}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial/Quote */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div 
            className="relative rounded-3xl p-8 md:p-12"
            style={{ backgroundColor: 'rgba(56, 86, 100, 0.05)' }}
          >
            <svg 
              className="absolute top-6 left-6 w-12 h-12 opacity-20" 
              style={{ color: 'var(--brand-secondary)' }}
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <div className="relative">
              <p className="text-xl md:text-2xl italic mb-6" style={{ color: 'var(--text-secondary)' }}>
                &ldquo;Together, we are stronger. One Voice Women Trade Network is more than a membership—it&apos;s 
                a movement of women-led associations working collectively to transform trade in Kenya.&rdquo;
              </p>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: 'var(--brand-secondary)' }}
                >
                  OV
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    The OVWTN Secretariat
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    One Voice Women Trade Network
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
