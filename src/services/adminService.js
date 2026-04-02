import api from "./api";

const adminService = {
  getPendingMentors: async () => {
    try {
      const response = await api.get("/admin/mentor-requests");
      return response;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Network error or server unavailable",
        }
      );
    }
  },

  approveMentor: async (profileId) => {
    try {
      const response = await api.post(
        `/admin/mentor-requests/${profileId}/approve`,
      );
      return response;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Network error or server unavailable",
        }
      );
    }
  },

  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard/stats");
    return response;
  },

  getUsers: async () => {
    try {
      const response = await api.get("/users");
      return response;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Network error or server unavailable",
        }
      );
    }
  },

  updateUser: async (userId, payload) => {
    try {
      const response = await api.put(`/users/${userId}`, payload);
      return response;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Network error or server unavailable",
        }
      );
    }
  },
};

export default adminService;
