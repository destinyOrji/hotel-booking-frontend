import apiClient from './api';

const staffService = {
  // Get all staff members (Admin)
  getAllStaff: async () => {
    try {
      const response = await apiClient.get('/admin/staff');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch staff'
      };
    }
  },

  // Create staff account (Admin)
  createStaff: async (staffData) => {
    try {
      const response = await apiClient.post('/admin/staff', staffData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create staff account'
      };
    }
  },

  // Update staff details (Admin)
  updateStaff: async (id, staffData) => {
    try {
      const response = await apiClient.put(`/admin/staff/${id}`, staffData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update staff'
      };
    }
  },

  // Update staff role and permissions (Admin)
  updateStaffRole: async (id, roleData) => {
    try {
      const response = await apiClient.put(`/admin/staff/${id}/role`, roleData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update staff role'
      };
    }
  },

  // Toggle staff status (activate/deactivate) (Admin)
  toggleStaffStatus: async (id) => {
    try {
      const response = await apiClient.put(`/admin/staff/${id}/status`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to toggle staff status'
      };
    }
  }
};

export default staffService;
