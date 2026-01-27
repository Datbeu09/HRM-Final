// src/services/approvals.service.js
const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

const STATUS = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

function now() {
  return new Date();
}

function safeJson(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function pushHistory(history, event) {
  const arr = Array.isArray(history) ? [...history] : [];
  arr.push(event);
  return arr;
}

module.exports = {
  // ================= LIST =================
  async list(query, user) {
    let where = "WHERE 1=1";
    const params = [];

    if (query.employeeId) {
      where += " AND employeeId = ?";
      params.push(query.employeeId);
    }
    if (query.status) {
      where += " AND status = ?";
      params.push(query.status);
    }
    if (query.type) {
      where += " AND type = ?";
      params.push(query.type);
    }

    // EMPLOYEE chỉ xem của mình
    if (user.role === "EMPLOYEE") {
      where += " AND employeeId = ?";
      params.push(user.employeeId);
    }

    const [rows] = await pool.query(
      `
      SELECT *
      FROM approvals
      ${where}
      ORDER BY id DESC
      `,
      params
    );

    return rows.map((r) => ({
      ...r,
      history: safeJson(r.history),
    }));
  },

  // ================= GET BY ID =================
  async getById(id, user) {
    const [rows] = await pool.query("SELECT * FROM approvals WHERE id = ?", [id]);
    const row = rows[0];
    if (!row) return null;

    if (user.role === "EMPLOYEE" && Number(row.employeeId) !== Number(user.employeeId)) {
      throw new ApiError(403, "Forbidden");
    }

    return { ...row, history: safeJson(row.history) };
  },

  // ================= CREATE =================
  async create(body, user) {
    const employeeId = user.role === "EMPLOYEE" ? user.employeeId : body.employeeId;
    if (!employeeId) throw new ApiError(400, "employeeId is required");

    const createdAt = now();
    const history = [
      {
        at: createdAt.toISOString(),
        by: user.id,
        action: "CREATE",
        note: "Tạo đơn",
      },
    ];

    try {
      const [result] = await pool.query(
        `
        INSERT INTO approvals
        (employeeId, type, reason, startDate, endDate, status, createdAt, history, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          employeeId,
          body.type,
          body.reason,
          body.startDate,
          body.endDate,
          STATUS.PENDING,
          createdAt,
          JSON.stringify(history),
          createdAt,
          createdAt,
        ]
      );

      return this.getById(result.insertId, user);
    } catch (e) {
      console.error("[approvals.create] SQL error:", e);
      throw new ApiError(500, e?.sqlMessage || "DB error");
    }
  },

  // ================= UPDATE (only Pending) =================
  async update(id, body, user) {
    const current = await this.getById(id, user);
    if (!current) throw new ApiError(404, "Approval not found");

    if (current.status !== STATUS.PENDING) {
      throw new ApiError(400, "Chỉ đơn 'Chờ duyệt' mới được sửa");
    }

    const updatedAt = now();

    const history = pushHistory(current.history, {
      at: updatedAt.toISOString(),
      by: user.id,
      action: "UPDATE",
      note: body.note || "Cập nhật",
    });

    await pool.query(
      `
      UPDATE approvals
      SET type = ?,
          reason = ?,
          startDate = ?,
          endDate = ?,
          history = ?,
          updated_at = ?
      WHERE id = ?
      `,
      [
        body.type ?? current.type,
        body.reason ?? current.reason,
        body.startDate ?? current.startDate,
        body.endDate ?? current.endDate,
        JSON.stringify(history),
        updatedAt,
        id,
      ]
    );

    return this.getById(id, user);
  },

  // ================= DELETE (only Pending) =================
  async remove(id, user) {
    const current = await this.getById(id, user);
    if (!current) throw new ApiError(404, "Approval not found");

    if (current.status !== STATUS.PENDING) {
      throw new ApiError(400, "Chỉ đơn 'Chờ duyệt' mới được xoá");
    }

    await pool.query("DELETE FROM approvals WHERE id = ?", [id]);
    return true;
  },

  // ================= ADMIN: APPROVE =================
  async approve(id, body, user) {
    const current = await this.getById(id, user);
    if (!current) throw new ApiError(404, "Approval not found");

    if (current.status !== STATUS.PENDING) {
      throw new ApiError(400, "Chỉ đơn 'Chờ duyệt' mới được duyệt");
    }

    const updatedAt = now();
    const history = pushHistory(current.history, {
      at: updatedAt.toISOString(),
      by: user.id,
      action: "APPROVE",
      note: body?.note || "Đồng ý",
    });

    await pool.query(
      `
      UPDATE approvals
      SET status = ?, history = ?, updated_at = ?
      WHERE id = ?
      `,
      [STATUS.APPROVED, JSON.stringify(history), updatedAt, id]
    );

    return this.getById(id, user);
  },

  // ================= ADMIN: REJECT =================
  async reject(id, body, user) {
    const current = await this.getById(id, user);
    if (!current) throw new ApiError(404, "Approval not found");

    if (current.status !== STATUS.PENDING) {
      throw new ApiError(400, "Chỉ đơn 'Chờ duyệt' mới được từ chối");
    }

    const updatedAt = now();
    const history = pushHistory(current.history, {
      at: updatedAt.toISOString(),
      by: user.id,
      action: "REJECT",
      note: body?.note || "Từ chối",
    });

    await pool.query(
      `
      UPDATE approvals
      SET status = ?, history = ?, updated_at = ?
      WHERE id = ?
      `,
      [STATUS.REJECTED, JSON.stringify(history), updatedAt, id]
    );

    return this.getById(id, user);
  },
};
