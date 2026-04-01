import React, { useState, useEffect } from "react"
import { BadgeCheck, FileText, CheckCircle, XCircle } from "lucide-react"
import adminService from "../../services/adminService"

export default function AdminMentorRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await adminService.getPendingMentors()
      if (res.code === 1000) {
        setRequests(res.result)
      }
    } catch (error) {
      console.error("Failed to fetch requests", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (profileId) => {
    if (!window.confirm("Bạn có chắc chắn muốn duyệt ứng viên này trở thành Mentor?")) return
    
    try {
      setProcessingId(profileId)
      const res = await adminService.approveMentor(profileId)
      if (res.code === 1000) {
        // Remove from list or refresh
        setRequests(requests.filter(req => req.profileId !== profileId))
        alert("Phê duyệt thành công!")
      } else {
        alert(res.message || "Có lỗi xảy ra.")
      }
    } catch (error) {
      console.error("Failed to approve", error)
      alert("Lỗi máy chủ rỗi.")
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = (profileId) => {
    // In a real app we'd call a reject API to delete the profile or mark as rejected.
    // Since backend doesn't have a reject endpoint yet, we just alert for now.
    alert("Tính năng từ chối đang được phát triển. Vui lòng duyệt hoặc bỏ qua.")
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <span className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#372660] animate-spin"></span>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <BadgeCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 leading-tight">Duyệt Hồ sơ Mentor</h1>
          <p className="text-sm font-medium text-slate-500">Xem và phê duyệt các yêu cầu đăng ký Mentor mới</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-500">
          Không có hồ sơ nào đang chờ duyệt.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((req) => (
            <div key={req.profileId} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              {/* Left Column - User Info */}
              <div className="p-6 md:w-1/3 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 overflow-hidden border-2 border-white shadow-sm shrink-0">
                    {req.avatarUrl ? (
                      <img src={req.avatarUrl} alt={req.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-500 font-bold text-xl">
                        {req.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{req.fullName}</h3>
                    <p className="text-sm text-slate-500">{req.email}</p>
                    {req.phone && <p className="text-xs text-slate-400 mt-0.5">{req.phone}</p>}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Kỹ năng</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {req.skills && req.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded block">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                </div>
              </div>

              {/* Middle Column - Details */}
              <div className="p-6 flex-1 break-words">
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-2">Giới thiệu bản thân</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{req.bio || "Chưa cập nhật giới thiệu."}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2">Chứng chỉ tải lên ({req.certificates?.length || 0})</h4>
                  {req.certificates && req.certificates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {req.certificates.map(cert => (
                        <a 
                          key={cert.id} 
                          href={cert.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
                        >
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                            {cert.name || "Tệp đính kèm"}
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Không có chứng chỉ nào được tải lên.</span>
                  )}
                </div>
              </div>

              {/* Right Column - Actions */}
              <div className="p-6 md:w-48 bg-slate-50 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-200">
                <button 
                  onClick={() => handleApprove(req.profileId)}
                  disabled={processingId === req.profileId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {processingId === req.profileId ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Phê duyệt
                </button>
                <button 
                  onClick={() => handleReject(req.profileId)}
                  disabled={processingId === req.profileId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-red-100 hover:border-red-200 hover:bg-red-50 text-red-600 font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-5 h-5" />
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
