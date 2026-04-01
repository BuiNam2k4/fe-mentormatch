import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, GraduationCap, Target, Sparkles, Mail, Phone, Calendar, User, Star, BookOpen } from "lucide-react"
import { userService } from "../services/userService"
import api from "../services/api"

export default function MenteeProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await userService.getMenteeProfile(id)
        if (res.code === 1000) {
          setUser(res.result)
        }
      } catch (err) {
        console.error("Failed to fetch mentee profile", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#372660]/20 border-t-[#372660] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Không tìm thấy hồ sơ</h2>
        <p className="text-slate-500 mt-1 mb-4">Học viên này không tồn tại hoặc đã bị xóa.</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-[#372660] text-white rounded-lg font-semibold hover:bg-[#2b1d4c] transition-colors">
          Quay lại
        </button>
      </div>
    )
  }

  const avatar = user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6c5ce7&color=fff&size=256`
  const mp = user.menteeProfile

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#372660] mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Quay lại
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Cover + Avatar Section */}
        <div className="relative">
          <div className="h-40 bg-gradient-to-br from-[#372660] via-[#5a3d8a] to-[#7c5cbf]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-60" />
          </div>
          
          <div className="px-8 pb-6 -mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img 
                src={avatar} 
                alt={user.fullName} 
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900">{user.fullName}</h1>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">Học viên</span>
                </div>
                <p className="text-slate-500 mt-0.5">@{user.userName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Chips */}
        <div className="px-8 pb-6 flex flex-wrap gap-3">
          {user.email && (
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Mail className="w-4 h-4 text-[#372660]" />
              {user.email}
            </div>
          )}
          {user.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Phone className="w-4 h-4 text-[#372660]" />
              {user.phone}
            </div>
          )}
          {user.createdAt && (
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Calendar className="w-4 h-4 text-[#372660]" />
              Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Education */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Trình độ học vấn</h3>
          </div>
          {mp?.currentEducation ? (
            <p className="text-slate-700 leading-relaxed">{mp.currentEducation}</p>
          ) : (
            <p className="text-slate-400 italic text-sm">Chưa cập nhật</p>
          )}
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Sở thích & Lĩnh vực</h3>
          </div>
          {mp?.interests ? (
            <div className="flex flex-wrap gap-2">
              {mp.interests.split(',').map((interest, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg border border-amber-100">
                  {interest.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-sm">Chưa cập nhật</p>
          )}
        </div>

        {/* Learning Goals — spans full width */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:col-span-2 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Mục tiêu học tập</h3>
          </div>
          {mp?.learningGoals ? (
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{mp.learningGoals}</p>
          ) : (
            <p className="text-slate-400 italic text-sm">Chưa cập nhật</p>
          )}
        </div>

      </div>

      {/* Empty State */}
      {!mp && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center mt-6">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">Chưa có hồ sơ chi tiết</h3>
          <p className="text-sm text-slate-400">Học viên này chưa cập nhật thông tin hồ sơ của mình.</p>
        </div>
      )}
    </div>
  )
}
