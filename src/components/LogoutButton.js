'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

/**
 * Logout Button Component
 * Handles logout functionality for both NextAuth and Zustand store
 */
export default function LogoutButton({ 
  className = '',
  children = 'Sign Out',
  redirectTo = '/login',
  showToast = true
}) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      // Clear Zustand store
      logout();

      // Sign out from NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: redirectTo 
      });

      if (showToast) {
        toast.success('Logged out successfully');
      }

      // Redirect to login page
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      if (showToast) {
        toast.error('Error logging out');
      }
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
      style={{
        ...(className.includes('bg-') ? {} : {
          backgroundColor: 'var(--brand-primary)',
          color: 'white',
        }),
      }}
    >
      {children}
    </button>
  );
}
