// services/salaryPaymentBatch.service.js
const pool = require("../config/db");

const SalaryPaymentBatchService = {
  async create(data) {
    const {
      month,
      year,
      totalAmount,
      status = "DRAFT",
      exportedBy = null,
      exportedAt = null,
    } = data;

    const [result] = await pool.query(
      `
      INSERT INTO salary_payment_batches
      (month, year, totalAmount, status, exportedBy, exportedAt)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [month, year, totalAmount, status, exportedBy, exportedAt]
    );

    return result.insertId;
  },

  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM salary_payment_batches ORDER BY id DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM salary_payment_batches WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    for (const key of [
      "month",
      "year",
      "totalAmount",
      "status",
      "exportedBy",
      "exportedAt",
    ]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return 0;

    const [result] = await pool.query(
      `
      UPDATE salary_payment_batches
      SET ${fields.join(", ")}
      WHERE id = ?
      `,
      [...values, id]
    );

    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM salary_payment_batches WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = SalaryPaymentBatchService;