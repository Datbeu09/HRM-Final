import React from "react";
import FinanceStatusBadge from "./FinanceStatusBadge";

function formatVND(v) {
  if (v === null || v === undefined || v === "" || Number.isNaN(Number(v))) return "—";
  return `${Number(v).toLocaleString("vi-VN")} ₫`;
}

export default function FinancePayrollItem({
  month,
  dept,
  amount,     // number hoặc string số
  status,
  onClickDetail,
  onQuickView, // optional
}) {
  const isDone = status === "APPROVED";

  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-3 rounded-xl border px-4 py-4
        transition-all duration-200
        ${isDone
          ? "bg-slate-50/60"
          : "bg-white hover:bg-slate-50 hover:shadow-sm hover:border-primary/30"}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center
            ${isDone ? "bg-green-500/10 text-green-700" : "bg-orange-500/10 text-orange-700"}
          `}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDone ? "verified" : "pending_actions"}
          </span>
        </div>

        <div>
          <p className="font-semibold text-slate-900">
            Tháng {month} – {dept}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <FinanceStatusBadge status={status} />
            <span className="text-xs text-slate-500">Cập nhật: hôm nay</span>
          </div>
        </div>
      </div>

      {!isDone ? (
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-slate-900 tabular-nums">
            {formatVND(amount)}
          </p>

          <div className="mt-2 flex gap-2 sm:justify-end">
            <button
              onClick={onQuickView}
              className="
                inline-flex items-center gap-2
                px-3 h-9 rounded-xl
                border border-border
                bg-white text-slate-700 text-xs font-semibold
                hover:bg-slate-50 transition
              "
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              Xem nhanh
            </button>

            <button
              onClick={onClickDetail}
              className="
                inline-flex items-center gap-2
                px-4 h-9 rounded-xl
                bg-primary text-white text-xs font-semibold
                transition hover:bg-primary/90 hover:shadow-md
              "
            >
              Chi tiết duyệt
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-semibold text-green-700">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Hoàn tất
        </div>
      )}
    </div>
  );
}
