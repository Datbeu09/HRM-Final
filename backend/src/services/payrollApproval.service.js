// src/services/payrollApproval.service.js
const pool = require("../config/db");
const ApiError = require("../utils/ApiError");
const ExcelJS = require("exceljs");

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

function normStr(v) {
  return String(v ?? "").trim();
}
function hasText(v) {
  return normStr(v).length > 0;
}

function normalizeDepartmentId(v) {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v === "object") return null;
  const n = Number(String(v).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function buildDepartmentWhere({ department }) {
  const depId = normalizeDepartmentId(department);
  if (!depId) return { where: "", params: [], depId: null };

  return {
    where: " AND e.departmentId = ? ",
    params: [depId],
    depId,
  };
}

function safeNumber(n) {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? v : 0;
}

function calcGross(row) {
  return safeNumber(row.baseSalary) + safeNumber(row.totalAllowances);
}

function toInt01(v) {
  return v ? 1 : 0;
}

/* ================= Core fetch (shared) ================= */

async function fetchApprovalRows({ monthStr, department }) {
  const { month, year } = parseMonthYear(monthStr);
  const dep = buildDepartmentWhere({ department });

  const params = [month, year, ...dep.params];

  const [rows] = await pool.query(
    `
    SELECT
      e.id AS employeeId,
      e.employeeCode,
      e.name,
      e.departmentId,
      d.departmentName AS departmentName,

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
    LEFT JOIN departments d
      ON d.id = e.departmentId
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

  return { rows: rows || [], month, year, depId: dep.depId };
}

/* ================= Build response object ================= */

function buildApprovalResponse({ rows, month, year, depId }) {
  // KPI
  let gross = 0;
  let ins = 0;
  let net = 0;

  for (const r of rows) {
    if (r.id != null) {
      gross += calcGross(r);
      ins += safeNumber(r.totalInsurance);
      net += safeNumber(r.netSalary);
    }
  }

  let tax = gross - net - ins;
  if (tax < 0) tax = 0;

  const employees = rows.map((r) => {
    const hasSalary = r.id != null;

    return {
      id: hasSalary ? r.id : null, // monthlysalary id
      employeeId: r.employeeId,
      employeeCode: r.employeeCode,
      name: r.name,

      departmentId: r.departmentId ?? null,
      departmentName: r.departmentName ?? "N/A",

      employeeType: hasSalary ? (r.employeeType ?? null) : null,
      salaryGradeId: hasSalary ? (r.salaryGradeId ?? null) : null,
      applicableRate: hasSalary ? (r.applicableRate ?? null) : null,

      baseSalary: hasSalary ? safeNumber(r.baseSalary) : 0,
      totalAllowances: hasSalary ? safeNumber(r.totalAllowances) : 0,
      totalInsurance: hasSalary ? safeNumber(r.totalInsurance) : 0,

      agreedSalary: hasSalary ? safeNumber(r.agreedSalary) : 0,
      grossSalary: hasSalary ? calcGross(r) : 0,

      totalDaysWorked: hasSalary ? safeNumber(r.totalDaysWorked) : 0,
      netSalary: hasSalary ? safeNumber(r.netSalary) : 0,

      locked: toInt01(hasSalary ? r.locked : 0),
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
    departmentId: depId,
    kpi: { gross, tax, ins, net },
    employees,
    meta: {
      count: employees.length,
      note: "FULL employees by departmentId (LEFT JOIN monthlysalary). Missing rows included.",
    },
  };
}

/* ================= Service ================= */

module.exports = {
  parseMonthYear,

  async getPayrollApproval({ monthStr, department }) {
    const { rows, month, year, depId } = await fetchApprovalRows({ monthStr, department });
    return buildApprovalResponse({ rows, month, year, depId });
  },

  async autoCheck({ monthStr, department }) {
    const { month, year } = parseMonthYear(monthStr);
    const dep = buildDepartmentWhere({ department });

    const [rows] = await pool.query(
      `
      SELECT
        e.id AS employeeId,
        e.employeeCode,
        e.name,
        e.departmentId,
        d.departmentName AS departmentName,
        ms.totalDaysWorked AS salaryDaysWorked,
        ma.totalDaysWorked AS attendanceDaysWorked
      FROM employees e
      LEFT JOIN departments d ON d.id = e.departmentId
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

      if (!hasSalary) {
        return {
          employeeCode: r.employeeCode,
          name: r.name,
          employeeId: r.employeeId,
          ok: true,
          note: "Chưa có monthlysalary (bỏ qua kiểm tra)",
          salaryDaysWorked: null,
          attendanceDaysWorked:
            r.attendanceDaysWorked === null ? null : safeNumber(r.attendanceDaysWorked),
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
      departmentId: dep.depId,
      allOk,
      summary: {
        total: details.length,
        ok: details.filter((x) => x.ok).length,
        notOk: details.filter((x) => !x.ok).length,
      },
      details,
    };
  },

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

  async requestEdit({ monthStr, department, employeeId, reason, createdByAccountId }) {
    const { month, year, monthStr: monthKey } = parseMonthYear(monthStr);
    if (!hasText(reason)) throw new ApiError(400, "reason is required");

    // department giờ là departmentId => log lại theo id cho rõ
    const depPart = hasText(department) ? `|depId=${normStr(department)}` : "";
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

  /**
   * Gửi phiếu lương qua email (stub)
   */
  async sendPayrollEmail({ monthStr, department, byAccountId }) {
    const { rows, month, year, depId } = await fetchApprovalRows({ monthStr, department });

    const employeeIds = (rows || []).map((r) => r.employeeId).filter(Boolean);

    if (employeeIds.length === 0) {
      return { ok: true, sent: 0, skipped: 0, month, year, departmentId: depId };
    }

    const placeholders = employeeIds.map(() => "?").join(",");
    const [emails] = await pool.query(
      `SELECT id AS employeeId, email FROM employees WHERE id IN (${placeholders})`,
      employeeIds
    );

    const emailMap = new Map((emails || []).map((x) => [x.employeeId, x.email]));

    let sent = 0;
    let skipped = 0;

    for (const r of rows) {
      const mail = normStr(emailMap.get(r.employeeId));
      if (!mail) {
        skipped++;
        continue;
      }
      // TODO: gắn mailer tại đây
      sent++;
    }

    return {
      ok: true,
      month,
      year,
      departmentId: depId,
      byAccountId: byAccountId ?? null,
      sent,
      skipped,
      note: "Email sending stubbed. Plug your mailer here to actually send.",
    };
  },

  /**
   * Export Excel chuẩn .xlsx bằng exceljs
   * ✅ FIX: không dùng `this.getPayrollApproval` để tránh lỗi context
   */
  async exportPayrollToExcel({ monthStr, department }) {
    const { rows, month, year, depId } = await fetchApprovalRows({ monthStr, department });
    const data = buildApprovalResponse({ rows, month, year, depId });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Payroll");

    ws.columns = [
      { header: "Mã NV", key: "employeeCode", width: 14 },
      { header: "Họ tên", key: "name", width: 26 },
      { header: "Phòng ban", key: "departmentName", width: 20 },
      { header: "Base", key: "baseSalary", width: 14 },
      { header: "Allowance", key: "totalAllowances", width: 14 },
      { header: "Insurance", key: "totalInsurance", width: 14 },
      { header: "Gross", key: "grossSalary", width: 14 },
      { header: "Net", key: "netSalary", width: 14 },
      { header: "Status", key: "status", width: 14 },
    ];

    (data.employees || []).forEach((e) => {
      ws.addRow({
        employeeCode: e.employeeCode,
        name: e.name,
        departmentName: e.departmentName || "N/A",
        baseSalary: e.baseSalary,
        totalAllowances: e.totalAllowances,
        totalInsurance: e.totalInsurance,
        grossSalary: e.grossSalary,
        netSalary: e.netSalary,
        status: e.status,
      });
    });

    ws.addRow([]);
    ws.addRow({
      employeeCode: "KPI",
      name: "",
      departmentName: "",
      baseSalary: "",
      totalAllowances: "",
      totalInsurance: data.kpi.ins,
      grossSalary: data.kpi.gross,
      netSalary: data.kpi.net,
      status: "TAX=" + data.kpi.tax,
    });

    ws.getRow(1).font = { bold: true };

    const buffer = await wb.xlsx.writeBuffer();
    const filename = `payroll_${monthStr}${data.departmentId ? `_dep${data.departmentId}` : ""}.xlsx`;

    return { buffer, filename };
  },
};