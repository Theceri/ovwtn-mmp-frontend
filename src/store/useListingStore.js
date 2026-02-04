import { create } from 'zustand';

/**
 * Listing/Goods & Services state management
 * Handles listings posted by members
 */
export const useListingStore = create((set, get) => ({
  // Listings
  listings: [],
  setListings: (listings) => set({ listings }),
  addListing: (listing) => set((state) => ({
    listings: [listing, ...state.listings]
  })),
  updateListing: (id, updates) => set((state) => ({
    listings: state.listings.map(l => l.id === id ? { ...l, ...updates } : l)
  })),
  removeListing: (id) => set((state) => ({
    listings: state.listings.filter(l => l.id !== id)
  })),
  
  // Categories
  categories: [],
  setCategories: (categories) => set({ categories }),
  
  // Featured listings (for homepage)
  featuredListings: [],
  setFeaturedListings: (listings) => set({ featuredListings: listings }),
  
  // Current listing (for detail view/edit)
  currentListing: null,
  setCurrentListing: (listing) => set({ currentListing: listing }),
  clearCurrentListing: () => set({ currentListing: null }),
  
  // Filters
  listingFilters: {
    search: '',
    category: '',
    priceMin: null,
    priceMax: null,
    visibility: 'all',
    organisation: '',
  },
  setListingFilters: (filters) => set((state) => ({
    listingFilters: { ...state.listingFilters, ...filters }
  })),
  clearListingFilters: () => set({
    listingFilters: {
      search: '',
      category: '',
      priceMin: null,
      priceMax: null,
      visibility: 'all',
      organisation: '',
    }
  }),
  
  // Loading states
  isLoadingListings: false,
  setLoadingListings: (loading) => set({ isLoadingListings: loading }),
}));
