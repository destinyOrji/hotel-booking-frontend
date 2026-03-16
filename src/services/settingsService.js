import apiClient from './api';

const settingsService = {
  // Get all settings (Admin)
  getSettings: async () => {
    try {
      const response = await apiClient.get('/admin/settings');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch settings'
      };
    }
  },

  // Update hotel information (Admin)
  updateHotelInfo: async (hotelData) => {
    try {
      const response = await apiClient.put('/admin/settings/hotel', hotelData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update hotel information'
      };
    }
  },

  // Update email settings (Admin)
  updateEmailSettings: async (emailData) => {
    try {
      const response = await apiClient.put('/admin/settings/email', emailData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update email settings'
      };
    }
  },

  // Update payment settings (Admin)
  updatePaymentSettings: async (paymentData) => {
    try {
      const response = await apiClient.put('/admin/settings/payment', paymentData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update payment settings'
      };
    }
  },

  // Update policies (Admin)
  updatePolicies: async (policiesData) => {
    try {
      const response = await apiClient.put('/admin/settings/policies', policiesData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update policies'
      };
    }
  }
};

export default settingsService;
