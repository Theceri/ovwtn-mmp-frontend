import { create } from 'zustand';

/**
 * Admin-specific state management
 * Handles admin dashboard data and actions
 */
export const useAdminStore = create((set, get) => ({
  // Dashboard stats
  stats: {
    totalMembers: 0,
    newMembersThisMonth: 0,
    pendingApplications: 0,
    pendingPayments: 0,
    activeMembers: 0,
    totalListings: 0,
    upcomingEvents: 0,
  },
  setStats: (stats) => set((state) => ({
    stats: { ...state.stats, ...stats }
  })),
  
  // Pending applications
  pendingApplications: [],
  setPendingApplications: (applications) => set({ pendingApplications: applications }),
  
  // Payment verification queue
  pendingPayments: [],
  setPendingPayments: (payments) => set({ pendingPayments: payments }),
  
  // Members list (for admin management)
  members: [],
  setMembers: (members) => set({ members }),
  
  // Selected application (for detail view)
  selectedApplication: null,
  setSelectedApplication: (application) => set({ selectedApplication: application }),
  clearSelectedApplication: () => set({ selectedApplication: null }),
  
  // Selected member (for edit/management)
  selectedMember: null,
  setSelectedMember: (member) => set({ selectedMember: member }),
  clearSelectedMember: () => set({ selectedMember: null }),
  
  // Audit logs
  auditLogs: [],
  setAuditLogs: (logs) => set({ auditLogs: logs }),
  addAuditLog: (log) => set((state) => ({
    auditLogs: [log, ...state.auditLogs]
  })),
  
  // Categories (for listing management)
  categories: [],
  setCategories: (categories) => set({ categories }),
  
  // Resources management
  resources: [],
  setResources: (resources) => set({ resources }),
  
  // Admin filters
  adminFilters: {
    status: 'all',
    tier: 'all',
    dateFrom: null,
    dateTo: null,
  },
  setAdminFilters: (filters) => set((state) => ({
    adminFilters: { ...state.adminFilters, ...filters }
  })),
  clearAdminFilters: () => set({
    adminFilters: {
      status: 'all',
      tier: 'all',
      dateFrom: null,
      dateTo: null,
    }
  }),
}));
