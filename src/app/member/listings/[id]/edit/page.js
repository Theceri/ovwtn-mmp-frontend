'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getMemberListing,
  updateListing,
  uploadListingPhotos,
  deleteListingPhoto,
  getPublicCategories,
} from '@/lib/api';

export default function EditListingPage({ params }) {
  const { id } = use(params);
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    short_summary: '',
    full_description: '',
    category_id: '',
    price_type: 'exact',
    price_min: '',
    price_max: '',
    currency: 'KES',
    unit_of_sale: '',
    whatsapp_phone: '',
    contact_email: '',
    contact_phone: '',
    visibility: 'public',
    is_active: true,
  });

  useEffect(() => {
    if (token) {
      loadCategories();
      loadListing();
    }
  }, [token, id]);

  const loadCategories = async () => {
    try {
      const data = await getPublicCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadListing = async () => {
    try {
      setLoading(true);
      const listing = await getMemberListing(id, token);
      setForm({
        title: listing.title || '',
        short_summary: listing.short_summary || '',
        full_description: listing.full_description || '',
        category_id: listing.category_id?.toString() || '',
        price_type: listing.price_type || 'exact',
        price_min: listing.price_min?.toString() || '',
        price_max: listing.price_max?.toString() || '',
        currency: listing.currency || 'KES',
        unit_of_sale: listing.unit_of_sale || '',
        whatsapp_phone: listing.whatsapp_phone || '',
        contact_email: listing.contact_email || '',
        contact_phone: listing.contact_phone || '',
        visibility: listing.visibility || 'public',
        is_active: listing.is_active ?? true,
      });
      setExistingPhotos(listing.photos || []);
    } catch (error) {
      toast.error('Failed to load listing');
      router.push('/member/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid type for "${file.name}". Use JPEG, PNG, GIF, or WebP.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Max 10MB.`);
        return;
      }
    }

    if (existingPhotos.length + files.length > 10) {
      toast.error('Maximum 10 photos per listing');
      return;
    }

    setUploadingPhotos(true);
    try {
      const result = await uploadListingPhotos(id, files, token);
      setExistingPhotos(result.photos);
      toast.success(`Uploaded ${files.length} photo(s)`);
    } catch (error) {
      toast.error(error.message || 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    try {
      const result = await deleteListingPhoto(id, photoUrl, token);
      setExistingPhotos(result.photos);
      toast.success('Photo removed');
    } catch (error) {
      toast.error(error.message || 'Failed to remove photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.full_description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!form.category_id) {
      toast.error('Please select a category');
      return;
    }

    setSaving(true);
    try {
      const listingData = {
        title: form.title.trim(),
        short_summary: form.short_summary.trim() || null,
        full_description: form.full_description.trim(),
        category_id: parseInt(form.category_id),
        price_type: form.price_type,
        price_min: form.price_type !== 'on_request' ? parseFloat(form.price_min) || null : null,
        price_max: form.price_type === 'range' ? parseFloat(form.price_max) || null : null,
        currency: form.currency,
        unit_of_sale: form.unit_of_sale.trim() || null,
        whatsapp_phone: form.whatsapp_phone.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        visibility: form.visibility,
        is_active: form.is_active,
      };

      await updateListing(id, listingData, token);
      toast.success('Listing updated successfully!');
      router.push('/member/listings');
    } catch (error) {
      toast.error(error.message || 'Failed to update listing');
    } finally {
      setSaving(false);
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
          <p style={{ color: 'var(--text-secondary)' }}>Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Edit Listing
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Update your listing details
          </p>
        </div>
        <button
          onClick={() => router.push('/member/listings')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
          style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Listings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                maxLength={255}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Short Summary
              </label>
              <textarea
                value={form.short_summary}
                onChange={(e) => handleChange('short_summary', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                rows={2}
                maxLength={500}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {form.short_summary.length}/500
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Full Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.full_description}
                onChange={(e) => handleChange('full_description', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                rows={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg text-sm bg-white"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Photos
          </h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {existingPhotos.length}/10 photos. Click &times; to remove.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {existingPhotos.map((photoUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
                  <img
                    src={`http://localhost:8000${photoUrl}`}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photoUrl)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}

            {existingPhotos.length < 10 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhotos}
                className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                style={{ borderColor: 'var(--input-border)' }}
              >
                {uploadingPhotos ? (
                  <svg className="animate-spin h-6 w-6" style={{ color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-8 h-8 mb-1" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Add Photo</span>
                  </>
                )}
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Pricing
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Price Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'exact', label: 'Fixed Price' },
                  { value: 'range', label: 'Price Range' },
                  { value: 'on_request', label: 'On Request' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price_type"
                      value={option.value}
                      checked={form.price_type === option.value}
                      onChange={(e) => handleChange('price_type', e.target.value)}
                      className="w-4 h-4"
                      style={{ accentColor: 'var(--brand-primary)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {form.price_type !== 'on_request' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    {form.price_type === 'exact' ? 'Price' : 'Minimum Price'} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <select
                      value={form.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="px-3 py-2.5 border border-r-0 rounded-l-lg text-sm bg-gray-50"
                      style={{ borderColor: 'var(--input-border)' }}
                    >
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price_min}
                      onChange={(e) => handleChange('price_min', e.target.value)}
                      className="flex-1 px-4 py-2.5 border rounded-r-lg focus:outline-none focus:ring-2 text-sm"
                      style={{ borderColor: 'var(--input-border)' }}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {form.price_type === 'range' && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Maximum Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price_max}
                      onChange={(e) => handleChange('price_max', e.target.value)}
                      className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                      style={{ borderColor: 'var(--input-border)' }}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Unit of Sale
              </label>
              <input
                type="text"
                value={form.unit_of_sale}
                onChange={(e) => handleChange('unit_of_sale', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                placeholder="e.g. per kg, per unit, per hour"
                maxLength={50}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Contact Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={form.whatsapp_phone}
                onChange={(e) => handleChange('whatsapp_phone', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: 'var(--input-border)' }}
                placeholder="+254..."
                maxLength={20}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Contact Email
                </label>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--input-border)' }}
                  placeholder="+254..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visibility & Status */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Visibility & Status
          </h2>

          <div className="space-y-4">
            {/* Active toggle */}
            <div className="flex items-center gap-3 pb-4 border-b">
              <button
                type="button"
                onClick={() => handleChange('is_active', !form.is_active)}
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
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Active Listing
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {form.is_active ? 'Listing is visible to other members' : 'Listing is hidden (draft/inactive)'}
                </p>
              </div>
            </div>

            {/* Visibility options */}
            <div className="space-y-3">
              {[
                { value: 'public', label: 'Public', description: 'Visible to everyone', icon: '🌍' },
                { value: 'members_only', label: 'Members Only', description: 'Only OVWTN members', icon: '🔒' },
                { value: 'paid_tier_only', label: 'Paid Tier Only', description: 'Basic, Full, Associate only', icon: '⭐' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    form.visibility === option.value ? 'border-[var(--brand-primary)] bg-red-50/30' : 'hover:bg-gray-50'
                  }`}
                  style={{
                    borderColor: form.visibility === option.value ? 'var(--brand-primary)' : 'var(--input-border)',
                  }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={form.visibility === option.value}
                    onChange={(e) => handleChange('visibility', e.target.value)}
                    className="w-4 h-4"
                    style={{ accentColor: 'var(--brand-primary)' }}
                  />
                  <span className="text-xl">{option.icon}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{option.label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push('/member/listings')}
            className="px-6 py-2.5 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
