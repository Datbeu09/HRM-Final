const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

module.exports = {
  // GET ALL
  async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        pe.employeeId,
        e.employeeCode,
        e.name AS employeeName,
        pe.salaryLevelId,
        sg.gradeName,
        pe.applicableRate,
        pe.baseSalary,
        pe.lastSalaryIncrease,
        pe.salaryIncreaseCycleMonths,
        pe.notes,
        pe.created_at,
        pe.updated_at
      FROM PermanentEmployee pe
      JOIN Employees e ON e.id = pe.employeeId
      JOIN SalaryGrades sg ON sg.id = pe.salaryLevelId
      ORDER BY e.name ASC
    `);
    return rows;
  },

  // GET BY employeeId
  async getByEmployeeId(employeeId) {
    const [rows] = await pool.query(
      `
      SELECT 
        pe.*,
        e.name AS employeeName,
        sg.gradeName
      FROM PermanentEmployee pe
      JOIN Employees e ON e.id = pe.employeeId
      JOIN SalaryGrades sg ON sg.id = pe.salaryLevelId
      WHERE pe.employeeId = ?
      `,
      [employeeId]
    );
    return rows[0] || null;
  },

  // CREATE
  async create(data) {
    const [exists] = await pool.query(
      "SELECT employeeId FROM PermanentEmployee WHERE employeeId = ?",
      [data.employeeId]
    );
    if (exists.length)
      throw new ApiError(409, "Permanent employee already exists");

    const now = new Date();

    await pool.query(
      `
      INSERT INTO PermanentEmployee
      (
        employeeId,
        salaryLevelId,
        applicableRate,
        baseSalary,
        lastSalaryIncrease,
        salaryIncreaseCycleMonths,
        notes,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.employeeId,
        data.salaryLevelId,
        data.applicableRate,
        data.baseSalary ?? null,
        data.lastSalaryIncrease ?? null,
        data.salaryIncreaseCycleMonths ?? 36,
        data.notes ?? null,
        now,
        now
      ]
    );

    return this.getByEmployeeId(data.employeeId);
  },

  // UPDATE (PATCH)
  async update(employeeId, data) {
    const current = await this.getByEmployeeId(employeeId);
    if (!current) return null;

    const now = new Date();

    await pool.query(
      `
      UPDATE PermanentEmployee
      SET
        salaryLevelId = ?,
        applicableRate = ?,
        baseSalary = ?,
        lastSalaryIncrease = ?,
        salaryIncreaseCycleMonths = ?,
        notes = ?,
        updated_at = ?
      WHERE employeeId = ?
      `,
      [
        data.salaryLevelId ?? current.salaryLevelId,
        data.applicableRate ?? current.applicableRate,
        data.baseSalary ?? current.baseSalary,
        data.lastSalaryIncrease ?? current.lastSalaryIncrease,
        data.salaryIncreaseCycleMonths ?? current.salaryIncreaseCycleMonths,
        data.notes ?? current.notes,
        now,
        employeeId
      ]
    );

    return this.getByEmployeeId(employeeId);
  },

  // DELETE
  async remove(employeeId) {
    const [result] = await pool.query(
      "DELETE FROM PermanentEmployee WHERE employeeId = ?",
      [employeeId]
    );
    return result.affectedRows > 0;
  }
};
