const pool = require("../config/db");

module.exports = {
  async list() {
    const [rows] = await pool.query(
      `SELECT
        id, name,
        checkInStart, checkInEnd,
        checkOutStart, checkOutEnd,
        autoCheckOutAt,
        standardMinutes,
        created_at, updated_at
       FROM attendancepolicy
       ORDER BY id DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT
        id, name,
        checkInStart, checkInEnd,
        checkOutStart, checkOutEnd,
        autoCheckOutAt,
        standardMinutes,
        created_at, updated_at
       FROM attendancepolicy
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(body) {
    const now = new Date();

    const [result] = await pool.query(
      `INSERT INTO attendancepolicy
        (name, checkInStart, checkInEnd, checkOutStart, checkOutEnd,
         autoCheckOutAt, standardMinutes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.checkInStart,
        body.checkInEnd,
        body.checkOutStart ?? null,
        body.checkOutEnd ?? null,
        body.autoCheckOutAt,
        body.standardMinutes ?? 480,
        now,
        now,
      ]
    );

    return this.getById(result.insertId);
  },

  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    const now = new Date();

    await pool.query(
      `UPDATE attendancepolicy SET
        name = ?,
        checkInStart = ?,
        checkInEnd = ?,
        checkOutStart = ?,
        checkOutEnd = ?,
        autoCheckOutAt = ?,
        standardMinutes = ?,
        updated_at = ?
       WHERE id = ?`,
      [
        body.name ?? current.name,
        body.checkInStart ?? current.checkInStart,
        body.checkInEnd ?? current.checkInEnd,
        body.checkOutStart !== undefined ? body.checkOutStart : current.checkOutStart,
        body.checkOutEnd !== undefined ? body.checkOutEnd : current.checkOutEnd,
        body.autoCheckOutAt ?? current.autoCheckOutAt,
        body.standardMinutes ?? current.standardMinutes,
        now,
        id,
      ]
    );

    return this.getById(id);
  },

  async remove(id) {
    const [result] = await pool.query(
      "DELETE FROM attendancepolicy WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
