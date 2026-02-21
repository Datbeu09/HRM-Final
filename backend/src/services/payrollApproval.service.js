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
      id: hasSalary ? r.id : null,
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
      status: hasSalary ? (r.status || "Chưa duyệt") : "Missing",

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

  // ✅ CHỐT: Đã duyệt + locked=1
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

  // ✅ NEW: MỞ KHÓA: Chưa duyệt + locked=0
  async unapprove({ monthStr, department }) {
    const { month, year } = parseMonthYear(monthStr);

    const dep = buildDepartmentWhere({ department });
    const params = [month, year, ...dep.params];

    const [result] = await pool.query(
      `
      UPDATE monthlysalary ms
      JOIN employees e ON e.id = ms.employeeId
      SET ms.status = 'Chưa duyệt',
          ms.locked = 0,
          ms.approvedByAccountId = NULL,
          ms.approvedAt = NULL,
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
   * Export Excel “Phiếu xuất lương tổng” theo tháng
   */
  async exportPayrollToExcel({ monthStr, department }) {
    const { rows, month, year, depId } = await fetchApprovalRows({ monthStr, department });
    const data = buildApprovalResponse({ rows, month, year, depId });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("BANG_LUONG_TONG");

    const moneyFmt = "#,##0";
    const merge = (r1, c1, r2, c2) => ws.mergeCells(r1, c1, r2, c2);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const todayStr = `${dd}/${mm}/${yyyy}`;

    const departmentLabel = data.departmentId ? `Dep ID: ${data.departmentId}` : "Tất cả phòng ban";

    ws.pageSetup = {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    merge(1, 1, 1, 9);
    ws.getCell("A1").value = `BẢNG LƯƠNG TỔNG HỢP THÁNG ${monthStr}`;
    ws.getCell("A1").font = { bold: true, size: 16 };
    ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    merge(2, 1, 2, 9);
    ws.getCell("A2").value = `Công ty: ............................................................`;
    ws.getCell("A2").alignment = { horizontal: "left", vertical: "middle" };

    merge(3, 1, 3, 9);
    ws.getCell("A3").value = `Ngày xuất: ${todayStr}   •   Người xuất: ................................`;
    ws.getCell("A3").alignment = { horizontal: "left", vertical: "middle" };

    merge(4, 1, 4, 9);
    ws.getCell("A4").value = `Phòng ban: ${departmentLabel}`;
    ws.getCell("A4").alignment = { horizontal: "left", vertical: "middle" };

    ws.addRow([]);
    ws.addRow([]);

    const headerRowIdx = 6;
    ws.getRow(headerRowIdx).values = [
      "STT",
      "Mã NV",
      "Họ tên",
      "Phòng ban",
      "Lương cơ bản",
      "Phụ cấp",
      "BHXH/BHYT/BHTN",
      "Thuế TNCN",
      "Thực lĩnh",
    ];

    ws.getRow(headerRowIdx).font = { bold: true };
    ws.getRow(headerRowIdx).alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    ws.getRow(headerRowIdx).height = 22;

    ws.getColumn(1).width = 6;
    ws.getColumn(2).width = 14;
    ws.getColumn(3).width = 24;
    ws.getColumn(4).width = 20;
    ws.getColumn(5).width = 16;
    ws.getColumn(6).width = 14;
    ws.getColumn(7).width = 18;
    ws.getColumn(8).width = 14;
    ws.getColumn(9).width = 16;

    let rowIdx = headerRowIdx + 1;
    let stt = 1;

    for (const e of data.employees || []) {
      const base = Number(e.baseSalary || 0);
      const allowance = Number(e.totalAllowances || 0);
      const ins = Number(e.totalInsurance || 0);
      const net = Number(e.netSalary || 0);

      let tax = base + allowance - net - ins;
      if (tax < 0) tax = 0;

      const r = ws.getRow(rowIdx);

      r.getCell(1).value = stt++;
      r.getCell(2).value = e.employeeCode || "";
      r.getCell(3).value = e.name || "";
      r.getCell(4).value = e.departmentName || "N/A";

      r.getCell(5).value = base;
      r.getCell(6).value = allowance;
      r.getCell(7).value = ins;
      r.getCell(8).value = tax;
      r.getCell(9).value = net;

      r.getCell(1).alignment = { horizontal: "center" };
      r.getCell(2).alignment = { horizontal: "center" };

      for (const c of [5, 6, 7, 8, 9]) {
        r.getCell(c).alignment = { horizontal: "right" };
        r.getCell(c).numFmt = moneyFmt;
      }

      rowIdx++;
    }

    const lastDataRow = rowIdx - 1;

    const totalRowIdx = rowIdx;
    ws.getRow(totalRowIdx).height = 20;

    merge(totalRowIdx, 1, totalRowIdx, 4);
    ws.getCell(totalRowIdx, 1).value = "TỔNG";
    ws.getCell(totalRowIdx, 1).font = { bold: true };
    ws.getCell(totalRowIdx, 1).alignment = { horizontal: "right", vertical: "middle" };

    ws.getCell(totalRowIdx, 5).value = { formula: `SUM(E${headerRowIdx + 1}:E${lastDataRow})` };
    ws.getCell(totalRowIdx, 6).value = { formula: `SUM(F${headerRowIdx + 1}:F${lastDataRow})` };
    ws.getCell(totalRowIdx, 7).value = { formula: `SUM(G${headerRowIdx + 1}:G${lastDataRow})` };
    ws.getCell(totalRowIdx, 8).value = { formula: `SUM(H${headerRowIdx + 1}:H${lastDataRow})` };
    ws.getCell(totalRowIdx, 9).value = { formula: `SUM(I${headerRowIdx + 1}:I${lastDataRow})` };

    for (const c of [5, 6, 7, 8, 9]) {
      ws.getCell(totalRowIdx, c).font = { bold: true };
      ws.getCell(totalRowIdx, c).numFmt = moneyFmt;
      ws.getCell(totalRowIdx, c).alignment = { horizontal: "right" };
    }

    const tableTop = headerRowIdx;
    const tableBottom = totalRowIdx;
    for (let r = tableTop; r <= tableBottom; r++) {
      for (let c = 1; c <= 9; c++) {
        ws.getCell(r, c).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    const kpiStart = totalRowIdx + 2;

    merge(kpiStart, 1, kpiStart, 3);
    ws.getCell(kpiStart, 1).value = "TỔNG HỢP KPI";
    ws.getCell(kpiStart, 1).font = { bold: true };

    const kpiRows = [
      ["Tổng Gross", data.kpi.gross],
      ["Tổng BH", data.kpi.ins],
      ["Tổng Thuế", data.kpi.tax],
      ["Tổng Net", data.kpi.net],
    ];

    let rr = kpiStart + 1;
    for (const [label, val] of kpiRows) {
      merge(rr, 1, rr, 2);
      ws.getCell(rr, 1).value = label;
      ws.getCell(rr, 3).value = Number(val || 0);
      ws.getCell(rr, 3).numFmt = moneyFmt;
      ws.getCell(rr, 3).alignment = { horizontal: "right" };
      rr++;
    }

    const signRow = rr + 2;

    merge(signRow, 1, signRow, 3);
    merge(signRow, 4, signRow, 6);
    merge(signRow, 7, signRow, 9);

    ws.getCell(signRow, 1).value = "NGƯỜI LẬP";
    ws.getCell(signRow, 4).value = "KẾ TOÁN";
    ws.getCell(signRow, 7).value = "GIÁM ĐỐC";

    for (const c of [1, 4, 7]) {
      ws.getCell(signRow, c).font = { bold: true };
      ws.getCell(signRow, c).alignment = { horizontal: "center" };
    }

    merge(signRow + 1, 1, signRow + 5, 3);
    merge(signRow + 1, 4, signRow + 5, 6);
    merge(signRow + 1, 7, signRow + 5, 9);

    const buffer = await wb.xlsx.writeBuffer();
    const filename = `phieu_xuat_luong_tong_${monthStr}${
      data.departmentId ? `_dep${data.departmentId}` : ""
    }.xlsx`;

    return { buffer, filename };
  },
  async approveAndEmail({ monthStr, department, approvedByAccountId, toEmail }) {
    const { month, year } = this.parseMonthYear(monthStr);
    if (!approvedByAccountId) throw new ApiError(400, "approvedByAccountId is required");
    if (!toEmail) throw new ApiError(400, "toEmail is required");

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // --- check đã chốt chưa (nếu đã chốt thì báo luôn) ---
      // (đỡ bị bấm lại)
      const dep = (function buildDepartmentWhere(department) {
        const normalizeDepartmentId = (v) => {
          if (v === undefined || v === null || v === "") return null;
          if (typeof v === "object") return null;
          const n = Number(String(v).trim());
          if (!Number.isFinite(n) || n <= 0) return null;
          return n;
        };
        const depId = normalizeDepartmentId(department);
        if (!depId) return { where: "", params: [], depId: null };
        return { where: " AND e.departmentId = ? ", params: [depId], depId };
      })(department);

      const [lockedRows] = await conn.query(
        `
        SELECT COUNT(*) AS cntLocked
        FROM monthlysalary ms
        JOIN employees e ON e.id = ms.employeeId
        WHERE ms.month = ?
          AND ms.year = ?
          ${dep.where}
          AND ms.locked = 1
        `,
        [month, year, ...dep.params]
      );

      const cntLocked = Number(lockedRows?.[0]?.cntLocked || 0);
      if (cntLocked > 0) {
        throw new ApiError(400, "Bảng lương đã chốt rồi, không thể chốt lại.");
      }

      // --- 1) Approve + lock ---
      const [result] = await conn.query(
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
        [approvedByAccountId, month, year, ...dep.params]
      );

      // --- 2) Export Excel (tận dụng hàm có sẵn) ---
      const { buffer, filename } = await this.exportPayrollToExcel({ monthStr, department });

      // --- 3) Send Email ---
      await sendPayrollExcel({
        to: toEmail,
        subject: `Bảng lương tháng ${monthStr}${dep.depId ? ` (Dep ${dep.depId})` : ""}`,
        text: `Bảng lương tháng ${monthStr} đã được chốt. File Excel đính kèm.`,
        filename,
        buffer,
      });

      await conn.commit();
      return {
        updated: result.affectedRows,
        emailed: true,
        filename,
        toEmail,
      };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },
};