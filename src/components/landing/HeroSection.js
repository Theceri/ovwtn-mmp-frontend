'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(150, 32, 33, 0.03) 0%, 
                rgba(56, 86, 100, 0.05) 50%, 
                rgba(145, 162, 123, 0.03) 100%
              )
            `
          }}
        />
        {/* Decorative circles */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        />
        <div 
          className="absolute top-1/2 -left-20 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--brand-secondary)' }}
        />
        <div 
          className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--brand-accent)' }}
        />
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(var(--brand-secondary) 1px, transparent 1px),
              linear-gradient(90deg, var(--brand-secondary) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white shadow-md border border-gray-100">
              <span 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--brand-accent)' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Empowering Women in Trade Across Kenya
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span style={{ color: 'var(--text-primary)' }}>Unite. Trade. </span>
                <span 
                  className="relative inline-block"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  Thrive.
                  <svg 
                    className="absolute -bottom-2 left-0 w-full" 
                    viewBox="0 0 200 12" 
                    fill="none"
                  >
                    <path 
                      d="M2 8C50 2 150 2 198 8" 
                      stroke="var(--brand-orange)" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      className="opacity-60"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-lg sm:text-xl max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                Join Kenya&apos;s leading network of women-led associations driving 
                collective advocacy, trade facilitation, and business growth in 
                export value chains.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/apply"
                className="w-full sm:w-auto px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <span>Apply for Membership</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#membership"
                className="w-full sm:w-auto px-8 py-4 font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                style={{ 
                  color: 'var(--brand-secondary)', 
                  borderColor: 'var(--brand-secondary)' 
                }}
              >
                <span>View Membership Tiers</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(145, 162, 123, 0.15)' }}
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Verified Members
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(56, 86, 100, 0.15)' }}
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--brand-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Nationwide Reach
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(217, 101, 52, 0.15)' }}
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--brand-orange)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Active Network
                </span>
              </div>
            </div>
          </div>

          {/* Image/Illustration Side */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Image Container */}
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Decorative frame */}
                <div 
                  className="absolute -inset-4 rounded-3xl rotate-3"
                  style={{ backgroundColor: 'rgba(145, 162, 123, 0.2)' }}
                />
                <div 
                  className="absolute -inset-4 rounded-3xl -rotate-3"
                  style={{ backgroundColor: 'rgba(56, 86, 100, 0.2)' }}
                />
                
                {/* Main visual */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 h-full flex flex-col items-center justify-center space-y-6">
                  <div className="w-40 h-40 relative">
                    <Image
                      src="/One-Voice-Final-LOGO.png"
                      alt="OVWTN Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      One Voice
                    </h3>
                    <p className="text-lg" style={{ color: 'var(--brand-primary)' }}>
                      Women Trade Network
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      Company Limited by Guarantee
                    </p>
                  </div>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: 'var(--brand-secondary)' }}>47</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Counties</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>200+</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: 'var(--brand-accent)' }}>50+</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Sectors</p>
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <div 
                  className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 animate-float"
                  style={{ animationDelay: '0s' }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(150, 32, 33, 0.1)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Network</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Growing Daily</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-float"
                  style={{ animationDelay: '1s' }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(145, 162, 123, 0.2)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: 'var(--brand-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Trade Value</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Increasing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#about" className="flex flex-col items-center space-y-2 text-gray-400 hover:text-gray-600 transition-colors">
          <span className="text-xs font-medium">Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
