'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requireAuth={true} requireRole="admin">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Admin Dashboard
            </h1>
            <LogoutButton className="px-4 py-2 rounded-lg font-medium">
              Sign Out
            </LogoutButton>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Welcome, Admin {user?.name || user?.email}!
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              This is the admin dashboard. Only users with admin role can access this page.
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
