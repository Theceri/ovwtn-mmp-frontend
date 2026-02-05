/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated (client-side)
 * @returns {boolean}
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  
  try {
    const { useAuthStore } = require('@/store/useAuthStore');
    return useAuthStore.getState().isAuthenticated;
  } catch {
    return false;
  }
}

/**
 * Get current user (client-side)
 * @returns {object|null}
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const { useAuthStore } = require('@/store/useAuthStore');
    return useAuthStore.getState().user;
  } catch {
    return null;
  }
}

/**
 * Get auth token (client-side)
 * @returns {string|null}
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    const { useAuthStore } = require('@/store/useAuthStore');
    return useAuthStore.getState().token;
  } catch {
    return null;
  }
}

/**
 * Check if user has admin role
 * @returns {boolean}
 */
export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Check if user has member role
 * @returns {boolean}
 */
export function isMember() {
  const user = getCurrentUser();
  return user?.role === 'member';
}
