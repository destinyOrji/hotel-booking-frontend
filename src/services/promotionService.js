import apiClient from './api';

const promotionService = {
  // Validate promo code (Public)
  validatePromoCode: async (code, roomId = null) => {
    try {
      const response = await apiClient.post('/promotions/validate', {
        code,
        roomId
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Invalid promo code'
      };
    }
  },

  // Get all promotions (Admin/Staff)
  getPromotions: async (status = null) => {
    try {
      const url = status ? `/promotions?status=${status}` : '/promotions';
      const response = await apiClient.get(url);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch promotions'
      };
    }
  },

  // Get single promotion (Admin/Staff)
  getPromotion: async (id) => {
    try {
      const response = await apiClient.get(`/promotions/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch promotion'
      };
    }
  },

  // Create promotion (Admin)
  createPromotion: async (promotionData) => {
    try {
      const response = await apiClient.post('/promotions', promotionData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create promotion'
      };
    }
  },

  // Update promotion (Admin)
  updatePromotion: async (id, promotionData) => {
    try {
      const response = await apiClient.put(`/promotions/${id}`, promotionData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update promotion'
      };
    }
  },

  // Delete promotion (Admin)
  deletePromotion: async (id) => {
    try {
      const response = await apiClient.delete(`/promotions/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete promotion'
      };
    }
  },

  // Get promotion usage statistics (Admin)
  getPromotionUsage: async (id) => {
    try {
      const response = await apiClient.get(`/promotions/${id}/usage`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch promotion usage'
      };
    }
  },

  // Toggle promotion status (Admin)
  togglePromotionStatus: async (id) => {
    try {
      const response = await apiClient.put(`/promotions/${id}/toggle`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to toggle promotion status'
      };
    }
  }
};

export default promotionService;
