import React from "react";

export default function FinanceStructureCard({ structure }) {
  const salary = structure?.salary ?? 70;
  const bonus = structure?.bonus ?? 20;
  const deduction = structure?.deduction ?? 10;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h4 className="text-sm font-bold mb-6">Cơ cấu quỹ lương</h4>

      <div className="flex flex-col gap-6">
        <div className="w-full h-8 flex rounded-lg overflow-hidden">
          <div className="bg-primary h-full" style={{ width: `${salary}%` }} />
          <div className="bg-amber-400 h-full" style={{ width: `${bonus}%` }} />
          <div className="bg-red-400 h-full" style={{ width: `${deduction}%` }} />
        </div>

        <div className="flex flex-col space-y-2">
          <LegendRow color="bg-primary" label="Lương" value={`${salary}%`} />
          <LegendRow color="bg-amber-400" label="Thưởng" value={`${bonus}%`} />
          <LegendRow color="bg-red-400" label="Khấu trừ" value={`${deduction}%`} />
        </div>
      </div>
    </div>
  );
}

function LegendRow({ color, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={["w-2 h-2 rounded-full", color].join(" ")} />
        <span className="text-[11px] text-slate-500">{label}</span>
      </div>
      <span className="text-[11px] font-bold">{value}</span>
    </div>
  );
}
