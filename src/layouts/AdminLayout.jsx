import React, { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar className="hidden md:flex md:sticky md:top-0" />

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu quản trị"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      )}

      <AdminSidebar
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 md:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onNavigate={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col md:h-screen md:overflow-hidden">
        <AdminHeader onMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="relative flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-[1200px] mx-auto w-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
