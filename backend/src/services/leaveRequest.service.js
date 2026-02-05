const pool = require("../config/db");

const LeaveRequestService = {
  // ================= CREATE =================
  async create(data) {
    const {
      employeeId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      status = "PENDING",
      approvedByAccountId = null,
    } = data;

    const [result] = await pool.query(
      `
      INSERT INTO leave_requests
      (employeeId, leaveType, startDate, endDate, totalDays, status, approvedByAccountId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        employeeId,
        leaveType,
        startDate,
        endDate,
        totalDays,
        status,
        approvedByAccountId,
      ]
    );

    return result.insertId;
  },

  // ================= GET ALL =================
  async getAll() {
    const [rows] = await pool.query(`
      SELECT *
      FROM leave_requests
      ORDER BY id DESC
    `);
    return rows;
  },

  // ================= GET BY ID =================
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM leave_requests WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // ================= UPDATE =================
  async update(id, data) {
    const fields = [];
    const values = [];

    for (const key of [
      "employeeId",
      "leaveType",
      "startDate",
      "endDate",
      "totalDays",
      "status",
      "approvedByAccountId",
    ]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return 0;

    const [result] = await pool.query(
      `
      UPDATE leave_requests
      SET ${fields.join(", ")}
      WHERE id = ?
      `,
      [...values, id]
    );

    return result.affectedRows;
  },

  // ================= DELETE =================
  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM leave_requests WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = LeaveRequestService;