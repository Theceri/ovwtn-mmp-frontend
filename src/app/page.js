'use client';

import { useEffect, useState } from 'react';
import { getPublicStats } from '@/lib/api';
import {
  Navigation,
  Footer,
  HeroSection,
  AboutSection,
  MembershipTiers,
  HowItWorks,
  BenefitsSection,
  StatsSection,
  CTASection,
} from '@/components/landing';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPublicStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Stats component will use default placeholder values
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Membership Tiers */}
        <MembershipTiers />

        {/* How It Works */}
        <HowItWorks />

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Call to Action */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
