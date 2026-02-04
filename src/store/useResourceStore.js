import { create } from 'zustand';

/**
 * Resource library state management
 * Handles document resources for members
 */
export const useResourceStore = create((set, get) => ({
  // Documents
  documents: [],
  setDocuments: (documents) => set({ documents }),
  addDocument: (document) => set((state) => ({
    documents: [document, ...state.documents]
  })),
  updateDocument: (id, updates) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  removeDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),
  
  // Public documents (accessible to everyone)
  publicDocuments: [],
  setPublicDocuments: (documents) => set({ publicDocuments: documents }),
  
  // Member-only documents (require authentication)
  memberDocuments: [],
  setMemberDocuments: (documents) => set({ memberDocuments: documents }),
  
  // Current document (for detail view)
  currentDocument: null,
  setCurrentDocument: (document) => set({ currentDocument: document }),
  clearCurrentDocument: () => set({ currentDocument: null }),
  
  // Filters
  resourceFilters: {
    search: '',
    category: '',
    visibility: 'all',
    fileType: '',
  },
  setResourceFilters: (filters) => set((state) => ({
    resourceFilters: { ...state.resourceFilters, ...filters }
  })),
  clearResourceFilters: () => set({
    resourceFilters: {
      search: '',
      category: '',
      visibility: 'all',
      fileType: '',
    }
  }),
  
  // Loading states
  isLoadingDocuments: false,
  setLoadingDocuments: (loading) => set({ isLoadingDocuments: loading }),
}));
