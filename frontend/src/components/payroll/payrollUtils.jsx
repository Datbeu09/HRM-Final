// src/components/payroll/payrollUtils.js

export function formatVND(n) {
  const v = Number(n ?? 0);
  return v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export function labelMonth(ym) {
  // ym: YYYY-MM
  if (!ym) return "";
  const [y, m] = String(ym).split("-");
  return `${m}/${y}`;
}

export function normalizeResponse(data) {
  // backend trả: {month, year, departmentId, kpi, employees}
  const employees = Array.isArray(data?.employees) ? data.employees : [];
  const kpi = data?.kpi || { gross: 0, tax: 0, ins: 0, net: 0 };

  return { employees, kpi };
}