
import React, { useEffect } from "react";

export default function Toast({ open, message, type = "error", duration = 2500, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const styleByType = {
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    info: "border-sky-200 bg-sky-50 text-sky-700",
  };

  return (
    <div className="fixed top-5 right-5 z-[9999]">
      <div className={`min-w-[280px] max-w-[420px] rounded-xl border px-4 py-3 shadow-lg ${styleByType[type]}`}>
        <div className="flex items-start gap-3">
          <div className="flex-1 text-sm font-semibold">{message}</div>
          <button
            type="button"
            onClick={onClose}
            className="text-lg leading-none opacity-70 hover:opacity-100"
            aria-label="close toast"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
