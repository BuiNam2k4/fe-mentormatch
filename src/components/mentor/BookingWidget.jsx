import React, { useState, useEffect } from "react"
import { Calendar as CalendarIcon, CreditCard } from "lucide-react"
import BookingModal from "./BookingModal"
import { paymentService } from "../../services/paymentService"

export default function BookingWidget({ timeSlots = [], onBookingSuccess }) {
  // Group slots by YYYY-MM-DD
  const groupedSlots = timeSlots.reduce((acc, slot) => {
    const slotDate = new Date(slot.startTime);
    const dateStr = slotDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(slot);
    return acc;
  }, {});

  // Generate 30 days starting from today to allow flexible booking
  const today = new Date();
  const calendarDays = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toLocaleDateString('en-CA');
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    return {
      dateStr,
      day: days[d.getDay()],
      date: d.getDate(),
      hasSlots: !!groupedSlots[dateStr],
      fullDate: d
    };
  });

  const [selectedDateStr, setSelectedDateStr] = useState(calendarDays[0].dateStr);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-select the first date that has available slots when timeSlots loads
  useEffect(() => {
    if (timeSlots && timeSlots.length > 0) {
      const sortedDatesWithSlots = Object.keys(groupedSlots).sort();
      if (sortedDatesWithSlots.length > 0) {
        // Only change if the currently selected date no longer has slots
        // or if it's the very first load
        if (!groupedSlots[selectedDateStr]) {
          setSelectedDateStr(sortedDatesWithSlots[0]);
        }
      }
    } else {
      // If no slots exist at all, just default to today
      setSelectedDateStr(calendarDays[0].dateStr);
    }
  }, [timeSlots]);

  useEffect(() => {
    setSelectedSlotId(null);
  }, [selectedDateStr]);

  const slotsForSelectedDate = groupedSlots[selectedDateStr] || [];
  const selectedDayInfo = calendarDays.find(d => d.dateStr === selectedDateStr);
  
  // formatting
  const currentMonthYear = `Tháng ${today.getMonth() + 1}, ${today.getFullYear()}`;
  
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleBookClick = () => {
    if (!selectedSlotId) {
      alert("Vui lòng chọn khung giờ trống trước khi đặt lịch.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (slotId, menteeNotes) => {
    try {
      const res = await paymentService.createVNPayBookingPayment({
        timeSlotId: slotId,
        menteeNotes: menteeNotes,
      });

      if (res.code === 1000 && res.result?.paymentUrl) {
        const { paymentUrl } = res.result;
        setIsModalOpen(false);
        setSelectedSlotId(null);
        if (onBookingSuccess) onBookingSuccess();
        window.location.href = paymentUrl;
      } else {
        alert("Lỗi khi tạo thanh toán VNPAY: " + (res.message || "Không rõ nguyên nhân"));
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Hệ thống gián đoạn, vui lòng thử lại.");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-6">
        <CalendarIcon className="w-5 h-5 text-[#372660]" />
        Đặt lịch hẹn
      </h3>

      {/* Mini Calendar */}
      <div className="mb-6">
        <div className="text-sm font-bold text-slate-700 mb-3">{currentMonthYear}</div>
        <div className="flex items-center justify-between text-center mx-auto overflow-x-auto pb-2 gap-2">
          {calendarDays.map((d, i) => {
            const isActive = d.dateStr === selectedDateStr;
            const isClickable = d.hasSlots || isActive;

            return (
              <div 
                key={i} 
                onClick={() => isClickable && setSelectedDateStr(d.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[36px] h-12 rounded-lg transition-colors shrink-0 ${
                  isActive ? 'bg-[#372660] text-white shadow-md cursor-pointer' 
                  : d.hasSlots ? 'bg-indigo-50 text-slate-700 cursor-pointer hover:bg-indigo-100 border border-indigo-100'
                  : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                <span className={`text-[10px] font-bold mb-1 ${isActive ? 'text-blue-100' : ''}`}>{d.day}</span>
                <span className="text-sm font-bold">{d.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="mb-6">
        <div className="text-sm font-bold text-slate-700 mb-3">
          Khung giờ trống {selectedDayInfo ? `(${selectedDayInfo.day}, ${selectedDayInfo.date}/${selectedDayInfo.fullDate.getMonth() + 1})` : ''}
        </div>
        
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
          {slotsForSelectedDate.length === 0 ? (
             <div className="text-sm text-slate-500 font-medium py-4 text-center border-2 border-dashed border-slate-100 rounded-lg">
               Không có khung giờ rảnh nào trong ngày này.
             </div>
          ) : (
            slotsForSelectedDate.map((slot) => {
              const isActive = selectedSlotId === slot.id;
              return (
                <div 
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`flex items-center justify-between p-3.5 rounded-lg border-2 cursor-pointer transition-colors ${
                    isActive
                      ? 'border-[#372660] bg-[#372660]/5' 
                      : 'border-slate-100 hover:border-[#372660]/30'
                  }`}
                >
                  <span className={`text-sm font-semibold ${isActive ? 'text-[#372660]' : 'text-slate-600'}`}>
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                  <span className={`text-sm font-bold ${isActive ? 'text-[#372660]' : 'text-slate-800'}`}>
                    {slot.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CTA */}
      <button 
        onClick={handleBookClick}
        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
          selectedSlotId 
            ? 'bg-[#372660] hover:bg-[#2b1d4c] text-white shadow-[#372660]/20' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
        }`}>
        <CreditCard className="w-5 h-5" />
        Đặt lịch & Thanh toán
      </button>

      <p className="text-xs text-slate-400 text-center mt-4 px-4 leading-relaxed">
        Bằng cách nhấn nút trên, bạn đồng ý với Điều khoản dịch vụ và Chính sách hoàn tiền của MentorMatch.
      </p>

      {/* Payment Modal */}
      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slot={slotsForSelectedDate.find(s => s.id === selectedSlotId)}
        dayInfo={selectedDayInfo}
        onConfirm={handleConfirmBooking}
      />
    </div>
  )
}
