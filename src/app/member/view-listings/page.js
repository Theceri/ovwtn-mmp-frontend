// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { toast } from 'sonner';
// import { useAuth } from '@/hooks/useAuth';
// import { getMemberMarketplaceListings, getPublicCategories } from '@/lib/api';

// export default function MarketplacePage() {
//   const { token } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [listings, setListings] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');

//   // Load categories once token is available
//   useEffect(() => {
//     if (token) loadCategories();
//   }, [token]);

//   // Load listings whenever token, page, search, or category changes
//   useEffect(() => {
//     if (token) loadListings();
//   }, [token, page, search, categoryFilter]);

//   const loadCategories = async () => {
//     try {
//       const data = await getPublicCategories();
//       setCategories(data);
//     } catch (error) {
//       console.error('Failed to load categories:', error);
//     }
//   };

//   const loadListings = async () => {
//   try {
//     setLoading(true);
//     const params = { page, limit: 12 };
//     if (search) params.search = search;
//     // Only add category_id if it's a valid number
//     if (categoryFilter && !isNaN(Number(categoryFilter))) {
//       params.category_id = Number(categoryFilter);
//     }

//     const data = await getMemberMarketplaceListings(params, token);
//     setListings(data.items);
//     setTotal(data.total);
//     setTotalPages(data.pages);
//   } catch (error) {
//     console.error('Failed to load marketplace listings:', error);
//     toast.error('Failed to load listings');
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPage(1);
//     loadListings();
//   };

//   const formatPrice = (listing) => {
//     if (listing.price_type === 'on_request') return 'Price on request';
//     const currency = listing.currency || 'KES';
//     if (listing.price_type === 'exact')
//       return `${currency} ${Number(listing.price_min).toLocaleString()}`;
//     if (listing.price_type === 'range')
//       return `${currency} ${Number(listing.price_min).toLocaleString()} - ${Number(
//         listing.price_max
//       ).toLocaleString()}`;
//     return '';
//   };

//   const getVisibilityBadge = (visibility) => {
//     const badges = {
//       public: { label: 'Public', color: '#91a27b', bg: '#f0f5eb' },
//       members: { label: 'Members Only', color: '#385664', bg: '#e8eef2' },
//     };
//     return badges[visibility] || badges.public;
//   };

//   if (loading && listings.length === 0) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="text-center">
//           <div
//             className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
//             style={{ borderBottomColor: 'var(--brand-primary)' }}
//           />
//           <p style={{ color: 'var(--text-secondary)' }}>Loading listings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
//             Marketplace
//           </h1>
//           <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
//             Browse goods and services from other members ({total} total)
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border p-4">
//         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search by title..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
//               style={{ borderColor: 'var(--input-border)' }}
//             />
//           </div>
//           <select
//             value={categoryFilter}
//             onChange={(e) => {
//                 setCategoryFilter(e.target.value); // e.g., "" or number string
//                 setPage(1);
//             }}
//             >
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                 {cat.icon} {cat.name}
//                 </option>
//             ))}
//             </select>
//           <button
//             type="submit"
//             className="px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
//             style={{ backgroundColor: 'var(--brand-secondary)' }}
//           >
//             Search
//           </button>
//         </form>
//       </div>

//       {/* Listings Grid */}
//       {listings.length === 0 ? (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
//             No listings yet
//           </h3>
//           <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
//             No listings match your search criteria.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {listings.map((listing) => {
//             const visibilityBadge = getVisibilityBadge(listing.visibility);
//             return (
//               <Link
//                 key={listing.id}
//                 href={`/marketplace/${Number(listing.id)}`}
//                 className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
//               >
//                 {/* Photo thumbnail */}
//                 <div className="h-40 bg-gray-100 relative">
//                   {listing.photos && listing.photos.length > 0 ? (
//                     <img
//                       src={`${process.env.NEXT_PUBLIC_BASE_URL}${listing.photos[0]}`}
//                       alt={listing.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <svg
//                         className="w-12 h-12"
//                         style={{ color: 'var(--text-tertiary)' }}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={1.5}
//                           d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </div>
//                   )}
//                   {/* Status badges */}
//                   <div className="absolute top-2 right-2 flex gap-1.5">
//                     <span
//                       className="text-xs font-medium px-2 py-0.5 rounded-full"
//                       style={{ backgroundColor: visibilityBadge.bg, color: visibilityBadge.color }}
//                     >
//                       {visibilityBadge.label}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-4">
//                   <h3 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
//                     {listing.title}
//                   </h3>
//                   <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
//                     {listing.short_summary}
//                   </p>
//                   <p className="text-sm font-bold" style={{ color: 'var(--brand-primary)' }}>
//                     {formatPrice(listing)}
//                   </p>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-2">
//           <button
//             onClick={() => setPage(Math.max(1, page - 1))}
//             disabled={page === 1}
//             className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-40 hover:bg-gray-50 transition-colors"
//             style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
//           >
//             Previous
//           </button>
//           <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={() => setPage(Math.min(totalPages, page + 1))}
//             disabled={page === totalPages}
//             className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-40 hover:bg-gray-50 transition-colors"
//             style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getMemberMarketplaceListings, getPublicCategories } from '@/lib/api';

export default function MarketplacePage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Load categories once
  useEffect(() => {
    if (token) loadCategories();
  }, [token]);

  // Load listings whenever dependencies change
  useEffect(() => {
    if (token) loadListings();
  }, [token, page, categoryFilter]);

  const loadCategories = async () => {
    try {
      const data = await getPublicCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      
      const params = { 
        page: Number(page), 
        limit: 12 
      };

      if (search && search.trim() !== '') {
        params.search = search.trim();
      }

      const parsedCat = parseInt(categoryFilter);
      if (!isNaN(parsedCat) && parsedCat > 0) {
        params.category_id = parsedCat;
      }

      const data = await getMemberMarketplaceListings(params, token);
      
      setListings(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Failed to load marketplace listings:', error);
      toast.error(error.message || 'Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadListings();
  };

  const formatPrice = (listing) => {
    if (listing.price_type === 'on_request') return 'Price on request';
    const currency = listing.currency || 'KES';
    const min = Number(listing.price_min || 0).toLocaleString();
    const max = Number(listing.price_max || 0).toLocaleString();
    
    if (listing.price_type === 'exact') return `${currency} ${min}`;
    if (listing.price_type === 'range') return `${currency} ${min} - ${max}`;
    return '';
  };

  /**
   * Updated visibility badge logic to match backend strings:
   * public, members_only, paid_tier_only
   */
  const getVisibilityBadge = (visibility) => {
    const badges = {
      public: { label: 'Public', color: '#166534', bg: '#f0fdf4' }, // Greenish
      members_only: { label: 'Members', color: '#075985', bg: '#f0f9ff' }, // Bluish
      paid_tier_only: { label: 'Premium', color: '#991b1b', bg: '#fef2f2' }, // Reddish/Gold
    };
    
    // Fallback for "members" (short version) or "private"
    if (visibility === 'members') return badges.members_only;
    
    return badges[visibility] || { label: 'Private', color: '#374151', bg: '#f3f4f6' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Marketplace
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Browse goods and services from other members ({total} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: 'var(--input-border)' }}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 border rounded-lg text-sm bg-white"
            style={{ borderColor: 'var(--input-border)' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--brand-secondary)' }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Content State */}
      {loading && listings.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: 'var(--brand-primary)' }} />
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => {
            const badge = getVisibilityBadge(listing.visibility);
            return (
              <Link
                key={listing.id}
                href={`/member/view-listings/${listing.id}`}
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-40 bg-gray-100 relative">
                  {listing.photos?.length > 0 ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${listing.photos[0]}`}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Visibility Badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm"
                      style={{ backgroundColor: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Category Icon Floating */}
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-1.5 py-0.5 text-xs shadow-sm border border-white/20">
                    {listing.category_icon} {listing.category_name}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                    {listing.title}
                  </h3>
                  <p className="text-xs mb-3 line-clamp-2 text-gray-500 min-h-[32px]">
                    {listing.short_summary}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-sm font-bold" style={{ color: 'var(--brand-primary)' }}>
                      {formatPrice(listing)}
                    </p>
                    <p className="text-[10px] text-gray-400 italic">
                      {listing.organisation_name}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
             <span className="text-sm font-medium">{page}</span>
             <span className="text-sm text-gray-400">/</span>
             <span className="text-sm text-gray-400">{totalPages}</span>
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}