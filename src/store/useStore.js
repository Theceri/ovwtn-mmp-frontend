import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global application store using Zustand
 * For general UI state and app-wide settings
 */
export const useStore = create(
  persist(
    (set, get) => ({
      // UI state
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Loading states
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
      
      // Modal state
      modalOpen: false,
      modalContent: null,
      openModal: (content) => set({ modalOpen: true, modalContent: content }),
      closeModal: () => set({ modalOpen: false, modalContent: null }),
      
      // Toast messages (managed by Sonner but we can track state)
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification]
      })),
      clearNotifications: () => set({ notifications: [] }),
      
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
    }),
    {
      name: 'ovwtn-app-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    }
  )
);
