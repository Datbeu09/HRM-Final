const pool = require("../config/db");

async function getAll() {
  const [rows] = await pool.query(
    "SELECT id, code, description, created_at, updated_at FROM permissions ORDER BY id ASC"
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    "SELECT id, code, description, created_at, updated_at FROM permissions WHERE id = ?",
    [id]
  );
  return rows[0];
}

async function create(data) {
  const { code, description } = data;

  const [result] = await pool.query(
    `INSERT INTO permissions (code, description, created_at, updated_at)
     VALUES (?, ?, NOW(), NOW())`,
    [code, description]
  );

  return getById(result.insertId);
}

async function update(id, data) {
  const { code, description } = data;

  const [result] = await pool.query(
    `UPDATE permissions
     SET code = ?, description = ?, updated_at = NOW()
     WHERE id = ?`,
    [code, description, id]
  );

  if (result.affectedRows === 0) return null;
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(
    "DELETE FROM permissions WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
