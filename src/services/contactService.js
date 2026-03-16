import apiClient from './api';

const contactService = {
  // Submit contact form (Public)
  submitContact: async (contactData) => {
    try {
      const response = await apiClient.post('/contact', contactData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to submit contact form'
      };
    }
  },

  // Get all contacts (Admin)
  getAllContacts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const queryString = params.toString();
      const url = queryString ? `/contact/admin?${queryString}` : '/contact/admin';
      
      const response = await apiClient.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch contacts'
      };
    }
  },

  // Get single contact (Admin)
  getContactById: async (id) => {
    try {
      const response = await apiClient.get(`/contact/admin/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch contact'
      };
    }
  },

  // Update contact status (Admin)
  updateContactStatus: async (id, status, adminNotes = '') => {
    try {
      const response = await apiClient.put(`/contact/admin/${id}/status`, {
        status,
        adminNotes
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update contact status'
      };
    }
  },

  // Delete contact (Admin)
  deleteContact: async (id) => {
    try {
      const response = await apiClient.delete(`/contact/admin/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete contact'
      };
    }
  },

  // Get contact statistics (Admin)
  getContactStats: async () => {
    try {
      const response = await apiClient.get('/contact/admin/stats');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch contact statistics'
      };
    }
  }
};

export default contactService;
