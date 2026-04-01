import api from './api';

const adminService = {
  getPendingMentors: async () => {
    try {
      const response = await api.get('/admin/mentor-requests');
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  },

  approveMentor: async (profileId) => {
    try {
      const response = await api.post(`/admin/mentor-requests/${profileId}/approve`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  },

  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response;
  }
};

export default adminService;
