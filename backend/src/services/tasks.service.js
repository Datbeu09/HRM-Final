const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

const ALLOWED_SORT = new Set(["id", "taskCode", "taskName", "created_at", "updated_at"]);

function buildWhere(q, params) {
  const where = [];
  if (q.search) {
    where.push("(taskCode LIKE ? OR taskName LIKE ? OR description LIKE ?)");
    const like = `%${q.search}%`;
    params.push(like, like, like);
  }
  return where.length ? `WHERE ${where.join(" AND ")}` : "";
}

module.exports = {
  async list(q = {}) {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(100, Math.max(1, Number(q.limit || 10)));
    const offset = (page - 1) * limit;

    const sortBy = ALLOWED_SORT.has(q.sortBy) ? q.sortBy : "id";
    const sortDir = String(q.sortDir || "").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const params = [];
    const whereSql = buildWhere(q, params);

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) total FROM tasks ${whereSql}`,
      params
    );

    const [rows] = await pool.query(
      `
      SELECT id, taskCode, taskName, description, created_at, updated_at
      FROM tasks
      ${whereSql}
      ORDER BY ${sortBy} ${sortDir}
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    return {
      data: rows,
      paging: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id) {
    const [rows] = await pool.query(
      "SELECT id, taskCode, taskName, description, created_at, updated_at FROM tasks WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create(body) {
    if (body.taskCode) {
      const [exists] = await pool.query(
        "SELECT id FROM tasks WHERE taskCode = ? LIMIT 1",
        [body.taskCode]
      );
      if (exists.length) throw new ApiError(409, "taskCode already exists");
    }

    const [rs] = await pool.query(
      `
      INSERT INTO tasks (taskCode, taskName, description, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
      `,
      [body.taskCode ?? null, body.taskName, body.description ?? null]
    );

    return this.getById(rs.insertId);
  },

  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    if (
      body.taskCode !== undefined &&
      body.taskCode !== current.taskCode &&
      body.taskCode
    ) {
      const [exists] = await pool.query(
        "SELECT id FROM tasks WHERE taskCode = ? LIMIT 1",
        [body.taskCode]
      );
      if (exists.length) throw new ApiError(409, "taskCode already exists");
    }

    await pool.query(
      `
      UPDATE tasks
      SET taskCode = ?,
          taskName = ?,
          description = ?,
          updated_at = NOW()
      WHERE id = ?
      `,
      [
        body.taskCode ?? current.taskCode,
        body.taskName ?? current.taskName,
        body.description ?? current.description,
        id,
      ]
    );

    return this.getById(id);
  },

  async remove(id) {
    try {
      const [rs] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
      return rs.affectedRows > 0;
    } catch (e) {
      if (e.code === "ER_ROW_IS_REFERENCED_2") {
        throw new ApiError(409, "Task is being referenced");
      }
      throw e;
    }
  },
};
