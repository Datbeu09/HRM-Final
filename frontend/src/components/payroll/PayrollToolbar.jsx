import React from "react";

export default function PayrollToolbar({
  q,
  setQ,
  onExportFile,
  onApprove,
  loading,
  submitting,
  disableApprove,
  isApproved = false,
  isAdmin = false,
}) {
  const approveLabel = isApproved ? "Mở khóa bảng lương" : "Chốt bảng lương";

  // ✅ Nếu đã chốt mà không phải admin => disable
  const approveDisabled =
    loading || submitting || disableApprove || (isApproved && !isAdmin);

  return (
    <section className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between px-4 py-3 bg-white border border-border rounded-xl shadow-sm">
      <div className="flex-1 flex gap-3">
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
      </div>

      <div className="flex gap-2 mt-3 lg:mt-0">
        <button
          onClick={onExportFile}
          disabled={loading || submitting}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-red-200 text-red-600 bg-white text-sm font-semibold hover:bg-red-50 transition disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">
            file_download
          </span>
          Xuất Excel tổng tháng
        </button>

        <button
          onClick={onApprove}
          disabled={approveDisabled}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
          title={
            isApproved && !isAdmin
              ? "Chỉ ADMIN mới có quyền mở khóa bảng lương"
              : ""
          }
        >
          <span className="material-symbols-outlined text-[18px]">
            {isApproved ? "lock_open" : "check_circle"}
          </span>
          {approveLabel}
        </button>
      </div>
    </section>
  );
}