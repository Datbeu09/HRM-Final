import React from "react";

export default function PayrollToolbar({
  q,
  setQ,
  sort,
  setSort,
  onSendEmail,
  onExportFile,
  onApprove,
  loading,
  submitting,
  disableApprove,
}) {
  return (
    <section className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between px-4 py-3 bg-white border border-border rounded-xl shadow-sm">
      <div className="flex-1 flex gap-3">
        {/* Input tìm kiếm */}
        <div className="flex items-center gap-2 px-4 h-11 rounded-xl border border-border bg-white w-full lg:max-w-md">
          <span className="material-symbols-outlined text-slate-500 text-[18px]">
            search
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo mã NV hoặc họ tên..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        {/* sort hiện chưa dùng - giữ prop cho tương lai */}
        {/* <div>Sort: {sort}</div> */}
      </div>

      {/* Các nút hành động */}
      <div className="flex gap-2 mt-3 lg:mt-0">
        <button
          onClick={onSendEmail}
          disabled={loading || submitting}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          Gửi phiếu lương
        </button>

        <button
          onClick={onExportFile}
          disabled={loading || submitting}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-red-200 text-red-600 bg-white text-sm font-semibold hover:bg-red-50 transition disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">file_download</span>
          Xuất file
        </button>

        <button
          onClick={onApprove}
          disabled={loading || submitting || disableApprove}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Chốt bảng lương
        </button>
      </div>
    </section>
  );
}