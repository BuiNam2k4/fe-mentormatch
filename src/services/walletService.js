import api from './api';

const walletService = {
  createWithdrawalRequest: (data) => api.post('/wallet/withdraw', data),
  getMyWithdrawals: () => api.get('/wallet/withdrawals'),
};

export default walletService;
