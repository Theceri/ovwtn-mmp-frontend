'use client';

import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Custom hook that combines NextAuth session and Zustand store
 * Provides a unified interface for authentication state
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const { 
    user, 
    token, 
    isAuthenticated: zustandAuth, 
    isAdmin, 
    isMember,
    getOrganisationId 
  } = useAuthStore();

  // Prefer NextAuth session, fallback to Zustand
  const isAuthenticated = status === 'authenticated' || zustandAuth;
  const currentUser = session?.user || user;
  const currentToken = session?.accessToken || token;

  return {
    user: currentUser,
    token: currentToken,
    isAuthenticated,
    isLoading: status === 'loading',
    isAdmin: isAdmin() || currentUser?.role === 'admin',
    isMember: isMember() || currentUser?.role === 'member',
    organisationId: getOrganisationId() || currentUser?.organisation_id,
    session,
  };
}
