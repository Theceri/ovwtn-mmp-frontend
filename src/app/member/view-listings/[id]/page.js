'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getMarketplaceListingDetail } from '@/lib/api';

export default function ListingDetailsPage({ params }) {
  const { id } = use(params);
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [tierRestricted, setTierRestricted] = useState(false);
  const [restrictionMessage, setRestrictionMessage] = useState('');

  useEffect(() => {
    if (token && id) loadListing();
  }, [token, id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      setTierRestricted(false);
      const data = await getMarketplaceListingDetail(id, token);
      setListing(data);
    } catch (error) {
      console.error('Marketplace Detail Error:', error);

      if (error.status === 403) {
        setTierRestricted(true);
        setRestrictionMessage(error.message || 'Your membership tier does not have access to this listing.');
      } else if (error.status === 404) {
        toast.error("Listing not found.");
        router.push('/member/view-listings');
      } else {
        toast.error(error.message || "An unexpected error occurred.");
        router.push('/member/view-listings');
      }
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
    return badges[visibility] || { label: 'Members', color: '#075985', bg: '#f0f9ff' };
  };

  if (tierRestricted) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Membership Upgrade Required</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{restrictionMessage}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.push('/member/view-listings')}
            className="px-5 py-2.5 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
          >
            Back to Marketplace
          </button>
          <Link
            href="/member/upgrade"
            className="px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Upgrade Membership
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !listing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
          style={{ borderBottomColor: 'var(--brand-primary)' }}
        />
        <p className="text-gray-400 text-sm animate-pulse">Loading listing details...</p>
      </div>
    );
  }

  const badge = getVisibilityBadge(listing.visibility);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Back Navigation */}
      <button 
        onClick={() => router.push('/member/view-listings')}
        className="flex items-center gap-2 text-sm font-medium hover:text-black transition-colors"
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
          <div className="bg-white rounded-2xl border p-2 shadow-sm">
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative border">
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
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/20" style={{ backgroundColor: badge.bg, color: badge.color }}>
                  {badge.label}
                </span>
              </div>
            </div>
            
            {listing.photos?.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2 px-1">
                {listing.photos.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActivePhoto(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg border-2 transition-all overflow-hidden ${activePhoto === idx ? 'border-[var(--brand-primary)]' : 'border-transparent opacity-60'}`}
                  >
                    <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${img}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[var(--brand-primary)] font-medium">
                <span className="text-lg">{listing.category_icon}</span>
                <span className="text-sm uppercase tracking-wide">{listing.category_name}</span>
              </div>
              <h1 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>{listing.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 pl-4" style={{ borderColor: 'var(--brand-secondary)' }}>
                {listing.short_summary}
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="prose prose-sm max-w-none">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Detailed Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {listing.full_description || listing.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Contact & Price Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm sticky top-6">
            <div className="mb-6">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Price</p>
              <h2 className="text-3xl font-black" style={{ color: 'var(--brand-primary)' }}>
                {formatPrice(listing)}
              </h2>
              {listing.unit_of_sale && (
                <p className="text-sm text-gray-400 mt-1 italic">per {listing.unit_of_sale}</p>
              )}
            </div>

            <div className="space-y-3">
              {listing.whatsapp_phone && (
                <a 
                  href={`https://wa.me/${listing.whatsapp_phone.replace(/\D/g, '')}?text=Hi, I am interested in your listing: ${listing.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 px-4 rounded-xl bg-[#25D366] text-white font-bold hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.516.903 3.135 1.38 4.793 1.381 5.233 0 9.491-4.258 9.493-9.491 0-2.533-.987-4.915-2.778-6.708s-4.175-2.779-6.708-2.779c-5.235 0-9.493 4.258-9.495 9.493-.001 1.608.403 3.18 1.17 4.561l-.993 3.631 3.72-.976zm9.954-6.83c-.273-.137-1.62-.8-1.87-.891-.249-.09-.431-.137-.613.137-.182.273-.706.891-.865 1.072-.158.182-.317.204-.59.068-.272-.137-1.15-.424-2.19-1.352-.809-.722-1.355-1.614-1.514-1.886-.159-.272-.017-.42.119-.556.124-.122.272-.318.409-.477.136-.159.182-.272.272-.454.091-.182.045-.341-.023-.477-.068-.137-.613-1.477-.841-2.022-.222-.53-.446-.458-.613-.466-.159-.008-.341-.01-.522-.01s-.477.068-.727.341c-.25.272-.954.932-.954 2.272s.977 2.636 1.114 2.818c.136.182 1.922 2.934 4.656 4.114.65.28 1.157.448 1.551.573.653.208 1.248.179 1.718.108.524-.078 1.62-.663 1.848-1.303.227-.641.227-1.192.159-1.303-.069-.112-.25-.182-.523-.319z"/></svg>
                  Message on WhatsApp
                </a>
              )}
              {listing.contact_phone && (
                <a href={`tel:${listing.contact_phone}`} className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-all">
                  Call {listing.contact_phone}
                </a>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-widest font-black">Vendor Details</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                  {listing.organisation_name?.[0]}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{listing.organisation_name}</p>
                  <p className="text-xs text-gray-500">{listing.organisation_county || listing.county || 'Nairobi'}, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}