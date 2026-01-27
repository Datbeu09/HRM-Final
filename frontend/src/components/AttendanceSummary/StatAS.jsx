import React from "react";
export default function StatAS({ title, value, icon, danger }) {
  return (
    <div
      className={`
        relative bg-white p-6 rounded-2xl
        border shadow-sm transition
        hover:-translate-y-1 hover:shadow-lg
        ${danger ? "border-orange-400" : "border-[#E2E8F0]"}
      `}
    >
      <div className="absolute right-5 top-5 w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100">
        <span className="material-symbols-outlined text-[26px]">
          {icon}
        </span>
      </div>

      <p className="text-sm text-slate-500 pr-16">{title}</p>
      <h3 className="mt-1 text-3xl font-bold">{value}</h3>
    </div>
  );
}
