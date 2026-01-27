import React from "react";

export default function FinanceMonthPicker({ value, onChange, min, max, title = "Chọn tháng" }) {
  return (
    <label
      className="
        flex items-center gap-2
        px-4 h-11 rounded-xl
        border border-border bg-white
        text-sm font-semibold text-slate-700
        hover:border-primary/40 transition
      "
      title={title}
    >
      <span className="material-symbols-outlined text-[18px] text-slate-500">
        calendar_month
      </span>

      <input
        type="month"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm font-semibold text-slate-700 cursor-pointer"
      />
    </label>
  );
}
