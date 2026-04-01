import React from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const MONTH_NAMES = [
  "",
  "THÁNG 1",
  "THÁNG 2",
  "THÁNG 3",
  "THÁNG 4",
  "THÁNG 5",
  "THÁNG 6",
  "THÁNG 7",
  "THÁNG 8",
  "THÁNG 9",
  "THÁNG 10",
  "THÁNG 11",
  "THÁNG 12",
];

export default function RevenueChart({ stats }) {
  const monthlyRevenues = stats?.monthlyRevenues || [];
  const systemRevenue = stats?.systemRevenue || 0;
  const totalRevenue = stats?.totalRevenue || 0;

  // Build chart data from API - show system revenue (5%) per month
  const chartData = monthlyRevenues.map((m) => ({
    name: MONTH_NAMES[m.month] || `T${m.month}`,
    value: Number(m.systemRevenue || 0),
  }));

  // Calculate % change vs previous month
  let changePercent = null;
  if (chartData.length >= 2) {
    const prev = chartData[chartData.length - 2].value;
    const curr = chartData[chartData.length - 1].value;
    if (prev > 0) {
      changePercent = Math.round(((curr - prev) / prev) * 100);
    }
  }

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-10 gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Doanh thu hoa hồng theo tháng
          </h2>
          <p className="text-sm text-slate-500">
            Thống kê doanh thu từ phí dịch vụ 5% ({monthlyRevenues.length} tháng
            gần nhất)
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="text-xl sm:text-2xl font-bold text-[#372660]">
            {formatVND(systemRevenue)}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tổng thanh toán: {formatVND(totalRevenue)}
          </p>
          {changePercent !== null && (
            <div
              className={`text-xs font-semibold flex items-center gap-1 mt-1 ${changePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {changePercent >= 0 ? (
                  <>
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </>
                ) : (
                  <>
                    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                    <polyline points="16 17 22 17 22 11"></polyline>
                  </>
                )}
              </svg>
              {changePercent >= 0 ? "+" : ""}
              {changePercent}% so với tháng trước
            </div>
          )}
        </div>
      </div>

      <div className="h-52 sm:h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                dy={15}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(value)
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#372660"
                strokeWidth={4}
                dot={{ r: 6, fill: "white", stroke: "#372660", strokeWidth: 3 }}
                activeDot={{
                  r: 8,
                  fill: "#372660",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-400">
            Chưa có dữ liệu thanh toán
          </div>
        )}
      </div>
    </div>
  );
}
