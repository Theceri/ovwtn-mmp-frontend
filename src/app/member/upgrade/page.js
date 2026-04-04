'use client';

import MembershipTiers from '@/components/landing/MembershipTiers';
import { useRouter, useSearchParams } from 'next/navigation';

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Check if they were redirected from a specific listing
  const fromListing = searchParams.get('from');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Contextual Header */}
      <div className="bg-white border-b py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          {fromListing && (
            <div className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4 border border-amber-100">
              🔒 Premium Listing: Upgrade your tier to view full details
            </div>
          )}
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">
            Elevate Your Experience
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Unlock professional tools, marketplace listing capabilities, and voting rights by upgrading to a higher membership tier.
          </p>
        </div>
      </div>

      {/* Your Membership Tiers Component */}
      <MembershipTiers />

      {/* Custom Back Button */}
      <div className="container mx-auto px-4 text-center mt-12">
        <button 
          onClick={() => router.back()}
          className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Go back to previous page
        </button>
      </div>
    </div>
  );
}