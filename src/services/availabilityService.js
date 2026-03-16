import apiClient from './api';

const availabilityService = {
  // Get room availability for date range (Admin)
  getAvailability: async (startDate, endDate, roomId = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (roomId) params.append('roomId', roomId);
      
      const queryString = params.toString();
      const url = queryString ? `/admin/availability?${queryString}` : '/admin/availability';
      
      const response = await apiClient.get(url);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch availability'
      };
    }
  },

  // Block room for specific dates (Admin)
  blockRoom: async (blockData) => {
    try {
      const response = await apiClient.post('/admin/availability/block', blockData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to block room'
      };
    }
  },

  // Unblock room (Admin)
  unblockRoom: async (blockId) => {
    try {
      const response = await apiClient.delete(`/admin/availability/block/${blockId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to unblock room'
      };
    }
  },

  // Get all blocked dates (Admin)
  getBlockedDates: async (roomId = null, startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (roomId) params.append('roomId', roomId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      const url = queryString 
        ? `/admin/availability/blocked?${queryString}` 
        : '/admin/availability/blocked';
      
      const response = await apiClient.get(url);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch blocked dates'
      };
    }
  }
};

export default availabilityService;
