import React from "react";
import FinanceKpiCard from "./FinanceKpiCard";


export default function FinanceKpis({ items = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((x, idx) => (
        <FinanceKpiCard key={idx} {...x} />
      ))}
    </div>
  );
}
