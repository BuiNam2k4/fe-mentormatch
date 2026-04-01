import React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

export default function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors bg-white shadow-sm">
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#372660] text-white font-semibold text-sm shadow-sm transition-colors">
          1
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors">
          2
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors">
          3
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 cursor-default">
          <MoreHorizontal className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors">
          12
        </button>
      </div>

      <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors bg-white shadow-sm">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
