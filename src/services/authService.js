import apiClient from './api';

const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem('authToken', token);
      }
      
      return { success: true, user, token };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const data = response.data;
      
      // Backend returns: { success: true, message, user }
      // No token on registration, only after email verification
      
      return { 
        success: true, 
        user: data.user,
        message: data.message 
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    return { success: true };
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      // Handle both response.data and response.data.data formats
      const userData = response.data?.data || response.data;
      return { success: true, user: userData };
    } catch (error) {
      console.error('getCurrentUser error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to get user'
      };
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default authService;
