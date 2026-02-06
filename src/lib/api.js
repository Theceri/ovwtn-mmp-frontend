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
  return apiPost('/auth/password-reset-request', { email });
}

/**
 * Reset password with token
 */
export async function resetPassword(token, newPassword) {
  return apiPost('/auth/password-reset', {
    token,
    new_password: newPassword,
  });
}

/**
 * Change password (authenticated)
 */
export async function changePassword(currentPassword, newPassword) {
  return apiPost('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });

// ============================================
// Auth API
// ============================================

/**
 * Request password reset
 */
export async function requestPasswordReset(email) {
  return apiPost('/auth/password-reset-request', { email });
}

/**
 * Reset password with token
 */
export async function resetPassword(token, newPassword) {
  return apiPost('/auth/password-reset', {
    token,
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

// Export the base URL for use in other places
export { API_BASE_URL };
