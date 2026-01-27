import React from "react";

const TYPE_OPTIONS = ["Đi muộn", "Về sớm", "Nghỉ phép", "Làm thêm giờ", "Công tác"];

// BE của bạn có thể trả: Pending/Approved/Rejected hoặc VN: Chờ duyệt/Đã duyệt/Từ chối
const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "Pending", label: "Chờ duyệt" },
  { value: "Approved", label: "Đã duyệt" },
  { value: "Rejected", label: "Từ chối" },
];

export default function ApprovalsFilterBar({
  filters,
  onChange,
  onReset,
  className = "",
}) {
  const { type = "ALL", status = "ALL", q = "" } = filters || {};

  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-end ${className}`}
    >
      {/* Search */}
      <div className="flex-1">
        <label className="text-xs font-semibold text-slate-500">Tìm kiếm</label>
        <input
          value={q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Tìm theo lý do / tên nhân viên..."
          className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-teal-600/30"
        />
      </div>

      {/* Type */}
      <div className="w-full md:w-56">
        <label className="text-xs font-semibold text-slate-500">Loại yêu cầu</label>
        <select
          value={type}
          onChange={(e) => onChange({ type: e.target.value })}
          className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-teal-600/30"
        >
          <option value="ALL">Tất cả</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="w-full md:w-56">
        <label className="text-xs font-semibold text-slate-500">Trạng thái</label>
        <select
          value={status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-teal-600/30"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
