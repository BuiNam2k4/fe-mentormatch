import React from "react"
import { ChevronDown } from "lucide-react"

export default function MentorListHeader({ totalResults }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-slate-600 font-medium text-sm">
        <span className="font-bold text-slate-900">{totalResults}</span> kết quả được tìm thấy
      </p>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-500">Sắp xếp:</span>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
          Đánh giá cao nhất
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  )
}
