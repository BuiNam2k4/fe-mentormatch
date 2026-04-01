import api from './api';

export const paymentService = {
  createVNPayBookingPayment: async (bookingRequest) => {
    try {
      const response = await api.post('/payments/vnpay/booking', bookingRequest);
      return response;
    } catch (error) {
      console.error('Error creating VNPay booking payment:', error);
      throw error;
    }
  },
};

