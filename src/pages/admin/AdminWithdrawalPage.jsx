import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Search, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import adminWithdrawalService from '../../services/adminWithdrawalService';

export default function AdminWithdrawalPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await adminWithdrawalService.getAllWithdrawals();
      if (res.code === 1000) setWithdrawals(res.result);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Xác nhận duyệt lệnh rút tiền này?')) return;
    try {
      const res = await adminWithdrawalService.approveWithdrawal(id);
      if (res.code === 1000) {
        setMessage({ type: 'success', text: 'Đã duyệt lệnh rút tiền thành công' });
        fetchData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra' });
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await adminWithdrawalService.rejectWithdrawal(id, rejectNote);
      if (res.code === 1000) {
        setMessage({ type: 'success', text: 'Đã từ chối lệnh rút tiền, số tiền đã hoàn vào ví Mentor.' });
        setRejectingId(null);
        setRejectNote('');
        fetchData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra' });
    }
  };

  const statusConfig = {
    PENDING: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    APPROVED: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
    REJECTED: { label: 'Từ chối', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  };

  const filtered = withdrawals
    .filter(w => filter === 'ALL' || w.status === filter)
    .filter(w => w.mentorName?.toLowerCase().includes(searchTerm.toLowerCase()) || w.bankAccountNumber?.includes(searchTerm));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Quản lý lệnh rút tiền</h1>
      <p className="text-slate-500 mb-6">Duyệt hoặc từ chối các yêu cầu rút tiền từ Mentor</p>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm font-medium border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input placeholder="Tìm theo tên Mentor hoặc STK..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-white" />
          </div>
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === s ? 'bg-[#372660] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                {s === 'ALL' ? 'Tất cả' : statusConfig[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="px-5 py-3">Mentor</th>
                <th className="px-5 py-3">Số tiền</th>
                <th className="px-5 py-3">Ngân hàng</th>
                <th className="px-5 py-3">STK</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Ngày tạo</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-400">Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-400">Không có lệnh rút tiền nào</td></tr>
              ) : (
                filtered.map(w => {
                  const config = statusConfig[w.status] || statusConfig.PENDING;
                  const StatusIcon = config.icon;
                  return (
                    <React.Fragment key={w.id}>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-sm font-bold text-slate-700">{w.mentorName}</td>
                        <td className="px-5 py-4 text-sm font-bold text-slate-900">{Number(w.amount).toLocaleString('vi-VN')}đ</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{w.bankName}</td>
                        <td className="px-5 py-4 text-sm text-slate-600 font-mono">{w.bankAccountNumber}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${config.color}`}>
                            <StatusIcon className="w-3 h-3" /> {config.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{new Date(w.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td className="px-5 py-4 text-right">
                          {w.status === 'PENDING' && (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleApprove(w.id)} className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors">Duyệt</button>
                              <button onClick={() => setRejectingId(rejectingId === w.id ? null : w.id)} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">Từ chối</button>
                            </div>
                          )}
                        </td>
                      </tr>
                      {rejectingId === w.id && (
                        <tr>
                          <td colSpan="7" className="px-5 py-3 bg-red-50">
                            <div className="flex items-center gap-3">
                              <Input placeholder="Lý do từ chối (không bắt buộc)..." value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} className="bg-white flex-1 max-w-md" />
                              <button onClick={() => handleReject(w.id)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">Xác nhận từ chối</button>
                              <button onClick={() => { setRejectingId(null); setRejectNote(''); }} className="text-slate-500 hover:text-slate-700"><X className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
