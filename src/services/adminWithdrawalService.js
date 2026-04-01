import api from './api';

const adminWithdrawalService = {
  getAllWithdrawals: () => api.get('/admin/withdrawals'),
  approveWithdrawal: (id) => api.post(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal: (id, adminNote) => api.post(`/admin/withdrawals/${id}/reject`, { adminNote }),
};

export default adminWithdrawalService;
