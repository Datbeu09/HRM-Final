// src/services/payrollApproval.service.js
const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

/* ================= Helpers ================= */

function parseMonthYear(monthStr) {
  if (!monthStr) throw new ApiError(400, "month is required (YYYY-MM)");
  const m = String(monthStr).match(/^(\d{4})-(\d{2})$/);
  if (!m) throw new ApiError(400, "month must be in YYYY-MM format");

  const year = Number(m[1]);
  const month = Number(m[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    throw new ApiError(400, "invalid month/year");
  }
  return { month, year, monthStr: `${year}-${String(month).padStart(2, "0")}` };
}

function toInt01(v) {
  return v ? 1 : 0;
}

function normStr(v) {
  return String(v ?? "").trim();
}

function hasText(v) {
  return normStr(v).length > 0;
}

// robust filter department
function buildDepartmentWhere({ department }) {
  if (!hasText(department)) return { where: "", params: [] };

  // so khớp chuẩn: TRIM + LOWER
  return {
    where: " AND LOWER(TRIM(e.department)) = LOWER(TRIM(?)) ",
    params: [normStr(department)],
  };
}

function safeNumber(n) {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? v : 0;
}

function calcGross(row) {
  // gross = base + totalAllowances
  return safeNumber(row.baseSalary) + safeNumber(row.totalAllowances);
}

/* ================= Service ================= */

module.exports = {
  parseMonthYear,

  /**
   * GET Payroll Approval (FULL nhân viên theo phòng ban)
   * - Luôn trả danh sách employee theo department
   * - LEFT JOIN monthlysalary theo month/year
   * - Nếu chưa có lương => status = "Missing", các số = 0
   */
  async getPayrollApproval({ monthStr, department }) {
    const { month, year } = parseMonthYear(monthStr);
    const dep = buildDepartmentWhere({ department });

    const params = [month, year, ...dep.params];

    // ✅ Luôn lấy full employee trước, rồi LEFT JOIN monthlysalary
    const [rows] = await pool.query(
      `
      SELECT
        e.id AS employeeId,
        e.employeeCode,
        e.name,
        e.department,

        ms.id,
        ms.employeeType,
        ms.salaryGradeId,
        ms.applicableRate,
        ms.baseSalary,
        ms.totalAllowances,
        ms.totalInsurance,
        ms.agreedSalary,
        ms.totalDaysWorked,
        ms.netSalary,
        ms.locked,
        ms.status,
        ms.approvedByAccountId,
        ms.approvedAt,
        ms.created_at,
        ms.updated_at
      FROM employees e
      LEFT JOIN monthlysalary ms
        ON ms.employeeId = e.id
       AND ms.month = ?
       AND ms.year = ?
      WHERE 1=1
        ${dep.where}
      ORDER BY e.employeeCode ASC
      `,
      params
    );

    // KPI
    let gross = 0;
    let ins = 0;
    let net = 0;

    for (const r of rows) {
      // chỉ cộng KPI cho người có monthlysalary
      if (r.id != null) {
        const g = calcGross(r);
        gross += g;
        ins += safeNumber(r.totalInsurance);
        net += safeNumber(r.netSalary);
      }
    }

    let tax = gross - net - ins;
    if (tax < 0) tax = 0;

    const employees = (rows || []).map((r) => {
      const hasSalary = r.id != null;

      return {
        id: hasSalary ? r.id : null, // monthlysalary id
        employeeId: r.employeeId,
        employeeCode: r.employeeCode,
        name: r.name,
        department: r.department,

        employeeType: hasSalary ? (r.employeeType ?? null) : null,
        salaryGradeId: hasSalary ? (r.salaryGradeId ?? null) : null,
        applicableRate: hasSalary ? (r.applicableRate ?? null) : null,

        baseSalary: hasSalary ? safeNumber(r.baseSalary) : 0,
        totalAllowances: hasSalary ? safeNumber(r.totalAllowances) : 0,
        totalInsurance: hasSalary ? safeNumber(r.totalInsurance) : 0,

        agreedSalary: hasSalary ? safeNumber(r.agreedSalary) : 0, // giữ field cũ nếu FE cần
        grossSalary: hasSalary ? calcGross(r) : 0, // ✅ field mới (chuẩn)

        totalDaysWorked: hasSalary ? safeNumber(r.totalDaysWorked) : 0,
        netSalary: hasSalary ? safeNumber(r.netSalary) : 0,

        locked: toInt01(hasSalary ? r.locked : 0),

        // ✅ Nếu chưa có bảng lương -> Missing
        status: hasSalary ? (r.status || "Pending") : "Missing",

        approvedByAccountId: hasSalary ? (r.approvedByAccountId ?? null) : null,
        approvedAt: hasSalary ? (r.approvedAt ?? null) : null,
        created_at: hasSalary ? (r.created_at ?? null) : null,
        updated_at: hasSalary ? (r.updated_at ?? null) : null,
      };
    });

    return {
      month,
      year,
      department: hasText(department) ? normStr(department) : null,
      kpi: { gross, tax, ins, net },
      employees,
      meta: {
        count: employees.length,
        note: "FULL employees by department (LEFT JOIN monthlysalary). Missing rows included.",
      },
    };
  },

  /**
   * POST Auto-check
   * - So sánh monthlysalary.totalDaysWorked vs monthlyattendance.totalDaysWorked
   */
  async autoCheck({ monthStr, department }) {
    const { month, year } = parseMonthYear(monthStr);
    const dep = buildDepartmentWhere({ department });

    const params = [month, year, ...dep.params];

    const [rows] = await pool.query(
      `
      SELECT
        e.id AS employeeId,
        e.employeeCode,
        e.name,
        e.department,
        ms.totalDaysWorked AS salaryDaysWorked,
        ma.totalDaysWorked AS attendanceDaysWorked
      FROM employees e
      LEFT JOIN monthlysalary ms
        ON ms.employeeId = e.id
       AND ms.month = ?
       AND ms.year = ?
      LEFT JOIN monthlyattendance ma
        ON ma.employeeId = e.id
       AND ma.month = ?
       AND ma.year = ?
      WHERE 1=1
        ${dep.where}
      ORDER BY e.employeeCode ASC
      `,
      [month, year, month, year, ...dep.params]
    );

    const details = (rows || []).map((r) => {
      const hasSalary = r.salaryDaysWorked !== null && r.salaryDaysWorked !== undefined;

      // Nếu chưa có lương thì coi như không check sai
      if (!hasSalary) {
        return {
          employeeCode: r.employeeCode,
          name: r.name,
          employeeId: r.employeeId,
          ok: true,
          note: "Chưa có monthlysalary (bỏ qua kiểm tra)",
          salaryDaysWorked: null,
          attendanceDaysWorked: r.attendanceDaysWorked === null ? null : safeNumber(r.attendanceDaysWorked),
        };
      }

      const salaryDays = safeNumber(r.salaryDaysWorked);
      const attDays = r.attendanceDaysWorked === null ? null : safeNumber(r.attendanceDaysWorked);

      let ok = true;
      let note = "OK";

      if (attDays === null) {
        ok = false;
        note = "Chưa có dữ liệu chấm công (monthlyattendance)";
      } else if (salaryDays !== attDays) {
        ok = false;
        note = `Sai lệch totalDaysWorked: salary=${salaryDays}, attendance=${attDays}`;
      }

      return {
        employeeCode: r.employeeCode,
        name: r.name,
        employeeId: r.employeeId,
        ok,
        note,
        salaryDaysWorked: salaryDays,
        attendanceDaysWorked: attDays,
      };
    });

    const allOk = details.length === 0 ? true : details.every((x) => x.ok);

    return {
      month,
      year,
      department: hasText(department) ? normStr(department) : null,
      allOk,
      summary: {
        total: details.length,
        ok: details.filter((x) => x.ok).length,
        notOk: details.filter((x) => !x.ok).length,
      },
      details,
    };
  },

  /**
   * POST Approve
   */
  async approve({ monthStr, department, approvedByAccountId }) {
    const { month, year } = parseMonthYear(monthStr);
    if (!approvedByAccountId) throw new ApiError(400, "approvedByAccountId is required");

    const dep = buildDepartmentWhere({ department });
    const params = [approvedByAccountId, month, year, ...dep.params];

    const [result] = await pool.query(
      `
      UPDATE monthlysalary ms
      JOIN employees e ON e.id = ms.employeeId
      SET ms.status = 'Đã duyệt',
          ms.locked = 1,
          ms.approvedByAccountId = ?,
          ms.approvedAt = NOW(),
          ms.updated_at = NOW()
      WHERE ms.month = ?
        AND ms.year = ?
        ${dep.where}
      `,
      params
    );

    return { updated: result.affectedRows };
  },

  /**
   * POST Request Edit
   */
  async requestEdit({ monthStr, department, employeeId, reason, createdByAccountId }) {
    const { month, year, monthStr: monthKey } = parseMonthYear(monthStr);

    if (!hasText(reason)) throw new ApiError(400, "reason is required");

    const depPart = hasText(department) ? `|${normStr(department)}` : "";
    const finalReason = `[${monthKey}${depPart}] ${normStr(reason)}`;

    const history = [
      {
        at: new Date().toISOString(),
        action: "REQUEST_EDIT",
        byAccountId: createdByAccountId ?? null,
        note: finalReason,
        employeeId: employeeId ?? null,
      },
    ];

    const [ins] = await pool.query(
      `
      INSERT INTO approvals
        (employeeId, type, reason, startDate, endDate, status, createdAt, history, created_at, updated_at)
      VALUES
        (?, 'duyet_luong', ?, NULL, NULL, 'Chờ duyệt', NOW(), ?, NOW(), NOW())
      `,
      [employeeId ?? null, finalReason, JSON.stringify(history)]
    );

    return { id: ins.insertId, month, year };
  },
};
