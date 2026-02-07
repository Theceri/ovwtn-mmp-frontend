'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/applications', label: 'Applications' },
  { href: '/admin/payments', label: 'Payment Verification' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/events', label: 'Events' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <ProtectedRoute requireAuth={true} requireRole="admin">
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col shrink-0">
          <div className="p-6 border-b">
            <h1 className="text-lg font-bold" style={{ color: 'var(--brand-primary)' }}>
              OVWTN Admin
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {user?.email}
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={!isActive ? { color: 'var(--text-primary)' } : {}}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <LogoutButton className="w-full px-4 py-2 rounded-lg text-sm font-medium">
              Sign Out
            </LogoutButton>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b px-8 py-4 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Admin Dashboard
            </h2>
          </header>

          <div className="flex-1 p-8 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
