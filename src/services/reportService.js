import apiClient from './api';

const reportService = {
  // Get revenue report for specified period (Admin)
  getRevenueReport: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      const url = queryString ? `/admin/reports/revenue?${queryString}` : '/admin/reports/revenue';
      
      const response = await apiClient.get(url);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch revenue report'
      };
    }
  },

  // Get occupancy report (Admin)
  getOccupancyReport: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      const url = queryString ? `/admin/reports/occupancy?${queryString}` : '/admin/reports/occupancy';
      
      const response = await apiClient.get(url);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch occupancy report'
      };
    }
  },

  // Get booking trends (Admin)
  getBookingTrends: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      const url = queryString ? `/admin/reports/trends?${queryString}` : '/admin/reports/trends';
      
      const response = await apiClient.get(url);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch booking trends'
      };
    }
  },

  // Export report as CSV (Admin)
  exportReport: async (reportType, startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      params.append('type', reportType);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await apiClient.get(`/admin/reports/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to export report'
      };
    }
  }
};

export default reportService;
