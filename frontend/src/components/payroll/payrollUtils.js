// src/components/payroll/payrollUtils.js

/* ================= Formatters ================= */

// Giữ logic labelMonth của bạn (split "-") + tăng độ an toàn
export function labelMonth(ym) {
  const [y, m] = String(ym || "").split("-");
  if (!y || !m) return ym || "";
  return `${m}/${y}`;
}

// Giữ logic formatVND của bạn
export function formatVND(n) {
  const s = Number(n || 0).toLocaleString("vi-VN");
  return `${s} ₫`;
}

/* ================= Helpers ================= */

const toNum = (v) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const normStatus = (s) => String(s || "").trim();

/**
 * ✅ Chuẩn hoá employee row để render không bị undefined
 * - Giữ nguyên logic fallback field của bạn (employeeId/employeeCode/name/netSalary/raw)
 * - Mở rộng thêm các field payroll để không bị rơi dữ liệu (departmentId, baseSalary, allowances...)
 */
export function normalizeEmployeeRow(r = {}) {
  // Giữ nguyên fallback cũ của bạn
  const employeeId = r.employeeId ?? r.employee_id ?? r.id ?? null;
  const employeeCode = r.employeeCode ?? r.employee_code ?? r.code ?? "";
  const name = r.name ?? r.fullName ?? r.full_name ?? "";

  // Mở rộng cho payroll table (không phá logic cũ)
  const departmentId =
    r.departmentId ?? r.department_id ?? r.depId ?? r.dep_id ?? null;

  const departmentName =
    r.departmentName ??
    r.department_name ??
    r.department ??
    r.depName ??
    r.dep_name ??
    "";

  const baseSalary = toNum(
    r.baseSalary ?? r.basicSalary ?? r.base_salary ?? r.basic_salary
  );

  const totalAllowances = toNum(
    r.totalAllowances ??
      r.allowanceBonus ??
      r.allowances ??
      r.total_allowances ??
      r.totalAllowance ??
      r.total_allowance
  );

  const totalInsurance = toNum(
    r.totalInsurance ?? r.insurance ?? r.total_insurance ?? r.totalInsuranceAmount
  );

  const grossSalary = toNum(
    r.grossSalary ??
      r.gross ??
      r.gross_salary ??
      (baseSalary + totalAllowances)
  );

  const totalDaysWorked = toNum(
    r.totalDaysWorked ?? r.workingDays ?? r.workDays ?? r.days ?? r.total_days_worked
  );

  // netSalary giữ fallback của bạn + mở rộng alias
  const netSalary = toNum(
    r.netSalary ?? r.net_salary ?? r.net ?? r.netPay ?? r.net_pay
  );

  const locked = !!(r.locked ?? r.isLocked ?? r.is_locked);

  // status: giữ trim + fallback
  const status = normStatus(r.status ?? r.salaryStatus ?? r.salary_status ?? "");

  return {
    employeeId,
    employeeCode,
    name,

    departmentId,
    departmentName,

    baseSalary,
    totalAllowances,
    totalInsurance,
    grossSalary,
    totalDaysWorked,
    netSalary,

    locked,
    status,

    // ✅ giữ raw như bạn
    raw: r,
  };
}

/**
 * ✅ normalizeResponse
 * - Giữ logic của bạn: lấy list từ employees / rows / data.employees
 * - Đồng thời trả full meta (month/year/departmentId) như bản mới
 */
export function normalizeResponse(data) {
  // ✅ KPI giữ logic của bạn
  const kpi0 = data?.kpi || { gross: 0, tax: 0, ins: 0, net: 0 };

  // ✅ Giữ logic list extraction của bạn (nhiều shape)
  const list = Array.isArray(data?.employees)
    ? data.employees
    : Array.isArray(data?.rows)
    ? data.rows
    : Array.isArray(data?.data?.employees)
    ? data.data.employees
    : [];

  const employees = (list || []).map(normalizeEmployeeRow);

  // ✅ Giữ bản mới: month/year/departmentId (không phá bản cũ vì chỉ thêm field)
  const month = data?.month ?? data?.data?.month;
  const year = data?.year ?? data?.data?.year;
  const departmentId = data?.departmentId ?? data?.data?.departmentId ?? null;

  return {
    month,
    year,
    departmentId,

    kpi: {
      gross: toNum(kpi0.gross),
      tax: toNum(kpi0.tax),
      ins: toNum(kpi0.ins),
      net: toNum(kpi0.net),
    },

    employees,
  };
}