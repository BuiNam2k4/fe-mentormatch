import api from './api';

const authService = {
  login: async (userName, password) => {
    try {
      const response = await api.post('/auth/login', { userName, password });
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  },

  register: async (userName, email, password) => {
    try {
      const response = await api.post('/auth/register', { userName, email, password });
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  }
};

export default authService;
