import React from "react";

export default function FinanceChip({ icon, text, active, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 h-9 rounded-xl border text-xs font-semibold transition ${
        disabled
          ? "opacity-60 cursor-not-allowed bg-white text-slate-400"
          : active
          ? "bg-primary/10 text-primary border-primary/30"
          : "bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
      {text}
    </button>
  );
}
