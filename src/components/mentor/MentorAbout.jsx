import React, { useState } from "react"
import { Award, Briefcase, X } from "lucide-react"

export default function MentorAbout({ user }) {
  const bio = user?.mentorProfile?.bio || "Chưa cập nhật thông tin giới thiệu.";
  const yearsOfExp = user?.mentorProfile?.yearsOfExperience;
  const [previewImg, setPreviewImg] = useState(null);
  
  return (
    <>
      <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm mb-6">
        {/* Bio */}
        <h2 className="text-base font-bold text-slate-800 mb-4">Giới thiệu về tôi</h2>
        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mb-6">
          {bio}
        </div>

        {/* Years of Experience */}
        {yearsOfExp != null && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#372660]/5 border border-[#372660]/10 mb-8">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Briefcase className="w-5 h-5 text-[#372660]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Kinh nghiệm</p>
              <p className="text-lg font-bold text-[#372660]">{yearsOfExp} năm</p>
            </div>
          </div>
        )}

        {/* Certificates */}
        <h2 className="text-base font-bold text-slate-800 mb-4 pt-6 border-t border-slate-100">Bằng cấp & Chứng chỉ</h2>
        
        {!user?.mentorProfile?.certificates || user.mentorProfile.certificates.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Chưa có chứng chỉ nào được cung cấp.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.mentorProfile.certificates.map(cert => (
              <div key={cert.id} className="group rounded-xl border border-slate-100 bg-slate-50 overflow-hidden hover:border-[#372660]/20 transition-colors">
                {/* Certificate Image */}
                <div 
                  onClick={() => setPreviewImg(cert.fileUrl)}
                  className="relative w-full h-40 bg-white cursor-pointer overflow-hidden"
                >
                  <img 
                    src={cert.fileUrl} 
                    alt={cert.name} 
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden items-center justify-center w-full h-full absolute inset-0 bg-slate-100">
                    <Award className="w-10 h-10 text-slate-300" />
                  </div>
                </div>
                {/* Certificate Name */}
                <div className="p-3 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-800 line-clamp-1" title={cert.name}>{cert.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewImg && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <button 
            onClick={() => setPreviewImg(null)} 
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={previewImg} 
            alt="Certificate preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
