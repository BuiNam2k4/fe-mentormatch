import { LayoutDashboard, Users, AlertTriangle, CreditCard, LogOut, Tag, Home } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { icon: LayoutDashboard, label: "Tổng quan", path: "/admin" },
    { icon: Users, label: "Duyệt Mentor", path: "/admin/mentor-requests" },
    { icon: Tag, label: "Quản lý kỹ năng", path: "/admin/skills" },
    { icon: AlertTriangle, label: "Khiếu nại", path: "/admin/disputes" },
    { icon: CreditCard, label: "Rút tiền", path: "/admin/withdrawals" },
  ]

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col shrink-0 sticky top-0">
      {/* Brand */}
      <div 
        className="h-16 flex items-center px-6 border-b border-slate-200 cursor-pointer"
        onClick={() => navigate('/admin')}
      >
        <div className="flex items-center gap-2 pt-1">
          <div className="w-8 h-8 bg-[#372660] rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#372660] leading-tight">MentorMatch</span>
            <span className="text-[10px] text-slate-500 font-medium">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-1.5">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/')
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-[#372660] text-white" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </div>
      {/* Return to Newsfeed Button */}
      <div className="px-4 mb-4 mt-auto">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-[#372660] bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm"
        >
          <Home className="w-4 h-4" />
          Về trang Newsfeed
        </button>
      </div>

      {/* Bottom Profile Widget */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
              A
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-slate-800 truncate">Quản trị viên</span>
              <span className="text-[10px] text-slate-500 truncate">admin@mentormatch.vn</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Đăng xuất">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
