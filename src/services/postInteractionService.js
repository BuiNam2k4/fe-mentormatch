import api from './api';

const postInteractionService = {
  // Like/Unlike a post
  toggleLike: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Get comments for a post
  getComments: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      return response;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a new comment
  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      return response;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
};

export default postInteractionService;
