const { pool } = require("../config/db");
const { buildInsert, buildUpdate } = require("../utils/sql");

async function list(table, { limit = 50, offset = 0, orderBy = "id", orderDir = "DESC" }) {
  const [rows] = await pool.query(
    `SELECT * FROM \`${table}\` ORDER BY \`${orderBy}\` ${orderDir} LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

async function findByPk(table, pkName, pkValue) {
  const [rows] = await pool.query(
    `SELECT * FROM \`${table}\` WHERE \`${pkName}\` = ? LIMIT 1`,
    [pkValue]
  );
  return rows[0] || null;
}

async function create(table, data) {
  const { sql, values } = buildInsert(table, data);
  const [result] = await pool.query(sql, values);
  return result.insertId;
}

async function update(table, pkName, pkValue, data) {
  const { sql, values } = buildUpdate(table, data, pkName, pkValue);
  const [result] = await pool.query(sql, values);
  return result.affectedRows;
}

async function remove(table, pkName, pkValue) {
  const [result] = await pool.query(
    `DELETE FROM \`${table}\` WHERE \`${pkName}\` = ?`,
    [pkValue]
  );
  return result.affectedRows;
}

module.exports = { list, findByPk, create, update, remove };
