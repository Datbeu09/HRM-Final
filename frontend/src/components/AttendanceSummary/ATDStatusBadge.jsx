import React from "react";

/**
 * Đồng bộ màu theo Legend:
 * - Có công: teal
 * - Không công / thiếu công / vắng: rose
 * - Nghỉ phép: amber
 * - Cuối tuần: slate (neutral)
 *
 * Không fix cứng enum, chỉ dựa vào keyword trong text.
 */

function resolveBadge(kindOrStatus) {
  const raw = String(kindOrStatus || "").trim();
  const s = raw.toLowerCase();

  // Cuối tuần
  if (
    s.includes("weekend") ||
    s.includes("cuối tuần") ||
    s.includes("chủ nhật") ||
    s.includes("thứ bảy")
  ) {
    return {
      text: raw || "Cuối tuần",
      dot: "bg-slate-400",
      cls: "bg-slate-50 text-slate-700 ring-slate-600/20",
    };
  }

  // Nghỉ phép
  if (s.includes("leave") || s.includes("nghỉ phép")) {
    return {
      text: raw || "Nghỉ phép",
      dot: "bg-amber-500",
      cls: "bg-amber-50 text-amber-700 ring-amber-600/20",
    };
  }

  // Không công / Thiếu công / Vắng
  if (
    s.includes("absent") ||
    s.includes("vắng") ||
    s.includes("không công") ||
    s.includes("thiếu công")
  ) {
    return {
      text: raw || "Không công",
      dot: "bg-rose-500",
      cls: "bg-rose-50 text-rose-700 ring-rose-600/20",
    };
  }

  // Mặc định coi là Có công (đúng giờ/đi muộn/về sớm/ca đêm/làm thêm giờ/...)
  return {
    text: raw || "Có công",
    dot: "bg-teal-500",
    cls: "bg-teal-50 text-teal-700 ring-teal-600/20",
  };
}

export default function ATDStatusBadge({ kind, status }) {
  // ✅ ƯU TIÊN status tiếng Việt (giàu thông tin hơn), kind chỉ là fallback
  const { text, cls, dot } = resolveBadge(status || kind);

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-2.5 py-1 rounded-full
        text-[11px] font-bold
        ring-1 ${cls}
        max-w-[170px]
      `}
      title={text}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <span className="truncate">{text}</span>
    </span>
  );
}