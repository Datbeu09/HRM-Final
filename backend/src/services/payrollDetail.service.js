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

    return {
      employee,
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
  },
};