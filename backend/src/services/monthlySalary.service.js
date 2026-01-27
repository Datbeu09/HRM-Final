const pool = require("../config/db");

module.exports = {
  // GET ALL
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM monthlysalary ORDER BY year DESC, month DESC"
    );
    return rows;
  },

  // GET BY ID
  async getById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM monthlysalary WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // GET BY EMPLOYEE
  async getByEmployee(employeeId) {
    const [rows] = await pool.query(
      "SELECT * FROM monthlysalary WHERE employeeId = ? ORDER BY year DESC, month DESC",
      [employeeId]
    );
    return rows;
  },

  // CREATE
  async create(data) {
    const {
      employeeId,
      month,
      year,
      employeeType,
      salaryGradeId,
      applicableRate,
      baseSalary,
      totalAllowances = 0,
      totalInsurance = 0,
      agreedSalary,
      totalDaysWorked = 0,
      netSalary,
      locked = 0,
      status = "DRAFT",
      approvedByAccountId = null,
      approvedAt = null,
    } = data;

    const [result] = await pool.query(
      `
      INSERT INTO monthlysalary
      (
        employeeId, month, year, employeeType, salaryGradeId, applicableRate,
        baseSalary, totalAllowances, totalInsurance, agreedSalary,
        totalDaysWorked, netSalary,
        locked, status,
        approvedByAccountId, approvedAt,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        employeeId,
        month,
        year,
        employeeType,
        salaryGradeId,
        applicableRate,
        baseSalary,
        totalAllowances,
        totalInsurance,
        agreedSalary,
        totalDaysWorked,
        netSalary,
        locked,
        status,
        approvedByAccountId,
        approvedAt,
      ]
    );

    return result.insertId;
  },

  // UPDATE (PATCH STYLE)
  async update(id, data) {
    const current = await this.getById(id);
    if (!current) return null;

    const next = {
      baseSalary: data.baseSalary ?? current.baseSalary,
      totalAllowances: data.totalAllowances ?? current.totalAllowances,
      totalInsurance: data.totalInsurance ?? current.totalInsurance,
      agreedSalary: data.agreedSalary ?? current.agreedSalary,
      totalDaysWorked: data.totalDaysWorked ?? current.totalDaysWorked,
      netSalary: data.netSalary ?? current.netSalary,
      locked: data.locked ?? current.locked,
      status: data.status ?? current.status,
      approvedByAccountId: data.approvedByAccountId ?? current.approvedByAccountId,
      approvedAt: data.approvedAt ?? current.approvedAt,
    };

    await pool.query(
      `
      UPDATE monthlysalary SET
        baseSalary = ?,
        totalAllowances = ?,
        totalInsurance = ?,
        agreedSalary = ?,
        totalDaysWorked = ?,
        netSalary = ?,
        locked = ?,
        status = ?,
        approvedByAccountId = ?,
        approvedAt = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        next.baseSalary,
        next.totalAllowances,
        next.totalInsurance,
        next.agreedSalary,
        next.totalDaysWorked,
        next.netSalary,
        next.locked,
        next.status,
        next.approvedByAccountId,
        next.approvedAt,
        id,
      ]
    );

    return this.getById(id);
  },

  // DELETE
  async remove(id) {
    const [result] = await pool.query(
      "DELETE FROM monthlysalary WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
