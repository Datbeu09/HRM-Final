const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

const allowedSort = new Set(["id", "departmentCode", "departmentName", "created_at"]);

/* ===== HELPER ===== */
function buildWhere(q, params) {
  const where = [];

  if (q.search) {
    where.push("(departmentCode LIKE ? OR departmentName LIKE ?)");
    const like = `%${q.search}%`;
    params.push(like, like);
  }

  return where.length ? `WHERE ${where.join(" AND ")}` : "";
}

/* ===== SERVICE ===== */
module.exports = {
  // LIST + PAGINATION + SEARCH + SORT
  async list(q) {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(100, Math.max(1, Number(q.limit || 10)));
    const offset = (page - 1) * limit;

    const sortBy = allowedSort.has(q.sortBy) ? q.sortBy : "id";
    const sortDir = String(q.sortDir).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const params = [];
    const whereSql = buildWhere(q, params);

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM Departments ${whereSql}`,
      params
    );

    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT id, departmentCode, departmentName, created_at, updated_at
       FROM Departments
       ${whereSql}
       ORDER BY ${sortBy} ${sortDir}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      data: rows,
      paging: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // GET BY ID
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT id, departmentCode, departmentName, created_at, updated_at
       FROM Departments WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // CREATE
  async create(body) {
    if (body.departmentCode) {
      const [exists] = await pool.query(
        "SELECT id FROM Departments WHERE departmentCode = ? LIMIT 1",
        [body.departmentCode]
      );
      if (exists.length) {
        throw new ApiError(409, "departmentCode already exists");
      }
    }

    const [result] = await pool.query(
      `INSERT INTO Departments (departmentCode, departmentName, created_at, updated_at)
       VALUES (?, ?, NOW(), NOW())`,
      [body.departmentCode ?? null, body.departmentName]
    );

    return this.getById(result.insertId);
  },

  // UPDATE
  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    if (
      body.departmentCode !== undefined &&
      body.departmentCode !== current.departmentCode &&
      body.departmentCode
    ) {
      const [exists] = await pool.query(
        "SELECT id FROM Departments WHERE departmentCode = ? LIMIT 1",
        [body.departmentCode]
      );
      if (exists.length) {
        throw new ApiError(409, "departmentCode already exists");
      }
    }

    await pool.query(
      `UPDATE Departments
       SET departmentCode = ?,
           departmentName = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        body.departmentCode ?? current.departmentCode,
        body.departmentName ?? current.departmentName,
        id
      ]
    );

    return this.getById(id);
  },

  // DELETE
  async remove(id) {
    try {
      const [result] = await pool.query(
        "DELETE FROM Departments WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (e) {
      if (e.code === "ER_ROW_IS_REFERENCED_2") {
        throw new ApiError(409, "Department is referenced by other records");
      }
      throw e;
    }
  }
};
