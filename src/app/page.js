'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { checkHealth } from '@/lib/api';
import { toast } from 'sonner';

export default function Home() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await checkHealth();
        setHealthStatus(data);
        toast.success('Backend connection successful!');
      } catch (error) {
        console.error('Health check failed:', error);
        toast.error('Failed to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-28 w-28 relative">
                <Image
                  src="/One-Voice-Final-LOGO.png"
                  alt="One Voice Women Trade Network Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  One Voice Women Trade Network
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Membership Management Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold">
              Welcome to OVWTN
            </h2>
            <p className="text-xl max-w-2xl mx-auto">
              Empowering women-led associations in trade and business across Kenya
            </p>
          </div>

          {/* Brand Colors Showcase */}
          <div className="flex justify-center gap-4 py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Primary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--brand-secondary)' }}></div>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Secondary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--brand-accent)' }}></div>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Accent</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--brand-orange)' }}></div>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Orange</span>
            </div>
          </div>

          {/* Backend Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold mb-4">
              System Status
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: 'var(--brand-primary)' }}></div>
              </div>
            ) : healthStatus ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">All Systems Operational</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>API Status</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {healthStatus.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Database</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {healthStatus.database}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Project</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {healthStatus.project}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Version</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {healthStatus.version}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-red-600">
                <p className="font-medium">Backend connection failed</p>
                <p className="text-sm mt-2">
                  Please ensure the backend server is running on http://localhost:8000
                </p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
              <h4 className="text-lg font-semibold mb-2">
                Apply for Membership
              </h4>
              <p className="text-sm">
                Join our network of women-led associations
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
              <h4 className="text-lg font-semibold mb-2">
                Member Portal
              </h4>
              <p className="text-sm">
                Access your membership dashboard
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
              <h4 className="text-lg font-semibold mb-2">
                Resources
              </h4>
              <p className="text-sm">
                Access documents and learning materials
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p style={{ color: 'var(--text-tertiary)' }}>
            © 2026 One Voice Women Trade Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
