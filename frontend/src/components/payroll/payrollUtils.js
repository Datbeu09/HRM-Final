export function labelMonth(ym) {
  const [y, m] = String(ym || "").split("-");
  if (!y || !m) return "";
  return `${m}/${y}`;
}

export function formatVND(n) {
  const s = Number(n || 0).toLocaleString("vi-VN");
  return `${s} ₫`;
}

// Chuẩn hoá employee row để render không bị undefined
export function normalizeEmployeeRow(r = {}) {
  return {
    employeeId: r.employeeId ?? r.employee_id ?? r.id ?? null,
    employeeCode: r.employeeCode ?? r.employee_code ?? r.code ?? "",
    name: r.name ?? r.fullName ?? r.full_name ?? "",
    netSalary: r.netSalary ?? r.net_salary ?? r.net ?? 0,
    raw: r,
  };
}

export function normalizeResponse(data) {
  const kpi = data?.kpi || { gross: 0, tax: 0, ins: 0, net: 0 };

  const list = Array.isArray(data?.employees)
    ? data.employees
    : Array.isArray(data?.rows)
    ? data.rows
    : Array.isArray(data?.data?.employees)
    ? data.data.employees
    : [];

  const employees = list.map(normalizeEmployeeRow);

  return { kpi, employees };
}
