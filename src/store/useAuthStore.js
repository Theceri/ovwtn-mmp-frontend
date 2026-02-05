import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication state management
 * Handles user login, logout, and session management
 * Integrates with NextAuth for session management
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Set user and token
      setAuth: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: !!user && !!token 
      }),
      
      // Update user
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      // Set loading state
      setLoading: (isLoading) => set({ isLoading }),
      
      // Logout - clears both Zustand store and NextAuth session
      logout: async () => {
        // Clear Zustand store
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        
        // Clear NextAuth session (will be handled by signOut in components)
      },
      
      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },
      
      // Check if user is member
      isMember: () => {
        const { user } = get();
        return user?.role === 'member';
      },
      
      // Get user's organisation ID
      getOrganisationId: () => {
        const { user } = get();
        return user?.organisation_id || null;
      },
    }),
    {
      name: 'ovwtn-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
