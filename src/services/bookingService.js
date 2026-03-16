import apiClient from './api';

const bookingService = {
  // Get user's own bookings
  getUserBookings: async () => {
    try {
      const response = await apiClient.get('/bookings');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch bookings'
      };
    }
  },

  // Get single booking (user's own)
  getBooking: async (id) => {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch booking'
      };
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create booking'
      };
    }
  },

  // Cancel user's own booking
  cancelUserBooking: async (id) => {
    try {
      const response = await apiClient.put(`/bookings/${id}/cancel`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to cancel booking'
      };
    }
  },

  // Get all bookings with filters (Admin)
  getAllBookings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const queryString = params.toString();
      const url = queryString ? `/admin/bookings?${queryString}` : '/admin/bookings';
      
      const response = await apiClient.get(url);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch bookings'
      };
    }
  },

  // Get single booking by ID (Admin)
  getBookingById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/bookings/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch booking'
      };
    }
  },

  // Update booking status (Admin)
  updateBookingStatus: async (id, status) => {
    try {
      const response = await apiClient.put(`/admin/bookings/${id}/status`, { status });
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update booking status'
      };
    }
  },

  // Cancel booking (Admin)
  cancelBooking: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/bookings/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to cancel booking'
      };
    }
  },

  // Get booking statistics (Admin)
  getBookingStats: async () => {
    try {
      const response = await apiClient.get('/admin/bookings/stats');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch booking statistics'
      };
    }
  }
};

export default bookingService;
