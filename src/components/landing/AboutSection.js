'use client';

export default function AboutSection() {
  const values = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Collective Voice',
      description: 'Amplifying the voice of women-led associations in trade policy and business development.',
      color: 'var(--brand-primary)',
      bgColor: 'rgba(150, 32, 33, 0.1)',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: 'Trade Facilitation',
      description: 'Connecting members with opportunities in local and international export value chains.',
      color: 'var(--brand-secondary)',
      bgColor: 'rgba(56, 86, 100, 0.1)',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Advocacy Support',
      description: 'Championing policy changes that benefit women entrepreneurs across Kenya.',
      color: 'var(--brand-accent)',
      bgColor: 'rgba(145, 162, 123, 0.2)',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Growth & Impact',
      description: 'Driving sustainable business growth and measurable impact for members.',
      color: 'var(--brand-orange)',
      bgColor: 'rgba(217, 101, 52, 0.1)',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <div 
                className="inline-flex items-center px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: 'rgba(56, 86, 100, 0.1)' }}
              >
                <span className="text-sm font-medium" style={{ color: 'var(--brand-secondary)' }}>
                  About The Network
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Empowering Women in Export Trade
              </h2>
              <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
                <p className="text-lg">
                  <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    One Voice Women Trade Network (OVWTN)
                  </strong> is a membership-based organization uniting women-led associations 
                  and enterprises across Kenya in export value chains.
                </p>
                <p>
                  As a Company Limited by Guarantee (CLG), we reinvest all surplus revenue 
                  directly into activities that benefit our members—from advocacy and capacity 
                  building to market access and networking opportunities.
                </p>
                <p>
                  Our members represent diverse sectors including agriculture, textiles, handicrafts, 
                  processed foods, technology, and professional services, operating across all 47 
                  counties of Kenya.
                </p>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>47</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Counties Represented</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold" style={{ color: 'var(--brand-secondary)' }}>CLG</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Company Structure</p>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: value.bgColor }}
                >
                  <span style={{ color: value.color }}>
                    {value.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {value.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
