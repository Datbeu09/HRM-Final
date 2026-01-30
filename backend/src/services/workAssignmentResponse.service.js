const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

function normalizeStatus(s) {
  const v = String(s || "").toUpperCase();
  const allowed = new Set(["PENDING", "ACCEPTED", "REJECTED"]);
  if (!allowed.has(v)) throw new ApiError(400, "Invalid status");
  return v;
}

module.exports = {
  async list({ workAssignmentId, employeeId } = {}) {
    const where = [];
    const params = [];

    if (workAssignmentId) {
      where.push("war.workAssignmentId = ?");
      params.push(Number(workAssignmentId));
    }
    if (employeeId) {
      where.push("war.employeeId = ?");
      params.push(Number(employeeId));
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `
      SELECT
        war.*,
        e.name AS employeeName,
        e.employeeCode AS employeeCode
      FROM workassignmentresponses war
      LEFT JOIN employees e ON e.id = war.employeeId
      ${whereSql}
      ORDER BY war.created_at DESC
      `,
      params
    );

    return rows;
  },

  async create(body) {
    const workAssignmentId = body.workAssignmentId ?? body.workAssignmentID;
    const employeeId = body.employeeId; // ✅ controller đã ép từ token

    if (!workAssignmentId) throw new ApiError(400, "workAssignmentId is required");
    if (!employeeId) throw new ApiError(400, "employeeId is required");

    const status = normalizeStatus(body.status);
    const rejectReason = body.rejectReason ?? null;

    if (status === "REJECTED" && !rejectReason) {
      throw new ApiError(400, "rejectReason is required when status=REJECTED");
    }

    // ✅ check assignment tồn tại + thuộc về chính employee đang login
    const [waRows] = await pool.query(
      `
      SELECT id, employeeId
      FROM workassignments
      WHERE id = ? AND deleted_at IS NULL
      LIMIT 1
      `,
      [workAssignmentId]
    );
    if (!waRows.length) throw new ApiError(400, "workAssignmentId is invalid");

    if (Number(waRows[0].employeeId) !== Number(employeeId)) {
      throw new ApiError(403, "You are not allowed to respond to this assignment");
    }

    // upsert theo (workAssignmentId, employeeId)
    const [exists] = await pool.query(
      `
      SELECT id FROM workassignmentresponses
      WHERE workAssignmentId = ? AND employeeId = ?
      LIMIT 1
      `,
      [workAssignmentId, employeeId]
    );

    if (exists.length) {
      const id = exists[0].id;
      await pool.query(
        `
        UPDATE workassignmentresponses
        SET status = ?,
            respondedAt = NOW(),
            rejectReason = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [status, rejectReason, id]
      );

      const [rows] = await pool.query("SELECT * FROM workassignmentresponses WHERE id = ?", [id]);
      return rows[0];
    }

    const [rs] = await pool.query(
      `
      INSERT INTO workassignmentresponses
        (workAssignmentId, employeeId, status, respondedAt, rejectReason, created_at, updated_at)
      VALUES
        (?, ?, ?, NOW(), ?, NOW(), NOW())
      `,
      [workAssignmentId, employeeId, status, rejectReason]
    );

    const [rows] = await pool.query("SELECT * FROM workassignmentresponses WHERE id = ?", [rs.insertId]);
    return rows[0];
  },
};
