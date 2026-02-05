'use client';

import { useEffect, useState } from 'react';

// Animated counter hook
function useCounter(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration, start]);

  return [count, setHasStarted];
}

function StatCard({ label, value, suffix = '', icon, color, delay = 0 }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const [count, setHasStarted] = useCounter(numericValue, 2000);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasStarted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, setHasStarted]);

  return (
    <div 
      className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div 
        className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color }}>
            {icon}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-4xl font-bold" style={{ color }}>
          {value.includes('+') ? count + '+' : count}
          {suffix}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default function StatsSection({ stats }) {
  // Default stats - will be replaced by API data when available
  const defaultStats = {
    totalMembers: '200+',
    totalListings: '150+',
    totalDocuments: '50+',
    upcomingEvents: '5',
    activeCounties: '35',
    newMembersThisMonth: '12',
    contactRequests: '500+',
    featuredMembers: '25',
  };

  const displayStats = stats || defaultStats;

  const statCards = [
    {
      label: 'Member Organisations',
      value: displayStats.totalMembers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'var(--brand-primary)',
    },
    {
      label: 'Goods & Services Listings',
      value: displayStats.totalListings,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'var(--brand-secondary)',
    },
    {
      label: 'Resource Documents',
      value: displayStats.totalDocuments,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'var(--brand-accent)',
    },
    {
      label: 'Upcoming Events',
      value: displayStats.upcomingEvents,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'var(--brand-orange)',
    },
    {
      label: 'Counties Covered',
      value: displayStats.activeCounties,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
      color: 'var(--brand-primary)',
    },
    {
      label: 'New Members This Month',
      value: displayStats.newMembersThisMonth,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'var(--brand-secondary)',
    },
    {
      label: 'Business Connections',
      value: displayStats.contactRequests,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      color: 'var(--brand-accent)',
    },
    {
      label: 'Featured Members',
      value: displayStats.featuredMembers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'var(--brand-orange)',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(150, 32, 33, 0.1)' }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
              Network Statistics
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Join a Growing Network
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Our network continues to grow, connecting women-led associations across 
            Kenya with opportunities, resources, and each other.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-16">
          <div 
            className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Members Across Kenya
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Our network spans across all 47 counties
              </p>
            </div>
            
            {/* Placeholder Map Visual */}
            <div 
              className="relative h-64 md:h-96 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: 'rgba(56, 86, 100, 0.05)' }}
            >
              <div className="text-center space-y-4">
                <div 
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(56, 86, 100, 0.1)' }}
                >
                  <svg 
                    className="w-10 h-10" 
                    style={{ color: 'var(--brand-secondary)' }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Interactive County Map
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Coming soon - Click to explore members by county
                  </p>
                </div>
              </div>
              
              {/* Decorative dots representing counties */}
              <div className="absolute inset-0 p-8">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full animate-pulse"
                    style={{
                      backgroundColor: [
                        'var(--brand-primary)',
                        'var(--brand-secondary)',
                        'var(--brand-accent)',
                        'var(--brand-orange)',
                      ][i % 4],
                      top: `${20 + Math.random() * 60}%`,
                      left: `${10 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.2}s`,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
