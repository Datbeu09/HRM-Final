// src/components/ApprovalsEmployee/AddRequestForm.jsx
import React, { useMemo } from "react";

const TYPES = ["Đi muộn", "Về sớm", "Nghỉ phép", "Làm thêm giờ", "Công tác"];

export default function AddRequestForm({ request, onChange, onSubmit, onClose }) {
  const canSubmit = useMemo(() => {
    const type = (request?.type ?? "").trim();
    const reason = (request?.reason ?? "").trim();
    const startDate = request?.startDate ?? "";
    const endDate = request?.endDate ?? "";
    return Boolean(type && reason && startDate && endDate);
  }, [request]);

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5"
      noValidate
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Tạo yêu cầu mới
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>

      {/* Loại yêu cầu */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500">Loại yêu cầu</label>

        <select
          name="type"
          value={request?.type ?? ""}
          onChange={onChange}
          required
          className="
            w-full rounded-lg
            border border-slate-200 dark:border-slate-700
            bg-white dark:bg-slate-800
            px-4 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-teal-600/30
          "
        >
          <option value="" disabled>
            -- Chọn loại yêu cầu --
          </option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Ngày */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Từ ngày</label>
          <input
            type="date"
            name="startDate"
            value={request?.startDate ?? ""}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Đến ngày</label>
          <input
            type="date"
            name="endDate"
            value={request?.endDate ?? ""}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30"
          />
        </div>
      </div>

      {/* Lý do */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500">Lý do</label>
        <textarea
          name="reason"
          placeholder="Nhập lý do..."
          value={request?.reason ?? ""}
          onChange={onChange}
          rows={4}
          required
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-600/30"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          Huỷ
        </button>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition shadow-sm
            ${
              canSubmit
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
        >
          Gửi yêu cầu
        </button>
      </div>
    </form>
  );
}
