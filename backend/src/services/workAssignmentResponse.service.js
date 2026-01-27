const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

module.exports = {
  async list(query) {
    const params = [];
    let where = "WHERE 1=1";

    if (query.workAssignmentId) {
      where += " AND workAssignmentId = ?";
      params.push(query.workAssignmentId);
    }

    if (query.employeeId) {
      where += " AND employeeId = ?";
      params.push(query.employeeId);
    }

    const [rows] = await pool.query(
      `SELECT *
       FROM workassignmentresponses
       ${where}
       ORDER BY id DESC`,
      params
    );

    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM workassignmentresponses WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create(body) {
    const {
      workAssignmentId,
      employeeId,
      status,
      respondedAt,
      rejectReason
    } = body;

    const [rs] = await pool.query(
      `INSERT INTO workassignmentresponses
       (workAssignmentId, employeeId, status, respondedAt, rejectReason, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        workAssignmentId,
        employeeId,
        status,
        respondedAt ?? null,
        rejectReason ?? null
      ]
    );

    return this.getById(rs.insertId);
  },

  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    await pool.query(
      `UPDATE workassignmentresponses
       SET status = ?,
           respondedAt = ?,
           rejectReason = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        body.status ?? current.status,
        body.respondedAt ?? current.respondedAt,
        body.rejectReason ?? current.rejectReason,
        id
      ]
    );

    return this.getById(id);
  },

  async remove(id) {
    const [rs] = await pool.query(
      "DELETE FROM workassignmentresponses WHERE id = ?",
      [id]
    );
    return rs.affectedRows > 0;
  }
};
