// API utility for handling requests in both development and production
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Makes an API request with proper base URL handling
 * @param {string} endpoint - The API endpoint (e.g., '/api/driver/requests')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export const apiRequest = async (endpoint, options = {}) => {
  // In development, Vite proxy handles routing, so use relative URLs
  // In production, use the full URL from environment variable
  const isDevelopment = import.meta.env.MODE === 'development';
  const url = isDevelopment ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  return fetch(url, options);
};

/**
 * Helper for GET requests
 */
export const apiGet = (endpoint, headers = {}) => {
  return apiRequest(endpoint, {
    method: 'GET',
    headers,
  });
};

/**
 * Helper for POST requests
 */
export const apiPost = (endpoint, data, headers = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
};

/**
 * Helper for PUT requests
 */
export const apiPut = (endpoint, data, headers = {}) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
};

/**
 * Helper for DELETE requests
 */
export const apiDelete = (endpoint, headers = {}) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
    headers,
  });
};