import React from "react"
import { Star, MessageCircle, Calendar, ShieldCheck, CheckCircle, Clock } from "lucide-react"
import { Badge } from "../ui/badge"
import { useNavigate } from "react-router-dom"

export default function MentorSearchResultCard({ mentor }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md hover:border-slate-200">
      
      {/* Avatar Section */}
      <div className="shrink-0 relative">
        <img 
          src={mentor.avatar} 
          alt={mentor.name} 
          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-slate-100 shadow-sm"
        />
        {mentor.isOnline && (
          <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      {/* Main Info Section */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-slate-900 truncate">
                {mentor.name}
              </h3>
              {mentor.isVerified && (
                <CheckCircle className="w-5 h-5 text-[#372660] fill-[#372660]/10" />
              )}
            </div>
            <p className="text-sm font-medium text-slate-600 truncate">
              {mentor.role}
              {mentor.yearOfExp ? ` • ${mentor.yearOfExp} năm kinh nghiệm` : ""}
            </p>
          </div>
          
          <div className="flex flex-col items-end shrink-0">
            <div className="text-xl font-bold text-slate-900">
              {mentor.price}<span className="text-sm font-normal text-slate-500">/buổi</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span className="text-sm font-bold text-slate-700">{mentor.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-500">({mentor.students} học viên)</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {mentor.tags.map((tag, i) => (
            <span key={i} className="px-2.5 py-1 bg-[#372660]/5 text-[#372660] text-xs font-semibold rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-2 md:line-clamp-none">
          {mentor.description}
        </p>

        {/* Footer info & CTA */}
        <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{mentor.responseTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>{mentor.availability}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate(`/mentor/${mentor.id}`)}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#372660] hover:bg-[#2b1d4c] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            Xem hồ sơ
          </button>
        </div>
      </div>

    </div>
  )
}
