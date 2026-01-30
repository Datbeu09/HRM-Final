import React from "react";
import { formatVND } from "./payrollUtils";

function KPI({ title, value, primary, icon }) {
  return (
    <div
      className={`
        relative p-6 rounded-2xl border bg-white shadow-sm
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
        ${primary ? "border-primary/30 bg-primary/5" : "border-border"}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
          {title}
        </p>
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            primary ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </span>
      </div>

      <p className={`mt-2 text-3xl font-extrabold tabular-nums ${primary ? "text-primary" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

export default function PayrollKpiCards({ kpi }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <KPI icon="payments" title="Tổng quỹ lương (Gross)" value={formatVND(kpi.gross)} />
      <KPI icon="receipt_long" title="Tổng thuế TNCN" value={formatVND(kpi.tax)} />
      <KPI icon="health_and_safety" title="BHXH / BHYT" value={formatVND(kpi.ins)} />
      <KPI icon="verified_user" title="Thực lĩnh (Net Pay)" value={formatVND(kpi.net)} primary />
    </section>
  );
}
