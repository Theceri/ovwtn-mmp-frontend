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
      throw new ApiError(
        data.detail || data.message || 'An error occurred',
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

// Export the base URL for use in other places
export { API_BASE_URL };
