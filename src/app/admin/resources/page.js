'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getAdminResources,
  uploadResource,
  updateResource,
  deleteResource,
} from '@/lib/api';

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'Visible to everyone' },
  { value: 'member_only', label: 'Members Only', description: 'Requires membership' },
];

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

export default function AdminResourcesPage() {
  const { token } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [totalResources, setTotalResources] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('');

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null,
    title: '',
    description: '',
    visibility: 'public',
    category: '',
    tags: '',
  });

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    visibility: 'public',
    category: '',
    tags: '',
  });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (token) loadResources();
  }, [token, page, searchTerm, filterVisibility]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (searchTerm) params.search = searchTerm;
      if (filterVisibility) params.visibility = filterVisibility;
      const data = await getAdminResources(params, token);
      setResources(data.items);
      setTotalResources(data.total);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  // Upload handlers
  const openUploadModal = () => {
    setUploadForm({
      file: null,
      title: '',
      description: '',
      visibility: 'public',
      category: '',
      tags: '',
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm((prev) => ({
        ...prev,
        file,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      toast.error('Please select a file');
      return;
    }
    if (!uploadForm.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setUploading(true);
    try {
      await uploadResource(
        {
          file: uploadForm.file,
          title: uploadForm.title.trim(),
          description: uploadForm.description.trim() || null,
          visibility: uploadForm.visibility,
          category: uploadForm.category.trim() || null,
          tags: uploadForm.tags.trim() || null,
        },
        token
      );
      toast.success('Resource uploaded successfully');
      setShowUploadModal(false);
      loadResources();
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Edit handlers
  const openEditModal = (resource) => {
    setEditingResource(resource);
    setEditForm({
      title: resource.title,
      description: resource.description || '',
      visibility: resource.visibility,
      category: resource.category || '',
      tags: resource.tags || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editForm.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      await updateResource(
        editingResource.id,
        {
          title: editForm.title.trim(),
          description: editForm.description.trim() || null,
          visibility: editForm.visibility,
          category: editForm.category.trim() || null,
          tags: editForm.tags.trim() || null,
        },
        token
      );
      toast.success('Resource updated');
      setShowEditModal(false);
      loadResources();
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const handleDelete = async (resourceId) => {
    setDeleting(true);
    try {
      await deleteResource(resourceId, token);
      toast.success('Resource deleted');
      setDeleteConfirm(null);
      loadResources();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Resource Library
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage uploaded resources ({totalResources} total)
          </p>
        </div>
        <button
          onClick={openUploadModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Resource
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 w-64"
          style={{ borderColor: 'var(--input-border)' }}
        />
        <select
          value={filterVisibility}
          onChange={(e) => {
            setFilterVisibility(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
        >
          <option value="">All Visibility</option>
          <option value="public">Public</option>
          <option value="member_only">Members Only</option>
        </select>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Document
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Visibility
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Size
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Uploaded By
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Date
              </th>
              <th className="text-center text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Downloads
              </th>
              <th className="text-right text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(resource.file_type)}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {resource.title}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                        {resource.file_name}
                      </p>
                      {resource.category && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-gray-100" style={{ color: 'var(--text-secondary)' }}>
                          {resource.category}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      resource.visibility === 'public'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {resource.visibility === 'public' ? 'Public' : 'Members Only'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatFileSize(resource.file_size)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {resource.uploaded_by_name || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(resource.created_at)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {resource.download_count || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(resource)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(resource)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {resources.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No resources found. Upload your first document to get started.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages} ({totalResources} resources)
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[100vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
              Upload New Resource
            </h3>

            <div className="space-y-4">
              {/* File input */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  File <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--input-border)' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadForm.file ? (
                    <div>
                      <span className="text-2xl">{getFileIcon(uploadForm.file.type)}</span>
                      <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-primary)' }}>
                        {uploadForm.file.name}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        {formatFileSize(uploadForm.file.size)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Click to select a file
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        PDF, Word, Excel, PowerPoint, CSV, images. Max 50MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.jpg,.jpeg,.png,.gif,.webp"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="Document title"
                  maxLength={255}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  rows={2}
                  placeholder="Brief description of this document"
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setUploadForm({ ...uploadForm, visibility: opt.value })}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        uploadForm.visibility === opt.value
                          ? 'border-[var(--brand-primary)] bg-red-50'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{
                        borderColor:
                          uploadForm.visibility === opt.value
                            ? 'var(--brand-primary)'
                            : 'var(--input-border)',
                      }}
                    >
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {opt.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }}
                    placeholder="e.g. Policy"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Tags
                  </label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }}
                    placeholder="e.g. trade, policy"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-5 py-2 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
              Edit Resource
            </h3>

            <div className="space-y-4">
              {/* File info (read-only) */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{getFileIcon(editingResource.file_type)}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {editingResource.file_name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {formatFileSize(editingResource.file_size)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, visibility: opt.value })}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        editForm.visibility === opt.value
                          ? 'border-[var(--brand-primary)] bg-red-50'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{
                        borderColor:
                          editForm.visibility === opt.value
                            ? 'var(--brand-primary)'
                            : 'var(--input-border)',
                      }}
                    >
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {opt.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }}
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Tags
                  </label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-5 py-2 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {saving ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Delete Resource
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
              Are you sure you want to delete <strong>&quot;{deleteConfirm.title}&quot;</strong>?
              The file will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}