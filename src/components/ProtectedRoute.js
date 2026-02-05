'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Protected Route Wrapper Component
 * Redirects unauthenticated users to login page
 * Optionally checks for specific roles (admin, member)
 */
export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireRole = null, // 'admin' or 'member'
  redirectTo = '/login'
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isAuthenticated, isAdmin, isMember } = useAuthStore();

  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') {
      return;
    }

    // If authentication is required
    if (requireAuth) {
      // Check if user is authenticated (either via NextAuth or Zustand)
      const authenticated = status === 'authenticated' || isAuthenticated;

      if (!authenticated) {
        router.push(redirectTo);
        return;
      }

      // Check role requirement if specified
      if (requireRole) {
        const hasRole = 
          (requireRole === 'admin' && (session?.user?.role === 'admin' || isAdmin())) ||
          (requireRole === 'member' && (session?.user?.role === 'member' || isMember()));

        if (!hasRole) {
          // Redirect to appropriate dashboard based on user's actual role
          if (session?.user?.role === 'admin' || isAdmin()) {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
          return;
        }
      }
    }
  }, [status, session, isAuthenticated, requireAuth, requireRole, router, redirectTo, isAdmin, isMember]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
               style={{ borderBottomColor: 'var(--brand-primary)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated, don't render children
  if (requireAuth && status !== 'authenticated' && !isAuthenticated) {
    return null;
  }

  // If role is required and user doesn't have it, don't render children
  if (requireRole) {
    const hasRole = 
      (requireRole === 'admin' && (session?.user?.role === 'admin' || isAdmin())) ||
      (requireRole === 'member' && (session?.user?.role === 'member' || isMember()));

    if (!hasRole) {
      return null;
    }
  }

  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuth(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
