import React from "react";
import { Home, Search, Calendar, Settings, Wallet, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const isMentor = user?.role === "mentor" || user?.role === "admin";

  const menuItems = [
    {
      icon: Home,
      label: "Bảng tin",
      active:
        window.location.pathname === "/feed" ||
        window.location.pathname === "/" ||
        window.location.pathname === "",
      href: "/feed",
    },
    {
      icon: User,
      label: "Trang cá nhân",
      active: window.location.pathname === "/me",
      href: "/me",
    },
    {
      icon: Search,
      label: "Tìm Mentor",
      active: window.location.pathname === "/search",
      href: "/search",
    },
    {
      icon: Calendar,
      label: "Lịch học",
      active: window.location.pathname === "/my-bookings",
      href: "/my-bookings",
    },
    // Only show Mentor items if user has Mentor role
    ...(isMentor
      ? [
          {
            icon: Calendar,
            label: "Lịch dạy",
            active: window.location.pathname === "/schedule",
            href: "/schedule",
          },
          {
            icon: Wallet,
            label: "Ví tiền",
            active: window.location.pathname === "/wallet",
            href: "/wallet",
          },
        ]
      : []),
    {
      icon: Settings,
      label: "Cài đặt",
      active: window.location.pathname === "/settings",
      href: "/settings",
    },
  ];

  return (
    <div className="w-64 shrink-0 hidden md:block space-y-6 sticky top-24">
      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-[#372660] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#372660] dark:hover:text-purple-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </a>
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
          <a
            href="/register-mentor"
            className="block w-full py-2 bg-white text-[#372660] text-sm font-bold text-center rounded-lg shadow-sm hover:bg-slate-50 transition relative z-10"
          >
            Đăng ký ngay
          </a>
        </div>
      )}
    </div>
  );
}
