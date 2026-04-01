import React from "react"
import { ShieldCheck } from "lucide-react"

export default function GuaranteeCard() {
  return (
    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex gap-3 mt-4">
      <div className="mt-0.5">
        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-800">Đảm bảo hoàn tiền</h4>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
          Hoàn tiền 100% nếu buổi học không diễn ra.
        </p>
      </div>
    </div>
  )
}
