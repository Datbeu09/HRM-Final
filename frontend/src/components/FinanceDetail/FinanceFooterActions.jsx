import React from "react";

export default function FinanceFooterActions({ onRequestEdit, onExport, onApprove }) {
  return (
    <footer className=" bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 px-8 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
      <div className="flex gap-3">
        <button
          onClick={onRequestEdit}
          className="px-5 py-2.5 text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2"
        >
          <span className="material-icons-outlined text-lg">edit_note</span>
          Yêu cầu chỉnh sửa
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onExport}
          className="px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2"
        >
          <span className="material-icons-outlined text-lg">file_download</span>
          Xuất file (PDF/Excel)
        </button>

        <button
          onClick={onApprove}
          className="px-8 py-2.5 text-sm font-bold text-white bg-primary hover:bg-teal-700 rounded-lg shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
        >
          <span className="material-icons-outlined text-lg">check_circle</span>
          Phê duyệt bảng lương
        </button>
      </div>
    </footer>
  );
}
