'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getMarketplaceListingDetail } from '@/lib/api';

export default function ListingDetailsPage({ params }) {
  const { id } = use(params);
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (token) loadListing();
  }, [token, id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const data = await getMarketplaceListingDetail(id, token);
      setListing(data);
    } catch (error) {
      toast.error('Listing not found or access denied');
      router.push(`/member/view-listings/${listing.id}`);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (l) => {
    if (l.price_type === 'on_request') return 'Price on Request';
    const currency = l.currency || 'KES';
    const min = Number(l.price_min || 0).toLocaleString();
    if (l.price_type === 'range') {
      return `${currency} ${min} - ${Number(l.price_max || 0).toLocaleString()}`;
    }
    return `${currency} ${min}`;
  };

  const getVisibilityBadge = (visibility) => {
    const badges = {
      public: { label: 'Public', color: '#166534', bg: '#f0fdf4' },
      members_only: { label: 'Members Only', color: '#075985', bg: '#f0f9ff' },
      paid_tier_only: { label: 'Premium', color: '#991b1b', bg: '#fef2f2' },
    };
    return badges[visibility] || badges.public;
  };

  // 1. If we are still fetching, show the spinner
  if (loading || !listing) {
  return (
    <div className="flex items-center justify-center py-20">
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2"
        style={{ borderBottomColor: 'var(--brand-primary)' }}
      />
    </div>
  );
}

  const badge = getVisibilityBadge(listing.visibility);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium hover:underline"
        style={{ color: 'var(--text-secondary)' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Photos & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="bg-white rounded-2xl border p-2 shadow-sm">
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative">
              {listing.photos?.length > 0 ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${listing.photos[activePhoto]}`}
                  className="w-full h-full object-contain"
                  alt={listing.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No images available</div>
              )}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: badge.bg, color: badge.color }}>
                  {badge.label}
                </span>
              </div>
            </div>
            
            {listing.photos?.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {listing.photos.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActivePhoto(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg border-2 transition-all ${activePhoto === idx ? 'border-[var(--brand-primary)]' : 'border-transparent'}`}
                  >
                    <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${img}`} className="w-full h-full object-cover rounded-md" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[var(--brand-primary)] font-medium">
                <span>{listing.category_icon}</span>
                <span className="text-sm">{listing.category_name}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{listing.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 pl-4" style={{ borderColor: 'var(--brand-secondary)' }}>
                {listing.short_summary}
              </p>
            </div>

            <hr />

            <div className="prose prose-sm max-w-none">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{listing.full_description}</p>
            </div>
          </div>
        </div>

        {/* Right: Contact & Price Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm sticky top-6">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Price</p>
              <h2 className="text-3xl font-black" style={{ color: 'var(--brand-primary)' }}>
                {formatPrice(listing)}
              </h2>
              {listing.unit_of_sale && (
                <p className="text-sm text-gray-400 mt-1">per {listing.unit_of_sale}</p>
              )}
            </div>

            <div className="space-y-3">
              {listing.whatsapp_phone && (
                <a 
                  href={`https://wa.me/${listing.whatsapp_phone.replace(/\+/g, '')}?text=Hi, I am interested in your listing: ${listing.title}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold hover:shadow-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.516.903 3.135 1.38 4.793 1.381 5.233 0 9.491-4.258 9.493-9.491 0-2.533-.987-4.915-2.778-6.708s-4.175-2.779-6.708-2.779c-5.235 0-9.493 4.258-9.495 9.493-.001 1.608.403 3.18 1.17 4.561l-.993 3.631 3.72-.976zm9.954-6.83c-.273-.137-1.62-.8-1.87-.891-.249-.09-.431-.137-.613.137-.182.273-.706.891-.865 1.072-.158.182-.317.204-.59.068-.272-.137-1.15-.424-2.19-1.352-.809-.722-1.355-1.614-1.514-1.886-.159-.272-.017-.42.119-.556.124-.122.272-.318.409-.477.136-.159.182-.272.272-.454.091-.182.045-.341-.023-.477-.068-.137-.613-1.477-.841-2.022-.222-.53-.446-.458-.613-.466-.159-.008-.341-.01-.522-.01s-.477.068-.727.341c-.25.272-.954.932-.954 2.272s.977 2.636 1.114 2.818c.136.182 1.922 2.934 4.656 4.114.65.28 1.157.448 1.551.573.653.208 1.248.179 1.718.108.524-.078 1.62-.663 1.848-1.303.227-.641.227-1.192.159-1.303-.069-.112-.25-.182-.523-.319z"/></svg>
                  Contact on WhatsApp
                </a>
              )}
              {listing.contact_phone && (
                <a href={`tel:${listing.contact_phone}`} className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-all">
                  Call {listing.contact_phone}
                </a>
              )}
              {listing.contact_email && (
                <a href={`mailto:${listing.contact_email}`} className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-all text-xs">
                  {listing.contact_email}
                </a>
              )}
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Seller</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">🏢</div>
                <div>
                  <p className="font-bold text-sm">{listing.organisation_name}</p>
                  <p className="text-xs text-gray-500">{listing.organisation_county || 'Nairobi'}, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}