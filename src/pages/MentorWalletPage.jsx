import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import { Input } from '../components/ui/input';
import profileService from '../services/profileService';
import walletService from '../services/walletService';

export default function MentorWalletPage() {
  const [profile, setProfile] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    amount: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountHolder: '',
    note: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, withdrawRes] = await Promise.all([
        profileService.getProfile(),
        walletService.getMyWithdrawals()
      ]);
      if (profileRes.code === 1000) setProfile(profileRes.result);
      if (withdrawRes.code === 1000) setWithdrawals(withdrawRes.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const walletBalance = profile?.mentorProfile?.walletBalance || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    if (parseFloat(form.amount) > walletBalance) {
      alert('Số dư không đủ để rút');
      return;
    }
    try {
      setSubmitting(true);
      const res = await walletService.createWithdrawalRequest({
        ...form,
        amount: parseFloat(form.amount)
      });
      if (res.code === 1000) {
        setMessage({ type: 'success', text: 'Gửi yêu cầu rút tiền thành công! Admin sẽ duyệt sớm nhất.' });
        setShowForm(false);
        setForm({ amount: '', bankName: '', bankAccountNumber: '', bankAccountHolder: '', note: '' });
        fetchData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra' });
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    PENDING: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    APPROVED: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
    REJECTED: { label: 'Từ chối', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  };

  if (loading) {
    return <div className="flex justify-center p-12 text-slate-400">Đang tải...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Ví tiền của tôi</h1>
      <p className="text-slate-500 mb-6">Quản lý số dư và yêu cầu rút tiền</p>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm font-medium border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-[#372660] to-[#503b87] rounded-2xl p-8 text-white mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-indigo-200" />
            <span className="text-indigo-200 font-semibold">Số dư khả dụng</span>
          </div>
          <div className="text-4xl font-bold mb-6">
            {Number(walletBalance).toLocaleString('vi-VN')}đ
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-white text-[#372660] font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <ArrowDownCircle className="w-5 h-5" />
            {showForm ? 'Đóng form' : 'Rút tiền'}
          </button>
        </div>
      </div>

      {/* Withdrawal Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Tạo yêu cầu rút tiền</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Số tiền rút (VNĐ) *</label>
                <Input 
                  type="number" required min="1"
                  placeholder="VD: 500000"
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})}
                  className="bg-slate-50 font-bold text-lg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Tên ngân hàng *</label>
                <Input 
                  required placeholder="VD: Vietcombank"
                  value={form.bankName}
                  onChange={(e) => setForm({...form, bankName: e.target.value})}
                  className="bg-slate-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Số tài khoản *</label>
                <Input 
                  required placeholder="VD: 1234567890"
                  value={form.bankAccountNumber}
                  onChange={(e) => setForm({...form, bankAccountNumber: e.target.value})}
                  className="bg-slate-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Tên chủ tài khoản *</label>
                <Input 
                  required placeholder="VD: NGUYEN VAN A"
                  value={form.bankAccountHolder}
                  onChange={(e) => setForm({...form, bankAccountHolder: e.target.value})}
                  className="bg-slate-50"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Ghi chú</label>
              <textarea 
                rows={2}
                placeholder="Ghi chú thêm (nếu có)..."
                value={form.note}
                onChange={(e) => setForm({...form, note: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#372660] resize-none"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit" disabled={submitting}
                className="px-6 py-2.5 bg-[#372660] text-white font-bold rounded-xl hover:bg-[#2b1d4c] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Đang gửi...' : 'Gửi yêu cầu rút tiền'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Withdrawal History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Lịch sử rút tiền</h2>
        </div>
        {withdrawals.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Chưa có yêu cầu rút tiền nào.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {withdrawals.map(w => {
              const config = statusConfig[w.status] || statusConfig.PENDING;
              const StatusIcon = config.icon;
              return (
                <div key={w.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg font-bold text-slate-900">-{Number(w.amount).toLocaleString('vi-VN')}đ</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${config.color}`}>
                        <StatusIcon className="w-3 h-3" /> {config.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 space-x-3">
                      <span>{w.bankName} • {w.bankAccountNumber}</span>
                      <span>• {new Date(w.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {w.adminNote && (
                      <p className="text-xs text-red-600 mt-1 italic">Admin: {w.adminNote}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
