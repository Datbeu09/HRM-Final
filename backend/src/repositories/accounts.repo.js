const { pool } = require("../config/db");

async function findByUsername(username) {
  const [rows] = await pool.query(
    "SELECT id, username, password, employeeId, role, status, name FROM Accounts WHERE username=? LIMIT 1",
    [username]
  );
  return rows[0] || null;
}

module.exports = { findByUsername };
