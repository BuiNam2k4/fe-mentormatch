import React, { useState } from "react"
import { MapPin, Briefcase, Share2, Bookmark, Star, CheckCircle, X } from "lucide-react"
import { Button } from "../ui/button"

export default function MentorHeader({ user, loading }) {
  const [lightboxImage, setLightboxImage] = useState(null)

  if (loading || !user) {
     return <div className="h-48 bg-slate-100 animate-pulse rounded-xl mb-6"></div>
  }

  const name = user.fullName || user.userName;
  const avatar = user.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(name);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      {/* Cover Image */}
      <div className="h-32 bg-[#e8e0d5] relative">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Cover" 
          className="w-full h-full object-cover opacity-60 mix-blend-multiply" 
        />
      </div>

      <div className="px-8 pb-8 relative">
        {/* Avatar */}
        <div className="absolute -top-12 left-8 p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
          <img 
            src={avatar} 
            alt={name} 
            onClick={() => setLightboxImage(avatar)}
            className="w-24 h-24 rounded-xl object-cover cursor-zoom-in hover:opacity-95 transition-opacity" 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 gap-3 mb-4">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-slate-600 rounded-lg">
            <Share2 className="w-4 h-4" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2 text-slate-600 rounded-lg">
            <Bookmark className="w-4 h-4" />
            Lưu
          </Button>
        </div>

        {/* Info Info */}
        <div className="mt-2">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {name}
            {user.isActive && <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-500/20" />}
          </h1>
          <p className="text-slate-600 font-medium mt-1">Mentor tại MentorMatch</p>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              Việt Nam
            </div>
            {user.mentorProfile?.yearsOfExperience != null && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {user.mentorProfile.yearsOfExperience} năm kinh nghiệm
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-700">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              {user.mentorProfile?.rating ? user.mentorProfile.rating.toFixed(1) : "0.0"} <span className="text-slate-500 font-normal">({user.mentorProfile?.reviewCount || 0} đánh giá)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Overlay */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-black/50 rounded-full transition-colors z-10"
            onClick={(e) => {
               e.stopPropagation();
               setLightboxImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={lightboxImage} 
            alt="Phóng to" 
            className="max-w-full max-h-full object-contain cursor-zoom-out shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  )
}
