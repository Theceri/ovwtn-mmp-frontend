'use client';

/**
 * API utility functions for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Make an API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @param {string} authToken - Optional auth token to include in headers
 * @returns {Promise<any>} Response data
 */
async function apiRequest(endpoint, options = {}, authToken = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      // Format FastAPI validation errors (422 responses)
      let errorMessage = 'An error occurred';
      if (data.detail) {
        if (Array.isArray(data.detail)) {
          // FastAPI validation errors are an array
          const errors = data.detail.map(err => {
            const field = err.loc && err.loc.length > 1 ? err.loc[err.loc.length - 1] : 'field';
            // Convert snake_case to Title Case for better readability
            const fieldName = field
              .replace(/_/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
            // Extract just the main message, removing redundant field name if present
            let msg = err.msg;
            if (msg.includes(':')) {
              const parts = msg.split(':');
              msg = parts[parts.length - 1].trim();
            }
            return `${fieldName}: ${msg}`;
          });
          errorMessage = errors.join('. ');
        } else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else {
          errorMessage = JSON.stringify(data.detail);
        }
      } else if (data.message) {
        errorMessage = data.message;
      }
      
      throw new ApiError(
        errorMessage,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
}

/**
 * Get auth token helper - can be used by components to pass token to API calls
 * This is a client-side only function
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try to get from Zustand store
    const { useAuthStore } = require('@/store/useAuthStore');
    const token = useAuthStore.getState().token;
    if (token) return token;
  } catch (e) {
    // Store not available
  }
  
  return null;
}

/**
 * GET request
 */
export async function apiGet(endpoint, options = {}, authToken = null) {
  const token = authToken || getAuthToken();
  return apiRequest(endpoint, {
    method: 'GET',
    ...options,
  }, token);
}

/**
 * POST request
 */
export async function apiPost(endpoint, data, options = {}, authToken = null) {
  const token = authToken || getAuthToken();
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  }, token);
}

/**
 * PUT request
 */
export async function apiPut(endpoint, data, options = {}, authToken = null) {
  const token = authToken || getAuthToken();
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  }, token);
}

/**
 * PATCH request
 */
export async function apiPatch(endpoint, data, options = {}, authToken = null) {
  const token = authToken || getAuthToken();
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
  }, token);
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint, options = {}, authToken = null) {
  const token = authToken || getAuthToken();
  return apiRequest(endpoint, {
    method: 'DELETE',
    ...options,
  }, token);
}

/**
 * Upload file(s)
 */
export async function apiUpload(endpoint, formData, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header; let browser set it with boundary
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.detail || data.message || 'Upload failed',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Upload failed', 0, null);
  }
}

/**
 * Health check
 */
export async function checkHealth() {
  return apiGet('/health');
}

// ============================================
// Public API (no authentication required)
// ============================================

/**
 * Get public stats for landing page
 */
export async function getPublicStats() {
  return apiGet('/public/stats');
}

/**
 * Get membership tiers information
 */
export async function getMembershipTiers() {
  return apiGet('/public/membership-tiers');
}

// ============================================
// Auth API
// ============================================

/**
 * Request password reset
 */
export async function requestPasswordReset(email) {
  return apiPost('/password-reset-request', { email });
}

/**
 * Reset password with token
 */
export async function resetPassword(token, newPassword) {
  return apiPost('/password-reset', {
    token,
    new_password: newPassword,
  });
}

/**
 * Change password (authenticated)
 */
export async function changePassword(currentPassword, newPassword) {
  return apiPost('/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

// ============================================
// Application API
// ============================================

/**
 * Submit membership application
 */
export async function submitApplication(applicationData) {
  return apiPost('/applications', applicationData);
}

/**
 * Upload application document
 */
export async function uploadApplicationDocument(file, documentType, email) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', documentType);
  formData.append('application_email', email);
  return apiUpload('/applications/upload-document', formData);
}

/**
 * Get application status
 */
export async function getApplicationStatus(applicationNumber) {
  return apiGet(`/applications/${applicationNumber}`);
}

// ============================================
// Admin API (requires admin auth token)
// ============================================

/**
 * List applications with filters and pagination
 * @param {Object} params - Query parameters
 * @param {string} [params.status] - Filter by status
 * @param {string} [params.tier] - Filter by membership type
 * @param {string} [params.county] - Filter by county
 * @param {string} [params.search] - Search by organisation name
 * @param {string} [params.date_from] - From date (YYYY-MM-DD)
 * @param {string} [params.date_to] - To date (YYYY-MM-DD)
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Items per page
 * @param {string} [authToken] - Admin JWT token
 */
export async function getAdminApplications(params = {}, authToken = null) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  const endpoint = `/admin/applications${query ? `?${query}` : ''}`;
  return apiGet(endpoint, {}, authToken);
}

/**
 * Get application detail by ID
 * @param {number} applicationId - Application ID
 * @param {string} [authToken] - Admin JWT token
 */
export async function getAdminApplicationDetail(applicationId, authToken = null) {
  return apiGet(`/admin/applications/${applicationId}`, {}, authToken);
}

/**
 * Update admin notes for an application
 * @param {number} applicationId - Application ID
 * @param {string} adminNotes - Admin notes text
 * @param {string} [authToken] - Admin JWT token
 */
export async function updateAdminNotes(applicationId, adminNotes, authToken = null) {
  return apiPatch(`/admin/applications/${applicationId}/notes`, { admin_notes: adminNotes }, {}, authToken);
}

/**
 * Approve a membership application
 * @param {number} applicationId - Application ID
 * @param {string} [authToken] - Admin JWT token
 */
export async function approveApplication(applicationId, authToken = null) {
  return apiPost(`/admin/applications/${applicationId}/approve`, {}, {}, authToken);
}

/**
 * Get predefined rejection reasons
 * @param {string} [authToken] - Admin JWT token
 */
export async function getRejectionReasons(authToken = null) {
  return apiGet('/admin/rejection-reasons', {}, authToken);
}

/**
 * Reject a membership application
 * @param {number} applicationId - Application ID
 * @param {Object} rejectionData - Rejection data
 * @param {string} rejectionData.rejection_reason - Required reason for rejection
 * @param {string} [rejectionData.rejection_notes] - Additional notes
 * @param {string} [authToken] - Admin JWT token
 */
export async function rejectApplication(applicationId, rejectionData, authToken = null) {
  return apiPost(`/admin/applications/${applicationId}/reject`, rejectionData, {}, authToken);
}

/**
 * Reverse a rejection, setting application back to pending
 * @param {number} applicationId - Application ID
 * @param {string} [authToken] - Admin JWT token
 */
export async function reverseRejection(applicationId, authToken = null) {
  return apiPost(`/admin/applications/${applicationId}/reverse-rejection`, {}, {}, authToken);
}

/**
 * Download application file (opens in new window)
 * @param {string} fileType - 'registration_certificate' or 'kra_pin'
 * @param {number} applicationId - Application ID
 * @param {string} [authToken] - Admin JWT token
 */
export async function downloadAdminFile(fileType, applicationId, authToken = null) {
  const token = authToken || getAuthToken();
  const url = `${API_BASE_URL}/admin/files/${fileType}/${applicationId}`;
  
  // Create a temporary link and click it to trigger download
  const link = document.createElement('a');
  link.href = url;
  link.style.display = 'none';
  
  // Add authorization header via fetch first to get the file
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    link.href = blobUrl;
    link.download = `${fileType}_${applicationId}${getFileExtension(response.headers.get('content-type'))}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

function getFileExtension(contentType) {
  const extensions = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  };
  return extensions[contentType] || '';
}

/**
 * Verify or reject a payment proof
 * @param {number} proofId - Payment proof ID
 * @param {string} status - 'verified' or 'rejected'
 * @param {string} [notes] - Verification notes
 * @param {string} [authToken] - Admin JWT token
 */
export async function verifyPayment(proofId, status, notes = null, authToken = null) {
  return apiPost(`/admin/payments/${proofId}/verify`, {
    status,
    notes,
  }, {}, authToken);
}

/**
 * Get list of unverified payment proofs
 * @param {Object} params - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Items per page
 * @param {string} [authToken] - Admin JWT token
 */
export async function getUnverifiedPayments(params = {}, authToken = null) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  const endpoint = `/admin/payments/unverified${query ? `?${query}` : ''}`;
  return apiGet(endpoint, {}, authToken);
}

// ============================================
// Member API (requires member auth token)
// ============================================

/**
 * Get member onboarding status
 * @param {string} [authToken] - Member JWT token
 */
export async function getMemberOnboardingStatus(authToken = null) {
  return apiGet('/member/onboarding-status', {}, authToken);
}

/**
 * Complete an onboarding step
 * @param {number} step - Step number (1-5)
 * @param {string} [authToken] - Member JWT token
 */
export async function completeOnboardingStep(step, authToken = null) {
  return apiPost('/member/onboarding/complete-step', { step }, {}, authToken);
}

/**
 * Skip remaining onboarding steps
 * @param {string} [authToken] - Member JWT token
 */
export async function skipOnboarding(authToken = null) {
  return apiPost('/member/onboarding/skip', {}, {}, authToken);
}

/**
 * Get member profile (includes organisation and membership info)
 * @param {string} [authToken] - Member JWT token
 */
export async function getMemberProfile(authToken = null) {
  return apiGet('/member/profile', {}, authToken);
}

/**
 * Update member organisation profile
 * @param {Object} profileData - Fields to update
 * @param {string} [authToken] - Member JWT token
 */
export async function updateMemberProfile(profileData, authToken = null) {
  return apiPatch('/member/profile', profileData, {}, authToken);
}

/**
 * Update member contact methods
 * @param {Object} contactData - Contact fields to update
 * @param {string} [authToken] - Member JWT token
 */
export async function updateMemberContacts(contactData, authToken = null) {
  return apiPatch('/member/profile/contacts', contactData, {}, authToken);
}

/**
 * Upload organisation logo
 * @param {File} file - Logo image file
 * @param {string} [authToken] - Member JWT token
 */
export async function uploadOrganisationLogo(file, authToken = null) {
  const token = authToken || getAuthToken();
  const formData = new FormData();
  formData.append('file', file);
  
  const url = `${API_BASE_URL}/member/profile/logo`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiError(
        data.detail || data.message || 'Logo upload failed',
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Logo upload failed', 0, null);
  }
}

// ============================================
// Listing API (requires member auth token)
// ============================================

/**
 * Get member's own listings
 * @param {Object} params - Query parameters (search, category_id, is_active, page, limit)
 * @param {string} [authToken] - Member JWT token
 */
export async function getMemberListings(params = {}, authToken = null) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  const endpoint = `/member/listings${query ? `?${query}` : ''}`;
  return apiGet(endpoint, {}, authToken);
}

/**
 * Get a single listing by ID
 * @param {number} listingId - Listing ID
 * @param {string} [authToken] - Member JWT token
 */
export async function getMemberListing(listingId, authToken = null) {
  return apiGet(`/member/listings/${listingId}`, {}, authToken);
}

/**
 * Create a new listing
 * @param {Object} listingData - Listing data
 * @param {string} [authToken] - Member JWT token
 */
export async function createListing(listingData, authToken = null) {
  return apiPost('/member/listings', listingData, {}, authToken);
}

/**
 * Update a listing
 * @param {number} listingId - Listing ID
 * @param {Object} listingData - Fields to update
 * @param {string} [authToken] - Member JWT token
 */
export async function updateListing(listingId, listingData, authToken = null) {
  return apiPatch(`/member/listings/${listingId}`, listingData, {}, authToken);
}

/**
 * Delete a listing
 * @param {number} listingId - Listing ID
 * @param {string} [authToken] - Member JWT token
 */
export async function deleteListing(listingId, authToken = null) {
  return apiDelete(`/member/listings/${listingId}`, {}, authToken);
}

/**
 * Upload photos for a listing
 * @param {number} listingId - Listing ID
 * @param {FileList|File[]} files - Photo files
 * @param {string} [authToken] - Member JWT token
 */
export async function uploadListingPhotos(listingId, files, authToken = null) {
  const token = authToken || getAuthToken();
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const url = `${API_BASE_URL}/member/listings/${listingId}/photos`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(
        data.detail || data.message || 'Photo upload failed',
        response.status,
        data
      );
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Photo upload failed', 0, null);
  }
}

/**
 * Delete a photo from a listing
 * @param {number} listingId - Listing ID
 * @param {string} photoUrl - URL of the photo to delete
 * @param {string} [authToken] - Member JWT token
 */
export async function deleteListingPhoto(listingId, photoUrl, authToken = null) {
  const params = new URLSearchParams({ photo_url: photoUrl });
  return apiDelete(`/member/listings/${listingId}/photos?${params}`, {}, authToken);
}

/**
 * Get public categories (no auth required)
 */
export async function getPublicCategories() {
  return apiGet('/public/categories');
}

// ============================================
// Admin Category API (requires admin auth token)
// ============================================

/**
 * Get all categories (admin view - includes inactive)
 * @param {boolean} includeInactive - Include inactive categories
 * @param {string} [authToken] - Admin JWT token
 */
export async function getAdminCategories(includeInactive = true, authToken = null) {
  const params = includeInactive ? '?include_inactive=true' : '';
  return apiGet(`/admin/categories${params}`, {}, authToken);
}

/**
 * Create a category
 * @param {Object} categoryData - Category data
 * @param {string} [authToken] - Admin JWT token
 */
export async function createCategory(categoryData, authToken = null) {
  return apiPost('/admin/categories', categoryData, {}, authToken);
}

/**
 * Update a category
 * @param {number} categoryId - Category ID
 * @param {Object} categoryData - Fields to update
 * @param {string} [authToken] - Admin JWT token
 */
export async function updateCategory(categoryId, categoryData, authToken = null) {
  return apiPatch(`/admin/categories/${categoryId}`, categoryData, {}, authToken);
}

/**
 * Delete a category
 * @param {number} categoryId - Category ID
 * @param {string} [authToken] - Admin JWT token
 */
export async function deleteCategory(categoryId, authToken = null) {
  return apiDelete(`/admin/categories/${categoryId}`, {}, authToken);
}

// Export the base URL for use in other places
export { API_BASE_URL };
