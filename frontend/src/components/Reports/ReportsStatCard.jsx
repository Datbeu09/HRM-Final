import React from "react";

export default function ReportsStatCard({ title, value, highlight = false }) {
  return (
    <div
      className={`p-4 border rounded-xl bg-white shadow-sm transition
        ${highlight
          ? "border-primary shadow-md"
          : "border-slate-200 hover:border-primary hover:shadow-lg"}
      `}
    >
      <p className="text-xs uppercase text-slate-500 font-medium tracking-wide">
        {title}
      </p>

      <p
        className={`text-2xl font-bold mt-1
          ${highlight ? "text-primary" : "text-slate-800"}
        `}
      >
        {value}
      </p>
    </div>
  );
}
