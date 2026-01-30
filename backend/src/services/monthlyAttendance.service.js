// backend/src/services/monthlyAttendance.service.js
const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

function toInt(v, fallback = null) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

module.exports = {
  // ✅ GET /monthlyAttendance
  async list() {
    // NOTE: đổi tên bảng/cột nếu DB bạn khác
    // giả định bảng: monthlyattendance (hoặc MonthlyAttendance)
    const [rows] = await pool.query(
      `SELECT *
       FROM monthlyattendance
       ORDER BY year DESC, month DESC, id DESC`
    );
    return rows;
  },

  // ✅ GET /monthlyAttendance/by-employee-month
  async getByEmployeeMonth({ employeeId, month, year }) {
    const eid = toInt(employeeId);
    const m = toInt(month);
    const y = toInt(year);

    if (!eid || !m || !y) throw new ApiError(400, "Invalid employeeId/month/year");

    const [rows] = await pool.query(
      `SELECT *
       FROM monthlyattendance
       WHERE employeeId = ? AND month = ? AND year = ?
       LIMIT 1`,
      [eid, m, y]
    );
    return rows[0] || null;
  },

  // ✅ POST /monthlyAttendance/ensure
  async ensure({ employeeId, month, year }) {
    const eid = toInt(employeeId);
    const m = toInt(month);
    const y = toInt(year);

    if (!eid || !m || !y) throw new ApiError(400, "Invalid employeeId/month/year");

    // nếu đã có thì trả về luôn
    const existing = await this.getByEmployeeMonth({ employeeId: eid, month: m, year: y });
    if (existing) return existing;

    // tạo mới
    const [rs] = await pool.query(
      `INSERT INTO monthlyattendance (employeeId, month, year, totalDaysWorked, status, locked)
       VALUES (?, ?, ?, 0, 'Draft', 0)`,
      [eid, m, y]
    );

    const [rows] = await pool.query(`SELECT * FROM monthlyattendance WHERE id = ? LIMIT 1`, [
      rs.insertId,
    ]);
    return rows[0] || null;
  },

  // ✅ POST /monthlyAttendance/:id/submit
  async submit({ id }) {
    const mid = toInt(id);
    if (!mid) throw new ApiError(400, "Invalid id");

    await pool.query(
      `UPDATE monthlyattendance
       SET status = 'Submitted', updated_at = NOW()
       WHERE id = ?`,
      [mid]
    );

    const [rows] = await pool.query(`SELECT * FROM monthlyattendance WHERE id = ? LIMIT 1`, [
      mid,
    ]);
    return rows[0] || null;
  },

  // ✅ POST /monthlyAttendance/:id/approve
  async approve({ id }) {
    const mid = toInt(id);
    if (!mid) throw new ApiError(400, "Invalid id");

    await pool.query(
      `UPDATE monthlyattendance
       SET status = 'Approved', updated_at = NOW()
       WHERE id = ?`,
      [mid]
    );

    const [rows] = await pool.query(`SELECT * FROM monthlyattendance WHERE id = ? LIMIT 1`, [
      mid,
    ]);
    return rows[0] || null;
  },

  // ✅ POST /monthlyAttendance/:id/reject
  async reject({ id, rejectReason }) {
    const mid = toInt(id);
    if (!mid) throw new ApiError(400, "Invalid id");

    await pool.query(
      `UPDATE monthlyattendance
       SET status = 'Rejected',
           rejectReason = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [rejectReason || null, mid]
    );

    const [rows] = await pool.query(`SELECT * FROM monthlyattendance WHERE id = ? LIMIT 1`, [
      mid,
    ]);
    return rows[0] || null;
  },

  // ✅ PATCH /monthlyAttendance/:id/lock
  async lock({ id, locked = true }) {
    const mid = toInt(id);
    if (!mid) throw new ApiError(400, "Invalid id");

    const lockedVal = locked ? 1 : 0;

    await pool.query(
      `UPDATE monthlyattendance
       SET locked = ?, updated_at = NOW()
       WHERE id = ?`,
      [lockedVal, mid]
    );

    const [rows] = await pool.query(`SELECT * FROM monthlyattendance WHERE id = ? LIMIT 1`, [
      mid,
    ]);
    return rows[0] || null;
  },
};
