'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { createListing, uploadListingPhotos, getPublicCategories } from '@/lib/api';

export default function NewListingPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const fileInputRef = useRef(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

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
  });

  useEffect(() => {
    if (token) loadCategories();
  }, [token]);

  const loadCategories = async () => {
    try {
      const data = await getPublicCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validFiles = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid type for "${file.name}". Use JPEG, PNG, GIF, or WebP.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Max 10MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (selectedPhotos.length + validFiles.length > 10) {
      toast.error('Maximum 10 photos per listing');
      return;
    }

    setSelectedPhotos((prev) => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, { name: file.name, url: reader.result }]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
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
    if (form.price_type === 'exact' && !form.price_min) {
      toast.error('Price is required for exact pricing');
      return;
    }
    if (form.price_type === 'range' && (!form.price_min || !form.price_max)) {
      toast.error('Both min and max price are required for range pricing');
      return;
    }

    setSaving(true);
    try {
      // Build listing data
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
      };

      // Create listing
      const listing = await createListing(listingData, token);

      // Upload photos if any
      if (selectedPhotos.length > 0) {
        try {
          await uploadListingPhotos(listing.id, selectedPhotos, token);
        } catch (uploadError) {
          toast.error('Listing created but photo upload failed. You can add photos later.');
        }
      }

      toast.success('Listing created successfully!');
      router.push('/member/listings');
    } catch (error) {
      toast.error(error.message || 'Failed to create listing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Create New Listing
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Add a new goods or services listing
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
                placeholder="e.g. Fresh Organic Honey - 500g jars"
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
                placeholder="Brief one-line description (shown in search results)"
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
                placeholder="Provide a detailed description of your product or service, including key features, specifications, availability, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Category <span className="text-red-500">*</span>
              </label>
              {loadingCategories ? (
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading categories...</p>
              ) : (
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
              )}
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Photos
          </h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
            Upload up to 10 photos. JPEG, PNG, GIF, WebP. Max 10MB each.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}

            {selectedPhotos.length < 10 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--input-border)' }}
              >
                <svg className="w-8 h-8 mb-1" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Add Photo</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={handlePhotoSelect}
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
                placeholder="e.g. per kg, per unit, per hour, per session"
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
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Enables click-to-chat on your listing
              </p>
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
                  placeholder="sales@company.co.ke"
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

        {/* Visibility */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Visibility
          </h2>

          <div className="space-y-3">
            {[
              {
                value: 'public',
                label: 'Public',
                description: 'Visible to everyone, including non-members',
                icon: '🌍',
              },
              {
                value: 'members_only',
                label: 'Members Only',
                description: 'Only visible to logged-in OVWTN members',
                icon: '🔒',
              },
              {
                value: 'paid_tier_only',
                label: 'Paid Tier Only',
                description: 'Only visible to Basic, Full, and Associate members',
                icon: '⭐',
              },
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
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {option.label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
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
                Creating...
              </span>
            ) : (
              'Create Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
