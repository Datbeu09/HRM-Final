import React from "react";

function resolveBadge(kindOrStatus) {
  const s = String(kindOrStatus || "").toLowerCase();

  if (s.includes("weekend") || s.includes("chủ nhật")) {
    return { text: "Cuối tuần", cls: "bg-slate-100 text-slate-700 border-slate-200" };
  }
  if (s.includes("present") || s.includes("đúng") || s.includes("làm")) {
    return { text: "Có mặt", cls: "bg-green-100 text-green-700 border-green-200" };
  }
  if (s.includes("leave") || s.includes("nghỉ")) {
    return { text: "Nghỉ phép", cls: "bg-slate-100 text-slate-700 border-slate-200" };
  }
  if (s.includes("absent") || s.includes("vắng")) {
    return { text: "Vắng", cls: "bg-rose-100 text-rose-700 border-rose-200" };
  }

  return { text: kindOrStatus || "—", cls: "bg-amber-100 text-amber-700 border-amber-200" };
}

export default function ATDStatusBadge({ kind, status }) {
  const { text, cls } = resolveBadge(kind || status);
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>
      {text}
    </span>
  );
}
