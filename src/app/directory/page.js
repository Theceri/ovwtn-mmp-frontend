'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicDirectory, getMembershipTiers, getPublicCategories } from '@/lib/api';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';

// Kenyan counties list for the filter
const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans-Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir',
  'West Pokot',
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'county', label: 'County' },
  { value: 'date', label: 'Newest First' },
  { value: 'relevance', label: 'Relevance' },
];

function TierBadge({ tierSlug, tierName }) {
  const styles = {
    full: { bg: '#fdf0ea', color: '#d96534', label: tierName || 'Full' },
    basic: { bg: '#e8eef2', color: '#385664', label: tierName || 'Basic' },
  };
  const style = styles[tierSlug] || styles.basic;
  return (
    <span
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label} Member
    </span>
  );
}

function OrganisationCard({ org }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
  const sectors = Array.isArray(org.sectors) ? org.sectors : [];

  return (
    <Link
      href={`/directory/${org.id}`}
      className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
    >
      {/* Top section with logo */}
      <div className="p-5 pb-0 flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-gray-50 border flex-shrink-0 flex items-center justify-center overflow-hidden">
          {org.logo_url ? (
            <img
              src={`${API_BASE}${org.logo_url}`}
              alt={`${org.name} logo`}
              className="w-full h-full object-contain"
            />
          ) : (
            <svg className="w-8 h-8" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight group-hover:underline line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            {org.name}
          </h3>
          <div className="mt-1.5">
            <TierBadge tierSlug={org.membership_tier_slug} tierName={org.membership_tier} />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pt-3 flex-1">
        {org.short_description ? (
          <p className="text-sm line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
            {org.short_description}
          </p>
        ) : (
          <p className="text-sm italic" style={{ color: 'var(--text-tertiary)' }}>
            No description available
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 mt-auto">
        {/* County */}
        {org.county && (
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{org.county}</span>
          </div>
        )}

        {/* Sectors */}
        {sectors.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {sectors.slice(0, 3).map((sector) => (
              <span
                key={sector}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100"
                style={{ color: 'var(--text-secondary)' }}
              >
                {sector}
              </span>
            ))}
            {sectors.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100" style={{ color: 'var(--text-tertiary)' }}>
                +{sectors.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function DirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [loading, setLoading] = useState(true);
  const [organisations, setOrganisations] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tiers, setTiers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state initialised from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [tier, setTier] = useState(searchParams.get('tier') || '');
  const [sector, setSector] = useState(searchParams.get('sector') || '');
  const [county, setCounty] = useState(searchParams.get('county') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [hasListings, setHasListings] = useState(searchParams.get('has_listings') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'name');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Sectors collected from results (for the multi-select)
  const [availableSectors, setAvailableSectors] = useState([]);

  // Load reference data on mount
  useEffect(() => {
    loadReferenceData();
  }, []);

  // Load directory when filters/page change
  useEffect(() => {
    loadDirectory();
    updateUrlParams();
  }, [page, sort]);

  const loadReferenceData = async () => {
    try {
      const [tiersData, catsData] = await Promise.all([
        getMembershipTiers(),
        getPublicCategories(),
      ]);
      // Only show tiers that appear in directory (Basic/Full)
      setTiers(tiersData.filter(t => t.isPublicDirectory));
      setCategories(catsData);
    } catch (err) {
      console.error('Failed to load reference data:', err);
    }
  };

  const buildParams = useCallback(() => {
    const params = { page, limit: 12, sort };
    if (search.trim()) params.search = search.trim();
    if (tier) params.tier = tier;
    if (sector) params.sector = sector;
    if (county) params.county = county;
    if (category) params.category = category;
    if (hasListings) params.has_listings = true;
    return params;
  }, [page, sort, search, tier, sector, county, category, hasListings]);

  const loadDirectory = async () => {
    try {
      setLoading(true);
      const data = await getPublicDirectory(buildParams());
      setOrganisations(data.items);
      setTotal(data.total);
      setTotalPages(data.pages);

      // Collect unique sectors from the results for the filter
      const allSectors = new Set();
      data.items.forEach(org => {
        if (Array.isArray(org.sectors)) {
          org.sectors.forEach(s => allSectors.add(s));
        }
      });
      setAvailableSectors(prev => {
        const merged = new Set([...prev, ...allSectors]);
        return Array.from(merged).sort();
      });
    } catch (err) {
      console.error('Failed to load directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (tier) params.set('tier', tier);
    if (sector) params.set('sector', sector);
    if (county) params.set('county', county);
    if (category) params.set('category', category);
    if (hasListings) params.set('has_listings', 'true');
    if (sort !== 'name') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    router.replace(`/directory${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadDirectory();
    updateUrlParams();
  };

  const handleApplyFilters = () => {
    setPage(1);
    setFiltersOpen(false);
    loadDirectory();
    updateUrlParams();
  };

  const handleResetFilters = () => {
    setSearch('');
    setTier('');
    setSector('');
    setCounty('');
    setCategory('');
    setHasListings(false);
    setSort('name');
    setPage(1);
    setFiltersOpen(false);
    // Load with cleared filters
    setTimeout(() => {
      router.replace('/directory');
    }, 0);
  };

  // When reset clears the URL, reload
  useEffect(() => {
    if (
      !search && !tier && !sector && !county && !category && !hasListings &&
      sort === 'name' && page === 1
    ) {
      loadDirectory();
    }
  }, [search, tier, sector, county, category, hasListings, sort, page]);

  const hasActiveFilters = tier || sector || county || category || hasListings;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="pt-28 pb-10 px-4" style={{ backgroundColor: '#f7f8fa' }}>
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Member Directory
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Discover women-led trade associations and businesses across Kenya.
            Connect, collaborate, and grow together.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
            <div className="flex bg-white rounded-xl shadow-md border overflow-hidden">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, description, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-sm focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Results count + sort */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>{total} organisation{total !== 1 ? 's' : ''} found</span>
            <span className="hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="px-3 py-1.5 border rounded-lg text-sm bg-white"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Filters</h3>
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        className="text-xs font-medium hover:underline"
                        style={{ color: 'var(--brand-primary)' }}
                      >
                        Reset all
                      </button>
                    )}
                  </div>

                  {/* Tier filter */}
                  <div className="mb-5">
                    <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                      Membership Tier
                    </label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    >
                      <option value="">All Tiers</option>
                      <option value="basic">Basic</option>
                      <option value="full">Full</option>
                    </select>
                  </div>

                  {/* County filter */}
                  <div className="mb-5">
                    <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                      County
                    </label>
                    <select
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    >
                      <option value="">All Counties</option>
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sector filter */}
                  <div className="mb-5">
                    <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                      Sector
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    >
                      <option value="">All Sectors</option>
                      {availableSectors.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category filter */}
                  <div className="mb-5">
                    <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                      Goods/Services Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Has listings checkbox */}
                  <div className="mb-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasListings}
                        onChange={(e) => setHasListings(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                        style={{ accentColor: 'var(--brand-primary)' }}
                      />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        Has active listings
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleApplyFilters}
                    className="w-full py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: 'var(--brand-secondary)' }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Mobile filter toggle + panel */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-sm font-medium text-white transition-all hover:shadow-xl"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>
            </div>

            {/* Mobile filter modal */}
            {filtersOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setFiltersOpen(false)}>
                <div
                  className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[85vh] overflow-y-auto p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Filters</h3>
                    <button onClick={() => setFiltersOpen(false)} className="p-1 rounded hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-5">
                    {/* Tier */}
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>
                        Membership Tier
                      </label>
                      <select value={tier} onChange={(e) => setTier(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white" style={{ borderColor: 'var(--input-border)' }}>
                        <option value="">All Tiers</option>
                        <option value="basic">Basic</option>
                        <option value="full">Full</option>
                      </select>
                    </div>

                    {/* County */}
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>
                        County
                      </label>
                      <select value={county} onChange={(e) => setCounty(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white" style={{ borderColor: 'var(--input-border)' }}>
                        <option value="">All Counties</option>
                        {KENYAN_COUNTIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sector */}
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>
                        Sector
                      </label>
                      <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white" style={{ borderColor: 'var(--input-border)' }}>
                        <option value="">All Sectors</option>
                        {availableSectors.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>
                        Goods/Services Category
                      </label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white" style={{ borderColor: 'var(--input-border)' }}>
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Has listings */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasListings}
                        onChange={(e) => setHasListings(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                        style={{ accentColor: 'var(--brand-primary)' }}
                      />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Has active listings</span>
                    </label>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleResetFilters}
                      className="flex-1 py-2.5 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleApplyFilters}
                      className="flex-1 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results grid */}
            <div className="flex-1 min-w-0">
              {/* Active filter chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {tier && (
                    <FilterChip label={`Tier: ${tier}`} onRemove={() => { setTier(''); handleApplyFilters(); }} />
                  )}
                  {county && (
                    <FilterChip label={`County: ${county}`} onRemove={() => { setCounty(''); handleApplyFilters(); }} />
                  )}
                  {sector && (
                    <FilterChip label={`Sector: ${sector}`} onRemove={() => { setSector(''); handleApplyFilters(); }} />
                  )}
                  {category && (
                    <FilterChip label={`Category: ${category}`} onRemove={() => { setCategory(''); handleApplyFilters(); }} />
                  )}
                  {hasListings && (
                    <FilterChip label="Has listings" onRemove={() => { setHasListings(false); handleApplyFilters(); }} />
                  )}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div
                      className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4"
                      style={{ borderBottomColor: 'var(--brand-primary)' }}
                    />
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Loading directory...
                    </p>
                  </div>
                </div>
              ) : organisations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    No organisations found
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Try adjusting your search or filters to find what you&apos;re looking for.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {organisations.map((org) => (
                      <OrganisationCard key={org.id} org={org} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      >
                        Previous
                      </button>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100" style={{ color: 'var(--text-primary)' }}>
      {label}
      <button onClick={onRemove} className="hover:text-red-600 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
