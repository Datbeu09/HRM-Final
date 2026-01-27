// src/services/benefits.service.js
const pool = require("../config/db");

module.exports = {
  async list() {
    const [rows] = await pool.query(
      `SELECT *
       FROM benefits
       ORDER BY id DESC`
    );
    return rows;
  },

  async getByEmployeeId(employeeId) {
    const [rows] = await pool.query(
      `SELECT *
       FROM benefits
       WHERE employeeId = ?
       ORDER BY startDate DESC`,
      [employeeId]
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM benefits WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(body) {
    const now = new Date();

    const payload = {
      employeeId: body.employeeId,
      type: body.type,
      name: body.name,
      value: body.value,
      startDate: body.startDate,
      endDate: body.endDate ?? null,
      notes: body.notes ?? null,
      calcType: body.calcType,
      applyByAttendance: body.applyByAttendance ?? 0,
      created_at: now,
      updated_at: now,
    };

    const cols = Object.keys(payload);
    const placeholders = cols.map(() => "?").join(",");
    const values = Object.values(payload);

    const [result] = await pool.query(
      `INSERT INTO benefits (${cols.join(",")})
       VALUES (${placeholders})`,
      values
    );

    return this.getById(result.insertId);
  },

  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    const patch = {
      employeeId: body.employeeId ?? current.employeeId,
      type: body.type ?? current.type,
      name: body.name ?? current.name,
      value: body.value ?? current.value,
      startDate: body.startDate ?? current.startDate,
      endDate: body.endDate !== undefined ? body.endDate : current.endDate,
      notes: body.notes !== undefined ? body.notes : current.notes,
      calcType: body.calcType ?? current.calcType,
      applyByAttendance:
        body.applyByAttendance !== undefined
          ? body.applyByAttendance
          : current.applyByAttendance,
      updated_at: new Date(),
    };

    const sets = Object.keys(patch).map(k => `${k} = ?`).join(", ");
    const values = [...Object.values(patch), id];

    await pool.query(
      `UPDATE benefits SET ${sets} WHERE id = ?`,
      values
    );

    return this.getById(id);
  },

  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM benefits WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },
};
