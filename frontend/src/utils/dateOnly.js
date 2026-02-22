// src/utils/dateOnly.js

// YYYY-MM-DD ?
export const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || "").trim());

// dd/mm/yyyy ?
export const isDMY = (s) => /^\d{2}\/\d{2}\/\d{4}$/.test(String(s || "").trim());

// Convert any date-ish value -> "YYYY-MM-DD" (date-only, tránh lệch timezone)
export const toYMD = (val) => {
  if (!val) return "";

  // If Date object
  if (val instanceof Date && !Number.isNaN(val.getTime())) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, "0");
    const d = String(val.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const s = String(val).trim();

  // ISO "2026-01-20T00:00:00.000Z" -> "2026-01-20"
  if (s.includes("T")) {
    const head = s.split("T")[0];
    return isYMD(head) ? head : "";
  }

  // already YMD
  if (isYMD(s)) return s;

  // DMY -> YMD
  if (isDMY(s)) {
    const [dd, mm, yyyy] = s.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }

  // fallback: try parse safely (last resort)
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return toYMD(d);

  return "";
};

export const formatDMY = (val) => {
  const ymd = toYMD(val);
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
};

export const formatRangeDMY = (start, end) => {
  const s = formatDMY(start);
  const e = formatDMY(end);
  if (s && e) return `${s} → ${e}`;
  if (s) return s;
  if (e) return e;
  return "";
};