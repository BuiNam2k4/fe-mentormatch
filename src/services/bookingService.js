import api from './api';

export const bookingService = {
  createBooking: async (bookingRequest) => {
    try {
      const response = await api.post('/bookings', bookingRequest);
      return response;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  payExistingBooking: async (bookingId) => {
    try {
      const response = await api.get(`/payments/vnpay/booking/${bookingId}`);
      return response;
    } catch (error) {
      console.error('Error generating payment url:', error);
      throw error;
    }
  },

  getMyTraineeBookings: async (page = 0, size = 10, status = "ALL") => {
    try {
      const statusParam = status !== "ALL" ? `&status=${status}` : "";
      const response = await api.get(`/bookings/my-bookings?page=${page}&size=${size}${statusParam}`);
      return response;
    } catch (error) {
      console.error('Error fetching mentee bookings:', error);
      throw error;
    }
  },

  completeBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/complete`);
    return response;
  },

  submitReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response;
  },

  getReviewByBooking: async (bookingId) => {
    const response = await api.get(`/reviews/booking/${bookingId}`);
    return response;
  },
};

