// src/services/dailyAttendance.service.js
const pool = require("../config/db");

module.exports = {
  // ===== GET ALL =====
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM DailyAttendance ORDER BY date DESC, id DESC"
    );
    return rows;
  },

  // ===== GET BY ID =====
  async getById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM DailyAttendance WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // ===== GET BY EMPLOYEE + DATE =====
  async getByEmployeeAndDate(employeeId, date) {
    const [rows] = await pool.query(
      "SELECT * FROM DailyAttendance WHERE employeeId = ? AND date = ?",
      [employeeId, date]
    );
    return rows;
  },

  // ===== CREATE =====
  async create(data) {
    const {
      employeeId,
      date,
      status,
      hoursWorked,
      notes,
      createdByAccountId,
      updatedByAccountId,
    } = data;

    const [result] = await pool.query(
      `
      INSERT INTO DailyAttendance
      (
        employeeId,
        date,
        status,
        hoursWorked,
        notes,
        createdByAccountId,
        updatedByAccountId,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        employeeId,
        date,
        status,
        hoursWorked,
        notes ?? null,
        createdByAccountId ?? null,
        updatedByAccountId ?? null,
      ]
    );

    return result.insertId;
  },

  // ===== UPDATE =====
  async update(id, data) {
    const current = await this.getById(id);
    if (!current) return false;

    const {
      status,
      hoursWorked,
      notes,
      updatedByAccountId,
    } = data;

    const [result] = await pool.query(
      `
      UPDATE DailyAttendance
      SET
        status = ?,
        hoursWorked = ?,
        notes = ?,
        updatedByAccountId = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        status ?? current.status,
        hoursWorked ?? current.hoursWorked,
        notes ?? current.notes,
        updatedByAccountId ?? current.updatedByAccountId,
        id,
      ]
    );

    return result.affectedRows > 0;
  },

  // ===== DELETE =====
  async remove(id) {
    const [result] = await pool.query(
      "DELETE FROM DailyAttendance WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
