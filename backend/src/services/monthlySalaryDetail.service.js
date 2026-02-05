const pool = require("../config/db");

const MonthlySalaryDetailService = {
  async create(data) {
    const {
      monthlySalaryId,
      type,
      name,
      amount,
      calcType,
    } = data;

    const [result] = await pool.query(
      `
      INSERT INTO monthlysalarydetails
      (monthlySalaryId, type, name, amount, calcType)
      VALUES (?, ?, ?, ?, ?)
      `,
      [monthlySalaryId, type, name, amount, calcType]
    );

    return result.insertId;
  },

  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM monthlysalarydetails ORDER BY created_at DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM monthlysalarydetails WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async update(id, data) {
    const {
      monthlySalaryId,
      type,
      name,
      amount,
      calcType,
    } = data;

    const [result] = await pool.query(
      `
      UPDATE monthlysalarydetails
      SET
        monthlySalaryId = ?,
        type = ?,
        name = ?,
        amount = ?,
        calcType = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [monthlySalaryId, type, name, amount, calcType, id]
    );

    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM monthlysalarydetails WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = MonthlySalaryDetailService;