import React from "react"
import { useAuth } from "../../contexts/AuthContext"
import { User, Briefcase, Lock } from "lucide-react"

export default function RegistrationSidebar() {
  const { user } = useAuth()
  
  return (
    <div className="w-full lg:w-64 shrink-0 flex flex-col h-full lg:min-h-[calc(100vh-140px)]">
      
      {/* Navigation Menu */}
      <div className="mb-auto">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Cài đặt tài khoản</p>
        <div className="space-y-1 w-full">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#372660]/10 text-[#372660] transition-colors">
            <Briefcase className="w-4 h-4" />
            Đăng kí Mentor
          </button>
        </div>
      </div>

      {/* User Context Footer (Mockup bottom left) */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3 px-2">
        <img 
          src={user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026024d"} 
          alt="Avatar" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 leading-tight">{user?.name || "Alex Nguyen"}</span>
          <span className="text-xs text-slate-500">{user?.email || "alex@mentormatch.vn"}</span>
        </div>
      </div>

    </div>
  )
}
