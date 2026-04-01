import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Search, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { disputeService } from '../../services/disputeService';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await disputeService.getAllDisputes({ page: 0, size: 50 });
      if (res.code === 1000) setDisputes(res.result.content);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleResolve = async (id, acceptRefund) => {
    if (!adminNote.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập nhận xét/lý do xử lý' });
      return;
    }
    if (!window.confirm(`Xác nhận ${acceptRefund ? 'HOÀN TIỀN' : 'TỪ CHỐI'} khiếu nại này?`)) return;
    
    try {
      const res = await disputeService.resolveDispute(id, { adminNote, acceptRefund });
      if (res.code === 1000) {
        setMessage({ type: 'success', text: `Đã xử lý khiếu nại thành công (${acceptRefund ? 'Hoàn tiền' : 'Từ chối'})` });
        setResolvingId(null);
        setAdminNote('');
        fetchData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra' });
    }
  };

  const statusConfig = {
    PENDING: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle },
    APPEALED: { label: 'Đã kháng cáo', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: AlertTriangle },
    RESOLVED_REFUND: { label: 'Đã hoàn tiền', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
    RESOLVED_NO_REFUND: { label: 'Từ chối hoàn tiền', color: 'bg-slate-50 text-slate-700 border-slate-200', icon: XCircle },
    REJECTED: { label: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  };

  const filtered = disputes
    .filter(d => filter === 'ALL' || d.status === filter)
    .filter(d => d.creatorName?.toLowerCase().includes(searchTerm.toLowerCase()) || d.reason?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Quản lý Khiếu nại</h1>
      <p className="text-slate-500 mb-6">Xử lý các đơn khiếu nại và hoàn tiền cho học viên</p>

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
            <Input placeholder="Tìm theo tên hoặc lý do..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-white" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'PENDING', 'APPEALED', 'RESOLVED_REFUND', 'RESOLVED_NO_REFUND'].map(s => (
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
                <th className="px-5 py-3">ID Ca học</th>
                <th className="px-5 py-3">Người khiếu nại</th>
                <th className="px-5 py-3">Lý do</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">Không có đơn khiếu nại nào</td></tr>
              ) : (
                filtered.map(d => {
                  const config = statusConfig[d.status] || statusConfig.PENDING;
                  const StatusIcon = config.icon;
                  return (
                    <React.Fragment key={d.id}>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-sm font-bold text-slate-900">#{d.bookingId}</td>
                        <td className="px-5 py-4 text-sm font-bold text-slate-700">{d.creatorName}</td>
                        <td className="px-5 py-4 text-sm text-slate-600 line-clamp-2 max-w-xs">{d.reason}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${config.color}`}>
                            <StatusIcon className="w-3 h-3" /> {config.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{new Date(d.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td className="px-5 py-4 text-right">
                          {d.status === 'PENDING' || d.status === 'APPEALED' ? (
                            <button onClick={() => setResolvingId(resolvingId === d.id ? null : d.id)} className="px-3 py-1.5 bg-[#372660] text-white text-xs font-bold rounded-lg hover:bg-opacity-90 transition-colors">
                              Xử lý
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 truncate max-w-[150px] inline-block" title={d.adminNote}>Lưu ý: {d.adminNote}</span>
                          )}
                        </td>
                      </tr>
                      {resolvingId === d.id && (
                        <tr>
                          <td colSpan="6" className="px-5 py-4 bg-slate-50 border-y border-slate-200 shadow-inner">
                            <div className="flex flex-col gap-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Người khiếu nại: <span className="text-orange-600">{d.creatorName}</span></p>
                                  <p className="text-sm font-medium text-slate-700">{d.reason}</p>
                                </div>
                                <div className={`p-4 rounded-xl border shadow-sm ${d.counterReason ? 'bg-white border-blue-100' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Giải trình đối chất: 
                                    {d.counterCreatorName ? <span className="text-blue-600 ml-1">{d.counterCreatorName}</span> : <span className="text-slate-500 ml-1">(Chưa có)</span>}
                                  </p>
                                  {d.counterReason ? (
                                    <p className="text-sm font-medium text-slate-700">{d.counterReason}</p>
                                  ) : (
                                    <p className="text-sm italic text-slate-400">Bên kia chưa cung cấp lý do kháng cáo hoặc đã bỏ qua.</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mt-2 bg-white p-3 rounded-xl border border-slate-200">
                                <div className="flex-1">
                                  <Input placeholder="Nhập nhận xét / quyết định của Admin (Bắt buộc)..." value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className="w-full bg-slate-50" />
                                </div>
                                <button onClick={() => handleResolve(d.id, true)} className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">Hoàn Tiền</button>
                                <button onClick={() => handleResolve(d.id, false)} className="px-5 py-2.5 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-700 transition-colors shadow-sm">Không Hoàn Tiền</button>
                                <button onClick={() => { setResolvingId(null); setAdminNote(''); }} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                              </div>
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
