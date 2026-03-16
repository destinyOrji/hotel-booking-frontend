import apiClient from './api';

const uploadService = {
  // Upload room images
  uploadRoomImages: async (files) => {
    try {
      const formData = new FormData();
      
      // Append all files to form data
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const response = await apiClient.post('/upload/room-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to upload images'
      };
    }
  },

  // Delete room image
  deleteRoomImage: async (imageUrl) => {
    try {
      const response = await apiClient.delete('/upload/room-images', {
        data: { imageUrl }
      });

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete image'
      };
    }
  }
};

export default uploadService;
