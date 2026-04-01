import api from './api';

const followService = {
  toggleFollow: async (targetId) => {
    const response = await api.post(`/follows/${targetId}/toggle`);
    return response;
  },

  getFollowing: async () => {
    const response = await api.get('/follows/following');
    return response;
  },

  getFollowers: async (targetId) => {
    const response = await api.get(`/follows/followers/${targetId}`);
    return response;
  },

  checkFollowStatus: async (targetId) => {
    const response = await api.get(`/follows/status/${targetId}`);
    return response;
  }
};

export default followService;
