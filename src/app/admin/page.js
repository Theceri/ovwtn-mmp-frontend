'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Welcome, {user?.name || user?.email}!
        </h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Manage membership applications and platform settings from this dashboard.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/applications?status=pending_ceo_approval"
            className="block p-4 rounded-lg border-2 border-amber-200 bg-amber-50 hover:border-amber-400 transition-colors"
          >
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Pending CEO Approval
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              New applications awaiting CEO review and approval
            </p>
          </Link>
          <Link
            href="/admin/applications?status=approved_awaiting_payment"
            className="block p-4 rounded-lg border-2 border-blue-200 bg-blue-50 hover:border-blue-400 transition-colors"
          >
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Awaiting Payment
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Approved applications waiting for payment verification
            </p>
          </Link>
          <Link
            href="/admin/applications"
            className="block p-4 rounded-lg border-2 border-gray-200 hover:border-[var(--brand-primary)] hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              All Applications
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              View and manage all membership applications
            </p>
          </Link>
          <Link
            href="/admin/payments"
            className="block p-4 rounded-lg border-2 border-gray-200 hover:border-[var(--brand-primary)] hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Payment Verification
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Verify and manage payment proofs
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
