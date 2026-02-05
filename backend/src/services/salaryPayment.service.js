const pool = require("../config/db");

const SalaryPaymentService = {
  async create(data) {
    const {
      batchId,
      monthlySalaryId,
      bankAccount,
      amount,
      status,
    } = data;

    const [result] = await pool.query(
      `
      INSERT INTO salary_payments
      (batchId, monthlySalaryId, bankAccount, amount, status)
      VALUES (?, ?, ?, ?, ?)
      `,
      [batchId, monthlySalaryId, bankAccount, amount, status]
    );

    return result.insertId;
  },

  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM salary_payments ORDER BY created_at DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM salary_payments WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async update(id, data) {
    const {
      batchId,
      monthlySalaryId,
      bankAccount,
      amount,
      status,
    } = data;

    const [result] = await pool.query(
      `
      UPDATE salary_payments
      SET
        batchId = ?,
        monthlySalaryId = ?,
        bankAccount = ?,
        amount = ?,
        status = ?
      WHERE id = ?
      `,
      [batchId, monthlySalaryId, bankAccount, amount, status, id]
    );

    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM salary_payments WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = SalaryPaymentService;