// src/services/attendanceLog.service.js
const pool = require("../config/db");

module.exports = {
  // ===== GET ALL =====
  async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM attendancelogs ORDER BY workDate DESC, id DESC"
    );
    return rows;
  },

  // ===== GET BY ID =====
  async getById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM attendancelogs WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // ===== GET BY EMPLOYEE + DATE =====
  async getByEmployeeAndDate(employeeId, workDate) {
    const [rows] = await pool.query(
      "SELECT * FROM attendancelogs WHERE employeeId = ? AND workDate = ?",
      [employeeId, workDate]
    );
    return rows;
  },

  // ===== CREATE =====
  async create(data) {
    const {
      employeeId,
      workDate,
      checkInAt,
      checkOutAt,
      workedMinutes,
      status,
      createdByAccountId,
      updatedByAccountId,
      note,
    } = data;

    const [result] = await pool.query(
      `
      INSERT INTO attendancelogs
      (employeeId, workDate, checkInAt, checkOutAt, workedMinutes, status,
       createdByAccountId, updatedByAccountId, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        employeeId,
        workDate,
        checkInAt,
        checkOutAt,
        workedMinutes,
        status,
        createdByAccountId,
        updatedByAccountId,
        note,
      ]
    );

    return result.insertId;
  },

  // ===== UPDATE =====
  async update(id, data) {
    const {
      checkInAt,
      checkOutAt,
      workedMinutes,
      status,
      updatedByAccountId,
      note,
    } = data;

    const [result] = await pool.query(
      `
      UPDATE attendancelogs
      SET
        checkInAt = ?,
        checkOutAt = ?,
        workedMinutes = ?,
        status = ?,
        updatedByAccountId = ?,
        note = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        checkInAt,
        checkOutAt,
        workedMinutes,
        status,
        updatedByAccountId,
        note,
        id,
      ]
    );

    return result.affectedRows > 0;
  },

  // ===== DELETE =====
  async remove(id) {
    const [result] = await pool.query(
      "DELETE FROM attendancelogs WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
