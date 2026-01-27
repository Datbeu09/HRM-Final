import React from "react";

export default function FinanceStat({ title, value, icon, tone, hint }) {
  const toneMap = {
    primary: "text-primary bg-primary/10",
    warning: "text-orange-600 bg-orange-500/10",
    info: "text-blue-600 bg-blue-500/10",
  };

  return (
    <div className="relative bg-white p-6 rounded-2xl border shadow-sm hover:-translate-y-1 transition">
      <div
        className={`absolute right-5 top-5 w-12 h-12 rounded-xl flex items-center justify-center ${toneMap[tone]}`}
      >
        <span className="material-symbols-outlined text-[26px]">{icon}</span>
      </div>

      <p className="text-sm text-slate-500 pr-16">{title}</p>
      <h3 className="mt-1 text-3xl font-bold">{value}</h3>

      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
