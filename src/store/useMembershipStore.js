import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Membership-related state management
 * Handles membership tiers, applications, and member data
 */
export const useMembershipStore = create(
  persist(
    (set, get) => ({
      // Membership tiers
      tiers: [],
      setTiers: (tiers) => set({ tiers }),
      
      // Current application (for multi-step form)
      currentApplication: null,
      setCurrentApplication: (application) => set({ currentApplication: application }),
      clearCurrentApplication: () => set({ currentApplication: null }),
      
      // Update current application (merge with existing)
      updateCurrentApplication: (data) => set((state) => ({
        currentApplication: state.currentApplication 
          ? { ...state.currentApplication, ...data }
          : data
      })),
      
      // Applications list (for admin or member viewing their applications)
      applications: [],
      setApplications: (applications) => set({ applications }),
      addApplication: (application) => set((state) => ({
        applications: [application, ...state.applications]
      })),
      
      // Organisations (for directory)
      organisations: [],
      setOrganisations: (organisations) => set({ organisations }),
      
      // Current organisation (for logged-in member)
      currentOrganisation: null,
      setCurrentOrganisation: (organisation) => set({ currentOrganisation: organisation }),
      clearCurrentOrganisation: () => set({ currentOrganisation: null }),
      
      // Payment proofs
      paymentProofs: [],
      setPaymentProofs: (paymentProofs) => set({ paymentProofs }),
      addPaymentProof: (paymentProof) => set((state) => ({
        paymentProofs: [paymentProof, ...state.paymentProofs]
      })),
      
      // Filters (for directory search)
      filters: {
        search: '',
        tier: '',
        county: '',
        sector: '',
        status: '',
      },
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      clearFilters: () => set({
        filters: {
          search: '',
          tier: '',
          county: '',
          sector: '',
          status: '',
        }
      }),
    }),
    {
      name: 'ovwtn-membership-storage',
      partialize: (state) => ({
        tiers: state.tiers,
        currentApplication: state.currentApplication,
        currentOrganisation: state.currentOrganisation,
      }),
    }
  )
);
