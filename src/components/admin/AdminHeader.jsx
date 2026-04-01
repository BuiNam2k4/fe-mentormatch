import React from "react";
import { Search, Bell, Settings, BarChart2, Menu } from "lucide-react";

export default function AdminHeader({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3 text-slate-800">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
          aria-label="Mở menu quản trị"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 bg-[#372660] text-white rounded-md flex items-center justify-center shadow-sm shrink-0">
          <BarChart2 className="w-5 h-5" />
        </div>
        <h1 className="truncate text-sm sm:text-base md:text-lg font-bold">
          Bảng điều khiển Quản trị viên
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Search */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hệ thống..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#372660] focus:bg-white transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
