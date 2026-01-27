// src/services/contractEmployees.service.js
const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

module.exports = {
  // ===== GET ALL =====
  async list() {
    const [rows] = await pool.query(`
      SELECT
        ce.employeeId,
        e.employeeCode,
        e.name AS employeeName,
        ce.contractNumber,
        ce.contractType,
        ce.signingDate,
        ce.effectiveDate,
        ce.expirationDate,
        ce.agreedSalary,
        ce.notes,
        ce.created_at,
        ce.updated_at
      FROM ContractEmployee ce
      JOIN Employees e ON e.id = ce.employeeId
      ORDER BY e.name ASC
    `);
    return rows;
  },

  // ===== GET BY EMPLOYEE =====
  async getByEmployeeId(employeeId) {
    const [rows] = await pool.query(
      `
      SELECT
        ce.*,
        e.employeeCode,
        e.name AS employeeName
      FROM ContractEmployee ce
      JOIN Employees e ON e.id = ce.employeeId
      WHERE ce.employeeId = ?
      `,
      [employeeId]
    );
    return rows[0] || null;
  },

  // ===== CREATE =====
  async create(body) {
    const [exists] = await pool.query(
      "SELECT employeeId FROM ContractEmployee WHERE employeeId = ?",
      [body.employeeId]
    );
    if (exists.length)
      throw new ApiError(409, "Contract employee already exists");

    const now = new Date();

    await pool.query(
      `
      INSERT INTO ContractEmployee
      (
        employeeId,
        contractNumber,
        contractType,
        signingDate,
        effectiveDate,
        expirationDate,
        agreedSalary,
        notes,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        body.employeeId,
        body.contractNumber ?? null,
        body.contractType ?? null,
        body.signingDate ?? null,
        body.effectiveDate ?? null,
        body.expirationDate ?? null,
        body.agreedSalary,
        body.notes ?? null,
        now,
        now,
      ]
    );

    return this.getByEmployeeId(body.employeeId);
  },

  // ===== UPDATE =====
  async update(employeeId, body) {
    const current = await this.getByEmployeeId(employeeId);
    if (!current) return null;

    const now = new Date();

    await pool.query(
      `
      UPDATE ContractEmployee
      SET
        contractNumber = ?,
        contractType = ?,
        signingDate = ?,
        effectiveDate = ?,
        expirationDate = ?,
        agreedSalary = ?,
        notes = ?,
        updated_at = ?
      WHERE employeeId = ?
      `,
      [
        body.contractNumber ?? current.contractNumber,
        body.contractType ?? current.contractType,
        body.signingDate ?? current.signingDate,
        body.effectiveDate ?? current.effectiveDate,
        body.expirationDate ?? current.expirationDate,
        body.agreedSalary ?? current.agreedSalary,
        body.notes ?? current.notes,
        now,
        employeeId,
      ]
    );

    return this.getByEmployeeId(employeeId);
  },

  // ===== DELETE =====
  async remove(employeeId) {
    const [result] = await pool.query(
      "DELETE FROM ContractEmployee WHERE employeeId = ?",
      [employeeId]
    );
    return result.affectedRows > 0;
  },
};
