'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Custom Session Provider that syncs NextAuth session with Zustand store
 */
function AuthSync() {
  const { data: session, status } = useSession();
  const { setAuth, logout } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Sync NextAuth session to Zustand store
      setAuth(
        {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          organisation_id: session.user.organisation_id,
        },
        session.accessToken
      );
    } else if (status === 'unauthenticated') {
      // Clear Zustand store when logged out
      logout();
    }
  }, [session, status, setAuth, logout]);

  return null;
}

export default function SessionProvider({ children }) {
  return (
    <NextAuthSessionProvider>
      <AuthSync />
      {children}
    </NextAuthSessionProvider>
  );
}
