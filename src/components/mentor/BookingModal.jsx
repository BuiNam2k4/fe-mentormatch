import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, CreditCard } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, slot, dayInfo, onConfirm }) {
  const [menteeNotes, setMenteeNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !slot || !dayInfo) return null;

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(slot.id, menteeNotes);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#372660]" />
            Xác nhận Thanh toán
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="bg-[#372660]/5 rounded-xl p-4 border border-[#372660]/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#372660]/10 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5 text-[#372660]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#372660]">Lịch hẹn 1-kèm-1</p>
                <p className="text-sm text-slate-600 mt-1">
                  {dayInfo.day}, {dayInfo.date}/{dayInfo.fullDate.getMonth() + 1}/{dayInfo.fullDate.getFullYear()}
                </p>
                <p className="text-sm font-medium text-slate-800 flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#372660]/10 flex items-center justify-between">
              <span className="text-slate-600 text-sm font-medium">Tổng thanh toán</span>
              <span className="text-lg font-bold text-[#372660]">{slot.price.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Lời nhắn cho Mentor (Tuỳ chọn)</label>
            <textarea 
              value={menteeNotes}
              onChange={(e) => setMenteeNotes(e.target.value)}
              placeholder="VD: Em muốn nhờ anh xem giúp CV và định hướng mảng Backend ạ..."
              className="w-full border-2 border-slate-100 rounded-xl p-3 text-sm focus:border-[#372660] focus:ring-1 focus:ring-[#372660] transition-all outline-none resize-none h-24"
            />
          </div>

          <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-lg flex items-start gap-2 border border-emerald-100">
            <p>
              Sau khi xác nhận, bạn sẽ được chuyển sang cổng thanh toán VNPAY để hoàn tất giao dịch.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-[#372660] text-white flex items-center justify-center gap-2 hover:bg-[#2b1d4c] transition-all disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Thanh toán ngay'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
