import React from "react";
import { Home, Search, Calendar, Settings, Wallet, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const { user } = useAuth();
  const isMentor = user?.role === "mentor" || user?.role === "admin";

  const menuItems = [
    {
      icon: Home,
      label: "Bảng tin",
      to: "/feed",
    },
    {
      icon: User,
      label: "Trang cá nhân",
      to: "/me",
    },
    {
      icon: Search,
      label: "Tìm Mentor",
      to: "/search",
    },
    {
      icon: Calendar,
      label: "Lịch học",
      to: "/my-bookings",
    },
    // Only show Mentor items if user has Mentor role
    ...(isMentor
      ? [
          {
            icon: Calendar,
            label: "Lịch dạy",
            to: "/schedule",
          },
          {
            icon: Wallet,
            label: "Ví tiền",
            to: "/wallet",
          },
        ]
      : []),
    {
      icon: Settings,
      label: "Cài đặt",
      to: "/settings",
    },
  ];

  return (
    <div className="w-64 shrink-0 hidden md:block space-y-6 sticky top-24">
      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#372660] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#372660] dark:hover:text-purple-400"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Mentor CTA - Hide if they are already a mentor */}
      {!isMentor && (
        <div className="bg-gradient-to-br from-[#372660] to-[#503b87] rounded-xl p-5 border border-indigo-900 relative overflow-hidden group shadow-md mt-4">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
          <h4 className="text-sm font-bold text-white mb-2 relative z-10">
            Chia sẻ kiến thức
          </h4>
          <p className="text-xs text-indigo-200 mb-4 leading-relaxed relative z-10">
            Trở thành Mentor để giúp đỡ cộng đồng và gia tăng thu nhập.
          </p>
          <NavLink
            to="/register-mentor"
            className="block w-full py-2 bg-white text-[#372660] text-sm font-bold text-center rounded-lg shadow-sm hover:bg-slate-50 transition relative z-10"
          >
            Đăng ký ngay
          </NavLink>
        </div>
      )}
    </div>
  );
}
