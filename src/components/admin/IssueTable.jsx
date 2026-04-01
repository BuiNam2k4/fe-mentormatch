import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { disputeService } from "../../services/disputeService";

export default function IssueTable() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await disputeService.getAllDisputes({ page: 0, size: 5 });
        if (res.code === 1000) {
          setDisputes(
            (res.result.content || []).filter((d) => d.status === "PENDING"),
          );
        }
      } catch (err) {
        console.error("Failed to fetch disputes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      <div className="p-4 sm:p-6 flex items-center justify-between gap-3 border-b border-slate-50">
        <h2 className="text-sm sm:text-base font-bold text-slate-800">
          Danh sách Khiếu nại đang chờ xử lý
        </h2>
        <button
          onClick={() => navigate("/admin/disputes")}
          className="shrink-0 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#372660] transition-colors"
        >
          Xem tất cả khiếu nại
        </button>
      </div>

      <div className="p-4 space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            Đang tải...
          </div>
        ) : disputes.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            Không có khiếu nại nào đang chờ xử lý
          </div>
        ) : (
          disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="rounded-xl border border-slate-100 p-4 bg-white space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">ID Ca học</p>
                  <p className="text-sm font-bold text-slate-800">
                    #{dispute.bookingId}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/disputes")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#372660] text-white hover:bg-[#2b1d4c] transition-colors"
                >
                  Xử lý
                </button>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Người khiếu nại</p>
                <p className="text-sm font-medium text-slate-700">
                  {dispute.creatorName || `User #${dispute.creatorId}`}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Lý do</p>
                <p className="text-sm text-slate-600 line-clamp-3">
                  {dispute.reason}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">ID Ca Học</th>
              <th className="px-6 py-4 font-bold">Người Khiếu Nại</th>
              <th className="px-6 py-4 font-bold">Lý Do</th>
              <th className="px-6 py-4 font-bold text-right">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  Đang tải...
                </td>
              </tr>
            ) : disputes.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  Không có khiếu nại nào đang chờ xử lý
                </td>
              </tr>
            ) : (
              disputes.map((dispute) => (
                <tr
                  key={dispute.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-5 text-sm font-semibold text-slate-700 whitespace-nowrap">
                    #{dispute.bookingId}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {(dispute.creatorName || "??")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {dispute.creatorName || `User #${dispute.creatorId}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 max-w-md">
                    {dispute.reason?.length > 80
                      ? dispute.reason.substring(0, 80) + "..."
                      : dispute.reason}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button
                      onClick={() => navigate("/admin/disputes")}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-[#372660] text-white hover:bg-[#2b1d4c] transition-colors"
                    >
                      Xử lý
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
