import api from "./api";

export const disputeService = {
  createDispute: async (data) => {
    // data: { bookingId, reason }
    const response = await api.post("/disputes", data);
    return response;
  },

  getMyDisputes: async (params) => {
    const response = await api.get("/disputes/my-disputes", { params });
    return response;
  },

  getAllDisputes: async (params) => {
    // Admin only
    const response = await api.get("/admin/disputes", { params });
    return response;
  },

  getMentorDisputes: async (params) => {
    const response = await api.get("/disputes/mentor-disputes", { params });
    return response;
  },

  getDisputeByBooking: async (bookingId) => {
    const response = await api.get(`/disputes/booking/${bookingId}`);
    return response;
  },

  resolveDispute: async (disputeId, data) => {
    // Admin only
    // data: { adminNote, acceptRefund: true/false }
    const response = await api.post(
      `/admin/disputes/${disputeId}/resolve`,
      data,
    );
    return response;
  },

  counterDispute: async (disputeId, data) => {
    // data: { counterReason }
    const response = await api.post(`/disputes/${disputeId}/counter`, data);
    return response;
  },
};
