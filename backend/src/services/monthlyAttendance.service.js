const pool = require("../config/db");

// GET ALL
module.exports.getAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM monthlyattendance ORDER BY year DESC, month DESC"
  );
  return rows;
};

// GET BY ID
module.exports.getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM monthlyattendance WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

// GET BY EMPLOYEE
module.exports.getByEmployee = async (employeeId) => {
  const [rows] = await pool.query(
    "SELECT * FROM monthlyattendance WHERE employeeId = ? ORDER BY year DESC, month DESC",
    [employeeId]
  );
  return rows;
};

// CREATE
module.exports.create = async (data) => {
  const {
    employeeId,
    month,
    year,
    totalDaysWorked = 0,
    locked = 0,
    status = "DRAFT",
    submittedByAccountId = null,
    submittedAt = null,
    approvedByAccountId = null,
    approvedAt = null,
    rejectReason = null,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO monthlyattendance
     (employeeId, month, year, totalDaysWorked, locked, status,
      submittedByAccountId, submittedAt,
      approvedByAccountId, approvedAt,
      rejectReason, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      employeeId,
      month,
      year,
      totalDaysWorked,
      locked,
      status,
      submittedByAccountId,
      submittedAt,
      approvedByAccountId,
      approvedAt,
      rejectReason,
    ]
  );

  return result.insertId;
};

// UPDATE (PATCH STYLE)
module.exports.update = async (id, data) => {
  const current = await module.exports.getById(id);
  if (!current) return null;

  const next = {
    employeeId: data.employeeId ?? current.employeeId,
    month: data.month ?? current.month,
    year: data.year ?? current.year,
    totalDaysWorked: data.totalDaysWorked ?? current.totalDaysWorked,
    locked: data.locked ?? current.locked,
    status: data.status ?? current.status,
    submittedByAccountId: data.submittedByAccountId ?? current.submittedByAccountId,
    submittedAt: data.submittedAt ?? current.submittedAt,
    approvedByAccountId: data.approvedByAccountId ?? current.approvedByAccountId,
    approvedAt: data.approvedAt ?? current.approvedAt,
    rejectReason: data.rejectReason ?? current.rejectReason,
  };

  await pool.query(
    `UPDATE monthlyattendance SET
      employeeId = ?, month = ?, year = ?, totalDaysWorked = ?, locked = ?, status = ?,
      submittedByAccountId = ?, submittedAt = ?,
      approvedByAccountId = ?, approvedAt = ?,
      rejectReason = ?, updated_at = NOW()
     WHERE id = ?`,
    [
      next.employeeId,
      next.month,
      next.year,
      next.totalDaysWorked,
      next.locked,
      next.status,
      next.submittedByAccountId,
      next.submittedAt,
      next.approvedByAccountId,
      next.approvedAt,
      next.rejectReason,
      id,
    ]
  );

  return module.exports.getById(id);
};

// DELETE
module.exports.remove = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM monthlyattendance WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};
