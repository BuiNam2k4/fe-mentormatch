import React, { useState, useEffect } from "react"
import { Star, ArrowRight, ShieldCheck } from "lucide-react"
import api from "../../services/api"

export default function MentorReviews({ mentorId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mentorId) return
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/reviews/mentor/${mentorId}`)
        if (res.code === 1000) {
          setReviews(res.result)
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [mentorId])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm mb-6 lg:mb-0">
        <div className="flex justify-center py-8 text-slate-400">Đang tải đánh giá...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm mb-6 lg:mb-0">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-800">
            Đánh giá từ học viên ({reviews.length})
          </h2>
          {reviews.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {avgRating}
            </span>
          )}
        </div>
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          Chưa có đánh giá nào.
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <img 
                src={review.menteeAvatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(review.menteeName)} 
                alt={review.menteeName} 
                className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-100 p-0.5" 
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{review.menteeName}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                        <ShieldCheck className="w-3 h-3" />
                        ĐÃ HỌC QUA NỀN TẢNG
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-500' : 'fill-slate-200 text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
