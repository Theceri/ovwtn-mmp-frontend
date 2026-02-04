import { create } from 'zustand';

/**
 * Event state management
 * Handles events and event registrations
 */
export const useEventStore = create((set, get) => ({
  // Events
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({
    events: [event, ...state.events]
  })),
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
  })),
  removeEvent: (id) => set((state) => ({
    events: state.events.filter(e => e.id !== id)
  })),
  
  // Upcoming events (for homepage/dashboard)
  upcomingEvents: [],
  setUpcomingEvents: (events) => set({ upcomingEvents: events }),
  
  // Current event (for detail view/edit)
  currentEvent: null,
  setCurrentEvent: (event) => set({ currentEvent: event }),
  clearCurrentEvent: () => set({ currentEvent: null }),
  
  // Event registrations
  registrations: [],
  setRegistrations: (registrations) => set({ registrations }),
  addRegistration: (registration) => set((state) => ({
    registrations: [registration, ...state.registrations]
  })),
  
  // User's registrations
  myRegistrations: [],
  setMyRegistrations: (registrations) => set({ myRegistrations: registrations }),
  
  // Filters
  eventFilters: {
    search: '',
    dateFrom: null,
    dateTo: null,
    isOnline: null,
    allowRegistration: null,
  },
  setEventFilters: (filters) => set((state) => ({
    eventFilters: { ...state.eventFilters, ...filters }
  })),
  clearEventFilters: () => set({
    eventFilters: {
      search: '',
      dateFrom: null,
      dateTo: null,
      isOnline: null,
      allowRegistration: null,
    }
  }),
  
  // Loading states
  isLoadingEvents: false,
  setLoadingEvents: (loading) => set({ isLoadingEvents: loading }),
}));
