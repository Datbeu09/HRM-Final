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
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800">Tạo yêu cầu mới</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          aria-label="Đóng"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
      </div>

      {/* Loại yêu cầu */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Loại yêu cầu</label>
        <select
          name="type"
          value={request?.type ?? ""}
          onChange={onChange}
          required
          className="
            w-full px-4 py-2.5 text-sm rounded-xl
            border border-gray-200 bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
          <input
            type="date"
            name="startDate"
            value={request?.startDate ?? ""}
            onChange={onChange}
            required
            className="
              w-full px-4 py-2.5 text-sm rounded-xl
              border border-gray-200 bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            "
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
          <input
            type="date"
            name="endDate"
            value={request?.endDate ?? ""}
            onChange={onChange}
            required
            className="
              w-full px-4 py-2.5 text-sm rounded-xl
              border border-gray-200 bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            "
          />
        </div>
      </div>

      {/* Lý do */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Lý do</label>
        <textarea
          name="reason"
          placeholder="Nhập lý do..."
          value={request?.reason ?? ""}
          onChange={onChange}
          rows={4}
          required
          className="
            w-full px-4 py-2.5 text-sm rounded-xl resize-none
            border border-gray-200 bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          "
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Hủy
        </button>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`px-4 py-2 rounded-md text-white
            ${canSubmit ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Gửi yêu cầu
        </button>
      </div>
    </form>
  );
}
