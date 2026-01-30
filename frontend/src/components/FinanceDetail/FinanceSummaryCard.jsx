import React from "react";

function StatusPill({ status }) {
  const map = {
    PENDING: { label: "Chờ duyệt", wrap: "bg-amber-100 text-amber-600", dot: "bg-amber-500" },
    APPROVED: { label: "Đã duyệt", wrap: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
    REJECTED: { label: "Từ chối", wrap: "bg-rose-100 text-rose-700", dot: "bg-rose-500" },
  };

  const cfg = map[String(status || "PENDING").toUpperCase()] || map.PENDING;

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-2 ${cfg.wrap}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}


export default function FinanceSummaryCard({ summary }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
      <div className="space-y-1">
        <p className="text-sm text-slate-500 font-medium">Tổng thực chi phòng</p>
        <h3 className="text-3xl font-bold text-slate-900">{summary.total}</h3>
      </div>

      <div className="flex flex-col items-end gap-2">
        <StatusPill status={summary.status} />
        <p className="text-[11px] text-slate-400">Cập nhật: {summary.updatedAt}</p>
      </div>
    </div>
  );
}
