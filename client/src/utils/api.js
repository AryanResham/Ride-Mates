import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
const isDevelopment = import.meta.env.MODE === 'development';

// Create axios instance
const api = axios.create({
  baseURL: isDevelopment ? '' : API_BASE_URL, // In dev, Vite proxy handles routing
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Auth token will be added by individual components when needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors
      console.error('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);

export default api;