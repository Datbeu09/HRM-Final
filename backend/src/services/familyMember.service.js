const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

module.exports = {
  // List FamilyMembers
  async list(query, user) {
    const params = [];
    let where = "WHERE 1=1";

    if (query.employeeId) {
      where += " AND f.employeeId = ?";
      params.push(query.employeeId);
    }

    // Nhân viên chỉ xem người thân của chính mình
    if (user.role === "EMPLOYEE") {
      where += " AND f.employeeId = ?";
      params.push(user.employeeId);
    }

    const [rows] = await pool.query(
      `
      SELECT 
        f.id,
        f.employeeId,
        f.name,
        f.relationship,
        f.birthDate,
        f.occupation,
        f.notes,
        f.created_at,
        f.updated_at
      FROM FamilyMembers f
      ${where}
      ORDER BY f.id DESC
      `,
      params
    );

    return rows;
  },

  // Get by ID
  async getById(id, user) {
    const [rows] = await pool.query(
      `
      SELECT 
        id,
        employeeId,
        name,
        relationship,
        birthDate,
        occupation,
        notes,
        created_at,
        updated_at
      FROM FamilyMembers
      WHERE id = ?
      `,
      [id]
    );

    const row = rows[0];
    if (!row) return null;

    if (user.role === "EMPLOYEE" && row.employeeId !== user.employeeId) {
      throw new ApiError(403, "Forbidden");
    }

    return row;
  },

  // Create
  async create(body, user) {
    if (user.role === "EMPLOYEE" && body.employeeId !== user.employeeId) {
      throw new ApiError(403, "Forbidden");
    }

    const now = new Date();

    const [result] = await pool.query(
      `
      INSERT INTO FamilyMembers
      (employeeId, name, relationship, birthDate, occupation, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        body.employeeId,
        body.name,
        body.relationship,
        body.birthDate ?? null,
        body.occupation ?? null,
        body.notes ?? null,
        now,
        now,
      ]
    );

    return this.getById(result.insertId, user);
  },

  // Update
  async update(id, body, user) {
    const current = await this.getById(id, user);
    if (!current) return null;

    const now = new Date();

    await pool.query(
      `
      UPDATE FamilyMembers
      SET
        name = ?,
        relationship = ?,
        birthDate = ?,
        occupation = ?,
        notes = ?,
        updated_at = ?
      WHERE id = ?
      `,
      [
        body.name ?? current.name,
        body.relationship ?? current.relationship,
        body.birthDate ?? current.birthDate,
        body.occupation ?? current.occupation,
        body.notes ?? current.notes,
        now,
        id,
      ]
    );

    return this.getById(id, user);
  },

  // Delete
  async remove(id, user) {
    const current = await this.getById(id, user);
    if (!current) return false;

    const [result] = await pool.query(
      "DELETE FROM FamilyMembers WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  },
};
