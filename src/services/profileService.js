import api from './api';

const profileService = {
  getProfile: async () => {
    try {
      const response = await api.get('/profiles/me');
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  },

  updateBasicProfile: async (profileData) => {
    try {
      const response = await api.put('/profiles/me', profileData);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  },

  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.put('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  },

  updateMentorProfile: async (mentorData) => {
    try {
      const response = await api.put('/profiles/mentor/me', mentorData);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  },

  updateMenteeProfile: async (menteeData) => {
    try {
      const response = await api.put('/profiles/mentee/me', menteeData);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  },

  registerMentor: async (formData) => {
    try {
      const response = await api.post('/mentors/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Network error or server unavailable' };
    }
  }
};

export default profileService;
