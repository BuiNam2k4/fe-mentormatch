import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Home, Search, User, Wallet } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function MobileBottomNav() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const isMentor = user?.role === "mentor" || user?.role === "admin";

  const menuItems = [
    { to: "/feed", label: "Bảng tin", icon: Home },
    { to: "/search", label: "Tìm", icon: Search },
    {
      to: isMentor ? "/schedule" : "/my-bookings",
      label: isMentor ? "Lịch dạy" : "Lịch học",
      icon: Calendar,
    },
    ...(isMentor ? [{ to: "/wallet", label: "Ví", icon: Wallet }] : []),
    { to: "/me", label: "Cá nhân", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div
        className="grid px-1 pb-[max(env(safe-area-inset-bottom),0px)]"
        style={{
          gridTemplateColumns: `repeat(${menuItems.length}, minmax(0, 1fr))`,
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? "text-[#372660]"
                    : "text-slate-500 dark:text-slate-400"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="leading-none">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
