import React from "react";

export default function FinanceKpiCard({ title, value, icon, iconWrap, iconColor }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>

      <div className={`w-16 h-12 rounded-lg flex items-center justify-center relative overflow-hidden ${iconWrap}`}>
        <span className={`material-icons-outlined ${iconColor}`}>{icon}</span>
        {/* viền overlay giống HTML */}
        <div className="absolute inset-0 border-2 border-white/50 dark:border-teal-900/50 rounded-lg" />
      </div>
    </div>
  );
}
