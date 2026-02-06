'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/api';

const EMOJI_OPTIONS = ['🌾', '🍽️', '👗', '🎨', '💼', '💄', '💻', '📦', '🏗️', '🚗', '🏠', '📚', '🎭', '🌿', '⚡'];
const COLOR_OPTIONS = ['#91a27b', '#d96534', '#962021', '#385664', '#6b4c9a', '#2d8659', '#c9a227', '#1a73e8'];

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: '📦',
    color: '#385664',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (token) loadCategories();
  }, [token]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories(true, token);
      setCategories(data.items);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingCategory(null);
    setForm({
      name: '',
      description: '',
      icon: '📦',
      color: '#385664',
      display_order: categories.length,
      is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '📦',
      color: category.color || '#385664',
      display_order: category.display_order || 0,
      is_active: category.is_active,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        icon: form.icon,
        color: form.color,
        display_order: parseInt(form.display_order) || 0,
        is_active: form.is_active,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, data, token);
        toast.success('Category updated');
      } else {
        await createCategory(data, token);
        toast.success('Category created');
      }

      setShowModal(false);
      loadCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    setDeleting(true);
    try {
      await deleteCategory(categoryId, token);
      toast.success('Category deleted');
      setDeleteConfirm(null);
      loadCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (category) => {
    try {
      await updateCategory(category.id, { is_active: !category.is_active }, token);
      toast.success(category.is_active ? 'Category deactivated' : 'Category activated');
      loadCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to update category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderBottomColor: 'var(--brand-primary)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Loading categories...</p>
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
            Categories
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage listing categories ({categories.length} total)
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Order
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Category
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Description
              </th>
              <th className="text-center text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Listings
              </th>
              <th className="text-center text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Status
              </th>
              <th className="text-right text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: 'var(--text-tertiary)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    {category.display_order}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: category.color ? `${category.color}20` : '#f3f4f6' }}
                    >
                      {category.icon || '📦'}
                    </span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {category.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {category.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                    {category.description || '—'}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {category.listing_count || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggleActive(category)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      category.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(category)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(category)}
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

        {categories.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No categories found. Create your first category to get started.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="e.g. Agricultural Products"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  rows={2}
                  placeholder="Brief description of this category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, icon: emoji })}
                      className={`w-10 h-10 rounded-lg border text-lg flex items-center justify-center transition-colors ${
                        form.icon === emoji ? 'border-[var(--brand-primary)] bg-red-50' : 'hover:bg-gray-50'
                      }`}
                      style={{
                        borderColor: form.icon === emoji ? 'var(--brand-primary)' : 'var(--input-border)',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({ ...form, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        form.color === color ? 'ring-2 ring-offset-2 ring-[var(--brand-primary)]' : ''
                      }`}
                      style={{ backgroundColor: color, borderColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--input-border)' }}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, is_active: !form.is_active })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        form.is_active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          form.is_active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {form.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Delete Category
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
              Are you sure you want to delete <strong>&quot;{deleteConfirm.name}&quot;</strong>?
            </p>
            {deleteConfirm.listing_count > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-700">
                  This category has {deleteConfirm.listing_count} listing(s). You must reassign or delete those listings first, or deactivate this category instead.
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-end mt-4">
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
