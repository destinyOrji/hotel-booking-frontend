import apiClient from './api';

const userService = {
  // Get all users with pagination (Admin)
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch users'
      };
    }
  },

  // Get user by ID with booking history (Admin)
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/users/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch user'
      };
    }
  },

  // Update user information (Admin)
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, userData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update user'
      };
    }
  },

  // Toggle user status (activate/deactivate) (Admin)
  toggleUserStatus: async (id) => {
    try {
      const response = await apiClient.put(`/admin/users/${id}/status`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to toggle user status'
      };
    }
  },

  // Search users by criteria (Admin)
  searchUsers: async (searchTerm) => {
    try {
      const response = await apiClient.get(`/admin/users/search?q=${encodeURIComponent(searchTerm)}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to search users'
      };
    }
  }
};

export default userService;
