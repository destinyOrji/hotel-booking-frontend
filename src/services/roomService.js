import apiClient from './api';

const roomService = {
  // Get all rooms
  getRooms: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.capacity) params.append('capacity', filters.capacity);
      if (filters.status) params.append('status', filters.status);

      const response = await apiClient.get(`/rooms?${params.toString()}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch rooms'
      };
    }
  },

  // Search rooms (alias for getRooms with different parameter handling)
  searchRooms: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Map frontend params to backend params
      if (params.roomType) queryParams.append('type', params.roomType);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.guests) queryParams.append('capacity', params.guests);
      
      // Always get available rooms for user-facing search
      queryParams.append('status', 'available');

      const response = await apiClient.get(`/rooms?${queryParams.toString()}`);
      
      let rooms = response.data.data || [];
      
      // Client-side sorting since backend doesn't support it yet
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'price-asc':
            rooms.sort((a, b) => a.basePrice - b.basePrice);
            break;
          case 'price-desc':
            rooms.sort((a, b) => b.basePrice - a.basePrice);
            break;
          case 'name-asc':
            rooms.sort((a, b) => a.name.localeCompare(b.name));
            break;
          default:
            break;
        }
      }
      
      // Client-side pagination
      const page = params.page || 1;
      const limit = params.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedRooms = rooms.slice(startIndex, endIndex);
      const totalPages = Math.ceil(rooms.length / limit);
      
      return {
        success: true,
        data: {
          rooms: paginatedRooms,
          totalPages,
          currentPage: page,
          total: rooms.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to search rooms'
      };
    }
  },

  // Get single room
  getRoom: async (id) => {
    try {
      const response = await apiClient.get(`/rooms/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch room'
      };
    }
  },

  // Check room availability
  checkAvailability: async (roomId, checkIn, checkOut) => {
    try {
      const response = await apiClient.post(`/rooms/${roomId}/availability`, {
        checkIn,
        checkOut
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to check availability'
      };
    }
  },

  // Get room availability for calendar (returns available dates)
  getRoomAvailability: async (roomId, params = {}) => {
    try {
      // For now, return all dates as available since we don't have a specific endpoint
      // In a real app, this would fetch booked dates from the backend
      const { startDate, endDate } = params;
      
      // Generate all dates between start and end as available
      const start = new Date(startDate);
      const end = new Date(endDate);
      const availableDates = [];
      
      const currentDate = new Date(start);
      while (currentDate <= end) {
        availableDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return { 
        success: true, 
        data: { 
          availableDates,
          bookedDates: [] // Would come from backend
        } 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch availability'
      };
    }
  },

  // Create room (Admin)
  createRoom: async (roomData) => {
    try {
      const response = await apiClient.post('/rooms', roomData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create room'
      };
    }
  },

  // Update room (Admin)
  updateRoom: async (id, roomData) => {
    try {
      const response = await apiClient.put(`/rooms/${id}`, roomData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update room'
      };
    }
  },

  // Delete room (Admin)
  deleteRoom: async (id) => {
    try {
      const response = await apiClient.delete(`/rooms/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete room'
      };
    }
  }
};

export default roomService;
