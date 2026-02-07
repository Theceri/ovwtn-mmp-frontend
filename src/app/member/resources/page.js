'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getMemberResources, downloadMemberResource } from '@/lib/api';

function formatFileSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getFileIcon(fileType) {
  if (!fileType) return '📄';
  if (fileType.includes('pdf')) return '📕';
  if (fileType.includes('word') || fileType.includes('msword')) return '📘';
  if (fileType.includes('sheet') || fileType.includes('excel') || fileType.includes('csv')) return '📊';
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📙';
  if (fileType.includes('image')) return '🖼️';
  return '📄';
}

export default function MemberResourcesPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [totalResources, setTotalResources] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (token) loadResources();
  }, [token, page, searchTerm, filterCategory]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (searchTerm) params.search = searchTerm;
      if (filterCategory) params.category = filterCategory;
      const data = await getMemberResources(params, token);
      setResources(data.items);
      setTotalResources(data.total);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error(error.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource) => {
    setDownloading(resource.id);
    try {
      await downloadMemberResource(resource.id, resource.file_name, token);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download file');
    } finally {
      setDownloading(null);
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(resources.map((r) => r.category).filter(Boolean))];

  if (loading && resources.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderBottomColor: 'var(--brand-primary)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Resource Library
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Download documents and resources available to members ({totalResources} resources)
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 w-64"
          style={{ borderColor: 'var(--input-border)' }}
        />
        {categories.length > 0 && (
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Resource Cards */}
      {resources.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-xl border shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl mt-0.5">{getFileIcon(resource.file_type)}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {resource.title}
                  </h3>
                  {resource.description && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {resource.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {formatFileSize(resource.file_size)}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {formatDate(resource.created_at)}
                  </span>
                  {resource.visibility === 'member_only' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                      Members
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDownload(resource)}
                  disabled={downloading === resource.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-all hover:shadow-sm disabled:opacity-50"
                  style={{ backgroundColor: 'var(--brand-secondary, #385664)' }}
                >
                  {downloading === resource.id ? (
                    'Downloading...'
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </>
                  )}
                </button>
              </div>

              {resource.category && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-gray-100" style={{ color: 'var(--text-secondary)' }}>
                    {resource.category}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No resources available yet. Check back later.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
