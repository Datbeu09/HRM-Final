const pool = require("../config/db");

async function list() {
  const [rows] = await pool.query(`
    SELECT 
      p.id,
      p.employeeId,
      p.youthUnionMembershipDate,
      p.partyMembershipDate,
      p.partyStatus,
      p.policyRemarks,
      p.created_at,
      p.updated_at
    FROM politicalaffiliation p
    ORDER BY p.id DESC
  `);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT * FROM politicalaffiliation WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create(body) {
  const now = new Date();

  const [result] = await pool.query(
    `
    INSERT INTO politicalaffiliation
    (employeeId, youthUnionMembershipDate, partyMembershipDate, partyStatus, policyRemarks, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      body.employeeId,
      body.youthUnionMembershipDate,
      body.partyMembershipDate,
      body.partyStatus,
      body.policyRemarks,
      now,
      now
    ]
  );

  return getById(result.insertId);
}

async function update(id, body) {
  const current = await getById(id);
  if (!current) return null;

  const now = new Date();

  await pool.query(
    `
    UPDATE politicalaffiliation
    SET employeeId = ?,
        youthUnionMembershipDate = ?,
        partyMembershipDate = ?,
        partyStatus = ?,
        policyRemarks = ?,
        updated_at = ?
    WHERE id = ?
    `,
    [
      body.employeeId ?? current.employeeId,
      body.youthUnionMembershipDate ?? current.youthUnionMembershipDate,
      body.partyMembershipDate ?? current.partyMembershipDate,
      body.partyStatus ?? current.partyStatus,
      body.policyRemarks ?? current.policyRemarks,
      now,
      id
    ]
  );

  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(
    `DELETE FROM politicalaffiliation WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove
};
