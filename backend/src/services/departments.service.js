const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

const ALLOWED_SORT = new Set(["id", "departmentCode", "departmentName", "created_at", "updated_at"]);

function buildWhere(q, params) {
  const where = [];
  if (q.search) {
    where.push("(departmentCode LIKE ? OR departmentName LIKE ?)");
    const like = `%${q.search}%`;
    params.push(like, like);
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
      `SELECT COUNT(*) AS total FROM departments ${whereSql}`,
      params
    );

    const [rows] = await pool.query(
      `
      SELECT id, departmentCode, departmentName, created_at, updated_at
      FROM departments
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
      `SELECT id, departmentCode, departmentName, created_at, updated_at
       FROM departments
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(body) {
    if (body.departmentCode) {
      const [exists] = await pool.query(
        "SELECT id FROM departments WHERE departmentCode = ? LIMIT 1",
        [body.departmentCode]
      );
      if (exists.length) throw new ApiError(409, "departmentCode already exists");
    }

    const [rs] = await pool.query(
      `
      INSERT INTO departments (departmentCode, departmentName, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
      `,
      [body.departmentCode ?? null, body.departmentName]
    );

    return this.getById(rs.insertId);
  },

  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    if (
      body.departmentCode !== undefined &&
      body.departmentCode !== current.departmentCode &&
      body.departmentCode
    ) {
      const [exists] = await pool.query(
        "SELECT id FROM departments WHERE departmentCode = ? LIMIT 1",
        [body.departmentCode]
      );
      if (exists.length) throw new ApiError(409, "departmentCode already exists");
    }

    await pool.query(
      `
      UPDATE departments
      SET departmentCode = ?,
          departmentName = ?,
          updated_at = NOW()
      WHERE id = ?
      `,
      [
        body.departmentCode ?? current.departmentCode,
        body.departmentName ?? current.departmentName,
        id,
      ]
    );

    return this.getById(id);
  },

  async remove(id) {
    try {
      const [rs] = await pool.query("DELETE FROM departments WHERE id = ?", [id]);
      return rs.affectedRows > 0;
    } catch (e) {
      if (e.code === "ER_ROW_IS_REFERENCED_2") {
        throw new ApiError(409, "Department is referenced by other records");
      }
      throw e;
    }
  },
};
