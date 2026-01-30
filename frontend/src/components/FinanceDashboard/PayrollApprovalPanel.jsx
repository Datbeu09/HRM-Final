import React from "react";
import PayrollApprovalRow from "./PayrollApprovalRow";


export default function PayrollApprovalPanel({ title, subtitle, items = [], onDetail }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>

      <div className="p-6 space-y-4">
        {items.map((it) => (
          <PayrollApprovalRow key={it.id} item={it} onDetail={onDetail} />
        ))}
      </div>
    </div>
  );
}
