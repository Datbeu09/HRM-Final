import React from "react";

export default function EditNoteModal({ open, value, onChange, onClose, onSave }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-icons-round text-primary">edit_note</span>
            Cập nhật ghi chú
          </h4>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Đóng"
          >
            <span className="material-icons-round text-slate-500">close</span>
          </button>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm outline-none focus:ring-2 focus:ring-teal-200"
          placeholder="Nhập ghi chú..."
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            Huỷ
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90"
            onClick={onSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
