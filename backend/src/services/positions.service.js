const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

const allowedSort = new Set(["id", "positionCode", "positionName", "created_at"]);

function buildWhere(query, params) {
  const where = [];

  if (query.search) {
    where.push("(positionCode LIKE ? OR positionName LIKE ?)");
    const like = `%${query.search}%`;
    params.push(like, like);
  }

  return where.length ? `WHERE ${where.join(" AND ")}` : "";
}

module.exports = {
  async list(query) {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit || 10)));
    const offset = (page - 1) * limit;

    const sortBy = allowedSort.has(query.sortBy) ? query.sortBy : "id";
    const sortDir = query.sortDir === "ASC" ? "ASC" : "DESC";

    const params = [];
    const whereSql = buildWhere(query, params);

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) total FROM positions ${whereSql}`,
      params
    );

    const [rows] = await pool.query(
      `
      SELECT id, positionCode, positionName, created_at, updated_at
      FROM positions
      ${whereSql}
      ORDER BY ${sortBy} ${sortDir}
      LIMIT ? OFFSET ?
      `,
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
      `SELECT * FROM positions WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(body) {
    if (body.positionCode) {
      const [exists] = await pool.query(
        `SELECT id FROM positions WHERE positionCode = ?`,
        [body.positionCode]
      );
      if (exists.length) throw new ApiError(409, "positionCode already exists");
    }

    const now = new Date();

    const [result] = await pool.query(
      `
      INSERT INTO positions
      (positionCode, positionName, created_at, updated_at)
      VALUES (?, ?, ?, ?)
      `,
      [
        body.positionCode ?? null,
        body.positionName,
        now,
        now
      ]
    );

    return this.getById(result.insertId);
  },

  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    if (
      body.positionCode !== undefined &&
      body.positionCode !== current.positionCode &&
      body.positionCode
    ) {
      const [exists] = await pool.query(
        `SELECT id FROM positions WHERE positionCode = ?`,
        [body.positionCode]
      );
      if (exists.length) throw new ApiError(409, "positionCode already exists");
    }

    const now = new Date();

    await pool.query(
      `
      UPDATE positions
      SET positionCode = ?,
          positionName = ?,
          updated_at = ?
      WHERE id = ?
      `,
      [
        body.positionCode ?? current.positionCode,
        body.positionName ?? current.positionName,
        now,
        id
      ]
    );

    return this.getById(id);
  },

  async remove(id) {
    try {
      const [result] = await pool.query(
        `DELETE FROM positions WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (e) {
      if (e.code === "ER_ROW_IS_REFERENCED_2") {
        throw new ApiError(409, "Position is being used and cannot be deleted");
      }
      throw e;
    }
  }
};
