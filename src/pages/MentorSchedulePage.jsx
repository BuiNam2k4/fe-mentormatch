import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, ChevronLeft, ChevronRight, Video, FileText, PlusCircle, CheckCircle, Clock3, X, User, Pencil, Trash2, AlertTriangle, MessageSquare } from "lucide-react"
import scheduleService from "../services/scheduleService"
import { disputeService } from "../services/disputeService"

export default function MentorSchedulePage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const size = 10

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // Modal form state
  const [slotDate, setSlotDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [price, setPrice] = useState("500000")
  const [submitError, setSubmitError] = useState("")

  // Edit slot modal
  const [editSlot, setEditSlot] = useState(null)
  const [editDate, setEditDate] = useState("")
  const [editStart, setEditStart] = useState("")
  const [editEnd, setEditEnd] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editError, setEditError] = useState("")

  // Dispute state
  const [disputeModalOpen, setDisputeModalOpen] = useState(false)
  const [disputeBooking, setDisputeBooking] = useState(null)
  const [disputeReason, setDisputeReason] = useState("")
  const [disputeError, setDisputeError] = useState("")
  const [disputeSubmitting, setDisputeSubmitting] = useState(false)
  const [mentorDisputes, setMentorDisputes] = useState([])
  const [showDisputes, setShowDisputes] = useState(false)

  // Counter Dispute state
  const [counterModalOpen, setCounterModalOpen] = useState(false)
  const [counterDisputeData, setCounterDisputeData] = useState(null)
  const [counterReasonText, setCounterReasonText] = useState("")
  const [counterError, setCounterError] = useState("")
  const [counterSubmitting, setCounterSubmitting] = useState(false)


  useEffect(() => {
    fetchData()
  }, [page, statusFilter])

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus)
    setPage(0)
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [bookingsRes, slotsRes, disputesRes] = await Promise.all([
        scheduleService.getMyBookings(page, size, statusFilter),
        scheduleService.getMyTimeSlots(),
        disputeService.getMentorDisputes({ page: 0, size: 50 })
      ])
      
      if (bookingsRes.code === 1000) {
        setBookings(bookingsRes.result.content)
        setTotalPages(bookingsRes.result.totalPages)
      }
      if (slotsRes.code === 1000) setTimeSlots(slotsRes.result)
      if (disputesRes.code === 1000) setMentorDisputes(disputesRes.result.content || [])
    } catch (error) {
      console.error("Failed to fetch schedule data", error)
    } finally {
      setLoading(false)
    }
  }

  const openDisputeModal = (booking) => {
    setDisputeBooking(booking)
    setDisputeReason("")
    setDisputeError("")
    setDisputeModalOpen(true)
  }

  const handleSubmitDispute = async (e) => {
    e.preventDefault()
    if (!disputeReason.trim()) {
      setDisputeError("Vui lòng nhập lý do khiếu nại")
      return
    }
    setDisputeSubmitting(true)
    setDisputeError("")
    try {
      const res = await disputeService.createDispute({ bookingId: disputeBooking.id, reason: disputeReason })
      if (res.code === 1000) {
        setDisputeModalOpen(false)
        fetchData()
      } else {
        setDisputeError(res.message || "Có lỗi xảy ra")
      }
    } catch (err) {
      setDisputeError(err.response?.data?.message || "Lỗi kết nối Server")
    } finally {
      setDisputeSubmitting(false)
    }
  }

  const openCounterModal = (dispute) => {
    setCounterDisputeData(dispute)
    setCounterReasonText("")
    setCounterError("")
    setCounterModalOpen(true)
  }

  const handleCounterDispute = async (e) => {
    e.preventDefault()
    if (!counterReasonText.trim()) {
      setCounterError("Vui lòng nhập lý do kháng cáo")
      return
    }
    setCounterSubmitting(true)
    setCounterError("")
    try {
      const res = await disputeService.counterDispute(counterDisputeData.id, { counterReason: counterReasonText })
      if (res.code === 1000) {
        setCounterModalOpen(false)
        fetchData()
      } else {
        setCounterError(res.message || "Có lỗi xảy ra")
      }
    } catch (err) {
      setCounterError(err.response?.data?.message || "Lỗi kết nối Server")
    } finally {
      setCounterSubmitting(false)
    }
  }

  const handleViewMentee = (menteeId) => {
    navigate(`/mentee/${menteeId}`)
  }

  const handleDeleteSlot = async (slotId) => {
    if (!confirm("Bạn có chắc muốn xóa khung giờ này?")) return
    try {
      const res = await scheduleService.deleteTimeSlot(slotId)
      if (res.code === 1000) fetchData()
      else alert(res.message || "Có lỗi xảy ra")
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi kết nối Server")
    }
  }

  const openEditSlot = (slot) => {
    setEditSlot(slot)
    const startDt = new Date(slot.startTime)
    const endDt = new Date(slot.endTime)
    const pad = (n) => n.toString().padStart(2, '0')
    setEditDate(`${startDt.getFullYear()}-${pad(startDt.getMonth()+1)}-${pad(startDt.getDate())}`)
    setEditStart(`${pad(startDt.getHours())}:${pad(startDt.getMinutes())}`)
    setEditEnd(`${pad(endDt.getHours())}:${pad(endDt.getMinutes())}`)
    setEditPrice(slot.price.toString())
    setEditError("")
  }

  const handleEditSlot = async (e) => {
    e.preventDefault()
    setEditError("")
    try {
      const res = await scheduleService.updateTimeSlot(editSlot.id, {
        startTime: `${editDate}T${editStart}:00`,
        endTime: `${editDate}T${editEnd}:00`,
        price: parseFloat(editPrice)
      })
      if (res.code === 1000) {
        setEditSlot(null)
        fetchData()
      } else {
        setEditError(res.message || "Có lỗi xảy ra")
      }
    } catch (err) {
      setEditError(err.response?.data?.message || "Lỗi kết nối Server")
    }
  }

  const handleBookingAction = async (bookingId, action) => {
    try {
      const res = await scheduleService.processBooking(bookingId, action)
      if (res.code === 1000) {
        fetchData()
      } else {
        alert(res.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      alert("Lỗi kết nối Server")
    }
  }

  const handleMeetingLink = async (bookingId, link) => {
    try {
      const res = await scheduleService.updateMeetingLink(bookingId, link)
      if (res.code === 1000) {
        fetchData()
      } else {
        alert(res.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      alert("Lỗi kết nối Server")
    }
  }

  const handleCreateSlot = async (e) => {
    e.preventDefault()
    setSubmitError("")
    
    if (!slotDate || !startTime || !endTime || !price) {
      setSubmitError("Vui lòng điền đủ thông tin")
      return
    }

    try {
      const startDateTime = `${slotDate}T${startTime}:00`
      const endDateTime = `${slotDate}T${endTime}:00`
      
      const res = await scheduleService.createTimeSlot({
        startTime: startDateTime,
        endTime: endDateTime,
        price: parseFloat(price)
      })

      if (res.code === 1000) {
        setIsModalOpen(false)
        fetchData()
        setSlotDate("")
        setStartTime("")
        setEndTime("")
      } else {
        setSubmitError(res.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Lỗi kết nối Server")
    }
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING': return { text: "Chờ xác nhận", color: "bg-amber-100 text-amber-700" }
      case 'PAID': return { text: "Đã thanh toán", color: "bg-indigo-100 text-indigo-700" }
      case 'CONFIRMED': return { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700" }
      case 'COMPLETED': return { text: "Đã hoàn thành", color: "bg-green-100 text-green-700" }
      case 'REJECTED': return { text: "Đã từ chối", color: "bg-red-100 text-red-700" }
      case 'CANCELLED': return { text: "Đã hủy", color: "bg-slate-100 text-slate-600" }
      case 'DISPUTED': return { text: "Đang khiếu nại", color: "bg-orange-100 text-orange-700" }
      case 'REFUNDED': return { text: "Đã hoàn tiền", color: "bg-rose-100 text-rose-700" }
      default: return { text: status, color: "bg-slate-100 text-slate-600" }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const d = new Date(dateString)
    return d.toLocaleDateString('vi-VN')
  }

  const formatTime = (dateString) => {
    if (!dateString) return ""
    const d = new Date(dateString)
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  // Calendar logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const calendarDays = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  const getDateString = (d) => {
    if (!d) return null;
    const pad = (n) => n.toString().padStart(2, '0');
    return `${currentYear}-${pad(currentMonth + 1)}-${pad(d)}`;
  }

  const hasBookingsOnDate = (dateStr) => {
    return bookings.some(b => b.startTime && b.startTime.startsWith(dateStr));
  }

  const displayedBookings = selectedDate 
    ? bookings.filter(b => b.startTime && b.startTime.startsWith(selectedDate))
    : bookings;

  return (
    <div className="flex gap-8 max-w-6xl mx-auto pb-10">
      <div className="flex-1">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-2xl font-bold text-slate-900">Lịch dạy của tôi</h1>
             <p className="text-slate-500 text-sm mt-1">Quản lý thời gian và các ca học sắp tới của bạn.</p>
           </div>
          <div className="flex items-center gap-3">
            <button 
               onClick={() => setShowDisputes(true)}
               className="flex items-center gap-2 bg-white border border-orange-200 text-orange-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors relative">
              <MessageSquare className="w-4 h-4" />
              Khiếu nại
              {mentorDisputes.filter(d => d.status === 'PENDING').length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {mentorDisputes.filter(d => d.status === 'PENDING').length}
                </span>
              )}
            </button>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-2 bg-[#372660] hover:bg-[#2b1d4c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              <Calendar className="w-4 h-4" />
              Cập nhật khung giờ rảnh
            </button>
          </div>
         </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN: Stats & Calendar */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Stat Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-500">Khung giờ đang mở</p>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">{timeSlots.filter(s => s.status === 'AVAILABLE').length} slot</h3>
            </div>

            {/* Stat Box 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-500">Tổng ca học</p>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{bookings.length} ca</h3>
            </div>

            {/* Mini Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hidden md:block select-none">
               <div className="flex justify-between items-center mb-6">
                 <h4 className="font-bold text-slate-900 capitalize">Tháng {currentMonth + 1}, {currentYear}</h4>
                 <div className="flex gap-2">
                   <button onClick={handlePrevMonth} className="text-slate-400 hover:text-[#372660] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                   <button onClick={handleNextMonth} className="text-slate-400 hover:text-[#372660] transition-colors"><ChevronRight className="w-5 h-5" /></button>
                 </div>
               </div>
               
               <div className="grid grid-cols-7 text-center gap-y-3 gap-x-1">
                 {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                   <div key={d} className="text-[10px] font-bold text-slate-400 mb-2">{d}</div>
                 ))}
                 
                 {calendarDays.map((day, idx) => {
                   if (!day) return <div key={`empty-${idx}`}></div>;
                   const dateStr = getDateString(day);
                   const isSelected = selectedDate === dateStr;
                   const isToday = getDateString(new Date().getDate()) === dateStr && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                   const hasEvent = hasBookingsOnDate(dateStr);
                   return (
                     <div 
                        key={idx} 
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={`text-sm font-medium w-8 h-8 flex flex-col items-center justify-center rounded-full mx-auto cursor-pointer transition-all relative ${
                          isSelected 
                            ? 'bg-[#372660] text-white shadow-md' 
                            : isToday 
                              ? 'bg-indigo-50 text-[#372660] border border-[#372660]/20'
                              : 'text-slate-700 hover:bg-slate-100'
                        }`}
                     >
                       <span>{day}</span>
                       {hasEvent && !isSelected && (
                         <span className="absolute bottom-1 w-1 h-1 bg-rose-500 rounded-full"></span>
                       )}
                     </div>
                   );
                 })}
               </div>

               {selectedDate && (
                 <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Ngày: {new Date(selectedDate).toLocaleDateString('vi-VN')}
                    </p>
                    <button onClick={() => setSelectedDate(null)} className="text-[10px] uppercase font-bold text-[#372660] hover:underline">
                      Xem tất cả
                    </button>
                 </div>
               )}
            </div>

            {/* List of Created Time Slots */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
               <div className="flex justify-between items-center mb-4">
                 <h4 className="font-bold text-slate-900">Khung giờ đã tạo</h4>
               </div>
               
               <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                 {timeSlots.length === 0 ? (
                   <p className="text-sm text-slate-500 text-center py-4">Chưa có khung giờ rảnh nào được tạo.</p>
                 ) : (
                   timeSlots.map(slot => (
                     <div key={slot.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-center transition-colors hover:border-[#372660]/30 group">
                       <div>
                         <p className="text-sm font-bold text-[#372660]">{formatDate(slot.startTime)}</p>
                         <p className="text-xs text-slate-500 font-medium mt-0.5">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="text-right">
                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${slot.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                             {slot.status === 'AVAILABLE' ? "Đang mở" : "Đã đặt"}
                           </span>
                           <p className="text-xs font-semibold text-slate-700 mt-1">{slot.price.toLocaleString('vi-VN')}đ</p>
                         </div>
                         {slot.status === 'AVAILABLE' && (
                           <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => openEditSlot(slot)} className="p-1 rounded-md hover:bg-blue-100 text-blue-600 transition-colors" title="Sửa">
                               <Pencil className="w-3.5 h-3.5" />
                             </button>
                             <button onClick={() => handleDeleteSlot(slot.id)} className="p-1 rounded-md hover:bg-red-100 text-red-500 transition-colors" title="Xóa">
                               <Trash2 className="w-3.5 h-3.5" />
                             </button>
                           </div>
                         )}
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Upcoming Classes */}
          <div className="w-full lg:w-2/3">
             <div className="flex justify-between items-center mb-4 px-1">
               <h3 className="font-bold text-lg text-slate-900">
                  {selectedDate ? `Ca học ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')}` : "Danh sách Ca học"}
               </h3>
               <span className="text-xs font-bold bg-[#372660]/10 text-[#372660] px-2.5 py-1 rounded-lg">
                 {displayedBookings.length} ca
               </span>
             </div>

             {/* Status Filter */}
             <div className="flex flex-nowrap overflow-x-auto gap-2 mb-4 pb-1 scrollbar-hide">
               {['ALL', 'PENDING', 'PAID', 'CONFIRMED', 'COMPLETED', 'DISPUTED', 'REFUNDED', 'CANCELLED', 'REJECTED'].map(st => (
                 <button 
                   key={st}
                   onClick={() => handleStatusChange(st)}
                   className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                     statusFilter === st 
                       ? 'bg-[#372660] text-white shadow-sm' 
                       : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                   }`}
                 >
                   {st === 'ALL' ? 'Tất cả' : getStatusDisplay(st).text}
                 </button>
               ))}
             </div>

             <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-10 text-slate-400">Đang tải lịch học...</div>
                ) : displayedBookings.length === 0 ? (
                  <div 
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-2xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center justify-center text-center bg-slate-50/50 mt-6 group hover:border-[#372660]/30 hover:bg-[#372660]/5 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#372660] mb-4">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-400 mb-2">Không có ca học nào {selectedDate ? 'trong ngày này' : 'được đặt'}.</p>
                    <p className="text-sm font-bold text-[#372660]">Mở thêm khung giờ rảnh?</p>
                  </div>
                ) : (
                  displayedBookings.map((cls) => {
                     const statusInfo = getStatusDisplay(cls.status)
                     return (
                     <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between hover:shadow-md transition-shadow">
                       
                       {/* User & Info */}
                       <div className="flex gap-4 items-center">
                         <div className="relative shrink-0">
                            <img 
                              src={cls.menteeAvatar || `https://ui-avatars.com/api/?name=${cls.menteeName}&background=random`} 
                              alt="Avatar" 
                              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-[#372660]/30 transition-all" 
                              onClick={() => handleViewMentee(cls.menteeId)}
                            />
                         </div>
                         
                         <div>
                           <div className="flex items-center gap-3 mb-1">
                             <h4 
                               className="font-bold text-slate-900 text-lg cursor-pointer hover:text-[#372660] transition-colors"
                               onClick={() => handleViewMentee(cls.menteeId)}
                             >
                               {cls.menteeName || `Học viên #${cls.menteeId}`}
                             </h4>
                             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                               {statusInfo.text}
                             </span>
                           </div>
                           <p className="text-sm font-semibold text-[#372660] mb-2 line-clamp-1">{cls.menteeNotes || "Không có ghi chú"}</p>
                           <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                             <span className="flex items-center gap-1.5 border border-slate-100 bg-slate-50 px-2 py-1 rounded-md"><Calendar className="w-3.5 h-3.5" /> {formatDate(cls.startTime)}</span>
                             <span className="flex items-center gap-1.5 border border-slate-100 bg-slate-50 px-2 py-1 rounded-md"><Clock3 className="w-3.5 h-3.5" /> {formatTime(cls.startTime)} - {formatTime(cls.endTime)}</span>
                           </div>
                         </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="w-full sm:w-auto mt-2 sm:mt-0 flex flex-col sm:flex-row gap-2">
                         {(cls.status === 'PENDING' || cls.status === 'PAID') && (
                            <>
                              <button 
                                onClick={() => handleBookingAction(cls.id, 'REJECT')}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">
                                Từ chối
                              </button>
                              <button 
                                onClick={() => handleBookingAction(cls.id, 'CONFIRM')}
                                className="px-4 py-2 bg-[#372660] text-white rounded-lg text-sm font-bold hover:bg-[#2b1d4c] transition-colors">
                                Xác nhận
                              </button>
                            </>
                         )}
                         {cls.status === 'CONFIRMED' && (
                            <>
                              {!cls.meetingLink ? (
                                <button 
                                  onClick={() => {
                                    const link = prompt("Nhập link phòng học (Google Meet, Zoom...):")
                                    if (link) handleMeetingLink(cls.id, link)
                                  }}
                                  className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
                                  <PlusCircle className="w-4 h-4" /> Thêm Link Meet
                                </button>
                              ) : (
                                <a 
                                  href={cls.meetingLink} target="_blank" rel="noreferrer"
                                  className="px-4 py-2 bg-[#372660] text-white rounded-lg text-sm font-bold hover:bg-[#2b1d4c] transition-colors flex items-center gap-2">
                                  <Video className="w-4 h-4" /> Vào phòng học
                                </a>
                              )}
                            </>
                         )}
                         {(cls.status === 'COMPLETED' || cls.status === 'PAID' || cls.status === 'CONFIRMED') && (
                             <button
                               onClick={() => openDisputeModal(cls)}
                               className="px-4 py-2 border border-orange-200 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors flex items-center gap-2"
                             >
                               <AlertTriangle className="w-4 h-4" /> Khiếu nại
                             </button>
                          )}
                         {cls.status === 'COMPLETED' && (
                            <div className="text-xs font-semibold text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded bg-emerald-50">
                               Ca học đã hoàn thành
                            </div>
                         )}
                         {cls.status === 'DISPUTED' && (
                             <div className="text-xs font-semibold text-orange-600 border border-orange-200 px-3 py-1.5 rounded bg-orange-50">
                                Đang chờ xử lý khiếu nại
                             </div>
                          )}
                          {cls.status === 'REFUNDED' && (
                             <div className="text-xs font-semibold text-rose-600 border border-rose-200 px-3 py-1.5 rounded bg-rose-50">
                                Đã hoàn tiền
                             </div>
                          )}
                         {cls.status === 'REJECTED' && (
                            <div className="text-xs font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded bg-red-50">
                               Đã được từ chối
                            </div>
                         )}
                       </div>
                     </div>
                   )})
                )}
             </div>
             
             {/* Pagination */}
             {totalPages > 1 && (
               <div className="flex items-center justify-center gap-2 mt-6">
                 <button 
                   onClick={() => setPage(p => Math.max(0, p - 1))}
                   disabled={page === 0}
                   className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   <ChevronLeft className="w-5 h-5" />
                 </button>
                 <div className="flex gap-1">
                   {[...Array(totalPages)].map((_, i) => (
                     <button
                       key={i}
                       onClick={() => setPage(i)}
                       className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                         page === i 
                           ? 'bg-[#372660] text-white' 
                           : 'text-slate-600 hover:bg-slate-50'
                       }`}
                     >
                       {i + 1}
                     </button>
                   ))}
                 </div>
                 <button 
                   onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                   disabled={page === totalPages - 1}
                   className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   <ChevronRight className="w-5 h-5" />
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* CREATE TIMESLOT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900">Mở khung giờ rảnh</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSlot} className="p-6 space-y-4">
              {submitError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày dạy <span className="text-red-500">*</span></label>
                <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#372660] focus:border-[#372660] outline-none text-sm" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giờ Bắt đầu <span className="text-red-500">*</span></label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#372660] focus:border-[#372660] outline-none text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giờ Kết thúc <span className="text-red-500">*</span></label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#372660] focus:border-[#372660] outline-none text-sm" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá tiền (VNĐ) <span className="text-red-500">*</span></label>
                <input type="number" step="10000" value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#372660] focus:border-[#372660] outline-none text-sm bg-slate-50" required />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#372660] text-white font-bold rounded-lg hover:bg-[#2b1d4c] shadow-md transition-colors">
                  Lưu khung giờ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TIMESLOT MODAL */}
      {editSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900">Chỉnh sửa khung giờ</h3>
              <button onClick={() => setEditSlot(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSlot} className="p-6 space-y-4">
              {editError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày dạy <span className="text-red-500">*</span></label>
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#372660] focus:border-[#372660] outline-none text-sm" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giờ Bắt đầu <span className="text-red-500">*</span></label>
                  <input type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#372660] focus:border-[#372660] outline-none text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giờ Kết thúc <span className="text-red-500">*</span></label>
                  <input type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#372660] focus:border-[#372660] outline-none text-sm" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá tiền (VNĐ) <span className="text-red-500">*</span></label>
                <input type="number" step="10000" value={editPrice} onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#372660] focus:border-[#372660] outline-none text-sm bg-slate-50" required />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditSlot(null)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#372660] text-white font-bold rounded-lg hover:bg-[#2b1d4c] shadow-md transition-colors">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DISPUTE MODAL */}
      {disputeModalOpen && disputeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-orange-50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" /> Tạo đơn khiếu nại
              </h3>
              <button onClick={() => setDisputeModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitDispute} className="p-6 space-y-4">
              {disputeError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">{disputeError}</div>
              )}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Ca học</p>
                <p className="text-sm font-bold text-slate-800">{disputeBooking.menteeName || `Học viên #${disputeBooking.menteeId}`}</p>
                <p className="text-xs text-slate-500 mt-1">{formatDate(disputeBooking.startTime)} • {formatTime(disputeBooking.startTime)} - {formatTime(disputeBooking.endTime)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lý do khiếu nại <span className="text-red-500">*</span></label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={4}
                  placeholder="Mô tả chi tiết lý do khiếu nại..."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-sm resize-none"
                  required
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setDisputeModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={disputeSubmitting}
                  className="flex-1 px-4 py-2.5 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 shadow-md transition-colors disabled:opacity-50">
                  {disputeSubmitting ? "Đang gửi..." : "Gửi khiếu nại"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INCOMING DISPUTES PANEL */}
      {showDisputes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" /> Đơn khiếu nại từ học viên
              </h3>
              <button onClick={() => setShowDisputes(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              {mentorDisputes.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">Chưa có đơn khiếu nại nào.</p>
              ) : (
                mentorDisputes.map(d => (
                  <div key={d.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{d.creatorName}</p>
                        <p className="text-xs text-slate-500">Booking #{d.bookingId} • {new Date(d.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        d.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        d.status === 'APPEALED' ? 'bg-blue-100 text-blue-700' :
                        d.status === 'RESOLVED_REFUND' ? 'bg-rose-100 text-rose-700' :
                        d.status === 'RESOLVED_NO_REFUND' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {d.status === 'PENDING' ? 'Chờ xử lý' :
                         d.status === 'APPEALED' ? 'Đã kháng đơn' :
                         d.status === 'RESOLVED_REFUND' ? 'Đã hoàn tiền' :
                         d.status === 'RESOLVED_NO_REFUND' ? 'Từ chối hoàn tiền' : d.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">Lý do khiếu nại:</p>
                      <p className="text-sm text-slate-700 bg-white p-2 rounded-lg border border-slate-100">{d.reason}</p>
                    </div>
                    {d.counterReason ? (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-slate-600 mb-1">Lý do kháng cáo của bạn:</p>
                        <p className="text-sm text-slate-700 bg-blue-50/50 p-2 rounded-lg border border-blue-100">{d.counterReason}</p>
                      </div>
                    ) : (
                      d.status === 'PENDING' && (
                        <div className="mt-2 flex justify-end">
                          <button 
                            onClick={() => openCounterModal(d)}
                            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors">
                            Gửi kháng cáo
                          </button>
                        </div>
                      )
                    )}
                    {d.adminNote && (
                      <div className="text-xs text-slate-500 bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <span className="font-bold">Admin:</span> {d.adminNote}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* COUNTER DISPUTE MODAL */}
      {counterModalOpen && counterDisputeData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" /> Kháng cáo quyết định
              </h3>
              <button onClick={() => setCounterModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCounterDispute} className="p-6 space-y-4">
              {counterError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">{counterError}</div>
              )}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Lý do khiếu nại của học viên:</p>
                <p className="text-sm italic text-slate-700">"{counterDisputeData.reason}"</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lý do kháng cáo của bạn <span className="text-red-500">*</span></label>
                <textarea
                  value={counterReasonText}
                  onChange={(e) => setCounterReasonText(e.target.value)}
                  rows={4}
                  placeholder="Mô tả sự việc từ góc nhìn của bạn để Admin xử lý công bằng..."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm resize-none"
                  required
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setCounterModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={counterSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50">
                  {counterSubmitting ? "Đang gửi..." : "Gửi kháng đơn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
