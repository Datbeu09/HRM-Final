const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

function now() {
  return new Date();
}

function isEmployeeSelf(user, employeeId) {
  return user.role === "EMPLOYEE" && Number(user.employeeId) === Number(employeeId);
}

module.exports = {
  // LIST
  async getAll(query, user) {
    let where = "WHERE 1=1";
    const params = [];

    if (query.employeeId) {
      where += " AND pq.employeeId = ?";
      params.push(query.employeeId);
    }

    if (user.role === "EMPLOYEE") {
      where += " AND pq.employeeId = ?";
      params.push(user.employeeId);
    }

    const [rows] = await pool.query(
      `
      SELECT
        pq.id,
        pq.employeeId,
        pq.degree,
        pq.fieldOfStudy,
        pq.educationLevel,
        pq.institution,
        pq.graduationYear,
        pq.foreignLanguageProficiency,
        pq.created_at,
        pq.updated_at
      FROM professionalqualification pq
      ${where}
      ORDER BY pq.id DESC
      `,
      params
    );

    return rows;
  },

  // GET BY ID
  async getById(id, user) {
    const [rows] = await pool.query(
      "SELECT * FROM professionalqualification WHERE id = ?",
      [id]
    );

    const row = rows[0];
    if (!row) return null;

    if (user.role === "EMPLOYEE" && !isEmployeeSelf(user, row.employeeId)) {
      throw new ApiError(403, "Forbidden");
    }

    return row;
  },

  // CREATE
  async create(body, user) {
    const employeeId =
      user.role === "EMPLOYEE" ? user.employeeId : body.employeeId;

    if (!employeeId) throw new ApiError(400, "employeeId is required");

    const time = now();

    const [rs] = await pool.query(
      `
      INSERT INTO professionalqualification
      (
        employeeId,
        degree,
        fieldOfStudy,
        educationLevel,
        institution,
        graduationYear,
        foreignLanguageProficiency,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        employeeId,
        body.degree,
        body.fieldOfStudy,
        body.educationLevel,
        body.institution,
        body.graduationYear,
        body.foreignLanguageProficiency ?? null,
        time,
        time,
      ]
    );

    return this.getById(rs.insertId, user);
  },

  // UPDATE
  async update(id, body, user) {
    const current = await this.getById(id, user);
    if (!current) return null;

    await pool.query(
      `
      UPDATE professionalqualification
      SET
        degree = ?,
        fieldOfStudy = ?,
        educationLevel = ?,
        institution = ?,
        graduationYear = ?,
        foreignLanguageProficiency = ?,
        updated_at = ?
      WHERE id = ?
      `,
      [
        body.degree ?? current.degree,
        body.fieldOfStudy ?? current.fieldOfStudy,
        body.educationLevel ?? current.educationLevel,
        body.institution ?? current.institution,
        body.graduationYear ?? current.graduationYear,
        body.foreignLanguageProficiency ?? current.foreignLanguageProficiency,
        now(),
        id,
      ]
    );

    return this.getById(id, user);
  },

  // DELETE
  async remove(id, user) {
    const current = await this.getById(id, user);
    if (!current) return false;

    const [rs] = await pool.query(
      "DELETE FROM professionalqualification WHERE id = ?",
      [id]
    );

    return rs.affectedRows > 0;
  },
};
