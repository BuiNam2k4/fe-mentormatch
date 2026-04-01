import React from "react"
import { User, Lock, Bell, Shield, CreditCard } from "lucide-react"

export default function SettingsSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "profile", icon: User, label: "Hồ sơ cá nhân" },
    { id: "security", icon: Lock, label: "Mật khẩu & Bảo mật" },
    { id: "notifications", icon: Bell, label: "Cài đặt thông báo" },
    { id: "payment", icon: CreditCard, label: "Phương thức thanh toán" },
  ]

  return (
    <div className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-800">Cài đặt Tài khoản</h2>
        </div>
        <div className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-[#372660]/5 text-[#372660] font-bold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#372660]" : "text-slate-400"}`} />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
