// src/services/payrollDetail.service.js
const pool = require("../config/db");
const ApiError = require("../utils/ApiError");
const { parseMonthYear } = require("./payrollApproval.service");

async function tableExists(tableName) {
  const [[r]] = await pool.query(
    `
    SELECT COUNT(*) AS cnt
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name = ?
    `,
    [tableName]
  );
  return Number(r?.cnt || 0) > 0;
}

const toNum = (v) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

module.exports = {
  async getPayrollDetail({ employeeId, monthStr }) {
    const { month, year, monthStr: ym } = parseMonthYear(monthStr);

    // ===== employee =====
    const [[employee]] = await pool.query(
      `
      SELECT 
        e.id, e.employeeCode, e.name, e.departmentId, d.departmentName,
        e.position, e.title
      FROM employees e
      LEFT JOIN departments d ON d.id = e.departmentId
      WHERE e.id = ?
      `,
      [employeeId]
    );

    if (!employee) throw new ApiError(404, "Không tìm thấy nhân viên");

    // ===== monthlysalary =====
    const [[salary]] = await pool.query(
      `
      SELECT *
      FROM monthlysalary
      WHERE employeeId = ?
        AND month = ?
        AND year = ?
      LIMIT 1
      `,
      [employeeId, month, year]
    );

    // ===== monthlyattendance =====
    const [[attendance]] = await pool.query(
      `
      SELECT *
      FROM monthlyattendance
      WHERE employeeId = ?
        AND month = ?
        AND year = ?
      LIMIT 1
      `,
      [employeeId, month, year]
    );

    // ===== allowances =====
    let allowances = [];
    const hasAllowanceTable = await tableExists("employeeallowances");
    if (hasAllowanceTable) {
      const [aRows] = await pool.query(
        `
        SELECT *
        FROM employeeallowances
        WHERE employeeId = ?
        `,
        [employeeId]
      );
      allowances = aRows || [];
    }

    // ===== trả raw =====
    const raw = {
      employee: {
        id: employee.id,
        employeeCode: employee.employeeCode,
        name: employee.name,
        position: employee.position,
        title: employee.title,
        department: employee.departmentName,
      },
      payroll: salary || null,
      allowances,
      attendance: attendance || null,
      month,
      year,
      monthStr: ym,
      meta: { allowanceTable: hasAllowanceTable ? "employeeallowances" : null },
      flags: {
        hasAttendance: !!attendance,
        hasAllowances: allowances.length > 0,
      },
    };

    return raw;
  },

  // ✅ Model chuẩn để in phiếu lương (match UI của bạn)
  normalizeForPayslip(raw) {
    const employee = raw?.employee || {};
    const payrollRaw = raw?.payroll || null;
    const allowances = Array.isArray(raw?.allowances) ? raw.allowances : [];
    const attendance = raw?.attendance || null;

    const monthStr = raw?.monthStr || "";

    // missing payroll
    if (!payrollRaw) {
      return {
        monthStr,
        employee: {
          name: employee.name || "",
          employeeCode: employee.employeeCode || "",
          position: employee.position || employee.title || "",
          title: employee.title || "",
          department: employee.department || "",
        },
        payroll: {
          status: "Missing",
          locked: false,
          totalDaysWorked: toNum(attendance?.totalDaysWorked ?? 0),
        },
        incomeItems: [],
        deductItems: [],
        summary: { totalIncome: 0, totalDeduct: 0, net: 0 },
      };
    }

    const payroll = payrollRaw;

    const incomeItems = [];
    const base = toNum(payroll.baseSalary ?? 0);
    incomeItems.push({ label: "Lương cơ bản", value: base });

    const sumAllowancesFromList = (allowances || []).reduce(
      (acc, a) => acc + toNum(a?.amount ?? a?.value ?? 0),
      0
    );

    const totalAllowancesField = toNum(payroll.totalAllowances ?? 0);
    const allowanceTotalValue =
      totalAllowancesField > 0 ? totalAllowancesField : sumAllowancesFromList;

    incomeItems.push({
      label: "Phụ cấp & Thưởng",
      value: allowanceTotalValue,
      sub:
        totalAllowancesField > 0
          ? "Theo monthlysalary.totalAllowances"
          : "Suy ra từ danh sách allowances",
    });

    // (Nếu bạn không muốn show chi tiết allowances thì bỏ đoạn này)
    for (const a of allowances) {
      incomeItems.push({
        label: a.name || a.type || "Phụ cấp",
        value: toNum(a.amount ?? a.value ?? 0),
      });
    }

    const grossByParts = base + allowanceTotalValue;
    const grossFromBackend = toNum(payroll.grossSalary ?? 0);
    const agreed = toNum(payroll.agreedSalary ?? 0);
    const totalIncome = Math.max(grossFromBackend || grossByParts, grossByParts, agreed);

    const ins = toNum(payroll.totalInsurance ?? 0);
    const net = toNum(payroll.netSalary ?? 0);

    let tax = toNum(payroll.tax ?? 0);
    if (!tax) {
      tax = totalIncome - ins - net;
      if (tax < 0) tax = 0;
    }

    const deductItems = [
      { label: "BHXH / BHYT / BHTN", value: ins },
      {
        label: "Thuế TNCN",
        value: tax,
        sub: "Tính suy ra (totalIncome - ins - net) nếu chưa có field riêng",
      },
    ];

    const totalDeduct = ins + tax;

    return {
      monthStr,
      employee: {
        name: employee.name || "",
        employeeCode: employee.employeeCode || "",
        position: employee.position || employee.title || "",
        title: employee.title || "",
        department: employee.department || "",
      },
      payroll: {
        status: payroll.status || "Pending",
        locked: !!payroll.locked,
        totalDaysWorked: toNum(payroll.totalDaysWorked ?? attendance?.totalDaysWorked ?? 0),
      },
      incomeItems,
      deductItems,
      summary: { totalIncome, totalDeduct, net },
    };
  },
};