// finance.helpers.js

export function getCurrentYearMonth(tz = "Asia/Bangkok") {
  // Lấy YYYY-MM theo timezone (VN/Thailand đều UTC+7)
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;

  return `${y}-${m}`; // YYYY-MM
}

export function clampYearMonth(ym, minYM, maxYM) {
  const v = String(ym || "");
  if (!v) return minYM;

  if (minYM && v < minYM) return minYM;
  if (maxYM && v > maxYM) return maxYM;
  return v;
}

export function splitMonthYear(ym) {
  const [y, m] = String(ym || "").split("-");
  return { year: Number(y), month: Number(m) };
}

export function monthToLabel(ym) {
  if (!ym || !String(ym).includes("-")) return "—";
  const [y, m] = String(ym).split("-");
  return `${m}/${y}`;
}

export function toStatus(raw) {
  const s = String(raw || "").toUpperCase();
  if (["APPROVED", "PENDING", "REJECTED"].includes(s)) return s;
  return "PENDING";
}

export function formatVND(value) {
  if (value === null || value === undefined || value === "" || Number.isNaN(Number(value)))
    return "—";
  return `${Number(value).toLocaleString("vi-VN")} ₫`;
}

export function unwrapAxios(res) {
  const d = res?.data;
  if (!d) return null;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.data?.data)) return d.data.data;
  if (d?.success && d?.data !== undefined) return d.data;
  return d;
}
