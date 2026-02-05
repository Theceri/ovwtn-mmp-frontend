'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, isAdmin, isMember } = useAuth();

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Member Dashboard
            </h1>
            <LogoutButton className="px-4 py-2 rounded-lg font-medium">
              Sign Out
            </LogoutButton>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Welcome, {user?.name || user?.email}!
            </h2>
            <div className="space-y-2">
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>Role:</strong> {user?.role}
              </p>
              {user?.organisation_id && (
                <p style={{ color: 'var(--text-secondary)' }}>
                  <strong>Organisation ID:</strong> {user.organisation_id}
                </p>
              )}
              {isAdmin() && (
                <p className="text-sm" style={{ color: 'var(--brand-primary)' }}>
                  You have admin privileges
                </p>
              )}
              {isMember() && (
                <p className="text-sm" style={{ color: 'var(--brand-secondary)' }}>
                  You are a member
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
