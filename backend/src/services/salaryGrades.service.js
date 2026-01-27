const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

const ALLOWED_SORT = new Set(["id", "gradeName", "coefficient", "created_at"]);

module.exports = {
  async list(q) {
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.min(100, Math.max(1, Number(q.limit || 10)));
    const offset = (page - 1) * limit;

    const sortBy = ALLOWED_SORT.has(q.sortBy) ? q.sortBy : "id";
    const sortDir = q.sortDir === "ASC" ? "ASC" : "DESC";

    const where = [];
    const params = [];

    if (q.search) {
      where.push("(gradeName LIKE ? OR description LIKE ?)");
      params.push(`%${q.search}%`, `%${q.search}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) total FROM salarygrades ${whereSql}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT *
       FROM salarygrades
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

  async getById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM salarygrades WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create(body) {
    const now = new Date();

    const [result] = await pool.query(
      `INSERT INTO salarygrades
       (gradeName, coefficient, description, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        body.gradeName,
        body.coefficient,
        body.description || null,
        now,
        now
      ]
    );

    return this.getById(result.insertId);
  },

  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    const now = new Date();

    await pool.query(
      `UPDATE salarygrades
       SET gradeName = ?,
           coefficient = ?,
           description = ?,
           updated_at = ?
       WHERE id = ?`,
      [
        body.gradeName ?? current.gradeName,
        body.coefficient ?? current.coefficient,
        body.description ?? current.description,
        now,
        id
      ]
    );

    return this.getById(id);
  },

  async remove(id) {
    try {
      const [rs] = await pool.query(
        "DELETE FROM salarygrades WHERE id = ?",
        [id]
      );
      return rs.affectedRows > 0;
    } catch (e) {
      if (e.code === "ER_ROW_IS_REFERENCED_2") {
        throw new ApiError(409, "Salary grade is being used");
      }
      throw e;
    }
  }
};
