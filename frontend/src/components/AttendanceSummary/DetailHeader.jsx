import React from "react";

const pad2 = (n) => String(n).padStart(2, "0");

export default function DetailHeader({
  loading,
  error,
  month,
  year,
  empName,
  empCode,
  onBack,
  onExport,
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      {/* LEFT */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="mt-1 w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Quay lại"
        >
          <span className="material-icons-round text-slate-600 dark:text-slate-300">
            arrow_back
          </span>
        </button>

        <div>
          <h2 className="text-[20px] md:text-[22px] font-bold text-slate-900 dark:text-white leading-tight">
            Chi tiết chấm công
          </h2>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Nhân viên:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {loading ? "Đang tải..." : empName}
            </span>
            <span className="text-slate-400">•</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-medium">
              #{empCode}
            </span>
          </div>

          {error ? <div className="text-xs text-rose-600 mt-2">{error}</div> : null}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button
          className="h-10 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-zinc-200 border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          title="Chọn tháng"
          // bạn có thể thay bằng dropdown sau
          onClick={() => {}}
        >
          <span className="material-icons-round text-[18px] text-slate-400">
            calendar_month
          </span>
          <span>
            Tháng {pad2(month || 1)}/{year || "----"}
          </span>
          <span className="material-icons-round text-[18px] text-slate-400">
            expand_more
          </span>
        </button>

        <button
          onClick={onExport}
          className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold inline-flex items-center gap-2 shadow-sm hover:opacity-90 active:scale-[0.99] transition"
        >
          <span className="material-icons-round text-[18px]">file_download</span>
          Xuất báo cáo
        </button>
      </div>
    </div>
  );
}
