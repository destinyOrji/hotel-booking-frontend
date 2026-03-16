import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to check if error is retryable
const isRetryableError = (error) => {
  if (!error.response) {
    // Network errors are retryable
    return true;
  }
  
  const status = error.response.status;
  // Retry on 5xx server errors and 429 (too many requests)
  return status >= 500 || status === 429;
};

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Initialize retry count
    config.retryCount = config.retryCount || 0;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and retry logic
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Check if we should retry
    if (config && isRetryableError(error) && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      
      // Calculate delay with exponential backoff
      const retryDelay = RETRY_DELAY * Math.pow(2, config.retryCount - 1);
      
      console.log(`Retrying request (${config.retryCount}/${MAX_RETRIES}) after ${retryDelay}ms...`);
      
      await delay(retryDelay);
      
      return apiClient(config);
    }
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken');
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register');
        
        // Only redirect if not already on auth pages
        if (!isAuthPage) {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        // Don't automatically redirect, let the component handle it
        console.warn('Access forbidden:', data.error || 'You do not have permission to access this resource');
      }
      
      // Return error with proper structure
      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        response: {
          status: 0,
          data: { error: 'Network error. Please check your connection.' }
        }
      });
    } else {
      // Something else happened
      return Promise.reject({
        response: {
          status: 0,
          data: { error: error.message || 'An unexpected error occurred' }
        }
      });
    }
  }
);

export default apiClient;
