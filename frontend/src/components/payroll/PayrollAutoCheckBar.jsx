import React from "react";

export default function PayrollAutoCheckBar({ checkState }) {
  if (!checkState) return null;

  return (
    <div className="px-6 py-4 border border-border rounded-2xl bg-slate-50">
      <div className="text-sm font-semibold text-slate-700">
        Auto-check: {checkState.allOk ? "✅ OK" : "⚠️ Có lỗi"}{" "}
        <span className="ml-2 text-xs text-slate-500">
          (OK: {checkState.summary?.ok} / Tổng: {checkState.summary?.total})
        </span>
      </div>
    </div>
  );
}
