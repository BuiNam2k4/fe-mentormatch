import React from "react";
import { Users, AlertTriangle, CheckCircle } from "lucide-react";

export default function StatCards({ stats }) {
  const statItems = [
    {
      title: "TỔNG NGƯỜI DÙNG",
      value: stats?.totalUsers?.toLocaleString("vi-VN") || "0",
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "KHIẾU NẠI CHỜ XỬ LÝ",
      value: stats?.pendingDisputes?.toLocaleString("vi-VN") || "0",
      icon: AlertTriangle,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "BUỔI HỌC HOÀN TẤT",
      value: stats?.totalCompletedBookings?.toLocaleString("vi-VN") || "0",
      icon: CheckCircle,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 flex items-center gap-4 sm:gap-5"
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 ${stat.bgColor} ${stat.iconColor}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
