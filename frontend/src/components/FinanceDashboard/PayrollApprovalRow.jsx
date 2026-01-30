import React from "react";

export default function PayrollApprovalRow({ item, onDetail }) {
  if (item.status === "APPROVED") {
    return (
      <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-lg">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white opacity-60">
            {item.title}
          </h4>
          <p className="text-xs text-slate-400 mt-1">Đã duyệt</p>
        </div>

        <div className="flex items-center text-emerald-500 font-medium">
          <span className="material-icons-outlined text-sm mr-1.5">check</span>
          <span>Hoàn tất</span>
        </div>
      </div>
    );
  }

  // pending
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-lg hover:border-primary/30 transition-all">
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
        <p className="text-xs text-slate-400 mt-1">Chờ duyệt</p>
      </div>

      <div className="flex items-center gap-6">
        <span className="font-bold text-slate-900 dark:text-white">{item.amount}</span>

        <button
          onClick={() => onDetail?.(item.id)}
          className="bg-primary hover:bg-teal-600 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors"
        >
          Chi tiết
          <span className="material-icons-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
