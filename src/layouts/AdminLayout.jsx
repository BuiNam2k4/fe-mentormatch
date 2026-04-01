import React from "react"
import AdminSidebar from "../components/admin/AdminSidebar"
import AdminHeader from "../components/admin/AdminHeader"
import { Outlet } from "react-router-dom"

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-[1200px] mx-auto w-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}
